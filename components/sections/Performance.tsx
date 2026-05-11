"use client";

import Image from "next/image";
import { motion, useTransform, MotionValue } from "framer-motion";
import ScrollPin from "../motion/ScrollPin";

/**
 * Performance
 * --------------------------------------------------------------
 * Scroll-pinned. As progress 0 → 1:
 *   - Car scales up + drifts horizontally + main fades into blueprint
 *   - SVG connector lines draw out to spec callouts
 *   - Spec numbers count up
 */

const SPECS = [
  { label: "Horsepower", value: 409, suffix: " HP", x: "8%", y: "30%", anchor: "left" as const },
  { label: "Torque", value: 650, suffix: " Nm", x: "92%", y: "32%", anchor: "right" as const },
  { label: "0–100 km/h", value: 6.7, suffix: "s", x: "12%", y: "70%", anchor: "left" as const },
  { label: "Top Speed", value: 210, suffix: " km/h", x: "88%", y: "70%", anchor: "right" as const },
];

function SpecCallout({
  spec,
  progress,
  index,
}: {
  spec: (typeof SPECS)[number];
  progress: MotionValue<number>;
  index: number;
}) {
  const start = 0.25 + index * 0.1;
  const end = start + 0.2;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const tx = useTransform(progress, [start, end], [spec.anchor === "left" ? -40 : 40, 0]);
  const num = useTransform(progress, [start, end], [0, spec.value]);
  const display = useTransform(num, (v) =>
    spec.value % 1 === 0 ? Math.round(v).toString() : v.toFixed(1)
  );

  // Outer div handles static positioning + centering (no motion values),
  // inner motion.div only animates opacity/x — keeps Framer's transform
  // out of the same element as Tailwind's transform classes.
  return (
    <div
      className={`absolute z-30 flex -translate-y-1/2 flex-col ${
        spec.anchor === "right" ? "-translate-x-full" : ""
      }`}
      style={{ left: spec.x, top: spec.y }}
    >
      <motion.div style={{ opacity, x: tx }} className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
          {spec.label}
        </span>
        <span className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          <motion.span>{display}</motion.span>
          {spec.suffix}
        </span>
      </motion.div>
    </div>
  );
}

function Connectors({ progress }: { progress: MotionValue<number> }) {
  const len = useTransform(progress, [0.2, 0.6], [0, 1]);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {["M 12,32 L 38,46", "M 88,34 L 62,46", "M 16,68 L 40,58", "M 84,68 L 60,58"].map(
        (d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="rgba(140,180,255,0.55)"
            strokeWidth="0.15"
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: len }}
          />
        )
      )}
    </svg>
  );
}

function Scene({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0, 1], [0.85, 1.05]);
  const xPos = useTransform(progress, [0, 1], [0, -20]);
  const blueOpacity = useTransform(progress, [0.4, 0.85], [0, 0.85]);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0f1218_0%,_#06070a_60%,_#020306_100%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(120,170,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,170,255,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute left-1/2 top-[10%] z-20 -translate-x-1/2 text-center"
      >
        <p className="text-[10px] uppercase tracking-[0.5em] text-blue-300/70">
          01 / Performance
        </p>
        <h2 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight text-white">
          Power, measured.
        </h2>
      </motion.div>

      <motion.div
        style={{ scale, x: xPos }}
        className="absolute inset-x-0 bottom-[6%] mx-auto h-[70vh] max-h-[800px] w-full max-w-[1800px]"
      >
        <Image
          src="/car/car-main.png"
          alt=""
          fill
          sizes="100vw"
          className="select-none object-contain object-bottom"
          style={{
            filter:
              "drop-shadow(0 30px 25px rgba(0,0,0,0.55)) drop-shadow(0 60px 50px rgba(0,0,0,0.45))",
          }}
        />
        <motion.div className="absolute inset-0" style={{ opacity: blueOpacity }}>
          <Image
            src="/car/car-blueprint.png"
            alt=""
            fill
            sizes="100vw"
            className="select-none object-contain object-bottom"
            style={{ filter: "drop-shadow(0 0 24px rgba(80,150,255,0.5))" }}
          />
        </motion.div>

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[40px] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/85 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[12px] w-[55%] -translate-x-1/2 rounded-[50%] bg-black blur-[5px]" />
      </motion.div>

      <Connectors progress={progress} />
      {SPECS.map((s, i) => (
        <SpecCallout key={s.label} spec={s} progress={progress} index={i} />
      ))}

      <div className="absolute bottom-8 left-1/2 h-px w-[200px] -translate-x-1/2 overflow-hidden bg-white/10">
        <motion.div
          className="h-full bg-blue-300"
          style={{ scaleX: progress, transformOrigin: "left" }}
        />
      </div>
    </div>
  );
}

export default function Performance() {
  return (
    <ScrollPin height="220vh" className="bg-[#06070a]">
      {(progress) => <Scene progress={progress} />}
    </ScrollPin>
  );
}
