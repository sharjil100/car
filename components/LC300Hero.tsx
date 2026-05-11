"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * LC300Hero
 * --------------------------------------------------------------
 * Premium dark studio hero for the LC300.
 *
 * Layering (bottom -> top):
 *   1. Dark gradient background (charcoal)
 *   2. Subtle blueprint/grid texture
 *   3. Radial spotlight glow
 *   4. Floor reflection / glow
 *   5. Hero headline (sits BEHIND the car visually)
 *   6. Car wrapper (shared) -> base PNG + blueprint PNG (clip-path masked)
 *   7. Top navbar
 *
 * Adjustment knobs (search for [TUNE]):
 *   - MASK_RADIUS    : size of the hover reveal circle
 *   - CAR_MAX_WIDTH  : max width of the car art
 *   - CAR_BOTTOM     : how far the car sits from the bottom
 *   - HEADLINE_SIZE  : responsive headline tracking
 */

// [TUNE] reveal circle size in pixels
const MASK_RADIUS = 220;

export default function LC300Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Track hover state so we can grow/shrink the mask
  const [hovering, setHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Raw cursor position relative to the car wrapper
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth the cursor with a spring so the circle glides
  const sx = useSpring(x, { stiffness: 350, damping: 35, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 350, damping: 35, mass: 0.6 });

  // Animate the radius on enter/leave
  const radius = useMotionValue(0);
  const sRadius = useSpring(radius, { stiffness: 220, damping: 28 });

  // Build the clip-path string from the springs via useMotionTemplate
  // (Framer's typed string-composition helper — avoids WAAPI keyframe bugs
  // that occur when interpolating composed strings from useTransform).
  const clipPath = useMotionTemplate`circle(${sRadius}px at ${sx}px ${sy}px)`;

  // Disable on touch / small screens
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

  // Shared classes so the base + blueprint stay pixel-aligned.
  // [TUNE] CAR_MAX_WIDTH — change max-w to scale the car
  const carImgClass =
    "absolute inset-0 m-auto h-auto w-full max-w-[2200px] select-none object-contain object-bottom";

  // Drop-shadow stack to feel like the car sits on a glossy/wet floor.
  // The first shadow is the wide ambient cast under the body; the second
  // is the tight contact shadow at the wheels.
  const carShadow =
    "drop-shadow(0 30px 25px rgba(0,0,0,0.55)) drop-shadow(0 60px 50px rgba(0,0,0,0.45)) drop-shadow(0 8px 6px rgba(0,0,0,0.7))";

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#08090b] text-white">
      {/* 1. Dark charcoal gradient background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#15171b_0%,_#0a0b0d_55%,_#050507_100%)]"
      />

      {/* 2. Subtle blueprint grid texture */}
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

      {/* Faint film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Ground plane — a subtle floor with horizon line so the car has something to stand on */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[42%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(20,28,42,0.55) 35%, rgba(8,12,20,0.95) 100%)",
        }}
      />
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

      {/* 3a. Overhead stage spotlight — narrow cone aimed down at the car */}
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
      {/* 3b. Tight hot-spot directly behind the car */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[60%] z-[5] h-[55vh] w-[45vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(120,170,235,0.28) 0%, rgba(50,90,170,0.14) 40%, transparent 75%)",
          mixBlendMode: "screen",
        }}
      />
      {/* 3c. Wide ambient fill */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] z-[4] h-[90vh] w-[100vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(80,130,210,0.10) 0%, rgba(40,80,160,0.05) 40%, transparent 70%)",
        }}
      />

      {/* Top navbar */}
      <header className="relative z-30 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="text-sm font-semibold tracking-[0.3em] text-white/90">
          LC<span className="text-blue-400">300</span>
        </div>
        <nav className="hidden gap-8 text-xs font-medium uppercase tracking-[0.2em] text-white/70 md:flex">
          <a href="#performance" className="transition hover:text-white">Performance</a>
          <a href="#engineering" className="transition hover:text-white">Engineering</a>
          <a href="#gallery" className="transition hover:text-white">Gallery</a>
          <a href="#contact" className="transition hover:text-white">Contact</a>
        </nav>
        <button
          aria-label="Menu"
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80"
        >
          <span className="block h-px w-4 bg-current" />
        </button>
      </header>

      {/* Hero headline — sits behind the car, pulled down so the car overlaps it */}
      <div className="pointer-events-none absolute left-0 right-0 top-[22%] z-10 px-6 text-center sm:top-[20%]">
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.5em] text-blue-300/70">
          Land Cruiser · Series 300
        </p>
        {/* [TUNE] HEADLINE_SIZE */}
        <h1 className="mx-auto max-w-[1600px] text-[clamp(3rem,11vw,10rem)] font-bold leading-[0.9] tracking-tight text-white/95">
          ENGINEERED FOR
          <br />
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            EVERY TERRAIN
          </span>
        </h1>
      </div>

      {/* 4 + 6. Car wrapper (shared) — both images live inside the same absolutely positioned box */}
      <div
        ref={wrapperRef}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="absolute inset-x-0 bottom-[1%] z-20 mx-auto h-[88vh] max-h-[1000px] w-full max-w-[2300px] sm:bottom-[-5%]"
        // [TUNE] CAR_BOTTOM — change `bottom-[…]` above to lift/lower the car
      >
        {/* Wet-floor reflection — flipped copy hinged exactly at the wheel line (bottom of wrapper) */}
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

        {/* Contact shadow stack — anchored exactly at the tire line (bottom of wrapper, where car rests) */}
        {/* Wide ambient blue haze on the floor */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[80px] w-[88%] -translate-x-1/2 translate-y-[10%] rounded-[50%] bg-blue-400/20 blur-3xl sm:h-[120px]"
        />
        {/* Mid-density grounding shadow */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[34px] w-[72%] -translate-x-1/2 translate-y-[20%] rounded-[50%] bg-black/85 blur-xl"
        />
        {/* Tight contact shadow — hugs the tires */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[12px] w-[58%] -translate-x-1/2 translate-y-[10%] rounded-[50%] bg-black blur-[5px]"
        />
        {/* Razor-thin tire-to-floor contact line */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 h-[4px] w-[44%] -translate-x-1/2 translate-y-[40%] rounded-full bg-black blur-[1.5px]"
        />

        {/* Base car (always visible) — drop-shadow filter gives it weight */}
        <Image
          src="/car/car-main.png"
          alt="Toyota Land Cruiser LC300"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 2000px"
          className={carImgClass}
          style={{ filter: carShadow }}
        />

        {/* Specular sheen across the bodywork — sits above the car but below the blueprint reveal */}
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

        {/* Blueprint car — same wrapper, same className so it is pixel-perfect aligned.
            Reveal is done via clip-path (only the circle shows). pointer-events-none
            ensures hover events keep firing on the wrapper, not this layer. */}
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

        {/* Soft cursor halo — purely decorative, only on desktop hover.
            Wrapper uses x/y (transform-based) which interpolates cleanly via WAAPI;
            inner div handles the centering offset so transforms don't conflict. */}
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
        <span>V6 · Twin-Turbo</span>
        <span className="hidden sm:inline">409 hp · 650 Nm</span>
        <span>Scroll ↓</span>
      </div>
    </section>
  );
}
