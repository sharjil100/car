"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { CARS } from "@/data/cars";
import type { CarCategory } from "@/data/cars";

type CatDef = {
  value: CarCategory;
  label: string;
  description: string;
  accent: string;
  icon: ReactNode;
};

const stroke = "stroke-current";

const SuvIcon = (
  <svg width="56" height="34" viewBox="0 0 56 34" fill="none" strokeLinecap="round" strokeLinejoin="round" className={stroke} strokeWidth="1.2">
    <path d="M3 24h50" />
    <path d="M8 24V15l9-8h22l9 8v9" />
    <path d="M17 15h31" />
    <circle cx="15" cy="26" r="2.4" />
    <circle cx="41" cy="26" r="2.4" />
  </svg>
);

const SedanIcon = (
  <svg width="56" height="34" viewBox="0 0 56 34" fill="none" strokeLinecap="round" strokeLinejoin="round" className={stroke} strokeWidth="1.2">
    <path d="M3 24h50" />
    <path d="M6 24v-6l5-3 6-7h18l9 7 6 3v6" />
    <path d="M17 15h26" />
    <circle cx="15" cy="26" r="2.4" />
    <circle cx="41" cy="26" r="2.4" />
  </svg>
);

const MpvIcon = (
  <svg width="56" height="34" viewBox="0 0 56 34" fill="none" strokeLinecap="round" strokeLinejoin="round" className={stroke} strokeWidth="1.2">
    <path d="M3 24h50" />
    <path d="M6 24V14l5-9h35l3 9v10" />
    <path d="M11 14h38" />
    <line x1="25" y1="14" x2="25" y2="24" />
    <circle cx="15" cy="26" r="2.4" />
    <circle cx="41" cy="26" r="2.4" />
  </svg>
);

const SportsIcon = (
  <svg width="56" height="34" viewBox="0 0 56 34" fill="none" strokeLinecap="round" strokeLinejoin="round" className={stroke} strokeWidth="1.2">
    <path d="M3 24h50" />
    <path d="M5 24l5-7 7-4h16l10 4 9 7" />
    <path d="M17 17h22" />
    <circle cx="15" cy="26" r="2.4" />
    <circle cx="41" cy="26" r="2.4" />
  </svg>
);

const CATEGORIES: CatDef[] = [
  {
    value: "SUV",
    label: "SUV",
    description: "Commanding presence, off-road capability, family-ready luxury.",
    accent: "#90c0ff",
    icon: SuvIcon,
  },
  {
    value: "Sedan",
    label: "Sedan",
    description: "Refined elegance, executive comfort, daily-driver finesse.",
    accent: "#c8a97a",
    icon: SedanIcon,
  },
  {
    value: "MPV",
    label: "MPV",
    description: "Business-class seating, sliding doors, the ultimate people mover.",
    accent: "#a78bfa",
    icon: MpvIcon,
  },
  {
    value: "Sports",
    label: "Sports",
    description: "Pure performance, raw soundtrack, weekend-only thrill.",
    accent: "#ff9a76",
    icon: SportsIcon,
  },
];

export default function CategoryShowcase() {
  return (
    <section className="bg-[#06070a] py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-12 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">
              Find Your Drive
            </p>
            <h2 className="mt-2 text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-white">
              Browse by Category
            </h2>
          </div>
          <p className="max-w-[400px] text-sm leading-relaxed text-white/40">
            Whatever your road demands — daily luxury, family touring, weekend
            thrill — there&apos;s a curated set waiting.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat, i) => {
            const count = CARS.filter((c) => c.category === cat.value).length;
            return (
              <motion.a
                key={cat.value}
                href="#collection"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="group relative flex h-[400px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-7"
              >
                {/* Accent glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full opacity-[0.18] blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                  style={{ background: cat.accent }}
                />
                {/* Subtle grid */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.025]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(200,220,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,220,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />

                <div className="relative flex-1">
                  <div className="text-white/45 transition-colors group-hover:text-white">
                    {cat.icon}
                  </div>

                  <h3 className="mt-7 text-3xl font-bold tracking-tight text-white">
                    {cat.label}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/45">
                    {cat.description}
                  </p>
                </div>

                <div className="relative flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                      Available
                    </p>
                    <p className="mt-0.5 text-3xl font-bold tracking-tight text-white">
                      {count}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/45 transition group-hover:text-white">
                    Browse
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="transition-transform group-hover:translate-x-1">
                      <path d="M1 5.5h9M6.5 1.5l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
