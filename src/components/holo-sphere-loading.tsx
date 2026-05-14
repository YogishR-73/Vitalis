"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/** Minimal loading shell — slow, low-amplitude motion only. */
export function HoloSphereLoadingFallback() {
  return (
    <div className="flex h-[420px] w-full items-center justify-center md:h-[520px]">
      <div className="relative grid size-52 place-items-center md:size-60">
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-[40px]" aria-hidden />
        <motion.div
          aria-hidden
          className="absolute size-[78%] rounded-full border border-cyan-400/25"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          aria-hidden
          className="absolute size-[62%] rounded-full border border-sky-400/18"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 44, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="relative size-[48%] rounded-full bg-gradient-to-br from-cyan-300/35 via-cyan-500/18 to-sky-900/35 shadow-cyan"
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatType: "mirror", ease: ease.inOut }}
        />
        <p className="absolute bottom-6 text-xs uppercase tracking-[0.28em] text-cyan-200/50">
          Initializing neural field…
        </p>
      </div>
    </div>
  );
}
