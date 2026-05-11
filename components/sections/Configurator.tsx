"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";

/**
 * Configurator
 * --------------------------------------------------------------
 * Drag-to-rotate fakes 3D by mapping drag X to a CSS rotateY on the car
 * (clamped to ±25°). Color swatch click morphs the paint via a tinted
 * overlay with mix-blend-color.
 */

const COLORS = [
  { id: "onyx", label: "Onyx Black", color: "transparent" }, // base
  { id: "graphite", label: "Graphite", color: "#3a4350" },
  { id: "pearl", label: "Pearl White", color: "#dde2e6" },
  { id: "midnight", label: "Midnight Blue", color: "#1c2a4a" },
  { id: "scarlet", label: "Scarlet", color: "#8a1424" },
  { id: "sand", label: "Desert Sand", color: "#a78b66" },
];

export default function Configurator() {
  const [colorIdx, setColorIdx] = useState(0);
  const dragX = useMotionValue(0);
  const rotY = useTransform(dragX, [-300, 300], [-25, 25]);
  const sRotY = useSpring(rotY, { stiffness: 150, damping: 20 });

  const active = COLORS[colorIdx];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#06070a] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,_#15171b_0%,_#08090b_60%,_#03040a_100%)]" />

      <div className="relative mx-auto max-w-[1500px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-blue-300/70">
            04 / Configurator
          </p>
          <h2 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight text-white">
            Make it yours.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/50">
            Drag to rotate · click a swatch to morph the finish
          </p>
        </motion.div>

        {/* Stage */}
        <div className="relative mx-auto mt-12 aspect-[16/9] w-full max-w-[1400px]">
          {/* floor disc */}
          <div className="pointer-events-none absolute bottom-[6%] left-1/2 h-[30px] w-[60%] -translate-x-1/2 rounded-[50%] bg-blue-400/15 blur-3xl" />

          <motion.div
            drag="x"
            dragConstraints={{ left: -300, right: 300 }}
            dragElastic={0.2}
            style={{ x: dragX, perspective: 1800 }}
            className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
          >
            <motion.div
              className="relative h-full w-full"
              style={{ rotateY: sRotY, transformStyle: "preserve-3d" }}
            >
              <Image
                src="/car/car-main.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 1400px"
                draggable={false}
                className="select-none object-contain object-bottom"
                style={{
                  filter:
                    "drop-shadow(0 30px 25px rgba(0,0,0,0.55)) drop-shadow(0 60px 50px rgba(0,0,0,0.45))",
                }}
              />

              {/* Color overlay — mix-blend-color recolors the car */}
              {active.id !== "onyx" && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  transition={{ duration: 0.6 }}
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundColor: active.color,
                    mixBlendMode: "color",
                    maskImage: "url(/car/car-main.png)",
                    WebkitMaskImage: "url(/car/car-main.png)",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskPosition: "center bottom",
                    WebkitMaskPosition: "center bottom",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                  }}
                />
              )}

              <div className="pointer-events-none absolute bottom-0 left-1/2 h-[40px] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/85 blur-2xl" />
              <div className="pointer-events-none absolute bottom-0 left-1/2 h-[12px] w-[55%] -translate-x-1/2 rounded-[50%] bg-black blur-[5px]" />
            </motion.div>
          </motion.div>
        </div>

        {/* Color swatches */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {COLORS.map((c, i) => (
            <motion.button
              key={c.id}
              onClick={() => setColorIdx(i)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="group flex flex-col items-center"
              aria-label={c.label}
            >
              <span
                className={`h-10 w-10 rounded-full border-2 transition ${
                  colorIdx === i
                    ? "border-blue-300 ring-4 ring-blue-300/20"
                    : "border-white/20 hover:border-white/50"
                }`}
                style={{
                  background:
                    c.id === "onyx"
                      ? "radial-gradient(circle at 30% 30%, #2a2d33, #050608)"
                      : c.color,
                }}
              />
              <span className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/60 group-hover:text-white">
                {c.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
