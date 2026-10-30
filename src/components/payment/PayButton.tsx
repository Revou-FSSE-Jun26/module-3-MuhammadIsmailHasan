"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/ToastProvider";
import { ApiError, orderApi, paymentApi } from "@/lib/api";
import { cn } from "@/lib/format";
import { SnapError, cacheSnapToken, cachedSnapToken, forgetSnapToken, loadSnap } from "@/lib/snap";
import type { Order } from "@/lib/types";

const POLL_MS = 3000;
const POLL_TRIES = 10;

type Phase = "idle" | "starting" | "confirming";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function PayButton({
  order,
  onChanged,
  autoStart = false,
  className,
}: {
  order: Order;
  onChanged: () => void;
  autoStart?: boolean;
  className?: string;
}) {
  const { authed } = useAuth();
  const toast = useToast();
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const autoStarted = useRef(false);

  function changePhase(next: Phase) {
    phaseRef.current = next;
    setPhase(next);
  }

  async function settle(tries: number): Promise<boolean> {
    for (let i = 0; i < tries; i++) {
      if (i > 0) await wait(POLL_MS);
      try {
        const fresh = await authed((token) => orderApi.get(token, order.id));
        if (fresh.status !== "waiting_for_payment") {
          toast.success(
            fresh.status === "paid"
              ? "Payment confirmed"
              : `Order is now ${fresh.status.replace(/_/g, " ")}`,
          );
          onChanged();
          return true;
        }
      } catch {
        return false;
      }
    }
    return false;
  }

  async function confirm() {
    changePhase("confirming");
    const done = await settle(POLL_TRIES);
    if (!done) toast.error("Still waiting for confirmation. Refresh this page in a moment.");
    changePhase("idle");
  }

  async function start() {
    if (phaseRef.current !== "idle") return;
    changePhase("starting");
    try {
      const snap = await loadSnap();
      let token = cachedSnapToken(order.id);
      if (!token) {
        const payment = await authed((t) => paymentApi.create(t, order.id));
        token = payment.snap_token;
        cacheSnapToken(order.id, token, payment.expires_at);
      }
      let handled = false;
      snap.pay(token, {
        onSuccess: () => {
          handled = true;
          forgetSnapToken(order.id);
          void confirm();
        },
        onPending: () => {
          handled = true;
          void confirm();
        },
        onError: () => {
          handled = true;
          forgetSnapToken(order.id);
          toast.error("Payment failed. You can try again.");
        },
        onClose: () => {
          if (!handled) void settle(1);
        },
      });
      changePhase("idle");
    } catch (err) {
      changePhase("idle");
      toast.error(
        err instanceof ApiError || err instanceof SnapError
          ? err.message
          : "Could not reach the server. Try again.",
      );
    }
  }

  const begin = useEffectEvent(() => {
    void start();
  });

  useEffect(() => {
    if (!autoStart || autoStarted.current) return;
    autoStarted.current = true;
    begin();
  }, [autoStart]);

  const busy = phase !== "idle";

  return (
    <button
      type="button"
      onClick={start}
      disabled={busy}
      className={cn(
        "h-11 rounded-full bg-ink px-6 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60",
        className,
      )}
    >
      {busy && <Spinner className="mr-2 size-4 align-[-3px]" />}
      {phase === "starting"
        ? "Opening payment…"
        : phase === "confirming"
          ? "Confirming…"
          : "Pay now"}
    </button>
  );
}
