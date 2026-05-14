"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Brain, Cpu, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { HoloSphereLoadingFallback } from "@/components/holo-sphere-loading";
import {
  ease,
  fadeUpHero,
  fadeUpItem,
  fadeUpTight,
  spring,
  staggerReveal,
} from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/magnetic-button";
import { MouseGlow, NeuralParticles, PulseWaves } from "@/components/ambient/neural-effects";
import { useMousePosition } from "@/hooks/use-mouse-position";

const HoloSphereScene = dynamic(() => import("@/components/holo-sphere-scene"), {
  ssr: false,
  loading: HoloSphereLoadingFallback,
});

export function HeroSection() {
  const root = React.useRef<HTMLElement>(null);
  const mouse = useMousePosition(root);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 52]);
  const dim = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      ref={root}
      id="hero"
      className="relative min-h-[100svh] overflow-hidden border-b border-cyan-500/10"
    >
      <div className="absolute inset-0 bg-grid-fade bg-grid bg-[length:64px_64px,64px_64px] bg-[position:center_top]" />
      <div className="absolute inset-0 bg-radial-glow" />
      <MouseGlow containerRef={root} />
      <NeuralParticles count={48} />
      <PulseWaves />
      <div className="pointer-events-none absolute inset-0 scanlines opacity-[0.08]" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]"
        animate={{ opacity: [0.18, 0.26, 0.18] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: "mirror", ease: ease.inOut }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-sky-500/15 blur-[110px]"
        animate={{ opacity: [0.14, 0.22, 0.14] }}
        transition={{
          duration: 26,
          repeat: Infinity,
          repeatType: "mirror",
          ease: ease.inOut,
          delay: 1,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-28 md:px-10 md:pt-32">
        <motion.div
          variants={staggerReveal}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-16 md:flex-row md:items-center md:gap-10"
        >
          <motion.div
            className="flex flex-1 flex-col space-y-10"
            style={{ opacity: dim }}
            variants={fadeUpHero}
          >
            <motion.div variants={fadeUpTight} className="flex flex-wrap items-center gap-3">
              <Badge variant="glow" className="gap-1.5 px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                <Sparkles className="size-3.5" />
                Clinical Intelligence OS
              </Badge>
              <Badge variant="outline" className="border-cyan-500/25 bg-white/5 text-cyan-100/80">
                Live · Synthetic demo environment
              </Badge>
            </motion.div>

            <motion.div variants={fadeUpHero} className="space-y-6">
              <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
                <span className="block text-glow bg-gradient-to-r from-white via-cyan-100 to-sky-200 bg-clip-text text-transparent">
                  AI-Powered Healthcare
                </span>
                <span className="mt-2 block text-3xl text-cyan-200/90 md:text-5xl">
                  Intelligence for the Future
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-cyan-100/70 md:text-lg">
                VITALIS AI fuses multimodal vitals, predictive triage, and ambient clinical copilots into one cinematic operating layer—built for the moment care becomes software-defined.
              </p>
            </motion.div>

            <motion.div variants={fadeUpTight} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <MagneticButton
                className="group relative overflow-hidden rounded-2xl border border-cyan-400/35 bg-gradient-to-r from-cyan-500/25 via-sky-500/15 to-cyan-400/10 px-8 py-4 text-base font-medium text-white shadow-cyan backdrop-blur-md"
                strength={0.18}
              >
                <span className="absolute inset-0 bg-holo-sweep bg-[length:200%_100%] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  <Cpu className="size-5 text-cyan-100" />
                  Launch Command Center
                </span>
              </MagneticButton>
              <motion.div whileHover={{ y: -1 }} transition={spring.soft}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-cyan-500/25 bg-white/5 text-cyan-50 backdrop-blur-md hover:bg-cyan-500/10"
                  asChild
                >
                  <a href="#assistant">Experience Symptom Copilot</a>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={staggerReveal}
              initial="hidden"
              animate="visible"
              className="grid max-w-lg grid-cols-3 gap-4 text-xs text-cyan-100/55 md:text-sm"
            >
              {[
                { icon: ShieldCheck, t: "HIPAA-ready architecture patterns" },
                { icon: Brain, t: "Neural triage + differential ranking" },
                { icon: Activity, t: "Sub-second risk propagation" },
              ].map((item) => (
                <motion.div
                  key={item.t}
                  variants={fadeUpItem}
                  whileHover={{ y: -2 }}
                  transition={spring.lift}
                  className="glass-panel flex items-start gap-2 rounded-xl p-3"
                >
                  <item.icon className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                  <span className="leading-snug">{item.t}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUpHero}
            className="relative flex flex-1 flex-col items-center justify-center"
            style={{ y: parallaxY }}
          >
            <motion.div
              style={{
                rotateX: mouse.ny * -4,
                rotateY: mouse.nx * 5,
                transformPerspective: 1200,
              }}
              className="relative w-full max-w-xl"
            >
              <div className="glass-panel holo-border relative overflow-hidden rounded-3xl p-1">
                <div className="rounded-[22px] bg-gradient-to-b from-white/[0.07] to-transparent p-4 md:p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-cyan-200/70">
                      <Waves className="size-4" />
                      Vital Field
                    </div>
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/35" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.55)]" />
                    </span>
                  </div>
                  <HoloSphereScene />
                  <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] text-cyan-100/65 md:text-xs">
                    {[
                      { k: "Fusion Index", v: "0.984" },
                      { k: "Latency", v: "42ms" },
                      { k: "Models", v: "17 active" },
                    ].map((m) => (
                      <div
                        key={m.k}
                        className="rounded-xl border border-cyan-500/15 bg-black/30 px-2 py-2 text-center backdrop-blur"
                      >
                        <div className="text-[10px] uppercase tracking-widest text-cyan-300/50">
                          {m.k}
                        </div>
                        <div className="mt-1 font-mono text-sm text-white">{m.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{
                  duration: 18,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: ease.inOut,
                }}
                className="glass-panel absolute -left-4 top-10 hidden w-44 rounded-2xl p-3 text-xs text-cyan-50 shadow-cyan md:block"
              >
                <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-widest text-cyan-300/60">
                  Hemodynamics
                  <span className="text-emerald-300">Stable</span>
                </div>
                <div className="font-mono text-lg text-white">112 / 74</div>
                <div className="mt-2 h-10 w-full rounded-md bg-gradient-to-r from-cyan-500/20 via-sky-400/10 to-transparent" />
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: ease.inOut,
                  delay: 0.6,
                }}
                className="glass-panel absolute -right-2 bottom-16 hidden w-48 rounded-2xl p-3 text-xs text-cyan-50 shadow-cyan lg:block"
              >
                <div className="mb-1 text-[10px] uppercase tracking-widest text-cyan-300/60">
                  Predictive trajectory
                </div>
                <div className="text-sm text-white">Recovery window: 9.4d ±1.1</div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"
                    initial={{ width: "44%" }}
                    whileInView={{ width: "68%" }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1.4, ease: ease.out }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
