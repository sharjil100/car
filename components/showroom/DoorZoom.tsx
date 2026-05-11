"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, ReactNode } from "react";
import type { CarListing } from "@/data/cars";

export default function DoorZoom({
  car,
  children,
}: {
  car: CarListing;
  children: (onOpen: (e: React.MouseEvent) => void) => ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleOpen = (e: React.MouseEvent) => {
    const x = Math.round((e.clientX / window.innerWidth) * 100);
    const y = Math.round((e.clientY / window.innerHeight) * 100);
    setOrigin({ x, y });
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const audioLabel = car.features.audioBrand
    ? car.features.speakers
      ? `${car.features.audioBrand} · ${car.features.speakers}-Speaker`
      : `${car.features.audioBrand} Premium Audio`
    : car.features.speakers
      ? `${car.features.speakers}-Speaker Audio`
      : null;

  const activeFeatures = [
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

  const glow = car.interiorColorHex;

  return (
    <>
      {children(handleOpen)}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="door-zoom"
            className="fixed inset-0 z-[200] overflow-y-auto bg-[#04060a]"
            initial={{ clipPath: `circle(0px at ${origin.x}% ${origin.y}%)` }}
            animate={{ clipPath: `circle(2500px at ${origin.x}% ${origin.y}%)` }}
            exit={{ clipPath: `circle(0px at ${origin.x}% ${origin.y}%)` }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ambient interior glow */}
            <div
              className="pointer-events-none fixed inset-0"
              style={{
                background: `radial-gradient(ellipse 80% 45% at 50% 15%, ${glow}28 0%, transparent 60%)`,
              }}
            />

            {/* Close */}
            <button
              onClick={handleClose}
              className="fixed right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/55 backdrop-blur-sm transition hover:border-white/35 hover:text-white"
              aria-label="Close interior view"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative mx-auto max-w-[1100px] px-5 pb-16 pt-12 sm:px-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
              >
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/30">
                  Interior Preview
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {car.brand} {car.model}
                  <span className="ml-3 text-sm font-light text-white/30">
                    {car.grade} · {car.year}
                  </span>
                </h2>
              </motion.div>

              {/* Interior visual stage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative mt-5 h-[36vh] max-h-[340px] w-full overflow-hidden rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${glow}12 0%, ${glow}05 50%, #060810 100%)`,
                  border: `1px solid ${glow}22`,
                }}
              >
                {/* Schematic SVG — evokes an interior without needing photos */}
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 900 340"
                  preserveAspectRatio="xMidYMid slice"
                  fill="none"
                >
                  <path d="M-50 200 Q120 148 290 155 Q510 163 690 155 Q830 150 960 200"
                    stroke={glow} strokeWidth="0.8" opacity="0.32" />
                  <path d="M0 185 Q210 142 430 146 Q640 150 910 185"
                    stroke={glow} strokeWidth="0.35" opacity="0.18" />
                  <circle cx="248" cy="228" r="62" stroke={glow} strokeWidth="0.9" opacity="0.38" />
                  <circle cx="248" cy="228" r="36" stroke={glow} strokeWidth="0.5" opacity="0.22" />
                  <line x1="248" y1="166" x2="248" y2="192" stroke={glow} strokeWidth="1" opacity="0.45" />
                  <line x1="248" y1="264" x2="248" y2="290" stroke={glow} strokeWidth="1" opacity="0.45" />
                  <line x1="186" y1="228" x2="212" y2="228" stroke={glow} strokeWidth="1" opacity="0.45" />
                  <line x1="284" y1="228" x2="310" y2="228" stroke={glow} strokeWidth="1" opacity="0.45" />
                  <rect x="372" y="132" width="208" height="118" rx="9" stroke={glow} strokeWidth="0.8" opacity="0.42" />
                  <line x1="382" y1="158" x2="570" y2="158" stroke={glow} strokeWidth="0.3" opacity="0.18" />
                  <line x1="382" y1="172" x2="530" y2="172" stroke={glow} strokeWidth="0.3" opacity="0.18" />
                  <rect x="332" y="205" width="68" height="72" rx="5" stroke={glow} strokeWidth="0.6" opacity="0.28" />
                  <rect x="58" y="270" width="148" height="62" rx="8" stroke={glow} strokeWidth="0.7" opacity="0.28" />
                  <rect x="232" y="270" width="148" height="62" rx="8" stroke={glow} strokeWidth="0.7" opacity="0.28" />
                  <line x1="0" y1="312" x2="900" y2="312" stroke={glow} strokeWidth="0.35" opacity="0.1" />
                </svg>

                {/* Interior color row */}
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-5 w-5 rounded-full ring-1 ring-white/20"
                      style={{ background: glow }}
                    />
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">Interior</p>
                      <p className="text-xs font-medium text-white/65">
                        {car.interiorColor} · Premium Leather
                      </p>
                    </div>
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/18">
                    Photos Coming Soon
                  </p>
                </div>
              </motion.div>

              {/* Feature chips */}
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {activeFeatures.map((feat, i) => (
                  <motion.div
                    key={feat}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.045, duration: 0.32 }}
                    className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5"
                  >
                    <span
                      className="h-1.5 w-1.5 flex-none rounded-full"
                      style={{ background: glow }}
                    />
                    <span className="text-[11px] leading-snug text-white/58">{feat}</span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.45 }}
                className="mt-8 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-7"
              >
                {[
                  { label: "Seating", value: `${car.seats} Persons` },
                  { label: "Drive System", value: car.drive },
                  { label: "Fuel Type", value: car.fuelType },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/28">{s.label}</p>
                    <p className="mt-1 text-base font-semibold text-white">{s.value}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
