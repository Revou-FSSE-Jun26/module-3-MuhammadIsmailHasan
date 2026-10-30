export type SnapResult = Record<string, unknown>;

export type SnapCallbacks = {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
};

export type SnapApi = {
  pay: (token: string, callbacks?: SnapCallbacks) => void;
  hide: () => void;
};

declare global {
  interface Window {
    snap?: SnapApi;
  }
}

export class SnapError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SnapError";
  }
}

const SNAP_SCRIPT_URL = "https://app.sandbox.midtrans.com/snap/snap.js";
const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";

let loading: Promise<void> | null = null;

export async function loadSnap(): Promise<SnapApi> {
  if (window.snap) return window.snap;
  if (!CLIENT_KEY) throw new SnapError("Midtrans client key is not configured.");

  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SNAP_SCRIPT_URL;
    script.async = true;
    script.setAttribute("data-client-key", CLIENT_KEY);
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new SnapError("Could not load the Midtrans payment window."));
    };
    document.body.appendChild(script);
  });

  await loading;
  if (!window.snap) throw new SnapError("The Midtrans payment window is not available.");
  return window.snap;
}

const tokens = new Map<number, { token: string; expiresAt: number }>();

function parseUtc(value: string): number {
  const hasZone = /[zZ]$|[+-]\d{2}:?\d{2}$/.test(value);
  return Date.parse(hasZone ? value : `${value}Z`);
}

export function cachedSnapToken(orderId: number): string | null {
  const entry = tokens.get(orderId);
  if (!entry) return null;
  if (Number.isNaN(entry.expiresAt) || entry.expiresAt <= Date.now()) {
    tokens.delete(orderId);
    return null;
  }
  return entry.token;
}

export function cacheSnapToken(orderId: number, token: string, expiresAt: string) {
  tokens.set(orderId, { token, expiresAt: parseUtc(expiresAt) });
}

export function forgetSnapToken(orderId: number) {
  tokens.delete(orderId);
}
