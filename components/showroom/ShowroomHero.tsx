"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CARS, formatPriceBDT } from "@/data/cars";

// Hover-reveal circle radius in px
const MASK_RADIUS = 220;

// Hero features the most expensive car in the catalogue
const FEATURED = CARS.reduce((best, c) =>
  c.priceMillionBDT > best.priceMillionBDT ? c : best
);

export default function ShowroomHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Raw cursor position relative to the car wrapper
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 350, damping: 35, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 350, damping: 35, mass: 0.6 });

  // Radius springs from 0 → MASK_RADIUS on enter, back to 0 on leave
  const radius = useMotionValue(0);
  const sRadius = useSpring(radius, { stiffness: 220, damping: 28 });

  // Compose the clip-path string via useMotionTemplate (avoids WAAPI offset bugs)
  const clipPath = useMotionTemplate`circle(${sRadius}px at ${sx}px ${sy}px)`;

  // Disable mask effect on touch / small screens
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px) and (hover: hover)");
    const update = () => setIsDesktop(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !wrapperRef.current) return;
    const r = wrapperRef.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
    radius.set(MASK_RADIUS);
    setHovering(true);
  };
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !wrapperRef.current) return;
    const r = wrapperRef.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };
  const handleLeave = () => {
    if (!isDesktop) return;
    radius.set(0);
    setHovering(false);
  };

  // Shared class keeps both image layers pixel-perfect aligned
  const carImgClass =
    "absolute inset-0 m-auto h-auto w-full max-w-[2200px] select-none object-contain object-bottom";

  const carShadow =
    "drop-shadow(0 30px 25px rgba(0,0,0,0.55)) drop-shadow(0 60px 50px rgba(0,0,0,0.45)) drop-shadow(0 8px 6px rgba(0,0,0,0.7))";

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#08090b] text-white">
      {/* Dark charcoal radial background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#15171b_0%,_#0a0b0d_55%,_#050507_100%)]"
      />

      {/* Subtle blueprint grid — fades at edges */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(120,170,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,170,255,0.35) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 90%)",
        }}
      />

      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Ground plane — subtle floor the car rests on */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[42%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(20,28,42,0.55) 35%, rgba(8,12,20,0.95) 100%)",
        }}
      />
      {/* Horizon line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-[3] h-px"
        style={{
          bottom: "42%",
          background:
            "linear-gradient(to right, transparent 0%, rgba(120,160,220,0.25) 25%, rgba(160,200,255,0.45) 50%, rgba(120,160,220,0.25) 75%, transparent 100%)",
          filter: "blur(0.5px)",
        }}
      />

      {/* Overhead stage spotlight — narrow cone aimed at the car */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] z-[5] h-[120vh] w-[55vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 30%, rgba(180,210,255,0.22) 0%, rgba(120,160,220,0.10) 30%, transparent 65%)",
          filter: "blur(40px)",
          mixBlendMode: "screen",
        }}
      />
      {/* Tight hot-spot directly behind the car body */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[60%] z-[5] h-[55vh] w-[45vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(120,170,235,0.28) 0%, rgba(50,90,170,0.14) 40%, transparent 75%)",
          mixBlendMode: "screen",
        }}
      />
      {/* Wide ambient fill */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] z-[4] h-[90vh] w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(80,130,210,0.10) 0%, rgba(40,80,160,0.05) 40%, transparent 70%)",
        }}
      />

      {/* Navbar */}
      <header className="relative z-30 flex items-center justify-between px-6 py-6 sm:px-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Motor Shot Cars"
          className="h-9 w-auto select-none sm:h-10"
        />
        <nav className="hidden gap-8 text-xs font-medium uppercase tracking-[0.2em] text-white/60 md:flex">
          <a href="#collection" className="transition hover:text-white">
            Collection
          </a>
          <a href="#" className="transition hover:text-white">
            About
          </a>
          <a href="#" className="transition hover:text-white">
            Contact
          </a>
        </nav>
        <a
          href="#collection"
          className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70 transition hover:border-white/35 hover:text-white md:flex hidden"
        >
          Browse All
        </a>
        <button
          aria-label="Menu"
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80"
        >
          <span className="block h-px w-4 bg-current" />
        </button>
      </header>

      {/* Hero headline — sits behind the car, car overlaps it */}
      <div className="pointer-events-none absolute left-0 right-0 top-[22%] z-10 px-6 text-center sm:top-[20%]">
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.5em] text-blue-300/65">
          Motor Shot Cars · Banani, Dhaka
        </p>
        <h1 className="mx-auto max-w-[1600px] text-[clamp(3rem,11vw,10rem)] font-bold leading-[0.9] tracking-tight text-white/95">
          BANGLADESH&apos;S
          <br />
          <span className="bg-gradient-to-b from-white to-white/35 bg-clip-text text-transparent">
            FINEST
          </span>
        </h1>
      </div>

      {/* Car wrapper — both image layers live here for pixel-perfect alignment */}
      <div
        ref={wrapperRef}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="absolute inset-x-0 bottom-[1%] z-20 mx-auto h-[88vh] max-h-[1000px] w-full max-w-[2300px] sm:bottom-[-5%]"
      >
        {/* Wet-floor reflection — flipped copy hinged at the wheel line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-full h-[55%] overflow-hidden"
          style={{
            transform: "scaleY(-1)",
            transformOrigin: "top",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 35%, transparent 75%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 35%, transparent 75%)",
            filter: "blur(1.5px)",
            opacity: 0.45,
          }}
        >
          <Image
            src="/car/car-main.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 2000px"
            className={`${carImgClass} !object-top`}
          />
        </div>

        {/* Contact shadow stack — anchored exactly at the tire line */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[80px] w-[88%] -translate-x-1/2 translate-y-[10%] rounded-[50%] bg-blue-400/20 blur-3xl sm:h-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[34px] w-[72%] -translate-x-1/2 translate-y-[20%] rounded-[50%] bg-black/85 blur-xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[12px] w-[58%] -translate-x-1/2 translate-y-[10%] rounded-[50%] bg-black blur-[5px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[4px] w-[44%] -translate-x-1/2 translate-y-[40%] rounded-full bg-black blur-[1.5px]"
        />

        {/* Base car — always visible, drop-shadow gives it weight */}
        <Image
          src="/car/car-main.png"
          alt={`${FEATURED.brand} ${FEATURED.model} — Motor Shot Cars`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 2000px"
          className={carImgClass}
          style={{ filter: carShadow }}
        />

        {/* Specular sheen across the bodywork */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 30%, rgba(180,210,255,0.10) 50%, rgba(255,255,255,0) 70%)",
            maskImage:
              "radial-gradient(ellipse 60% 35% at 50% 55%, rgba(0,0,0,0.9) 0%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 35% at 50% 55%, rgba(0,0,0,0.9) 0%, transparent 75%)",
          }}
        />

        {/* Blueprint reveal — clip-path circle follows cursor */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ clipPath, WebkitClipPath: clipPath }}
        >
          <Image
            src="/car/car-blueprint.png"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 2000px"
            className={carImgClass}
            style={{ filter: "drop-shadow(0 0 18px rgba(80,150,255,0.45))" }}
          />
        </motion.div>

        {/* Soft cursor halo — purely decorative, desktop hover only.
            Outer motion.div uses x/y (transform) so WAAPI doesn't touch left/top. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0"
          style={{ x: sx, y: sy, opacity: hovering ? 0.35 : 0 }}
        >
          <div
            className="h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(120,180,255,0.35) 0%, rgba(80,130,255,0.15) 40%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </motion.div>
      </div>

      {/* Bottom meta row */}
      <div className="absolute inset-x-0 bottom-6 z-30 flex items-center justify-between px-6 text-[10px] uppercase tracking-[0.3em] text-white/40 sm:px-10">
        <span>
          {FEATURED.brand} {FEATURED.model} · {FEATURED.grade}
        </span>
        <span className="hidden sm:inline">
          {formatPriceBDT(FEATURED.priceMillionBDT)} · {CARS.length} Cars Available
        </span>
        <a href="#collection" className="transition hover:text-white">
          Browse ↓
        </a>
      </div>
    </section>
  );
}
