'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Activity, Users, Globe2, Award } from 'lucide-react';
import { useEffect, useState } from 'react';

// Dynamically import the 3D Canvas with SSR disabled to prevent WebGL compilation errors on server
const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative">
      <div className="w-20 h-20 rounded-full border-4 border-primary-blue/30 border-t-primary-blue animate-spin" />
    </div>
  ),
});

// Dynamic stat counter utility
function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value);
  const suffix = value.replace(numericValue.toString(), '');

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    if (isNaN(end)) return;
    
    const stepTime = Math.abs(Math.floor((duration * 1000) / end));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, Math.max(stepTime, 15));

    return () => clearInterval(timer);
  }, [numericValue, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function HeroSection() {
  const handleScrollTo = (id: string) => {
    window.location.hash = '#' + id;
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden bg-gradient-to-b from-blue-50/40 via-white to-transparent dark:from-slate-950 dark:via-slate-900/60 dark:to-transparent z-10"
    >
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary-blue/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-primary-green/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Content Block */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-blue dark:text-accent-blue text-xs font-semibold uppercase tracking-wider"
            >
              <ShieldCheck className="w-4 h-4 text-primary-green" />
              Trusted Global Export Partner
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-dark dark:text-white leading-[1.1]"
            >
              Innovative{' '}
              <span className="bg-gradient-to-r from-primary-blue via-primary-blue to-primary-green bg-clip-text text-transparent dark:from-accent-blue dark:to-primary-green">
                Closure Solutions
              </span>{' '}
              for Every Industry
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-text-light dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Manufacturing high-quality plastic caps, closures, spouts, and dispensing systems trusted by leading brands worldwide. Precision-engineered for leakage protection and structural integrity.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => handleScrollTo('products')}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-primary-blue to-primary-green hover:shadow-lg hover:shadow-primary-blue/20 text-white font-semibold transition-all duration-300 transform hover:-translate-y-0.5 group w-full sm:w-auto justify-center"
              >
                Explore Products
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => handleScrollTo('contact')}
                className="flex items-center gap-1 px-8 py-3.5 rounded-full glass-card hover:bg-slate-100 dark:hover:bg-slate-800 text-text-dark dark:text-white font-semibold transition-all duration-300 w-full sm:w-auto justify-center"
              >
                Contact Us
              </button>
            </motion.div>

            {/* Mini Statistics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/80"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start text-primary-blue font-bold text-2xl">
                  <Award className="w-5 h-5 text-primary-green shrink-0" />
                  <AnimatedCounter value="25+" />
                </div>
                <p className="text-xs text-text-light dark:text-slate-400 font-medium">Years Legacy</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start text-primary-blue font-bold text-2xl">
                  <Activity className="w-5 h-5 text-primary-green shrink-0" />
                  <AnimatedCounter value="50+" />
                </div>
                <p className="text-xs text-text-light dark:text-slate-400 font-medium">Product Lines</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start text-primary-blue font-bold text-2xl">
                  <Globe2 className="w-5 h-5 text-primary-green shrink-0" />
                  <AnimatedCounter value="20+" />
                </div>
                <p className="text-xs text-text-light dark:text-slate-400 font-medium">Export Countries</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 justify-center lg:justify-start text-primary-blue font-bold text-2xl">
                  <Users className="w-5 h-5 text-primary-green shrink-0" />
                  <AnimatedCounter value="100+" />
                </div>
                <p className="text-xs text-text-light dark:text-slate-400 font-medium">Global Clients</p>
              </div>
            </motion.div>
          </div>

          {/* 3D Model Floating Canvas Block */}
          <div className="lg:col-span-5 w-full h-[400px] lg:h-full flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full h-full relative"
            >
              <Hero3DCanvas />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
