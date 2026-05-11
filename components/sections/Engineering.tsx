"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";

/**
 * Engineering
 * --------------------------------------------------------------
 * Big blueprint car. Numbered hotspots pulse. Hovering one reveals
 * a glass-morphism callout. A radial spotlight follows the cursor
 * and brightens whichever hotspot it's near.
 */

type Hotspot = {
  id: number;
  x: number; // % of stage
  y: number;
  title: string;
  body: string;
};

const HOTSPOTS: Hotspot[] = [
  { id: 1, x: 30, y: 55, title: "3.3L V6 Twin-Turbo", body: "409 hp · all-aluminum block" },
  { id: 2, x: 55, y: 62, title: "10-Speed Direct-Shift", body: "Adaptive torque mapping" },
  { id: 3, x: 75, y: 60, title: "Multi-Terrain Select", body: "6 drive modes, real-time" },
  { id: 4, x: 22, y: 70, title: "Adaptive Suspension", body: "KDSS · electronic damping" },
  { id: 5, x: 64, y: 38, title: "Reinforced GA-F Frame", body: "20% stiffer, 200kg lighter" },
];

export default function Engineering() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const smx = useSpring(mx, { stiffness: 200, damping: 25 });
  const smy = useSpring(my, { stiffness: 200, damping: 25 });

  const spotlightClip = useMotionTemplate`circle(220px at ${smx}px ${smy}px)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  const onLeave = () => {
    mx.set(-9999);
    my.set(-9999);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative min-h-screen w-full overflow-hidden bg-[#04060a] py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a1220_0%,_#04060a_70%)]" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(120,170,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,170,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-blue-300/70">
            02 / Engineering
          </p>
          <h2 className="mt-3 text-[clamp(2rem,5vw,4.5rem)] font-bold tracking-tight text-white">
            Every component, deliberate.
          </h2>
        </motion.div>

        <div className="relative mx-auto aspect-[16/9] w-full max-w-[1300px]">
          {/* Blueprint base — dimmed */}
          <Image
            src="/car/car-blueprint.png"
            alt="Blueprint"
            fill
            sizes="(max-width: 1024px) 100vw, 1300px"
            className="select-none object-contain opacity-40"
          />

          {/* Spotlight reveal — same blueprint at full opacity, clipped to a circle around cursor */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{
              clipPath: spotlightClip,
              WebkitClipPath: spotlightClip,
            }}
          >
            <Image
              src="/car/car-blueprint.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 1300px"
              className="select-none object-contain"
              style={{ filter: "drop-shadow(0 0 20px rgba(80,150,255,0.6))" }}
            />
          </motion.div>

          {/* Hotspots */}
          {HOTSPOTS.map((h) => (
            <button
              key={h.id}
              onMouseEnter={() => setActive(h.id)}
              onMouseLeave={() => setActive(null)}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              aria-label={h.title}
            >
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-300 ring-2 ring-blue-300/40 transition group-hover:scale-150" />
              </span>
            </button>
          ))}

          {/* Active callout card */}
          {HOTSPOTS.map((h) => {
            const isActive = active === h.id;
            const onLeft = h.x > 50;
            return (
              <motion.div
                key={`card-${h.id}`}
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
                transition={{ duration: 0.25 }}
                className={`absolute z-20 w-[220px] rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md ${
                  isActive ? "pointer-events-auto" : "pointer-events-none"
                }`}
                style={{
                  left: onLeft ? `calc(${h.x}% - 240px)` : `calc(${h.x}% + 20px)`,
                  top: `calc(${h.y}% - 30px)`,
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.25em] text-blue-300/80">
                  Detail · {String(h.id).padStart(2, "0")}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{h.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/60">{h.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
