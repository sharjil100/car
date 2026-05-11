"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/**
 * Marquee
 * --------------------------------------------------------------
 * Infinite horizontal ticker built with two duplicated tracks animated
 * with framer-motion. No external libs.
 */
export default function Marquee({
  children,
  speed = 40,
  className = "",
}: {
  children: ReactNode;
  speed?: number; // seconds per loop
  className?: string;
}) {
  const Track = (
    <div className="flex shrink-0 items-center gap-16 px-8">{children}</div>
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        {Track}
        {Track}
      </motion.div>
    </div>
  );
}
