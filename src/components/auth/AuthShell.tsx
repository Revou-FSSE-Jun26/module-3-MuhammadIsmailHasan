"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Scene } from "@/components/illustrations/Scene";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/format";
import { siteConfig, type ScenePalette, type SceneVariant } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

type Aside = {
  eyebrow: string;
  title: string;
  points: string[];
  scene: SceneVariant;
  palette: ScenePalette;
};

export function AuthShell({
  title,
  subtitle,
  aside,
  children,
}: {
  title: string;
  subtitle: string;
  aside: Aside;
  children: ReactNode;
}) {
  return (
    <div className="bg-cream px-4 py-10 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 lg:grid-cols-2"
      >
        <div className="p-6 sm:p-10 lg:p-12">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            {siteConfig.name}
          </Link>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>

        <aside className="relative hidden min-h-[520px] lg:block">
          <Scene variant={aside.scene} palette={aside.palette} />
          <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/5 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] opacity-80">
              {aside.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight">{aside.title}</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {aside.points.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/25 backdrop-blur">
                    <Icon name="check" size={14} />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </motion.div>
    </div>
  );
}

const inputClass =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-sm outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/5";

export const buttonClass =
  "h-12 w-full rounded-full bg-ink text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60";

export function Field({
  label,
  type = "text",
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          className={cn(inputClass, isPassword && "pr-16")}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted hover:text-ink"
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
      className="rounded-xl bg-coral/10 px-4 py-3 text-sm font-medium text-coral"
    >
      {message}
    </motion.p>
  );
}
