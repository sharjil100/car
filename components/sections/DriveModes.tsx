"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * DriveModes
 * --------------------------------------------------------------
 * Vertical scroll → horizontal track of 4 terrain panels.
 * Section is 400vh tall; inner viewport sticks; inner track translates -75%.
 * Each panel has a procedural background (gradients/SVG) and the same car PNG.
 */

type Mode = {
  name: string;
  tag: string;
  bg: string; // CSS gradient
  carTint: string; // overlay color over the car for "lighting"
  accent: string; // accent text/line color
};

const MODES: Mode[] = [
  {
    name: "Sand",
    tag: "Desert calibration",
    bg: "linear-gradient(to bottom, #d99761 0%, #b3743f 35%, #5a3a1f 80%, #1a0e05 100%)",
    carTint: "rgba(255,180,120,0.18)",
    accent: "#ffb877",
  },
  {
    name: "Snow",
    tag: "Sub-zero traction",
    bg: "linear-gradient(to bottom, #cfe6f3 0%, #8fb3c8 30%, #3a4d5e 75%, #0a0f14 100%)",
    carTint: "rgba(180,210,235,0.22)",
    accent: "#cfe6f3",
  },
  {
    name: "Rock",
    tag: "Crawl-control mode",
    bg: "linear-gradient(to bottom, #6e6357 0%, #4b423a 35%, #2a2520 75%, #0a0807 100%)",
    carTint: "rgba(220,200,180,0.12)",
    accent: "#c8b896",
  },
  {
    name: "Highway",
    tag: "Cruise envelope",
    bg: "linear-gradient(to bottom, #18334a 0%, #0e1f30 40%, #050a12 90%)",
    carTint: "rgba(120,180,255,0.15)",
    accent: "#90c8ff",
  },
];

export default function DriveModes() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // Translate -75% across (4 panels, each 25% of total track width = 100vw each)
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={ref} style={{ height: "400vh" }} className="relative w-full bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div className="flex h-full w-[400vw]" style={{ x }}>
          {MODES.map((m, i) => (
            <Panel key={m.name} mode={m} index={i} />
          ))}
        </motion.div>

        {/* Section header pinned overlay */}
        <div className="pointer-events-none absolute left-0 right-0 top-8 z-30 px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/70">
            03 / Drive Modes
          </p>
        </div>

        {/* Pagination dots */}
        <div className="pointer-events-none absolute bottom-10 left-1/2 z-30 flex -translate-x-1/2 gap-3">
          {MODES.map((_, i) => (
            <Dot key={i} index={i} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Dot({
  index,
  progress,
}: {
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each panel occupies a 0.25 slice of scroll progress [0,1].
  // Keep start ≥ 0 and use two points per transform so offsets are always 0→1.
  const start = Math.max(0, index / 4);
  const mid = start + 0.125;
  const end = Math.min(1, (index + 1) / 4);
  const opacity = useTransform(progress, [start, mid, end], [0.3, 1, 0.3]);
  const scale = useTransform(progress, [start, mid, end], [1, 1.6, 1]);
  return (
    <motion.span
      style={{ opacity, scale }}
      className="block h-1.5 w-1.5 rounded-full bg-white"
    />
  );
}

function Panel({ mode, index }: { mode: Mode; index: number }) {
  return (
    <div
      className="relative h-full w-screen flex-none overflow-hidden"
      style={{ background: mode.bg }}
    >
      {/* Atmospheric noise/grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Big mode number */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.08 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 1 }}
        className="absolute left-[6%] top-[14%] select-none text-[28vw] font-bold leading-none text-white"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.div>

      {/* Mode name + tag */}
      <div className="absolute left-[6%] top-[20%] z-20 max-w-[40vw]">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.7 }}
          className="text-[10px] uppercase tracking-[0.4em] text-white/70"
        >
          {mode.tag}
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-2 text-[clamp(3rem,9vw,9rem)] font-bold leading-[0.9] tracking-tight text-white"
          style={{ color: mode.accent }}
        >
          {mode.name}
        </motion.h3>
      </div>

      {/* Horizon line */}
      <div className="pointer-events-none absolute inset-x-0 top-[62%] h-px bg-white/15" />

      {/* Car */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 bottom-[6%] mx-auto h-[60vh] max-h-[700px] w-full max-w-[1500px]"
      >
        <Image
          src="/car/car-main.png"
          alt={mode.name}
          fill
          sizes="100vw"
          className="select-none object-contain object-bottom"
          style={{
            filter:
              "drop-shadow(0 30px 25px rgba(0,0,0,0.6)) drop-shadow(0 60px 50px rgba(0,0,0,0.5))",
          }}
        />
        {/* Color tint overlay (mix-blend) — picks up terrain ambience */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-overlay"
          style={{ background: mode.carTint }}
        />
        {/* contact shadow */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[40px] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/85 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[12px] w-[55%] -translate-x-1/2 rounded-[50%] bg-black blur-[5px]" />
      </motion.div>
    </div>
  );
}
