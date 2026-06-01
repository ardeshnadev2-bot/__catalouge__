'use client';

import { motion } from 'framer-motion';
import {
  Droplet,
  GlassWater,
  Pill,
  Settings,
  Car,
  Paintbrush,
  FlaskConical,
  Combine,
  Filter,
  Home,
  Sparkles,
  Package,
} from 'lucide-react';

const industries = [
  {
    name: 'Edible Oil Industry',
    icon: Droplet,
    color: 'from-amber-500/10 to-yellow-500/10 text-amber-500',
    description: 'Bespoke cap geometries with tear-off pull rings and anti-drip pouring spouts.',
  },
  {
    name: 'Food & Beverage',
    icon: GlassWater,
    color: 'from-emerald-500/10 to-teal-500/10 text-emerald-500',
    description: 'Food-grade certified closures preserving freshness and carbonation limits.',
  },
  {
    name: 'Pharmaceutical',
    icon: Pill,
    color: 'from-blue-500/10 to-indigo-500/10 text-blue-500',
    description: 'Secured child-resistant and tamper-evident caps complying with healthcare standards.',
  },
  {
    name: 'Lubricants',
    icon: Settings,
    color: 'from-red-500/10 to-orange-500/10 text-orange-500',
    description: 'Rigid closures designed to resist petroleum breakdown and guarantee high sealing torques.',
  },
  {
    name: 'Automotive Oil',
    icon: Car,
    color: 'from-slate-500/10 to-zinc-500/10 text-slate-500',
    description: 'Press-fit spouts and crimp-on caps facilitating smooth, direct engine pours.',
  },
  {
    name: 'Paint Industry',
    icon: Paintbrush,
    color: 'from-purple-500/10 to-pink-500/10 text-purple-500',
    description: 'Robust airtight locks avoiding skinning and evaporation of chemical paints.',
  },
  {
    name: 'Chemical Industry',
    icon: FlaskConical,
    color: 'from-cyan-500/10 to-blue-500/10 text-cyan-500',
    description: 'Vented caps managing pressure changes when storing volatile solvents and corrosives.',
  },
  {
    name: 'Adhesives',
    icon: Combine,
    color: 'from-violet-500/10 to-purple-500/10 text-violet-500',
    description: 'Airtight caps with precision nozzles for controlled, drop-by-drop fluid dispensing.',
  },
  {
    name: 'Solvent Industry',
    icon: Filter,
    color: 'from-sky-500/10 to-cyan-500/10 text-sky-500',
    description: 'Heavy-duty closure systems preventing gas escape and external degradation.',
  },
  {
    name: 'Home Care Products',
    icon: Home,
    color: 'from-teal-500/10 to-green-500/10 text-teal-500',
    description: 'Dispensing flip-tops and screw caps optimized for domestic chemical bottles.',
  },
  {
    name: 'Personal Care Products',
    icon: Sparkles,
    color: 'from-rose-500/10 to-pink-500/10 text-rose-500',
    description: 'High-aesthetic flip-top caps and pumps offering smooth cream and gel dispensing.',
  },
  {
    name: 'Industrial Packaging',
    icon: Package,
    color: 'from-indigo-500/10 to-violet-500/10 text-indigo-500',
    description: 'Threaded Jerry can plugs and heavy-drum adapters with tamper-evident seals.',
  },
];

export default function IndustriesSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 12,
      },
    },
  };

  return (
    <section id="industries" className="py-20 lg:py-28 bg-slate-50/50 dark:bg-slate-900/10 relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-dark dark:text-white">
            Industries We Serve
          </h2>
          <p className="text-text-light dark:text-slate-400 font-light max-w-2xl mx-auto">
            Delivering high-integrity caps, dispensing systems, and spill-resistant seals tailored to the regulatory and logistics requirements of each sector.
          </p>
        </div>

        {/* 12 Industry Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {industries.map((ind) => (
            <motion.div
              key={ind.name}
              variants={itemVariants}
              className="group glass-card rounded-2xl p-6 flex flex-col items-center text-center space-y-4 hover:shadow-xl hover:shadow-primary-blue/5 dark:hover:shadow-primary-green/5 dark:hover:border-primary-green/20 hover:border-primary-blue/20"
            >
              {/* Icon wrap */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ind.color} flex items-center justify-center transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 shadow-inner`}>
                <ind.icon className="w-7 h-7" />
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-text-dark dark:text-white group-hover:text-primary-blue dark:group-hover:text-primary-green transition-colors duration-200">
                {ind.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-text-light dark:text-slate-400 font-light leading-relaxed">
                {ind.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
