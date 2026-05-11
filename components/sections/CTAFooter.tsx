"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import MagneticButton from "../motion/MagneticButton";
import Marquee from "../motion/Marquee";

/**
 * CTAFooter
 * --------------------------------------------------------------
 * - Huge "LC300" wordmark dissolves into drifting particles on scroll-into-view.
 * - "Configure Yours" magnetic button.
 * - Slow breathing background gradient.
 * - Marquee ticker of stats above.
 *
 * The particle effect is rendered to a single <canvas>, ~600 particles drifting
 * upward into the wordmark when entering view.
 */

export default function CTAFooter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(sectionRef, { once: false, amount: 0.4 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let particles: { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number }[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const spawn = () => {
      const r = canvas.getBoundingClientRect();
      for (let i = 0; i < 4; i++) {
        particles.push({
          x: Math.random() * r.width,
          y: r.height + 20,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -(0.4 + Math.random() * 0.9),
          life: 0,
          max: 200 + Math.random() * 200,
          size: Math.random() * 1.6 + 0.4,
        });
      }
    };

    const tick = () => {
      const r = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      if (inView) spawn();
      particles = particles.filter((p) => {
        p.life += 1;
        p.x += p.vx;
        p.y += p.vy;
        const t = p.life / p.max;
        const alpha = Math.max(0, Math.sin(t * Math.PI)) * 0.6;
        ctx.fillStyle = `rgba(140,180,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return p.life < p.max && p.y > -20;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [inView]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#04050a]"
    >
      {/* breathing gradient bg — two stacked layers cross-fade for the "breathing" effect */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(40,80,160,0.25) 0%, rgba(10,12,20,0.95) 60%)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(80,130,210,0.30) 0%, rgba(10,12,20,0.95) 65%)",
        }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* marquee */}
      <div className="relative z-20 border-y border-white/10 bg-black/30 py-6 backdrop-blur-sm">
        <Marquee speed={45}>
          {["3.3L V6 TWIN-TURBO", "409 HP", "650 NM TORQUE", "10-SPEED DCT", "MULTI-TERRAIN SELECT", "GA-F PLATFORM", "20% STIFFER", "BUILT TO ENDURE"].map(
            (t, i) => (
              <span
                key={i}
                className="whitespace-nowrap text-2xl font-semibold tracking-[0.2em] text-white/30 sm:text-4xl"
              >
                {t} ·
              </span>
            )
          )}
        </Marquee>
      </div>

      {/* particle canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      />

      {/* wordmark + cta */}
      <div className="relative z-20 flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-[10px] uppercase tracking-[0.5em] text-blue-300/70"
        >
          06 / Build yours
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 select-none bg-gradient-to-b from-white via-white/80 to-white/30 bg-clip-text text-[clamp(5rem,22vw,22rem)] font-bold leading-[0.85] tracking-tight text-transparent"
          style={{ filter: "drop-shadow(0 0 40px rgba(80,150,255,0.25))" }}
        >
          LC300
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 max-w-md text-sm leading-relaxed text-white/55"
        >
          Begin your configuration. Choose finish, drivetrain and interior package.
        </motion.p>

        <MagneticButton strength={0.4} range={140} className="mt-10">
          <button className="group relative overflow-hidden rounded-full border border-white/15 bg-white/[0.04] px-10 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-md transition hover:border-blue-300/60 hover:bg-blue-300/10">
            <span className="relative z-10">Configure Yours</span>
            <span className="absolute inset-0 -z-0 translate-y-full bg-blue-300/15 transition-transform duration-500 group-hover:translate-y-0" />
          </button>
        </MagneticButton>
      </div>

      {/* bottom legalia */}
      <div className="relative z-20 flex flex-col items-center gap-2 border-t border-white/10 px-6 py-6 text-[10px] uppercase tracking-[0.3em] text-white/30 sm:flex-row sm:justify-between">
        <span>© LC300 Studio · 2026</span>
        <span>Engineered for every terrain</span>
        <span>Privacy · Terms · Press</span>
      </div>
    </section>
  );
}
