'use client';

import { Leaf, Award, Recycle, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

// Drifting leaf animations (CSS based for maximum performance)
function FallingLeaves() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {Array.from({ length: 12 }).map((_, i) => {
        const startLeft = `${(i * 17) % 100}%`;
        const delay = `${(i * 1.3) % 15}s`;
        const duration = `${12 + (i * 1.7) % 12}s`;
        const scale = 0.5 + ((i * 0.23) % 0.8);
        
        return (
          <div
            key={i}
            className="absolute top-[-50px] w-6 h-6 text-emerald-500/20 fill-current opacity-75 animate-leaf-drift"
            style={{
              left: startLeft,
              animationDelay: delay,
              animationDuration: duration,
              transform: `scale(${scale})`,
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <path d="M17 8C8 10 5.9 16.8 5.1 19.3c-.2.6-.8.8-1.2.4-.4-.4-.3-1 .1-1.5C6.4 14.8 9.9 8.2 17 8zm0 0c-4 5.5-1 12.3.8 13.9.4.4 1 .2 1-.4.1-3-.9-9-1.8-13.5z" />
            </svg>
          </div>
        );
      })}
      
      {/* Dynamic Leaf CSS Keyframes */}
      <style jsx global>{`
        @keyframes leafDrift {
          0% {
            top: -50px;
            transform: translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% {
            top: 105%;
            transform: translateX(120px) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-leaf-drift {
          animation-name: leafDrift;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
}

export default function SustainabilitySection() {
  return (
    <section id="sustainability" className="py-20 lg:py-28 relative overflow-hidden bg-emerald-50/30 dark:bg-emerald-950/10 z-10">
      {/* Background Leaves widget */}
      <FallingLeaves />

      {/* Decorative green glows */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary-green/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Row 1: Content Overlay */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm tracking-wider uppercase">
              <Leaf className="w-5 h-5 text-primary-green animate-bounce" />
              Eco-Friendly Manufacturing
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-dark dark:text-white leading-tight">
              Committed to Sustainable Production
            </h2>
            <p className="text-text-light dark:text-slate-300 font-light leading-relaxed">
              At SV Closures, we believe that high-performance packaging should not compromise the environment. We are dedicated to implementing environmentally responsible practices across our entire production cycle. By leveraging low-emission machinery, closed-loop waste recycling, and polymer reductions, we help our clients lower their packaging footprints.
            </p>
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-emerald-500/10 shadow-sm leading-relaxed text-sm text-text-light dark:text-slate-300 font-medium italic">
              &quot;SV Closures Private Limited is committed to environmentally responsible manufacturing through energy-efficient production, recyclable materials, waste reduction practices, and eco-friendly packaging innovations.&quot;
            </div>
          </div>

          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Round Green Badge Mockup */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-dashed border-emerald-500/30 flex items-center justify-center p-8 relative animate-spin-slow">
              {/* Internal ring */}
              <div className="w-full h-full rounded-full border border-emerald-500/20 flex flex-col items-center justify-center text-center p-4 bg-white/40 dark:bg-slate-900/30 backdrop-blur-md">
                <Recycle className="w-12 h-12 text-primary-green mb-3" />
                <span className="text-lg font-extrabold text-text-dark dark:text-white uppercase tracking-wider leading-none">100% Recyclable</span>
                <span className="text-[10px] text-text-light dark:text-slate-400 mt-1">Virgin PP & HDPE Polymers Only</span>
              </div>
            </div>
            {/* Absolute element overlays */}
            <div className="absolute top-8 left-16 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/50 shadow-md rounded-2xl p-4 text-center">
              <span className="block text-2xl font-black text-primary-green">35%</span>
              <span className="text-[10px] uppercase font-bold text-text-dark dark:text-slate-300">Energy Saved</span>
            </div>
          </div>
        </div>

        {/* Row 2: Three-column detailed practices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/10 hover:border-primary-green/30 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Recycle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text-dark dark:text-white">
              Recyclable Polymers
            </h3>
            <p className="text-xs text-text-light dark:text-slate-400 font-light leading-relaxed">
              We manufacture closures using highly recyclable polymers (HDPE Code 2, PP Code 5). These materials are standard in municipal sorting bins, enabling direct integration into consumer circular recycling streams.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-emerald-500/10 hover:border-primary-green/30 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text-dark dark:text-white">
              Energy-Efficient Machinery
            </h3>
            <p className="text-xs text-text-light dark:text-slate-400 font-light leading-relaxed">
              Our automated injection machines are equipped with servo-hydraulic drives that draw power dynamically. This reduces electrical consumption during tooling cycles by up to 35% compared to conventional presses.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-emerald-500/10 hover:border-primary-green/30 space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-text-dark dark:text-white">
              Zero-Waste Regrinding
            </h3>
            <p className="text-xs text-text-light dark:text-slate-400 font-light leading-relaxed">
              We employ closed-loop granulation units next to our molding lines. Scrap runner material is granulated and immediately processed back, ensuring a near-zero raw material waste profile.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
