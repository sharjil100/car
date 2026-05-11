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
    cls: "text-emerald-300 border-emerald-300/30 bg-emerald-300/[0.08]",
  },
  Reconditioned: {
    label: "Reconditioned",
    cls: "text-amber-300 border-amber-300/30 bg-amber-300/[0.08]",
  },
  Local: {
    label: "Local",
    cls: "text-slate-300 border-slate-300/25 bg-slate-300/[0.06]",
  },
};

export default function CarCard({ car }: { car: CarListing }) {
  const cond = CONDITION[car.condition];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.25 } }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0c0d12]"
      style={{
        boxShadow: "0 1px 0 0 rgba(255,255,255,0.04) inset",
      }}
    >
      {/* Image area */}
      <div
        className="relative h-[210px] overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 80%, ${car.colorHex}22 0%, #0a0b10 68%)`,
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <Image
          src={carImageSrc(car)}
          alt={`${car.brand} ${car.model}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="select-none object-contain object-bottom px-5 pb-2 pt-4 transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ filter: "drop-shadow(0 14px 22px rgba(0,0,0,0.75))" }}
        />

        {/* Door/Interior button */}
        <DoorZoom car={car}>
          {(onOpen) => (
            <button
              onClick={onOpen}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/12 bg-black/55 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/50 backdrop-blur-sm transition hover:border-white/28 hover:text-white/85"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="flex-none"
              >
                <rect
                  x="1"
                  y="1"
                  width="8"
                  height="8"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="0.9"
                />
                <rect
                  x="3.5"
                  y="2.8"
                  width="3"
                  height="4.4"
                  rx="0.5"
                  stroke="currentColor"
                  strokeWidth="0.75"
                />
              </svg>
              Interior
            </button>
          )}
        </DoorZoom>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        {/* Badges */}
        <div className="mb-2.5 flex items-center gap-1.5">
          <span
            className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] ${cond.cls}`}
          >
            {cond.label}
          </span>
          <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-white/35">
            {car.category}
          </span>
        </div>

        {/* Name */}
        <div className="flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/35">
            {car.brand}
          </p>
          <h3 className="mt-0.5 text-[1.15rem] font-bold leading-tight tracking-tight text-white">
            {car.model}
          </h3>
          <p className="text-[11px] text-white/32">
            {car.grade} · {car.year}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-white/40">
            {car.tagline}
          </p>
        </div>

        {/* Quick stats */}
        <div className="mt-3 flex gap-2.5 text-[10px] text-white/35">
          <span>{car.mileage.toLocaleString()} km</span>
          <span className="text-white/15">·</span>
          <span>{car.drive}</span>
          <span className="text-white/15">·</span>
          <span>{car.fuelType}</span>
        </div>

        {/* Feature tags */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {car.tags.slice(1, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[9px] text-white/35"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-end justify-between border-t border-white/[0.06] pt-3.5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/28">Price</p>
            <p className="mt-0.5 text-xl font-bold tracking-tight text-white">
              {formatPriceBDT(car.priceMillionBDT)}
            </p>
          </div>
          <Link
            href={`/cars/${car.id}`}
            className="rounded-full bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-white/88"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
