"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Brain, ListChecks, Stethoscope } from "lucide-react";
import { duration, ease, spring } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { TriageAnalysis } from "@/lib/triage-analysis";
import { cn } from "@/lib/utils";

type Props = {
  triage: TriageAnalysis;
  className?: string;
};

const listContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.message, ease: ease.out },
  },
};

/**
 * Structured triage readout — keeps the cinematic glass look while surfacing NLP fields.
 */
export function TriageInsightPanel({ triage, className }: Props) {
  const hasFlags = triage.emergency_flags.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: ease.out }}
      className={cn(
        "mt-4 space-y-4 rounded-2xl border border-cyan-400/20 bg-black/35 p-4 text-left shadow-panel backdrop-blur-md",
        hasFlags && "border-amber-400/35 shadow-[0_0_40px_-12px_rgba(251,191,36,0.35)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="glow" className="gap-1 uppercase tracking-[0.2em]">
          <Brain className="size-3.5" />
          Structured triage
        </Badge>
        <Badge variant="outline" className="border-cyan-500/30 text-[10px] text-cyan-100/80">
          {triage.triage_level}
        </Badge>
        <Badge variant="outline" className="border-cyan-500/30 text-[10px] text-cyan-100/80">
          {triage.severity}
        </Badge>
        <Badge variant="outline" className="border-cyan-500/30 text-[10px] text-cyan-100/80">
          {triage.confidence}
        </Badge>
      </div>

      {hasFlags && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring.soft}
          className="flex items-start gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-50"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-200" />
          <div>
            <div className="font-medium uppercase tracking-[0.18em] text-amber-100/90">Escalation cues</div>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-amber-50/90">
              {triage.emergency_flags.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cyan-200/55">
            <ListChecks className="size-3.5" />
            Extracted symptoms
          </div>
          <motion.ul variants={listContainer} initial="hidden" animate="show" className="space-y-1.5 text-sm text-cyan-50/90">
            {(triage.symptoms.length ? triage.symptoms : ["No discrete symptoms enumerated"]).map((s, i) => (
              <motion.li key={`${s}-${i}`} variants={listItem} className="leading-snug">
                <span className="text-cyan-300/50">{String(i + 1).padStart(2, "0")}</span> {s}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cyan-200/55">
            <Stethoscope className="size-3.5" />
            Differential space
          </div>
          <motion.ul variants={listContainer} initial="hidden" animate="show" className="space-y-1.5 text-sm text-cyan-50/90">
            {(triage.possible_conditions.length ? triage.possible_conditions : ["Insufficient data for ranked differentials"]).map(
              (c, i) => (
                <motion.li key={`${c}-${i}`} variants={listItem} className="leading-snug">
                  <span className="text-cyan-300/50">{String(i + 1).padStart(2, "0")}</span> {c}
                </motion.li>
              ),
            )}
          </motion.ul>
        </div>
      </div>

      <Separator className="bg-cyan-500/15" />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-sm leading-relaxed text-cyan-50/95"
      >
        {triage.recommendation}
      </motion.p>
    </motion.div>
  );
}
