"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import RevealMask from "../motion/RevealMask";

/**
 * Detail
 * --------------------------------------------------------------
 * Three parallax layers (background grain, blueprint, accent strokes)
 * each scrolling at different speeds. A magnifier cursor (RevealMask)
 * sits over the blueprint and zooms detail when hovered.
 *
 * Parallax via useScroll + useTransform (different ranges for each layer).
 */

const MATERIALS = [
  { name: "Semi-Aniline Leather", code: "L-72", swatch: "linear-gradient(135deg, #4a3a2c 0%, #2a1f15 100%)" },
  { name: "Brushed Aluminium", code: "A-18", swatch: "linear-gradient(135deg, #b9bcc1 0%, #6b6e73 50%, #2f3236 100%)" },
  { name: "Open-Pore Walnut", code: "W-04", swatch: "linear-gradient(135deg, #5a3a22 0%, #2c1a0e 100%)" },
  { name: "Optical Carbon", code: "C-90", swatch: "repeating-linear-gradient(45deg, #1a1d22 0 8px, #2a2e34 8px 16px)" },
];

export default function Detail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const yMid = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const yFront = useTransform(scrollYProgress, [0, 1], [-160, 160]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-[#05060a] py-32"
    >
      {/* parallax grid background */}
      <motion.div
        aria-hidden
        style={{ y: yBg }}
        className="absolute inset-0 opacity-[0.07]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(120,170,255,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,170,255,0.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[1500px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-blue-300/70">
            05 / Detail
          </p>
          <h2 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight text-white">
            Hover, magnified.
          </h2>
        </motion.div>

        {/* parallax stage */}
        <motion.div style={{ y: yMid }} className="relative mx-auto aspect-[16/9] w-full max-w-[1300px]">
          {/* Base blueprint at low opacity */}
          <Image
            src="/car/car-blueprint.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 1300px"
            className="select-none object-contain opacity-30"
          />

          {/* Magnifier reveal — full opacity blueprint inside the cursor circle */}
          <RevealMask radius={200} className="absolute inset-0">
            <div className="relative h-full w-full">
              <Image
                src="/car/car-blueprint.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 1300px"
                className="select-none object-contain"
                style={{
                  filter: "drop-shadow(0 0 24px rgba(80,150,255,0.7)) brightness(1.4) contrast(1.1)",
                }}
              />
              {/* magnifier ring */}
              <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />
            </div>
          </RevealMask>

          {/* foreground accents — drift faster */}
          <motion.div
            aria-hidden
            style={{ y: yFront }}
            className="pointer-events-none absolute -right-6 top-6 hidden text-[10px] uppercase tracking-[0.3em] text-blue-300/60 md:block"
          >
            DETAIL · 200%
          </motion.div>
          <motion.div
            aria-hidden
            style={{ y: yFront }}
            className="pointer-events-none absolute -left-6 bottom-6 hidden text-[10px] uppercase tracking-[0.3em] text-blue-300/60 md:block"
          >
            REV · 03 · 26
          </motion.div>
        </motion.div>

        {/* Materials drift in */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {MATERIALS.map((m, i) => (
            <motion.div
              key={m.code}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            >
              <div
                className="aspect-square w-full rounded-xl transition group-hover:scale-[1.04]"
                style={{ background: m.swatch }}
              />
              <div className="mt-4 flex items-baseline justify-between">
                <p className="text-xs font-medium text-white/85">{m.name}</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {m.code}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

