"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Icon } from "@/components/ui/Icon";
import { DASHBOARD_NAV } from "@/lib/dashboard-nav";
import type { Role } from "@/lib/types";
import { PageHeader } from "./PageHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

export function RoleOverview({ role }: { role: Role }) {
  const { user } = useAuth();
  const cards = DASHBOARD_NAV[role].slice(1);

  return (
    <>
      <PageHeader
        title={`Welcome back${user ? `, ${user.username}` : ""}`}
        description="Pick where you want to work."
      />
      <motion.ul
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {cards.map((card) => (
          <motion.li
            key={card.href}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
          >
            <Link
              href={card.href}
              className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <h2 className="text-lg font-bold">{card.label}</h2>
                <p className="mt-1 text-sm text-muted">{card.text}</p>
              </div>
              <span className="mt-8 grid size-10 place-items-center rounded-full bg-[#f2f2f2] transition group-hover:bg-ink group-hover:text-white">
                <Icon name="arrowRight" size={16} />
              </span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </>
  );
}
