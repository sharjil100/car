"use client";

import { motion } from "framer-motion";
import { CARS } from "@/data/cars";

export default function BrandsStrip() {
  // Compute brand counts dynamically from the catalogue
  const brandCounts = Array.from(
    CARS.reduce<Map<string, number>>((map, car) => {
      map.set(car.brand, (map.get(car.brand) ?? 0) + 1);
      return map;
    }, new Map())
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <section className="border-y border-white/[0.06] bg-[#04060a] py-20">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="mb-12 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">
            House of
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,3rem)] font-bold tracking-tight text-white">
            Brands We Carry
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {brandCounts.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group cursor-default"
            >
              <p className="whitespace-nowrap text-[15px] font-bold tracking-[0.15em] text-white/30 transition-colors duration-300 group-hover:text-white sm:text-base">
                {b.name.toUpperCase()}
              </p>
              <p className="mt-1.5 text-[9px] uppercase tracking-[0.28em] text-white/20">
                {b.count} {b.count === 1 ? "vehicle" : "vehicles"}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
