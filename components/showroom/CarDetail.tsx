"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { CarListing } from "@/data/cars";
import { formatPriceBDT, carImageSrc } from "@/data/cars";
import DoorZoom from "./DoorZoom";

const CONDITION: Record<
  CarListing["condition"],
  { label: string; cls: string }
> = {
  Fresh: {
    label: "Fresh Import",
    cls: "text-emerald-300 bg-emerald-300/[0.08] border-emerald-300/28",
  },
  Reconditioned: {
    label: "Reconditioned",
    cls: "text-amber-300 bg-amber-300/[0.08] border-amber-300/28",
  },
  Local: {
    label: "Local Registration",
    cls: "text-slate-300 bg-slate-300/[0.06] border-slate-300/22",
  },
};

export default function CarDetail({ car }: { car: CarListing }) {
  const cond = CONDITION[car.condition];

  const audioLabel = car.features.audioBrand
    ? car.features.speakers
      ? `${car.features.audioBrand} · ${car.features.speakers}-Speaker`
      : `${car.features.audioBrand} Premium Audio`
    : car.features.speakers
      ? `${car.features.speakers}-Speaker Audio`
      : null;

  const allFeatures = [
    car.features.autoFootstep && "Auto Side Step",
    audioLabel,
    car.features.camera360 && "360° Surround Camera",
    car.features.sunroof && "Panoramic Sunroof",
    car.features.panoramicRoof && "Panoramic Moonroof",
    car.features.heatedSeats && "Heated Seats",
    car.features.ventilatedSeats && "Ventilated Seats",
    car.features.headUpDisplay && "Head-Up Display",
    car.features.massageSeats && "Massage Seats",
    car.features.ambientLighting && "64-Color Ambient Lighting",
    car.features.wirelessCharging && "Wireless Charging",
    car.features.blindSpotMonitor && "Blind Spot Monitor",
    car.features.adaptiveCruise && "Adaptive Cruise Control",
    car.features.electricTailgate && "Electric Tailgate",
    car.features.airSuspension && "Air Suspension",
  ].filter(Boolean) as string[];

  const SPECS = [
    { label: "Mileage", value: `${car.mileage.toLocaleString()} km` },
    { label: "Registration", value: car.registrationDate },
    { label: "Engine", value: car.engine },
    { label: "Power", value: `${car.horsepower} HP` },
    { label: "Transmission", value: car.transmission },
    { label: "Drive", value: car.drive },
    { label: "Fuel", value: car.fuelType },
    { label: "Seats", value: `${car.seats} Persons` },
  ];

  return (
    <div className="min-h-screen bg-[#06070a] text-white">
      {/* Sticky navbar */}
      <header className="sticky top-0 z-30 flex items-center gap-5 border-b border-white/[0.06] bg-[#06070a]/92 px-5 py-4 backdrop-blur-sm sm:px-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Collection
        </Link>
        <span className="text-white/15">·</span>
        <span className="text-xs text-white/35 truncate">
          {car.brand} {car.model}
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Motor Shot Cars"
          className="ml-auto h-8 w-auto select-none"
        />
      </header>

      {/* Hero section */}
      <section className="relative overflow-hidden">
        {/* Color ambient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 65% 50%, ${car.colorHex}12 0%, transparent 55%)`,
          }}
        />
        {/* Subtle grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(200,220,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,220,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative mx-auto flex max-w-[1400px] flex-col gap-10 px-5 py-12 sm:px-10 lg:flex-row lg:items-center lg:gap-0 lg:py-20">
          {/* LEFT: Info */}
          <div className="flex-none lg:w-[44%] lg:pr-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span
                className={`inline-block rounded-full border px-3 py-1 text-[9px] uppercase tracking-[0.28em] ${cond.cls}`}
              >
                {cond.label}
              </span>

              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.32em] text-white/38">
                {car.brand}
              </p>
              <h1 className="mt-1 text-[clamp(2rem,5vw,4.2rem)] font-bold leading-[0.93] tracking-tight text-white">
                {car.model}
              </h1>
              <p className="mt-1.5 text-base text-white/38">
                {car.grade} · {car.year}
              </p>

              {/* Price */}
              <div className="mt-6">
                <p className="text-[9px] uppercase tracking-[0.32em] text-white/28">
                  Asking Price
                </p>
                <p className="mt-1 text-[2.8rem] font-bold leading-none tracking-tight text-white">
                  {formatPriceBDT(car.priceMillionBDT)}
                </p>
                <p className="mt-0.5 text-xs text-white/22">
                  BDT · Negotiable
                </p>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-white/45">
                {car.tagline}
              </p>

              {car.description && (
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {car.description}
                </p>
              )}

              {/* Specs grid */}
              <div className="mt-6 grid grid-cols-2 gap-2.5">
                {SPECS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5"
                  >
                    <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">
                      {s.label}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-white">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Interior CTA */}
              <DoorZoom car={car}>
                {(onOpen) => (
                  <button
                    onClick={onOpen}
                    className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/12 bg-white/[0.03] py-3.5 text-sm font-medium text-white/60 transition hover:border-white/28 hover:bg-white/[0.06] hover:text-white"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <rect
                        x="1.5"
                        y="1.5"
                        width="12"
                        height="12"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.1"
                      />
                      <rect
                        x="5"
                        y="4"
                        width="5"
                        height="7"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="0.9"
                      />
                    </svg>
                    Explore Interior
                  </button>
                )}
              </DoorZoom>
            </motion.div>
          </div>

          {/* RIGHT: Car image + door hotspot */}
          <div className="relative flex flex-1 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[48vw] max-h-[500px] w-full"
              style={{
                background: `radial-gradient(ellipse at 50% 65%, ${car.colorHex}1c 0%, transparent 60%)`,
              }}
            >
              <Image
                src={carImageSrc(car)}
                alt={`${car.brand} ${car.model}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="select-none object-contain object-bottom"
                style={{
                  filter:
                    "drop-shadow(0 28px 40px rgba(0,0,0,0.75)) drop-shadow(0 55px 60px rgba(0,0,0,0.5))",
                }}
              />

              {/* Contact shadow */}
              <div className="pointer-events-none absolute bottom-0 left-1/2 h-[28px] w-[68%] -translate-x-1/2 rounded-[50%] bg-black/75 blur-2xl" />

              {/* Door hotspot — pulsing ring on the door area */}
              <DoorZoom car={car}>
                {(onOpen) => (
                  <button
                    onClick={onOpen}
                    className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${car.doorHotspotX}%`,
                      top: `${car.doorHotspotY}%`,
                    }}
                    aria-label="View interior"
                  >
                    {/* Outer ping ring */}
                    <span className="relative flex h-5 w-5 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/35 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-white ring-2 ring-white/25 transition-transform group-hover:scale-150" />
                    </span>
                    {/* Tooltip */}
                    <span className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/12 bg-black/72 px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] text-white/65 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      View Interior
                    </span>
                  </button>
                )}
              </DoorZoom>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-10">
        <div className="border-t border-white/[0.06] pt-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/28">
              Equipped With
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              Features &amp; Technology
            </h2>
          </motion.div>

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {allFeatures.map((feat, i) => (
              <motion.div
                key={feat}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.32 }}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3"
              >
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-blue-400/70" />
                <span className="text-[11px] text-white/58">{feat}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Colors row */}
        <div className="mt-14 grid grid-cols-2 gap-6 border-t border-white/[0.06] pt-12 sm:grid-cols-4">
          {[
            {
              label: "Exterior",
              name: car.color,
              hex: car.colorHex,
            },
            {
              label: "Interior",
              name: car.interiorColor,
              hex: car.interiorColorHex,
            },
          ].map((c) => (
            <div key={c.label}>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">
                {c.label} Color
              </p>
              <div className="mt-2 flex items-center gap-2.5">
                <div
                  className="h-6 w-6 rounded-full ring-1 ring-white/15"
                  style={{ background: c.hex }}
                />
                <span className="text-sm font-medium text-white/70">
                  {c.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
