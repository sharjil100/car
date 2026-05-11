"use client";

import { useEffect, useState } from "react";
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

// Number of cards visible initially and added per "Load more" click
const INITIAL_VISIBLE = 6;
const PAGE_SIZE = 6;

export default function CarGrid() {
  const [active, setActive] = useState<Filter>("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const filtered = CARS.filter((c) => {
    if (active === "All") return true;
    if (active === "Fresh") return c.condition === "Fresh";
    return c.category === active;
  });

  // Reset paging when the filter changes so users always start at page 1
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [active]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = Math.max(0, filtered.length - visibleCount);
  const hasMore = remaining > 0;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filtered.length));
  };

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
            {visible.length} of {filtered.length} vehicle
            {filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load more */}
        {hasMore && (
          <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-12 flex flex-col items-center"
          >
            <button
              onClick={loadMore}
              className="group flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.02] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em] text-white/75 transition hover:border-white/35 hover:bg-white/[0.06] hover:text-white"
            >
              Load More
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
            </button>
            <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-white/25">
              {remaining} more vehicle{remaining !== 1 ? "s" : ""}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
