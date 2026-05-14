"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ease, fadeUpHero, staggerReveal, viewport } from "@/lib/motion";
import { Moon, Utensils, Droplets, Flame, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function useAnimatedFloat(target: number, decimals = 1) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 120, damping: 22 });
  const [text, setText] = React.useState(
    decimals === 0 ? "0" : Number(0).toFixed(decimals)
  );

  React.useEffect(() => {
    mv.jump(0);
    mv.set(target);
  }, [mv, target]);

  React.useEffect(() => {
    const unsub = spring.on("change", (v) =>
      setText(v.toFixed(decimals))
    );
    return () => unsub();
  }, [spring, decimals]);

  return text;
}

function EcgCanvas() {
  const path =
    "M0,20 L6,20 L8,8 L10,32 L12,20 L30,20 L32,12 L34,28 L36,20 L54,20 L56,6 L58,34 L60,20 L78,20 L80,14 L82,26 L84,20 L102,20 L104,10 L106,30 L108,20 L120,20";
  const gid = React.useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 120 40" className="h-28 w-full">
      <defs>
        <linearGradient id={`ecg-${gid}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#67e8f9" stopOpacity="1" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <motion.path
        d={path}
        fill="none"
        stroke={`url(#ecg-${gid})`}
        strokeWidth="1.6"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4, ease: ease.inOut }}
      />
    </svg>
  );
}

function HeatStrip() {
  const bars = [0.35, 0.55, 0.42, 0.7, 0.5, 0.62, 0.38, 0.58, 0.45, 0.66, 0.52, 0.4];
  return (
    <div className="relative h-10 w-full overflow-hidden rounded-xl border border-cyan-500/15 bg-black/40">
      <div className="flex h-full items-end gap-px px-1 pb-1 pt-2">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-cyan-700/25 to-cyan-300/55"
            initial={{ scaleY: 0.25, opacity: 0.35 }}
            whileInView={{ scaleY: h, opacity: 0.85 }}
            viewport={viewport}
            transition={{ duration: 0.55, delay: i * 0.04, ease: ease.out }}
            style={{ transformOrigin: "bottom" }}
          />
        ))}
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent"
        animate={{ x: ["-45%", "145%"] }}
        transition={{ duration: 9, repeat: Infinity, repeatDelay: 7, ease: ease.inOut }}
      />
    </div>
  );
}

export function HealthMetricsVisualization() {
  const calories = useAnimatedFloat(1840, 0);
  const sleep = useAnimatedFloat(7.4, 1);

  return (
    <section id="metrics" className="relative border-b border-cyan-500/10 py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="mb-12 max-w-2xl space-y-4"
          variants={staggerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.div variants={fadeUpHero}>
            <Badge variant="glow" className="uppercase tracking-[0.28em]">
              Multimodal vitals canvas
            </Badge>
          </motion.div>
          <motion.h2 variants={fadeUpHero} className="font-display text-3xl text-white md:text-5xl">
            Holographic analytics that breathe with the patient
          </motion.h2>
          <motion.p variants={fadeUpHero} className="text-base text-cyan-100/65 md:text-lg">
            ECG traces, oxygen trends, stress heatmaps, and metabolic intelligence—each rendered as kinetic glass, not static charts.
          </motion.p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glass-panel lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base text-white">Live ECG synthesis</CardTitle>
              <Activity className="size-4 text-cyan-300" />
            </CardHeader>
            <CardContent>
              <EcgCanvas />
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-cyan-500/15 bg-black/35 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/55">
                    Heart rate
                  </div>
                  <div className="mt-2 font-mono text-3xl text-white">68</div>
                  <div className="text-xs text-emerald-300/80">Rhythm stable</div>
                </div>
                <div className="rounded-2xl border border-cyan-500/15 bg-black/35 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/55">
                    SpO₂ trend
                  </div>
                  <div className="mt-2 font-mono text-3xl text-white">98%</div>
                  <div className="text-xs text-cyan-100/60">Room air</div>
                </div>
                <div className="rounded-2xl border border-cyan-500/15 bg-black/35 p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/55">
                    HRV coherence
                  </div>
                  <div className="mt-2 font-mono text-3xl text-white">0.81</div>
                  <div className="text-xs text-cyan-100/60">Ascending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Flame className="size-4 text-orange-300" />
                  Stress heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HeatStrip />
                <p className="mt-3 text-xs text-cyan-100/60">
                  Sympathetic load concentrates late afternoon—consider adaptive scheduling of high-focus work blocks.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Moon className="size-4 text-indigo-300" />
                  Sleep architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/55">
                      Deep + REM
                    </div>
                    <div className="font-mono text-3xl text-white">{sleep}h</div>
                  </div>
                  <div className="h-16 w-24 rounded-xl border border-cyan-500/15 bg-gradient-to-t from-cyan-500/25 via-sky-500/10 to-transparent" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Utensils className="size-4 text-lime-300" />
                  Calorie intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/55">
                    Net burn target
                  </div>
                  <div className="font-mono text-3xl text-white">{calories}</div>
                </div>
                <div className="flex size-16 items-center justify-center rounded-2xl border border-cyan-500/20 bg-black/40">
                  <Droplets className="size-7 text-cyan-300" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
