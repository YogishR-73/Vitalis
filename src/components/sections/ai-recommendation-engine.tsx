"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Home,
  Pill,
  Sparkles,
  Stethoscope,
  Syringe,
} from "lucide-react";
import {
  fadeUpItem,
  spring,
  staggerReveal,
  viewport,
} from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  {
    title: "Home care orchestration",
    body: "Ambient reminders with frictionless caregiver sync and escalation if adherence drops.",
    icon: Home,
    tag: "Continuity",
  },
  {
    title: "Emergency playbooks",
    body: "Scenario-tuned checklists that adapt to vitals deltas in real time—not static PDFs.",
    icon: Syringe,
    tag: "Acute",
  },
  {
    title: "Clinic intelligence mesh",
    body: "Live routing to highest-fit facilities based on specialty coverage and transport windows.",
    icon: Building2,
    tag: "Network",
  },
  {
    title: "Medication harmonics",
    body: "Chronopharmacology-aware reminders that respect sleep, meals, and contraindication graphs.",
    icon: Pill,
    tag: "Pharma AI",
  },
  {
    title: "Wellness optimization",
    body: "Micro-interventions synthesized from stress, sleep, and movement—minimalist, not noisy.",
    icon: Sparkles,
    tag: "Lifestyle",
  },
  {
    title: "Preventive foresight",
    body: "Longitudinal priors that spotlight silent risks years before traditional thresholds fire.",
    icon: Stethoscope,
    tag: "Forecast",
  },
];

export function AiRecommendationEngine() {
  return (
    <section id="recommendations" className="relative py-24">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="mb-12 max-w-2xl space-y-4"
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={fadeUpItem}>
            <Badge variant="glow" className="uppercase tracking-[0.28em]">
              Recommendation engine
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUpItem} className="font-display text-3xl text-white md:text-5xl">
            Cards that lift, glow, and expand like physical instruments
          </motion.h2>
          <motion.p variants={fadeUpItem} className="text-base text-cyan-100/65 md:text-lg">
            Each recommendation is a composable micro-app: triage logic on the back, cinematic affordances up front.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          {items.map((c) => (
            <motion.div key={c.title} variants={fadeUpItem}>
              <motion.div whileHover={{ y: -3 }} transition={spring.lift}>
                <Card className="glass-panel holo-border group relative overflow-hidden border-cyan-500/15 bg-gradient-to-br from-white/[0.06] to-transparent">
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                    <div className="absolute -inset-24 rotate-12 bg-holo-sweep bg-[length:220%_100%] opacity-35" />
                  </div>
                  <CardHeader className="relative">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <Badge variant="outline" className="border-cyan-500/25 bg-black/30 text-[10px] uppercase tracking-[0.22em]">
                        {c.tag}
                      </Badge>
                      <c.icon className="size-5 text-cyan-200" />
                    </div>
                    <CardTitle className="text-lg text-white">{c.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative text-sm text-cyan-100/65">
                    {c.body}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
