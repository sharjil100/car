"use client";

import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ReactNode, useRef } from "react";

/**
 * ScrollPin
 * --------------------------------------------------------------
 * A tall outer section whose inner viewport sticks while the user scrolls.
 * Exposes a 0–1 progress motion value to children via render-prop.
 *
 * Usage:
 *   <ScrollPin height="200vh">
 *     {(progress) => <YourScene progress={progress} />}
 *   </ScrollPin>
 */
export default function ScrollPin({
  children,
  height = "200vh",
  className = "",
}: {
  children: (progress: MotionValue<number>) => ReactNode;
  height?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} style={{ height }} className={`relative w-full ${className}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {children(progress)}
      </div>
    </section>
  );
}
