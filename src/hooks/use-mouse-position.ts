"use client";

import * as React from "react";

export function useMousePosition(containerRef?: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = React.useState({ x: 0, y: 0, nx: 0, ny: 0 });

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const target = containerRef?.current;
      if (target) {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPos({
          x,
          y,
          nx: x / rect.width - 0.5,
          ny: y / rect.height - 0.5,
        });
        return;
      }
      setPos({
        x: e.clientX,
        y: e.clientY,
        nx: e.clientX / window.innerWidth - 0.5,
        ny: e.clientY / window.innerHeight - 0.5,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [containerRef]);

  return pos;
}
