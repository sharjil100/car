"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CARS, formatPriceBDT } from "@/data/cars";

// Hover-reveal circle radius in px
const MASK_RADIUS = 220;

// Hero spotlights the Land Cruiser — Toyota's flagship and a BD favourite.
// (Matches the silhouette of the placeholder hero PNG.)
const FEATURED = CARS.find((c) => c.id === "lc-v8-vx-2017") ?? CARS[0];

export default function ShowroomHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the menu on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

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
          <a href="#about" className="transition hover:text-white">
            About
          </a>
          <a href="#contact" className="transition hover:text-white">
            Contact
          </a>
        </nav>
        <a
          href="#collection"
          className="hidden rounded-full border border-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70 transition hover:border-white/35 hover:text-white md:inline-flex"
        >
          Browse All
        </a>
        <button
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-white/35 hover:text-white md:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-px w-4 bg-current" />
            <span className="block h-px w-4 bg-current" />
          </span>
        </button>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] flex flex-col bg-[#04060a]/95 backdrop-blur-md md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Motor Shot Cars" className="h-9 w-auto" />
              <button
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-white/35 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
              {[
                { label: "Collection", href: "#collection" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ].map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="text-3xl font-bold uppercase tracking-[0.18em] text-white/85 transition hover:text-white"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <div className="px-6 pb-10 text-center">
              <a
                href="tel:+8801799237222"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition hover:bg-white/90"
              >
                Call 01799-237222
              </a>
              <p className="mt-4 text-[10px] uppercase tracking-[0.32em] text-white/30">
                Banani, Dhaka
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Car wrapper — both image layers live here for pixel-perfect alignment.
          On mobile the wrapper extends beyond the viewport edges so `object-contain`
          scales the car larger than the viewport width and the car lifts higher up. */}
      <div
        ref={wrapperRef}
        onMouseEnter={handleEnter}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="absolute inset-x-[-40%] bottom-[12%] z-20 h-[42vh] sm:inset-x-0 sm:bottom-[-5%] sm:mx-auto sm:h-[88vh] sm:w-full sm:max-w-[2300px] sm:max-h-[1000px]"
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
