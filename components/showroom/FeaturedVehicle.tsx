"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CARS, formatPriceBDT, carImageSrc } from "@/data/cars";

// Spotlight a car different from the hero so we showcase variety.
// Hero auto-picks the highest-price car (Range Rover Autobiography);
// this section showcases the V8 — Toyota's flagship SUV.
const FEATURED_ID = "lc-v8-vx-2017";

export default function FeaturedVehicle() {
  const car = CARS.find((c) => c.id === FEATURED_ID) ?? CARS[0];

  return (
    <section className="relative overflow-hidden bg-[#03050a] py-24">
      {/* Ambient color glow tied to the car */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${car.colorHex}22 0%, transparent 60%)`,
        }}
      />
      {/* Faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(200,220,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,220,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-10">
        <div className="flex flex-col items-stretch gap-10 lg:flex-row lg:items-center lg:gap-4">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:w-[44%] lg:pr-6"
          >
            <p className="text-[10px] uppercase tracking-[0.5em] text-blue-300/65">
              Featured Vehicle
            </p>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.32em] text-white/40">
              {car.brand}
            </p>
            <h2 className="mt-1 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.92] tracking-tight text-white">
              {car.model}
            </h2>
            <p className="mt-1.5 text-lg text-white/40">{car.grade}</p>

            {car.description && (
              <p className="mt-6 max-w-[520px] text-[15px] leading-relaxed text-white/55">
                {car.description}
              </p>
            )}

            {/* Stat row */}
            <div className="mt-8 grid grid-cols-3 gap-5 border-t border-white/[0.07] pt-7">
              <Stat label="Power" value={`${car.horsepower} HP`} />
              <Stat label="Engine" value={car.fuelType === "Diesel" ? "V8 Diesel" : car.fuelType} />
              <Stat label="Drive" value={car.drive} />
              <Stat label="Mileage" value={`${car.mileage.toLocaleString()} km`} />
              <Stat label="Year" value={String(car.year)} />
              <Stat label="Seats" value={`${car.seats} persons`} />
            </div>

            {/* Price + CTA */}
            <div className="mt-9 flex items-end gap-6">
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                  Asking
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-white">
                  {formatPriceBDT(car.priceMillionBDT)}
                </p>
              </div>
              <Link
                href={`/cars/${car.id}`}
                className="flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition hover:bg-white/90"
              >
                View Details
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 5.5h9M6.5 1.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Right: car image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[55vw] max-h-[520px] w-full flex-1 lg:h-[480px]"
            style={{
              background: `radial-gradient(ellipse at 50% 60%, ${car.colorHex}20 0%, transparent 60%)`,
            }}
          >
            <Image
              src={carImageSrc(car)}
              alt={`${car.brand} ${car.model}`}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="select-none object-contain object-bottom"
              style={{
                filter:
                  "drop-shadow(0 30px 40px rgba(0,0,0,0.7)) drop-shadow(0 60px 60px rgba(0,0,0,0.5))",
              }}
            />
            {/* Contact shadow */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-[26px] w-[64%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-[10px] w-[48%] -translate-x-1/2 rounded-[50%] bg-black blur-[5px]" />

            {/* Floating tag */}
            <div className="pointer-events-none absolute right-4 top-4 rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[9px] uppercase tracking-[0.25em] text-white/70 backdrop-blur-sm">
              Flagship · Diesel V8
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
