"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CARS, carImageSrc } from "@/data/cars";
import type { CarListing } from "@/data/cars";

// 5 varied cars — different categories + colors so the fan has visual range.
// Center (index 2) is the flagship Range Rover Autobiography.
const FEATURED_IDS = [
  "toyota-supra-2019", // Sports · matte black
  "bmw-x7-2022", // SUV · Tanzanite Blue
  "range-rover-autobiography-2021", // CENTER · flagship
  "lexus-es300h-2023", // Sedan · Sonic Quartz
  "toyota-alphard-2020", // MPV · Pearl White
];

export default function FeaturedFan() {
  const cars = FEATURED_IDS
    .map((id) => CARS.find((c) => c.id === id))
    .filter((c): c is CarListing => c !== undefined);

  return (
    <section className="relative overflow-hidden bg-[#06070a] py-20 sm:py-28">
      {/* Soft centered glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 55%, rgba(80,130,210,0.07) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-10">
        {/* Eyebrow + headline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-10 text-center sm:mb-14"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-blue-300/55">
            A Glimpse
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,4vw,3.25rem)] font-bold tracking-tight text-white">
            Inside the Showroom
          </h2>
        </motion.div>

        {/* Fan container — scales down on smaller viewports so it always fits */}
        <div className="relative mx-auto flex h-[420px] origin-top items-center justify-center scale-[0.42] sm:h-[460px] sm:scale-[0.62] md:scale-[0.78] lg:scale-[0.92] xl:scale-100">
          {cars.map((car, i) => (
            <FanCard key={car.id} car={car} index={i} total={cars.length} />
          ))}
        </div>

        {/* CTA below the fan */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.5 }}
          className="mt-10 flex flex-col items-center sm:mt-14"
        >
          <a
            href="#collection"
            className="group flex items-center gap-2.5 rounded-full border border-white/15 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em] text-white/75 transition hover:border-white/35 hover:bg-white/[0.04] hover:text-white"
          >
            See Full Collection
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="transition-transform group-hover:translate-y-0.5"
            >
              <path
                d="M6 1.5v9M2 6.5l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/25">
            {CARS.length} vehicles available
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function FanCard({
  car,
  index,
  total,
}: {
  car: CarListing;
  index: number;
  total: number;
}) {
  const center = Math.floor(total / 2);
  const offset = index - center; // -2, -1, 0, 1, 2
  const absOffset = Math.abs(offset);

  const rotation = offset * 7; // -14°, -7°, 0°, 7°, 14° — softer fan
  const xTranslate = offset * 165; // px — bigger spread so cards breathe
  const yTranslate = absOffset * 22; // outer cards dip slightly
  const scale = 1 - absOffset * 0.04; // gentler size drop — fan reads via rotation, not shrinkage
  const zIndex = 10 - absOffset * 2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: 0, x: 0, y: 60 }}
      whileInView={{
        opacity: 1,
        scale,
        rotate: rotation,
        x: xTranslate,
        y: yTranslate,
      }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.95,
        delay: 0.1 + absOffset * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="absolute"
      style={{ zIndex }}
    >
      <Link href={`/cars/${car.id}`} className="group block">
        <div
          className="relative h-[380px] w-[240px] overflow-hidden rounded-2xl border border-white/[0.08] transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-[1.02]"
          style={{
            background: `linear-gradient(180deg, ${car.colorHex}55 0%, ${car.colorHex}1a 45%, #0a0c12 100%)`,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.85)",
          }}
        >
          {/* Subtle grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(200,220,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,220,255,0.5) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />

          {/* Brand top */}
          <p className="absolute left-5 right-5 top-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/65">
            {car.brand}
          </p>

          {/* Category vertical */}
          <p className="pointer-events-none absolute right-3 top-1/2 origin-center -translate-y-1/2 rotate-90 whitespace-nowrap text-[9px] uppercase tracking-[0.4em] text-white/25">
            {car.category}
          </p>

          {/* Car image */}
          <div className="absolute inset-x-0 bottom-[26%] top-[20%]">
            <Image
              src={carImageSrc(car)}
              alt={`${car.brand} ${car.model}`}
              fill
              sizes="240px"
              className="select-none object-contain object-bottom"
              style={{
                filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.7))",
              }}
            />
          </div>

          {/* Bottom labels */}
          <div className="absolute inset-x-5 bottom-5">
            <p className="text-[15px] font-bold leading-tight tracking-tight text-white">
              {car.model}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-white/40">
              {car.grade}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
