"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Pillar = {
  title: string;
  body: string;
  icon: ReactNode;
};

const iconCls = "stroke-current";

const PILLARS: Pillar[] = [
  {
    title: "Fresh Imports",
    body: "S-grade Japan auction units with minimal mileage. Every car arrives in fresh condition with documented service history.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
        <path d="M14 3v4M14 21v4M3 14h4M21 14h4M6 6l2.5 2.5M19.5 19.5L22 22M22 6l-2.5 2.5M8.5 19.5L6 22" />
        <circle cx="14" cy="14" r="4" />
      </svg>
    ),
  },
  {
    title: "Verified Service",
    body: "Service records, papers updated, free general & brake service packages on select models till 2027–2028.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
        <path d="M14 3l9 3v8c0 5.2-3.8 9.2-9 11-5.2-1.8-9-5.8-9-11V6l9-3z" />
        <path d="M9.5 14l3 3 6-6" />
      </svg>
    ),
  },
  {
    title: "Premium Curation",
    body: "Only top-tier brands and trims — Toyota, BMW, Mercedes, Lexus, Range Rover, Porsche, Audi. No compromises.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
        <path d="M4.5 10l4-5h11l4 5L14 24 4.5 10z" />
        <path d="M8.5 5L14 24M19.5 5L14 24M4.5 10h19" />
      </svg>
    ),
  },
  {
    title: "Banani Showroom",
    body: "Visit our showroom in Banani, Dhaka. Financing assistance up to 70% available. Test drives by appointment.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
        <path d="M14 25c-5-7-8-11-8-15a8 8 0 0 1 16 0c0 4-3 8-8 15z" />
        <circle cx="14" cy="10" r="2.8" />
      </svg>
    ),
  },
];

export default function WhyUs() {
  return (
    <section className="bg-[#06070a] py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-14 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">
            The Standard
          </p>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight text-white">
            Why Motor Shot Cars
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-sm leading-relaxed text-white/45">
            Bangladesh&apos;s trusted source for premium and luxury automobiles.
            We don&apos;t just sell cars — we curate them.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-400/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative text-blue-300/70 transition-colors group-hover:text-blue-300">
                {p.icon}
              </div>
              <h3 className="relative mt-6 text-base font-semibold tracking-tight text-white">
                {p.title}
              </h3>
              <p className="relative mt-2 text-[13px] leading-relaxed text-white/45">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
