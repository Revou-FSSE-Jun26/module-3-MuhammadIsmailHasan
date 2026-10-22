"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: send `email` to your newsletter provider here.
    setDone(true);
  }

  return (
    <section
      id="newsletter"
      className="mx-auto max-w-3xl scroll-mt-32 px-4 pt-24 text-center sm:px-6"
    >
      <Reveal>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Subscribe to our emails
        </h2>
        <p className="mt-3 text-muted">
          Be the first to know about new collections and exclusive offers.
        </p>
      </Reveal>
      <Reveal delay={0.15} className="mt-8">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.p
              key="done"
              className="inline-flex items-center gap-3 rounded-full bg-teal/10 px-6 py-4 font-semibold text-teal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              role="status"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
              >
                <Icon name="check" size={20} strokeWidth={2.5} />
              </motion.span>
              Thanks for subscribing!
            </motion.p>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row"
              exit={{ opacity: 0, y: -10 }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="h-12 flex-1 rounded-full border border-line px-5 text-sm outline-none transition focus:border-ink"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="h-12 rounded-full bg-accent px-8 text-sm font-semibold text-white"
              >
                Subscribe
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
