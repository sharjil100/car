"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type ContactItem = {
  label: string;
  value: string;
  sub?: string;
  href?: string;
  icon: ReactNode;
};

const ICON_CLS = "stroke-current";

const CONTACTS: ContactItem[] = [
  {
    label: "Call",
    value: "01799-237222",
    sub: "Sat–Thu · 10am to 8pm",
    href: "tel:+8801799237222",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLS}>
        <path d="M16.5 13.5v2a2 2 0 0 1-2.2 2 18.5 18.5 0 0 1-8-2.9 18 18 0 0 1-5.5-5.5 18.5 18.5 0 0 1-2.9-8.1 2 2 0 0 1 2-2.2h2a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.4 2.1L3.2 6.3a14.4 14.4 0 0 0 5.5 5.5l1.2-1.2a2 2 0 0 1 2.1-.4c.8.3 1.6.5 2.5.6a2 2 0 0 1 1.7 2z" />
      </svg>
    ),
  },
  {
    label: "Address",
    value: "Banani, Dhaka",
    sub: "Bangladesh",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLS}>
        <path d="M9 16c-3-4-5-7-5-9.5A5 5 0 0 1 9 1.5a5 5 0 0 1 5 5C14 9 12 12 9 16z" />
        <circle cx="9" cy="6.5" r="1.8" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "info@motorshotcars.com",
    sub: "Replies within 24h",
    href: "mailto:info@motorshotcars.com",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLS}>
        <rect x="2" y="3.5" width="14" height="11" rx="1.5" />
        <path d="M2.5 4.5l6.5 5 6.5-5" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    value: "Motor Shot Cars",
    sub: "Browse latest arrivals",
    href: "https://www.facebook.com/profile.php?id=100092398178357",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLS}>
        <path d="M11.5 6h-1.5c-.5 0-1 .5-1 1v2H7v2.5h2V17h2.5v-5.5H13l.5-2.5h-2V7.5c0-.3.2-.5.5-.5h1.5V4.5h-2c-1.4 0-2.5 1.1-2.5 2.5z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#03050a]">
      {/* Top ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(80,130,210,0.10) 0%, transparent 60%)",
        }}
      />

      {/* Visit section */}
      <div className="relative mx-auto max-w-[1400px] px-5 pb-16 pt-24 sm:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
          >
            <p className="text-[10px] uppercase tracking-[0.5em] text-blue-300/55">
              Visit Our Showroom
            </p>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-[0.95] tracking-tight text-white">
              Banani,
              <br />
              <span className="bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent">
                Dhaka
              </span>
            </h2>
            <p className="mt-5 max-w-[440px] text-sm leading-relaxed text-white/45">
              Experience the cars in person. Test drives by appointment.
              Financial assistance up to 70% available for qualified buyers.
            </p>
            <a
              href="tel:+8801799237222"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition hover:bg-white/90"
            >
              Call 01799-237222
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 5.5h9M6.5 1.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {CONTACTS.map((c) => (
              <ContactCard key={c.label} item={c} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-5 py-6 sm:flex-row sm:px-10">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Motor Shot Cars"
              className="h-7 w-auto select-none opacity-80"
            />
          </div>
          <nav className="flex gap-6 text-[10px] uppercase tracking-[0.28em] text-white/30">
            <a href="#collection" className="transition hover:text-white">
              Collection
            </a>
            <a href="#" className="transition hover:text-white">
              Sell Your Car
            </a>
            <a href="#" className="transition hover:text-white">
              Financing
            </a>
            <a href="#" className="transition hover:text-white">
              Privacy
            </a>
          </nav>
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/25">
            © {new Date().getFullYear()} Motor Shot Cars
          </p>
        </div>
      </div>
    </footer>
  );
}

function ContactCard({ item }: { item: ContactItem }) {
  const inner = (
    <>
      <div className="text-blue-300/65 transition-colors group-hover:text-blue-300">
        {item.icon}
      </div>
      <div className="mt-4">
        <p className="text-[9px] uppercase tracking-[0.32em] text-white/30">
          {item.label}
        </p>
        <p className="mt-1.5 text-[15px] font-semibold text-white">
          {item.value}
        </p>
        {item.sub && (
          <p className="mt-0.5 text-[11px] text-white/35">{item.sub}</p>
        )}
      </div>
    </>
  );

  const cls =
    "group block rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.04]";

  if (item.href) {
    const external = item.href.startsWith("http");
    return (
      <a
        href={item.href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}
