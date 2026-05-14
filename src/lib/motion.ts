import type { Transition, Variants } from "framer-motion";

/** Cinematic easing — calm deceleration (Apple-adjacent feel). */
export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  outSoft: [0.22, 1, 0.36, 1] as const,
  inOut: [0.45, 0, 0.55, 1] as const,
};

export const duration = {
  hero: 1,
  section: 0.72,
  message: 0.48,
  micro: 0.28,
};

/** Springs tuned for luxury UI: high damping, moderate stiffness. */
export const spring = {
  soft: { type: "spring" as const, stiffness: 280, damping: 32, mass: 0.85 },
  tactile: { type: "spring" as const, stiffness: 380, damping: 34, mass: 0.65 },
  lift: { type: "spring" as const, stiffness: 300, damping: 28, mass: 0.9 },
};

export const stagger = {
  tight: 0.055,
  luxe: 0.085,
};

export const viewport = {
  once: true as const,
  margin: "-10% 0px -10% 0px" as const,
  amount: 0.22 as const,
};

const transition = (d = duration.section, delay = 0): Transition => ({
  duration: d,
  delay,
  ease: ease.out,
});

/** Section / block stagger — parent coordinates children. */
export const staggerReveal: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.luxe,
      delayChildren: 0.06,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition(duration.section),
  },
};

export const fadeUpHero: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition(duration.hero),
  },
};

export const fadeUpTight: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition(duration.micro + 0.08),
  },
};

/** Cards / list tiles — slightly shorter travel. */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition(0.62),
  },
};
