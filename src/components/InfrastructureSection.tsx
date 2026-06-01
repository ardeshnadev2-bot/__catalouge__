'use client';

import { motion } from 'framer-motion';
import { Factory, Cpu, Hammer, ShieldAlert, Package, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const infrastructureData = [
  {
    title: 'Injection Molding Machines',
    icon: Factory,
    description: 'Equipped with high-tonnage micro-processor controlled molding presses. Operating in continuous high-output loops with automated material feed systems.',
    kpiName: 'Machine Efficiency',
    kpiValue: 96,
    specs: ['Clamping force up to 350T', 'Energy-saving servo motors', 'Hot-runner tooling capability'],
  },
  {
    title: 'Automated Assembly Lines',
    icon: Cpu,
    description: 'Specialized high-speed closing, cap-lining, and assembly lines. Employs machine-vision cameras to detect micro-flaws at up to 600 caps per minute.',
    kpiName: 'Automation Rate',
    kpiValue: 88,
    specs: ['Camera-defect optical sorting', 'Auto lining wadding systems', 'Laser batch-code engraving'],
  },
  {
    title: 'Mold Development Facility',
    icon: Hammer,
    description: 'In-house mold shop featuring CNC milling, electric discharge machining (EDM), and computer-aided engineering (CAD/CAM) simulation tools.',
    kpiName: 'Design Precision',
    kpiValue: 94,
    specs: ['3D CAD/CAM mold flows', 'Hardened tool steel cores', 'Rapid prototype molds'],
  },
  {
    title: 'Quality Testing Laboratory',
    icon: ShieldAlert,
    description: 'Dedicated testing clean-room. Performs rigorous batch release validation covering vertical load tests, leak vacuum tests, and material torque tests.',
    kpiName: 'Compliance Rating',
    kpiValue: 99.9,
    specs: ['Vacuum leak verification', 'Torque testing meters', 'Melt flow index testers'],
  },
  {
    title: 'Packaging Unit',
    icon: Package,
    description: 'Dust-free packing environment using anti-static food-grade bags, robust double-wall corrugated export boxes, and heavy-duty shrink palletizing.',
    kpiName: 'Export Standards',
    kpiValue: 92,
    specs: ['Anti-static poly linings', 'RFID carton tracking', 'Sea-worthy shrink wrap'],
  },
];

// Helper component for animating individual progress bar when in view
function ProgressBar({ targetValue, duration = 1.5 }: { targetValue: number; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = targetValue;
    const stepTime = Math.abs(Math.floor((duration * 1000) / end));
    
    const timer = setInterval(() => {
      start += 1;
      if (start >= end) {
        setValue(end);
        clearInterval(timer);
      } else {
        setValue(start);
      }
    }, Math.max(stepTime, 15));

    return () => clearInterval(timer);
  }, [targetValue, duration]);

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-text-light dark:text-slate-400">KPI Performance</span>
        <span className="text-primary-blue dark:text-primary-green">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-blue to-primary-green rounded-full"
          initial={{ width: 0 }}
          whileInView={{ width: `${targetValue}%` }}
          viewport={{ once: true }}
          transition={{ duration }}
        />
      </div>
    </div>
  );
}

export default function InfrastructureSection() {
  return (
    <section id="infrastructure" className="py-20 lg:py-28 relative overflow-hidden z-10">
      {/* Visual background details */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary-green/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-dark dark:text-white">
            Manufacturing Infrastructure
          </h2>
          <p className="text-text-light dark:text-slate-400 font-light max-w-2xl mx-auto">
            A state-of-the-art facility in Rajkot engineered for high-volume precision output, meeting food-grade clean standards and global export supply volumes.
          </p>
        </div>

        {/* Infrastructure Units Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-16">
          
          {/* Detailed list left column */}
          <div className="space-y-6 lg:col-span-1">
            <h3 className="text-2xl font-bold text-text-dark dark:text-white mb-4">
              Advanced Machinery & Tooling
            </h3>
            <p className="text-text-light dark:text-slate-400 font-light leading-relaxed mb-6">
              Our infrastructure is designed for 24/7 continuous operations, leveraging zero-defect automation systems. From computer-modeled plastic flow analysis to multi-cavity hot runner molds, we maintain rigorous control over dimensional tolerances and product consistency.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <p className="text-sm text-text-light dark:text-slate-300">
                  <strong>Integrated optical quality sorters</strong> scan the locking bands on every cap in real time.
                </p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <p className="text-sm text-text-light dark:text-slate-300">
                  <strong>Clean-room packaging setup</strong> prevents particulate contamination prior to container shipping.
                </p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                <p className="text-sm text-text-light dark:text-slate-300">
                  <strong>In-house testing facility</strong> guarantees each batch adheres to food-safe chemical migration limits.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid Column */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 text-center space-y-2 border border-primary-blue/5">
              <h4 className="text-3xl font-extrabold text-primary-blue dark:text-primary-green">25,000+</h4>
              <p className="text-xs font-bold uppercase tracking-wider text-text-dark dark:text-white">Sq. Feet Area</p>
              <p className="text-[10px] text-text-light dark:text-slate-400">Integrated Rajkot Unit</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center space-y-2 border border-primary-green/5">
              <h4 className="text-3xl font-extrabold text-primary-blue dark:text-primary-green">50M+</h4>
              <p className="text-xs font-bold uppercase tracking-wider text-text-dark dark:text-white">Monthly Output</p>
              <p className="text-[10px] text-text-light dark:text-slate-400">High-volume capability</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center space-y-2 border border-primary-green/5">
              <h4 className="text-3xl font-extrabold text-primary-blue dark:text-primary-green">100%</h4>
              <p className="text-xs font-bold uppercase tracking-wider text-text-dark dark:text-white">Food Grade Resin</p>
              <p className="text-[10px] text-text-light dark:text-slate-400">Virgin PP & HDPE only</p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center space-y-2 border border-primary-blue/5">
              <h4 className="text-3xl font-extrabold text-primary-blue dark:text-primary-green">&lt;0.05%</h4>
              <p className="text-xs font-bold uppercase tracking-wider text-text-dark dark:text-white">Defect Tolerance</p>
              <p className="text-[10px] text-text-light dark:text-slate-400">Strict automated rejection</p>
            </div>
          </div>

        </div>

        {/* Detailed Department Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {infrastructureData.map((dept, index) => (
            <div
              key={index}
              className="group glass-card rounded-2xl p-6 flex flex-col justify-between space-y-6 hover:shadow-lg dark:hover:border-primary-green/20 hover:border-primary-blue/20"
            >
              <div className="space-y-4">
                {/* Header with Icon */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-blue/10 dark:bg-primary-green/10 flex items-center justify-center text-primary-blue dark:text-primary-green shrink-0">
                    <dept.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-text-dark dark:text-white leading-tight">
                    {dept.title}
                  </h4>
                </div>

                <p className="text-xs text-text-light dark:text-slate-400 font-light leading-relaxed">
                  {dept.description}
                </p>

                {/* Specs list */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                  {dept.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-1.5 text-[10px] text-text-light dark:text-slate-300 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-green shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Metric */}
              <div className="pt-2">
                <ProgressBar targetValue={dept.kpiValue} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
