"use client";

import * as React from "react";
import { animate, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ease, fadeUpHero, staggerReveal, viewport } from "@/lib/motion";
import { Activity, AlertTriangle, Brain, Droplets, Flame, Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Ring({
  value,
  label,
  sub,
  tone,
}: {
  value: number;
  label: string;
  sub: string;
  tone: "cyan" | "amber" | "emerald" | "rose";
}) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const colors = {
    cyan: "#22d3ee",
    amber: "#fbbf24",
    emerald: "#34d399",
    rose: "#fb7185",
  } as const;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative grid size-36 place-items-center md:size-40">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="9"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={r}
            stroke={colors[tone]}
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - value / 100) }}
            transition={{ duration: 1.6, ease: ease.out }}
            style={{ filter: `drop-shadow(0 0 12px ${colors[tone]})` }}
          />
        </svg>
        <div className="absolute text-center">
          <div className="font-mono text-2xl text-white md:text-3xl">{value}</div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200/55">
            AI score
          </div>
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-xs text-cyan-100/55">{sub}</div>
      </div>
    </div>
  );
}

function Sparkline({ d, color }: { d: string; color: string }) {
  const uid = React.useId().replace(/:/g, "");
  const gradId = `grad-${uid}`;
  return (
    <svg viewBox="0 0 120 40" className="h-16 w-full">
      <defs>
        <linearGradient id={gradId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={viewport}
        transition={{ duration: 2.2, ease: ease.inOut }}
      />
    </svg>
  );
}

export function RiskIntelligenceDashboard() {
  const live = useMotionValue(0);
  const pulse = useSpring(live, { stiffness: 72, damping: 24 });
  const glow = useTransform(pulse, [0, 1], ["0 0 0 rgba(0,0,0,0)", "0 0 42px rgba(34,211,238,0.22)"]);

  React.useEffect(() => {
    const controls = animate(live, [0.38, 0.52], {
      duration: 12,
      repeat: Infinity,
      repeatType: "mirror",
      ease: ease.inOut,
    });
    return () => controls.stop();
  }, [live]);

  return (
    <section id="risk" className="relative border-b border-cyan-500/10 py-24">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-64 w-[120%] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]"
        style={{ boxShadow: glow }}
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div className="max-w-2xl space-y-4">
            <motion.div variants={fadeUpHero}>
              <Badge variant="glow" className="uppercase tracking-[0.28em]">
                Predictive risk fabric
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUpHero} className="font-display text-3xl text-white md:text-5xl">
              Live patient intelligence, rendered like a flight deck
            </motion.h2>
            <motion.p variants={fadeUpHero} className="text-base text-cyan-100/65 md:text-lg">
              Continuous fusion of vitals, genomics priors, and behavioral telemetry—expressed through luminous metrics instead of dense tables.
            </motion.p>
          </div>
          <motion.div variants={fadeUpHero} className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3 text-xs text-cyan-100/70">
            <span className="relative flex h-2.5 w-2.5">
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.45)]" />
            </span>
            Real-time inference stream · demo simulation
          </motion.div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glass-panel holo-border border-cyan-500/15 bg-gradient-to-b from-white/[0.05] to-transparent lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base text-white">Composite AI health score</CardTitle>
              <Activity className="size-4 text-cyan-300" />
            </CardHeader>
            <CardContent className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
              <div className="flex flex-wrap items-start justify-around gap-6 py-2">
                <Ring value={92} label="Resilience" sub="Model confidence high" tone="cyan" />
                <Ring value={38} label="Emergency risk" sub="Watchlist · not alarmed" tone="amber" />
                <Ring value={74} label="Recovery" sub="Bayesian prognosis" tone="emerald" />
              </div>
              <div className="space-y-4">
                {[
                  { k: "AI confidence", v: 0.94 },
                  { k: "Stress load", v: 0.62 },
                  { k: "O₂ saturation", v: 0.97 },
                  { k: "Cardiac strain", v: 0.41 },
                ].map((row) => (
                  <div key={row.k} className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-cyan-100/60">
                      <span>{row.k}</span>
                      <span className="font-mono text-cyan-50">
                        {(row.v * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.v * 100}%` }}
                        viewport={viewport}
                        transition={{ duration: 1.2, ease: ease.out }}
                      />
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-cyan-500/15 bg-black/35 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs text-cyan-100/65">
                    <Brain className="size-4 text-cyan-300" />
                    Live patient intelligence narrative
                  </div>
                  <p className="text-sm leading-relaxed text-cyan-50/85">
                    Autonomic balance is trending favorable with rising HRV coherence. Maintain current medication timing; avoid additional sympathomimetic load until evening review.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="glass-panel border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-transparent shadow-emergency">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-rose-50">
                  <AlertTriangle className="size-4" />
                  Severity visualization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Sparkline
                  color="#fb7185"
                  d="M0,30 C10,10 20,35 30,18 S50,5 60,22 80,8 120,28"
                />
                <div className="flex items-center justify-between text-xs text-rose-100/70">
                  <span>Escalation pressure</span>
                  <span className="font-mono">0.32σ</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="text-base text-white">Ambient vitals</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-cyan-500/15 bg-black/30 p-3">
                  <div className="flex items-center gap-2 text-xs text-cyan-200/60">
                    <Wind className="size-4" />
                    Respiratory
                  </div>
                  <div className="mt-2 font-mono text-xl text-white">18 rpm</div>
                </div>
                <div className="rounded-xl border border-cyan-500/15 bg-black/30 p-3">
                  <div className="flex items-center gap-2 text-xs text-cyan-200/60">
                    <Droplets className="size-4" />
                    Hydration
                  </div>
                  <div className="mt-2 font-mono text-xl text-white">+1.8σ</div>
                </div>
                <div className="rounded-xl border border-cyan-500/15 bg-black/30 p-3">
                  <div className="flex items-center gap-2 text-xs text-cyan-200/60">
                    <Flame className="size-4" />
                    Metabolic
                  </div>
                  <div className="mt-2 font-mono text-xl text-white">1420 kcal</div>
                </div>
                <div className="rounded-xl border border-cyan-500/15 bg-black/30 p-3">
                  <div className="flex items-center gap-2 text-xs text-cyan-200/60">
                    <Brain className="size-4" />
                    Neural load
                  </div>
                  <div className="mt-2 font-mono text-xl text-white">Stable</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
