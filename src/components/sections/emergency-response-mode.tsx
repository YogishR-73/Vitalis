"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertOctagon, Cpu, PhoneCall, ShieldAlert } from "lucide-react";
import { ease, spring, staggerReveal, fadeUpItem, viewport } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmergency } from "@/context/emergency-context";

export function EmergencyResponseMode() {
  const { active, toggle } = useEmergency();

  return (
    <section id="emergency" className="relative py-24">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-2xl space-y-3">
            <Badge variant="danger" className="uppercase tracking-[0.28em]">
              Emergency response fabric
            </Badge>
            <h2 className="font-display text-3xl text-white md:text-4xl">
              One control surfaces catastrophic scenarios with theatrical clarity
            </h2>
            <p className="text-sm text-cyan-100/65 md:text-base">
              Toggle emergency mode to watch the interface re-orchestrate lighting, motion, and information hierarchy—without sacrificing readability under stress.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.99 }} transition={spring.soft}>
            <Button
              onClick={toggle}
              size="lg"
              className="relative overflow-hidden rounded-2xl border border-rose-400/40 bg-gradient-to-r from-rose-600 to-orange-600 px-8 text-white shadow-emergency"
            >
              <span className="relative z-10 flex items-center gap-2">
                <AlertOctagon className="size-5" />
                {active ? "Stand down emergency" : "Activate emergency mode"}
              </span>
              <motion.span
                aria-hidden
                className="absolute inset-0 bg-white/15"
                initial={{ x: "-55%", opacity: 0 }}
                whileHover={{ x: "55%", opacity: 1 }}
                transition={{ duration: 0.75, ease: ease.out }}
              />
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-6 lg:grid-cols-3"
        >
          {[
            {
              title: "AI emergency insights",
              body: "Prioritized interventions ranked by outcome elasticity and transport feasibility.",
              icon: Cpu,
            },
            {
              title: "Critical care handoff",
              body: "Structured packet with vitals deltas, medication reconciliation, and imaging stubs.",
              icon: PhoneCall,
            },
            {
              title: "Facility routing",
              body: "Live ED load, cath lab readiness, and specialty coverage mapped to patient phenotype.",
              icon: ShieldAlert,
            },
          ].map((c) => (
            <motion.div key={c.title} variants={fadeUpItem} layout transition={spring.soft}>
              <motion.div whileHover={{ y: -3 }} transition={spring.lift}>
                <Card
                  className={`glass-panel h-full transition-shadow duration-500 ${
                    active ? "border-rose-500/50 shadow-emergency" : "border-cyan-500/10"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base text-white">
                      <c.icon className="size-4 text-cyan-300" />
                      {c.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-cyan-100/65">{c.body}</CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[40] mix-blend-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: ease.out }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(244,63,94,0.28),transparent_52%),radial-gradient(circle_at_78%_28%,rgba(251,146,60,0.18),transparent_48%)] opacity-[0.72]" />
            <motion.div
              className="absolute inset-6 rounded-[32px] border border-rose-400/45 md:inset-10"
              initial={{ opacity: 0, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.998 }}
              transition={{ duration: 0.55, ease: ease.out }}
              style={{
                boxShadow: "0 0 48px rgba(244,63,94,0.22)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
