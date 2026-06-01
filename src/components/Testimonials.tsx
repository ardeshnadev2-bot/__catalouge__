'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  name: string;
  company: string;
  country: string;
  review: string;
}

const testimonialsData: Testimonial[] = [
  {
    name: 'Giovanni Rossi',
    company: 'AgriOil SpA',
    country: 'Italy',
    review: "SV Closures has been our primary spout cap vendor for our premium olive oil exports. The leak-proof integrity of their 32mm pull-ring caps is exceptional, resulting in zero claims during marine transport.",
  },
  {
    name: 'Ahmad Al-Mansoori',
    company: 'Gulf Lubricants Ltd',
    country: 'UAE',
    review: "The custom crimp-on caps we co-developed with their mold facility matched our specifications exactly. Their high-capacity lines delivered 2 million units within four weeks. Remarkable supply chain efficiency.",
  },
  {
    name: 'Dr. Robert H.',
    company: 'VeloPharma GmbH',
    country: 'Germany',
    review: "We require strict FDA virgin resin compliance for our pharmaceutical screw caps. SV Closures provided complete chemical migration analysis sheets, making audits seamless. Their quality control laboratory is top-tier.",
  },
  {
    name: 'Sarah Jenkins',
    company: 'EcoPack Packaging',
    country: 'Canada',
    review: "Our industrial clients demand high torque retention on Jerry can plugs. Since switching to SV Closures, capping line breakages dropped by 40%. Their thread tolerances are incredibly consistent.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden z-10 border-t border-slate-800">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(64,164,214,0.06),transparent)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <Quote className="w-12 h-12 text-primary-blue/30 dark:text-primary-green/30 mx-auto mb-6 shrink-0" />
        
        {/* Title */}
        <div className="mb-12 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Client Testimonials
          </h2>
          <p className="text-xs text-slate-400 font-light max-w-md mx-auto">
            What international packaging partners say about our quality consistency, mold tooling speed, and export deliveries.
          </p>
        </div>

        {/* Testimonial slider window */}
        <div className="min-h-[220px] sm:min-h-[180px] relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Star Rating */}
              <div className="flex justify-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-base sm:text-lg text-slate-200 font-light leading-relaxed max-w-2xl mx-auto italic">
                &quot;{testimonialsData[currentIndex].review}&quot;
              </p>

              {/* Customer ID details */}
              <div>
                <span className="block text-sm font-extrabold text-white">
                  {testimonialsData[currentIndex].name}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5 block">
                  {testimonialsData[currentIndex].company} • {testimonialsData[currentIndex].country}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Arrows */}
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-slate-800 hover:border-primary-blue hover:text-primary-blue flex items-center justify-center transition-colors bg-slate-950/60"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Bullet Indicators */}
          <div className="flex gap-2">
            {testimonialsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'bg-primary-blue w-6' : 'bg-slate-700'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-slate-800 hover:border-primary-blue hover:text-primary-blue flex items-center justify-center transition-colors bg-slate-950/60"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
