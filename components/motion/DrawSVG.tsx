"use client";

import { motion, MotionValue } from "framer-motion";

/**
 * DrawSVG
 * --------------------------------------------------------------
 * A motion <path> that draws itself based on either a scroll progress
 * MotionValue OR an in-view trigger. Defaults to in-view.
 */
export function DrawPath({
  d,
  progress,
  className = "stroke-blue-300",
  strokeWidth = 1,
  delay = 0,
  duration = 1.2,
}: {
  d: string;
  progress?: MotionValue<number>;
  className?: string;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
}) {
  if (progress) {
    return (
      <motion.path
        d={d}
        fill="none"
        strokeWidth={strokeWidth}
        className={className}
        style={{ pathLength: progress }}
      />
    );
  }
  return (
    <motion.path
      d={d}
      fill="none"
      strokeWidth={strokeWidth}
      className={className}
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
