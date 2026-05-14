"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Lock, Radar, Shield } from "lucide-react";
import { ease, spring } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";

const links = [
  { href: "#hero", label: "Overview" },
  { href: "#assistant", label: "Copilot" },
  { href: "#risk", label: "Risk fabric" },
  { href: "#metrics", label: "Metrics" },
  { href: "#recommendations", label: "Engine" },
  { href: "#emergency", label: "Emergency" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled ? "rgba(3,5,8,0.9)" : "rgba(3,5,8,0.35)",
        backdropFilter: scrolled ? "blur(22px)" : "blur(12px)",
      }}
      transition={{ duration: 0.45, ease: ease.out }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-10">
        <a href="#hero" className="flex items-center gap-3">
          <motion.div
            className="grid size-10 place-items-center rounded-2xl border border-cyan-400/35 bg-gradient-to-br from-cyan-500/35 to-sky-600/10 shadow-cyan"
            whileHover={{ scale: 1.03 }}
            transition={spring.soft}
          >
            <span className="font-display text-sm font-semibold tracking-tight text-white">V</span>
          </motion.div>
          <div>
            <div className="font-display text-sm font-semibold tracking-[0.18em] text-white">
              VITALIS AI
            </div>
            <div className="text-[11px] text-cyan-200/55">Healthcare intelligence OS</div>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.22em] text-cyan-100/60 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Badge variant="glow" className="hidden text-[10px] uppercase tracking-[0.28em] sm:inline-flex">
            Investor preview
          </Badge>
          <motion.a
            href="#assistant"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.985 }}
            transition={spring.tactile}
            className="rounded-2xl border border-cyan-400/35 bg-gradient-to-r from-cyan-500/25 to-sky-500/15 px-4 py-2 text-xs font-medium text-white shadow-cyan backdrop-blur-md"
          >
            Open copilot
          </motion.a>
        </div>
      </div>
    </motion.header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan-500/10 py-20">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[140%] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <div className="space-y-6">
            <div className="font-display text-2xl tracking-[0.24em] text-white">VITALIS AI</div>
            <p className="max-w-xl text-sm leading-relaxed text-cyan-100/65 md:text-base">
              The future of AI-powered healthcare intelligence—where clinical rigor meets cinematic human interface design. Built as a premium narrative surface for investors, clinicians, and product leaders.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Shield, t: "Zero-trust ready patterns" },
                { icon: Lock, t: "End-to-end encryption posture" },
                { icon: Radar, t: "Continuous adversarial monitoring" },
              ].map((x) => (
                <motion.div
                  key={x.t}
                  whileHover={{ y: -1 }}
                  transition={spring.soft}
                  className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-xs text-cyan-50"
                >
                  <x.icon className="size-4 text-cyan-300" />
                  {x.t}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3 text-sm text-cyan-100/60">
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-300/55">Systems</div>
              <div>Clinical copilots</div>
              <div>Risk intelligence fabric</div>
              <div>Emergency orchestration</div>
              <div>Population sensing</div>
            </div>
            <div className="space-y-3 text-sm text-cyan-100/60">
              <div className="text-xs uppercase tracking-[0.28em] text-cyan-300/55">Trust</div>
              <div>Model cards on every release</div>
              <div>Human-in-the-loop overrides</div>
              <div>Regional data residency</div>
              <div>Immutable audit trails</div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-cyan-500/10 pt-8 text-xs text-cyan-200/45 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} VITALIS AI · Conceptual interface demonstration</span>
          <span className="font-mono text-[11px] text-cyan-300/40">
            SYS_OK · LAT_12ms · NODE_US_EAST
          </span>
        </div>
      </div>
    </footer>
  );
}
