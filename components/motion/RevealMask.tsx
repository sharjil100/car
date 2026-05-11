"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

/**
 * RevealMask
 * --------------------------------------------------------------
 * Wraps a layer in a circular clip-path that follows the cursor on hover.
 * Reused from the hero — generalized so any section can use it.
 *
 * <RevealMask radius={220}>
 *   <YourLayer />   // this is what gets revealed
 * </RevealMask>
 *
 * Place this absolutely over the base layer you want to "reveal".
 */
export default function RevealMask({
  children,
  radius = 220,
  className = "",
  desktopOnly = true,
}: {
  children: ReactNode;
  radius?: number;
  className?: string;
  desktopOnly?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 350, damping: 35, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 350, damping: 35, mass: 0.6 });
  const r = useMotionValue(0);
  const sr = useSpring(r, { stiffness: 220, damping: 28 });

  const clipPath = useMotionTemplate`circle(${sr}px at ${sx}px ${sy}px)`;

  useEffect(() => {
    if (!desktopOnly) return;
    const mql = window.matchMedia("(min-width: 1024px) and (hover: hover)");
    const update = () => setActive(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [desktopOnly]);

  const onEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    r.set(radius);
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };
  const onLeave = () => {
    if (!active) return;
    r.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath, WebkitClipPath: clipPath }}
      >
        {children}
      </motion.div>
    </div>
  );
}
