"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CARS } from "@/data/cars";
import type { CarCategory } from "@/data/cars";
import CarCard from "./CarCard";

type Filter = "All" | CarCategory | "Fresh";

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "All" },
  { label: "SUV", value: "SUV" },
  { label: "Sedan", value: "Sedan" },
  { label: "MPV", value: "MPV" },
  { label: "Sports", value: "Sports" },
  { label: "Fresh Import", value: "Fresh" },
];

export default function CarGrid() {
  const [active, setActive] = useState<Filter>("All");

  const filtered = CARS.filter((c) => {
    if (active === "All") return true;
    if (active === "Fresh") return c.condition === "Fresh";
    return c.category === active;
  });

  return (
    <section id="collection" className="bg-[#05060a] pb-28 pt-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-10"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">
            Our Fleet
          </p>
          <h2 className="mt-2 text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-white">
            The Collection
          </h2>
        </motion.div>

        {/* Filter pills */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`relative rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] transition ${
                active === f.value
                  ? "text-black"
                  : "border border-white/10 text-white/45 hover:text-white/75"
              }`}
            >
              {active === f.value && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.42 }}
                />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
          <span className="ml-auto text-[11px] text-white/22">
            {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
