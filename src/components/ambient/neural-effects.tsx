"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import * as React from "react";
import { buildNeuralParticles } from "@/lib/seeded-rng";
import { ease } from "@/lib/motion";

export function NeuralParticles({ count = 48 }: { count?: number }) {
  const particles = React.useMemo(() => buildNeuralParticles(count), [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-cyan-400/20 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s * 0.85,
            height: p.s * 0.85,
          }}
          animate={{
            y: [0, -6, 0],
            opacity: [0.1, 0.22, 0.1],
          }}
          transition={{
            duration: 16 + (p.id % 6) * 1.4,
            repeat: Infinity,
            repeatType: "mirror",
            ease: ease.inOut,
            delay: p.id * 0.04,
          }}
        />
      ))}
    </div>
  );
}

export function MouseGlow({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 32, mass: 0.55 });
  const sy = useSpring(my, { stiffness: 90, damping: 32, mass: 0.55 });

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(e.clientX - r.left);
      my.set(e.clientY - r.top);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [containerRef, mx, my]);

  const background = useMotionTemplate`radial-gradient(480px circle at ${sx}px ${sy}px, rgba(34,211,238,0.12), transparent 58%)`;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 mix-blend-screen"
      style={{ background }}
    />
  );
}

/** Single soft horizon pulse — low contrast, long period. */
export function PulseWaves() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden opacity-[0.18]">
      <motion.div
        aria-hidden
        className="absolute h-[42vh] w-[125vw] rounded-[100%] border border-cyan-400/15"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1.05, opacity: [0, 0.35, 0] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          repeatDelay: 4,
          ease: ease.out,
        }}
      />
    </div>
  );
}
