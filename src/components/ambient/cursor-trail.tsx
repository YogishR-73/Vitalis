"use client";

import * as React from "react";
import { motion } from "framer-motion";

export function CursorTrail() {
  const [trail, setTrail] = React.useState<{ x: number; y: number; id: number }[]>(
    []
  );
  const idRef = React.useRef(0);

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      idRef.current += 1;
      const id = idRef.current;
      setTrail((t) => [...t.slice(-8), { x: e.clientX, y: e.clientY, id }]);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] hidden md:block">
      {trail.map((p, i) => (
        <motion.span
          key={p.id}
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/35 blur-[2px]"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 0.9, scale: 1.2 }}
          animate={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.012 }}
        />
      ))}
    </div>
  );
}
