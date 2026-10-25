"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site";

const TINTS = ["#f6d7c3", "#cfe4dc", "#dcdff0"];

export function ProjectRoles() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Built to learn
        </p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Three roles, one store
        </h2>
        <p className="mt-3 text-muted">
          Try RevoShop as a buyer, a seller or an admin. Each role gets its own dashboard and
          permissions.
        </p>
      </div>
      <RevealGroup className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {siteConfig.roles.map((role, i) => (
          <RevealItem key={role.title}>
            <div
              className="flex h-full flex-col rounded-3xl p-7"
              style={{ background: TINTS[i % TINTS.length] }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-ink/60">
                0{i + 1}
              </span>
              <h3 className="mt-2 text-2xl font-extrabold">{role.title}</h3>
              <p className="mt-3 flex-1 text-sm text-ink/75">{role.text}</p>
              <Link
                href={role.cta.href}
                className="group mt-6 inline-flex items-center gap-2 text-sm font-bold"
              >
                {role.cta.label}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <Icon name="arrowRight" size={16} />
                </span>
              </Link>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
