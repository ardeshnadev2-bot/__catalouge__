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
  Fingerprint,
  CheckCircle2,
  Zap,
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
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-blue/5 dark:bg-primary-blue/2 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 w-[400px] h-[400px] bg-primary-green/5 dark:bg-primary-green/2 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Layout: Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 lg:mb-28">
          
          {/* Left Column: Content + Benefits Grid */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-blue/10 dark:bg-primary-green/10 border border-primary-blue/20 dark:border-primary-green/20 text-xs font-semibold tracking-wider uppercase text-primary-blue dark:text-primary-green">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Engineered Excellence</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-dark dark:text-white leading-tight">
                Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-accent-blue dark:from-primary-green dark:to-accent-green">Ease</span>,<br />
                Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-accent-green dark:from-primary-blue to-accent-blue">Convenience</span>
              </h2>
              <p className="text-text-light dark:text-slate-400 font-light text-base sm:text-lg leading-relaxed max-w-xl">
                At Anjani Closures, we combine innovative engineering with high-quality manufacturing to deliver closures that are secure yet easy to open.
              </p>
            </div>

            {/* 2x2 Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Benefit 1 */}
              <div className="glass-card rounded-2xl p-5 flex flex-col space-y-3 hover:border-primary-blue/25 dark:hover:border-primary-green/25 hover:shadow-lg hover:shadow-primary-blue/5 dark:hover:shadow-primary-green/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary-blue/10 dark:bg-primary-green/10 flex items-center justify-center text-primary-blue dark:text-primary-green">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-dark dark:text-white">Effortless Use</h4>
                  <p className="text-xs text-text-light dark:text-slate-400 font-light mt-1 leading-relaxed">
                    Closures designed for smooth, hassle-free access.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="glass-card rounded-2xl p-5 flex flex-col space-y-3 hover:border-primary-blue/25 dark:hover:border-primary-green/25 hover:shadow-lg hover:shadow-primary-blue/5 dark:hover:shadow-primary-green/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary-blue/10 dark:bg-primary-green/10 flex items-center justify-center text-primary-blue dark:text-primary-green">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-dark dark:text-white">Secure Sealing</h4>
                  <p className="text-xs text-text-light dark:text-slate-400 font-light mt-1 leading-relaxed">
                    Reliable closures that preserve freshness and prevent leakage.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="glass-card rounded-2xl p-5 flex flex-col space-y-3 hover:border-primary-blue/25 dark:hover:border-primary-green/25 hover:shadow-lg hover:shadow-primary-blue/5 dark:hover:shadow-primary-green/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary-blue/10 dark:bg-primary-green/10 flex items-center justify-center text-primary-blue dark:text-primary-green">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-dark dark:text-white">Innovative Solutions</h4>
                  <p className="text-xs text-text-light dark:text-slate-400 font-light mt-1 leading-relaxed">
                    Functional designs meeting modern consumer requirements.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="glass-card rounded-2xl p-5 flex flex-col space-y-3 hover:border-primary-blue/25 dark:hover:border-primary-green/25 hover:shadow-lg hover:shadow-primary-blue/5 dark:hover:shadow-primary-green/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary-blue/10 dark:bg-primary-green/10 flex items-center justify-center text-primary-blue dark:text-primary-green">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-dark dark:text-white">User-Friendly Designs</h4>
                  <p className="text-xs text-text-light dark:text-slate-400 font-light mt-1 leading-relaxed">
                    Flip-tops, screw caps, and spouts built for convenience.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Factory Video Embed */}
          <div className="relative group w-full">
            {/* Decorative background glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-blue to-primary-green rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            
            {/* Framed iframe wrapper */}
            <div className="relative glass-card rounded-2xl overflow-hidden p-2">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950">
                <iframe
                  src="https://www.youtube.com/embed/XHOmBV4js_E?autoplay=1&mute=1&loop=1&playlist=XHOmBV4js_E&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1"
                  title="Anjani Closures Production Line"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>

        </div>

        {/* Separator / Spacer */}
        <div className="border-t border-slate-200/10 dark:border-slate-800/30 my-16" />

        {/* Bottom Section: Versatility Across Industries */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-dark dark:text-white">
            Versatility Across Industries
          </h2>
          <p className="text-text-light dark:text-slate-400 font-light max-w-2xl mx-auto">
            Our closures are built for a wide range of products, making them perfect for various sectors, including food, beverages, cosmetics, and healthcare.
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
