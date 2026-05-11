"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * MagneticButton
 * --------------------------------------------------------------
 * Wraps any child element and attracts it toward the cursor when within range.
 * Uses motion springs for inertia. ~30 LoC.
 */
export default function MagneticButton({
  children,
  strength = 0.35,
  range = 120,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 22, mass: 0.5 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > range + Math.max(r.width, r.height) / 2) {
      x.set(0);
      y.set(0);
      return;
    }
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
