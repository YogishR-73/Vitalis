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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: ease.out }}
      className={cn(
        "mt-5 w-full min-w-0 space-y-5 rounded-2xl border border-cyan-400/20 bg-black/35 p-4 pt-5 text-left shadow-panel backdrop-blur-md sm:p-5",
        hasFlags && "border-amber-400/35 shadow-[0_0_40px_-12px_rgba(251,191,36,0.35)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-start gap-x-2 gap-y-2.5 border-b border-cyan-500/10 pb-4">
        <Badge variant="glow" className="shrink-0 gap-1 uppercase tracking-[0.2em]">
          <Brain className="size-3.5" />
          Structured triage
        </Badge>
        <div className="flex min-w-0 flex-1 flex-wrap gap-x-2 gap-y-2 sm:justify-end">
          <Badge
            variant="outline"
            className="max-w-full shrink-0 border-cyan-500/30 text-left text-[10px] leading-snug text-cyan-100/80 [overflow-wrap:anywhere]"
          >
            {triage.triage_level}
          </Badge>
          <Badge
            variant="outline"
            className="max-w-full shrink-0 border-cyan-500/30 text-left text-[10px] leading-snug text-cyan-100/80 [overflow-wrap:anywhere]"
          >
            {triage.severity}
          </Badge>
          <Badge
            variant="outline"
            className="max-w-full shrink-0 border-cyan-500/30 text-left text-[10px] leading-snug text-cyan-100/80 [overflow-wrap:anywhere]"
          >
            {triage.confidence}
          </Badge>
        </div>
      </div>

      {hasFlags && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring.soft}
          className="flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-3 text-xs text-amber-50 sm:px-4 sm:py-3.5"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-200" />
          <div className="min-w-0 flex-1">
            <div className="font-medium uppercase tracking-[0.18em] text-amber-100/90">Escalation cues</div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-amber-50/90">
              {triage.emergency_flags.map((f) => (
                <li key={f} className="break-words">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      <div className="grid min-w-0 gap-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cyan-200/55">
            <ListChecks className="size-3.5 shrink-0" />
            Extracted symptoms
          </div>
          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate="show"
            className="space-y-2 text-sm leading-snug text-cyan-50/90"
          >
            {(triage.symptoms.length ? triage.symptoms : ["No discrete symptoms enumerated"]).map((s, i) => (
              <motion.li key={`${s}-${i}`} variants={listItem} className="break-words pl-0.5">
                <span className="mr-1.5 text-cyan-300/50">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cyan-200/55">
            <Stethoscope className="size-3.5 shrink-0" />
            Differential space
          </div>
          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate="show"
            className="space-y-2 text-sm leading-snug text-cyan-50/90"
          >
            {(triage.possible_conditions.length ? triage.possible_conditions : ["Insufficient data for ranked differentials"]).map(
              (c, i) => (
                <motion.li key={`${c}-${i}`} variants={listItem} className="break-words pl-0.5">
                  <span className="mr-1.5 text-cyan-300/50">{String(i + 1).padStart(2, "0")}</span>
                  {c}
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
        className="text-sm leading-relaxed text-cyan-50/95 [overflow-wrap:anywhere]"
      >
        {triage.recommendation}
      </motion.p>
    </motion.div>
  );
}
