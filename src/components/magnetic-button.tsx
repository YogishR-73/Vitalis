"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";

type MagneticButtonProps = React.ComponentProps<typeof motion.button> & {
  strength?: number;
};

export function MagneticButton({
  className,
  children,
  strength = 0.28,
  onMouseMove: onMouseMoveProp,
  onMouseLeave: onMouseLeaveProp,
  ...rest
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 28, mass: 0.45 });
  const sy = useSpring(y, { stiffness: 220, damping: 28, mass: 0.45 });
  const rotateX = useTransform(sy, [-20, 20], [3.5 * strength, -3.5 * strength]);
  const rotateY = useTransform(sx, [-20, 20], [-3.5 * strength, 3.5 * strength]);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = e.clientX - (r.left + r.width / 2);
    const py = e.clientY - (r.top + r.height / 2);
    x.set(px * strength);
    y.set(py * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      {...rest}
      className={cn("relative", className)}
      style={{ x: sx, y: sy, rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        onMove(e);
        onMouseMoveProp?.(e);
      }}
      onMouseLeave={(e) => {
        onLeave();
        onMouseLeaveProp?.(e);
      }}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
      transition={spring.tactile}
    >
      {children}
    </motion.button>
  );
}
