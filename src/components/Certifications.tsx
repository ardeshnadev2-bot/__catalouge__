'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, ShieldAlert, BadgeCheck, FileCheck2 } from 'lucide-react';

const certificationsData = [
  {
    title: 'ISO 9001:2015 Certified',
    subtitle: 'Quality Management Systems',
    icon: Award,
    description: 'Our raw materials, tooling engineering, and automated inspection pipelines adhere to ISO Quality Management Systems.',
  },
  {
    title: 'Food Grade Certification',
    subtitle: 'Directive Compliance (US FDA & EU)',
    icon: BadgeCheck,
    description: 'All polymers used are virgin FDA-approved HDPE/PP. We ensure zero chemical migration and complete food safety compliance.',
  },
  {
    title: 'Quality Assurance Standards',
    subtitle: 'Zero Defect Inspection',
    icon: ShieldAlert,
    description: 'We run digital checks covering sealing stability, thread pitch tolerances, and torque retention indexes.',
  },
  {
    title: 'Export Compliance',
    subtitle: 'Global Logistics Accreditation',
    icon: FileCheck2,
    description: 'Accredited with customs export clearance certifications, matching global shipping and containerized transport criteria.',
  },
];

export default function Certifications() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50/20 via-transparent to-transparent dark:from-slate-950/40 dark:via-slate-900/20 dark:to-transparent border-t border-slate-100 dark:border-slate-800/60 z-10 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#40A4D6]/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#6EC482]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl font-bold text-text-dark dark:text-white">
            International Compliance
          </h2>
          <p className="text-xs text-text-light dark:text-slate-400 font-light">
            Ensuring our closures meet global manufacturing quality, official registration, and food-safe packaging criteria.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {certificationsData.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-5 border border-primary-blue/5 hover:border-primary-blue/20 dark:hover:border-primary-green/20 space-y-4"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-blue/10 dark:bg-primary-green/10 flex items-center justify-center text-primary-blue dark:text-primary-green shrink-0">
                <cert.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-text-dark dark:text-white leading-tight">
                  {cert.title}
                </h3>
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {cert.subtitle}
                </span>
              </div>
              <p className="text-xs text-text-light dark:text-slate-400 font-light leading-relaxed">
                {cert.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Certificate Images Section */}
        <div className="mt-16">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                src: '/images/certificate_iso9001.png',
                alt: 'ISO 9001:2015 Registration Certificate',
                title: 'ISO 9001:2015 Certification'
              },
              {
                src: '/images/certificate_fda.png',
                alt: 'US FDA Food Grade Compliance Certificate',
                title: 'FDA Food Contact Compliance'
              },
              {
                src: '/images/certificate_gmp.png',
                alt: 'GMP Good Manufacturing Practices Certificate',
                title: 'GMP Manufacturing Approval'
              }
            ].map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="group relative flex flex-col items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden p-4 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
                  <Image
                    src={cert.src}
                    alt={cert.alt}
                    fill
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h4 className="text-sm font-bold text-text-dark dark:text-white group-hover:text-primary-blue dark:group-hover:text-primary-green transition-colors duration-200">
                    {cert.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
