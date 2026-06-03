'use client';
 
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
 
const carouselImages = [
  {
    src: '/images/factory_molding.png',
    alt: 'Injection Molding Production Floor',
    title: 'Precision & Efficiency in Every Production Run',
    description: 'Our state-of-the-art manufacturing facility ensures seamless mass production with high-speed automation and quality control at every stage. From concept to large-scale manufacturing, we deliver customized plastic components with consistency, efficiency, and industry-leading standards.',
  },
  {
    src: '/images/factory_automation.png',
    alt: 'Automated Assembly and Defect Sorting',
    title: 'High-Speed Automated Assembly Lines',
    description: 'Equipped with machine-vision sensors and automated cap lining machinery, our systems process up to 600 components per minute with zero human error, ensuring consistent thread calibration.',
  },
  {
    src: '/images/factory_pallet.png',
    alt: 'Clean Packaging Palletizing operations',
    title: 'Hygienic Clean-Room Packaging',
    description: 'Finished products are packed inside dust-free clean environments using anti-static food-grade bag liners and automated carton strapping, ready for international sea-worthy freight shipping.',
  },
  {
    src: '/images/factory_warehouse.png',
    alt: 'Rajkot Logistics and Storage Hub',
    title: 'Integrated High-Capacity Storage',
    description: 'Our integrated 25,000+ sq. ft. warehousing center in Rajkot handles high-volume inventory management with real-time tracking, ensuring secure and on-time shipment distribution.',
  },
];
 
export default function InfrastructureSection() {
  const [activeIndex, setActiveIndex] = useState(0);
 
  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
 
  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1));
  };
 
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };
 
  const handleScrollToSection = (sectionId: string) => {
    const event = new CustomEvent('scroll-to-section', {
      detail: { targetId: sectionId },
    });
    window.dispatchEvent(event);
  };
 
  return (
    <section
      id="infrastructure"
      className="py-20 lg:py-28 relative overflow-hidden bg-slate-50/40 dark:bg-slate-900/20 border-y border-slate-200/20 dark:border-slate-800/20 z-10"
    >
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#40A4D6]/10 rounded-full blur-[80px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#6EC482]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Banner Block with Overlay Text */}
        <div className="relative rounded-3xl overflow-hidden glass-card shadow-xl border border-slate-200/10">
          <div className="relative w-full aspect-[21/9] md:aspect-[21/6]">
            <Image
              src="/images/infrastructure_banner.png"
              alt="Tailored Mold Development"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Text & Button Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent dark:from-slate-950/95 dark:via-slate-950/70 dark:to-transparent flex items-center">
            <div className="max-w-xl md:max-w-2xl px-6 md:px-12 space-y-4 md:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-dark dark:text-white uppercase leading-tight">
                Tailored Mold <br className="hidden sm:block" /> Development & <br className="hidden sm:block" /> Manufacturing
              </h2>
              <p className="text-[10px] sm:text-xs md:text-sm text-text-light dark:text-slate-300 font-light max-w-md leading-relaxed">
                We design and produce innovative closures that meet your specific product challenges. With in-house mold development and advanced manufacturing, we ensure precision, durability, and cost-effectiveness for custom packaging solutions.
              </p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                <button
                  onClick={() => handleScrollToSection('products')}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[10px] md:text-xs tracking-wider rounded-xl uppercase transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md shadow-orange-600/20 cursor-pointer"
                >
                  View Products
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('innovative-solutions');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 font-bold text-[10px] md:text-xs tracking-wider uppercase underline underline-offset-4 cursor-pointer"
                >
                  Explore Our Products
                </button>
              </div>
            </div>
          </div>
        </div>
 
        {/* Innovative Solutions Section (Split-screen) */}
        <div id="innovative-solutions" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: text & checklist */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-dark dark:text-white uppercase leading-tight">
              Innovative Solutions for Your <span className="text-orange-600 dark:text-orange-500">Unique Packaging Needs</span>
            </h3>
            <p className="text-sm text-text-light dark:text-slate-400 font-light leading-relaxed">
              With advanced injection and blow molding capabilities and an in-house tool room for mold development, we provide end-to-end manufacturing solutions. From concept to production, we bring your ideas to life with precision and efficiency.
            </p>
            
            <div className="space-y-4 pt-2">
              
              <div className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-orange-600/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-dark dark:text-white">Custom Mold Development</h4>
                  <p className="text-xs text-text-light dark:text-slate-400 font-light mt-0.5 leading-relaxed">
                    We design and manufacture high-quality molds tailored to your unique product requirements.
                  </p>
                </div>
              </div>
 
              <div className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-orange-600/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-dark dark:text-white">Injection & Blow Molding</h4>
                  <p className="text-xs text-text-light dark:text-slate-400 font-light mt-0.5 leading-relaxed">
                    Our advanced machinery enables the production of a wide range of plastic components with superior quality.
                  </p>
                </div>
              </div>
 
              <div className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-orange-600/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-dark dark:text-white">Versatile Manufacturing</h4>
                  <p className="text-xs text-text-light dark:text-slate-400 font-light mt-0.5 leading-relaxed">
                    From closures and spouts to specialized plastic parts, we cater to diverse industry needs.
                  </p>
                </div>
              </div>
 
              <div className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-orange-600/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-dark dark:text-white">Complete Development Support</h4>
                  <p className="text-xs text-text-light dark:text-slate-400 font-light mt-0.5 leading-relaxed">
                    We offer expert guidance from design optimization to full-scale production for cost-effective and innovative solutions.
                  </p>
                </div>
              </div>
 
              <div className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-orange-600/10 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-dark dark:text-white">End-to-End Solutions</h4>
                  <p className="text-xs text-text-light dark:text-slate-400 font-light mt-0.5 leading-relaxed">
                    From mold development to production and final delivery, we manage the entire process to ensure seamless execution and on-time supply.
                  </p>
                </div>
              </div>
 
            </div>
          </div>
 
          {/* Right Column: jerry cans stack photo */}
          <div className="lg:col-span-5 relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-600/20 to-primary-blue/20 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card p-1">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/packaging_solutions.png"
                  alt="Packaging containers and jerry cans"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
 
        </div>
 
        {/* Certified Quality Subsection (Grid) */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-dark dark:text-white">
              Certified Quality Through In-House Testing
            </h3>
            <p className="text-text-light dark:text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              Our advanced in-house testing facility performs rigorous scientific quality evaluations to verify leak tightness, chemical durability, and application reliability.
            </p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Lab Image 1 */}
            <div className="group glass-card rounded-3xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/testing_chemical.png"
                  alt="Chemical Compatibility Testing"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 bg-white/50 dark:bg-slate-900/40">
                <h4 className="text-base font-bold text-text-dark dark:text-white">Chemical Compatibility</h4>
                <p className="text-xs text-text-light dark:text-slate-400 font-light leading-relaxed">
                  Closures are submerged in aggressive chemicals (such as Xylene, Toluene, MEK, MIBK) inside testing jars to verify zero material softening, swelling, or active migration.
                </p>
              </div>
            </div>
 
            {/* Lab Image 2 */}
            <div className="group glass-card rounded-3xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/testing_pressure.png"
                  alt="Pressure and Vacuum Leak Testing"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 bg-white/50 dark:bg-slate-900/40">
                <h4 className="text-base font-bold text-text-dark dark:text-white">Vacuum & Leakage Control</h4>
                <p className="text-xs text-text-light dark:text-slate-400 font-light leading-relaxed">
                  Rigorous vacuum and pressure-tightness checks are performed to ensure closures hold pressure boundaries without gas escaping or liquid leaking under strain.
                </p>
              </div>
            </div>
 
            {/* Lab Image 3 */}
            <div className="group glass-card rounded-3xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src="/images/testing_torque.png"
                  alt="Torque Release Testing"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-2 bg-white/50 dark:bg-slate-900/40">
                <h4 className="text-base font-bold text-text-dark dark:text-white">Torque Verification</h4>
                <p className="text-xs text-text-light dark:text-slate-400 font-light leading-relaxed">
                  Application torque and unscrewing torque boundaries are verified using automated sensors to guarantee a tight seal that is still easy for consumers to open.
                </p>
              </div>
            </div>
 
          </div>
        </div>
 
        {/* Precision Engineering Carousel */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text-dark dark:text-white">
              Precision Engineering for Reliable and Efficient Production
            </h3>
            <p className="text-text-light dark:text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              SV Closures utilizes high-speed automation and precise engineering setups to run mass-production operations with maximum accuracy and consistent quality output.
            </p>
          </div>
 
          {/* Interactive Carousel Frame */}
          <div className="relative group max-w-5xl mx-auto w-full rounded-3xl overflow-hidden shadow-2xl bg-slate-950 aspect-[16/10] md:aspect-[21/9]">
            
            {/* Active Slide Image */}
            <div className="relative w-full h-full">
              <Image
                src={carouselImages[activeIndex].src}
                alt={carouselImages[activeIndex].alt}
                fill
                className="object-cover transition-all duration-700 ease-in-out"
              />
              {/* Dim Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />
            </div>
 
            {/* Left Arrow Button */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/40 dark:hover:bg-slate-900/60 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-20 animate-pulse"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
 
            {/* Right Arrow Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/40 dark:hover:bg-slate-900/60 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer z-20 animate-pulse"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
 
            {/* Overlaid Banner at Bottom-Left (matching fifth photo) */}
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 right-6 md:right-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl rounded-2xl p-5 md:p-6 max-w-md border border-slate-200/20 z-10 transition-all duration-500">
              <h4 className="text-xs md:text-sm font-extrabold text-text-dark dark:text-white leading-tight mb-2 uppercase">
                {carouselImages[activeIndex].title}
              </h4>
              <p className="text-[10px] md:text-xs text-text-light dark:text-slate-400 font-light leading-relaxed">
                {carouselImages[activeIndex].description}
              </p>
            </div>
 
            {/* Dots Indicator Overlay */}
            <div className="absolute bottom-4 right-6 flex items-center gap-2 z-20">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? 'bg-orange-600 w-6'
                      : 'bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
 
          </div>
        </div>
 
      </div>
    </section>
  );
}
