"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { buildNeuralParticles } from "@/lib/seeded-rng";
import { ease } from "@/lib/motion";

/**
 * CSS / Motion hologram — restrained depth, slow rotation, minimal sparkles.
 */
export default function HoloSphereScene() {
  const sparks = React.useMemo(() => buildNeuralParticles(28, 0x484f4c4f), []);

  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center overflow-visible md:h-[520px]">
      <div
        className="pointer-events-none absolute inset-[8%] rounded-full bg-cyan-500/15 blur-[52px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[20%] rounded-full bg-sky-500/10 blur-[36px]"
        aria-hidden
      />

      <div
        className="relative grid size-[min(100%,22rem)] place-items-center [perspective:1100px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          aria-hidden
          className="absolute size-[92%] rounded-full border border-cyan-400/18"
          style={{ transform: "rotateX(68deg)" }}
          animate={{ rotateZ: [0, 360] }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          aria-hidden
          className="absolute size-[76%] rounded-full border border-sky-300/20"
          style={{ transform: "rotateX(58deg) rotateZ(18deg)" }}
          animate={{ rotateZ: [0, -360] }}
          transition={{ duration: 56, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          aria-hidden
          className="absolute size-[60%] rounded-full border border-cyan-200/16"
          style={{ transform: "rotateX(48deg) rotateZ(-12deg)" }}
          animate={{ rotateZ: [0, 360] }}
          transition={{ duration: 64, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="relative size-[46%] rounded-full"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 52, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 rounded-full shadow-cyan"
            style={{
              background:
                "radial-gradient(circle at 32% 28%, rgba(207,250,254,0.45), transparent 42%), radial-gradient(circle at 72% 68%, rgba(34,211,238,0.38), rgba(8,47,73,0.92) 68%)",
            }}
          />
          <div
            className="absolute inset-[6%] rounded-full border border-cyan-300/28 opacity-90"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, rgba(34,211,238,0.18) 0deg 9deg, transparent 9deg 18deg)",
              maskImage: "radial-gradient(circle, transparent 38%, black 40%, black 62%, transparent 64%)",
              WebkitMaskImage:
                "radial-gradient(circle, transparent 38%, black 40%, black 62%, transparent 64%)",
            }}
          />
          <div className="absolute inset-[18%] rounded-full border border-white/10 bg-black/25 backdrop-blur-[2px]" />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          {sparks.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-cyan-300/35 blur-[0.5px]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: Math.max(1, p.s * 0.3),
                height: Math.max(1, p.s * 0.3),
              }}
              animate={{ opacity: [0.08, 0.28, 0.08] }}
              transition={{
                duration: 10 + (p.id % 5),
                repeat: Infinity,
                repeatType: "mirror",
                ease: ease.inOut,
                delay: p.id * 0.06,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
