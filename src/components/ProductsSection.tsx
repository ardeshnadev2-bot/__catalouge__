'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, MessageSquare, ShieldCheck, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  image: string;
  categories: string[];
  material: string;
  closureType: string;
  tamperEvidence: string;
  diameter: string;
  application: string;
  specifications: string[];
}

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'flip-top', name: 'Flip Top Caps' },
  { id: 'spout', name: 'Spout Closures' },
  { id: 'tamper-evident', name: 'Tamper Evident Caps' },
  { id: 'screw-cap', name: 'Screw Caps' },
  { id: 'food-grade', name: 'Food Grade Closures' },
  { id: 'pharma', name: 'Pharmaceutical Closures' },
  { id: 'oil-bottle', name: 'Oil Bottle Caps' },
  { id: 'jerry-can', name: 'Jerry Can Closures' },
  { id: 'custom', name: 'Custom Closures' },
];

const productsData: Product[] = [
  {
    id: 'sv-32-spout',
    name: 'SV 32mm Press-Fit Spout Cap',
    image: '/images/spout_cap.png',
    categories: ['spout', 'food-grade', 'oil-bottle', 'tamper-evident'],
    material: 'HDPE / LLDPE Virgin Polymer',
    closureType: 'Press-Fit Spout',
    tamperEvidence: 'Tear-Off Pull Ring + Outer Cap Seal',
    diameter: '32 mm',
    application: 'Edible Oil Bottles, Packaging Containers',
    specifications: ['High flow control', 'Dual lip leak prevention', 'Retractable design'],
  },
  {
    id: 'sv-42-spout',
    name: 'SV 42mm Press-Fit Spout Cap',
    image: '/images/spout_cap.png',
    categories: ['spout', 'jerry-can', 'oil-bottle', 'tamper-evident'],
    material: 'HDPE / LLDPE Virgin Polymer',
    closureType: 'Press-Fit Spout',
    tamperEvidence: 'Tear-Off Pull Ring + Inner Locking Ridges',
    diameter: '42 mm',
    application: 'Automotive Oils, Lubricants, Solvents',
    specifications: ['Antiglug venting', 'Chemical resistant liner', 'Heavy wall thickness'],
  },
  {
    id: 'sv-57-spout',
    name: 'SV 57mm Press-Fit Spout Cap',
    image: '/images/spout_cap.png',
    categories: ['spout', 'jerry-can', 'tamper-evident'],
    material: 'HDPE / LLDPE Virgin Polymer',
    closureType: 'Press-Fit Spout',
    tamperEvidence: 'Double Pull Ring + Snap Ring Lock',
    diameter: '57 mm',
    application: 'Jerry Cans, Medium Industrial Carboys',
    specifications: ['Vented pouring channel', 'Corrosive resistance', 'Impact drop-tested'],
  },
  {
    id: 'sv-42-crimp',
    name: 'SV 42mm Crimp-On Closure',
    image: '/images/crimp_closure.png',
    categories: ['tamper-evident', 'oil-bottle'],
    material: 'Metal Ring + Virgin Polypropylene',
    closureType: 'Crimp-On Fitment',
    tamperEvidence: 'Crimped Tin Base + Poly Tear Ring',
    diameter: '42 mm',
    application: 'Engine Oils, Lubricants, Automotive Cans',
    specifications: ['Anti-counterfeiting crimp', 'Metal-plastic hybrid bond', 'Hermetic sealing'],
  },
  {
    id: 'sv-63-crimp',
    name: 'SV 63mm Crimp-On Closure',
    image: '/images/crimp_closure.png',
    categories: ['tamper-evident', 'oil-bottle', 'jerry-can'],
    material: 'Metal Ring + Virgin Polypropylene',
    closureType: 'Crimp-On Fitment',
    tamperEvidence: 'Metal Crimped Ring + Snap Lid',
    diameter: '63 mm',
    application: 'Industrial Oils, Grease Containers',
    specifications: ['Heavy-duty sealing force', 'Weatherproof design', 'Puncture protection'],
  },
  {
    id: 'sv-24-screw',
    name: 'SV 24mm Rigid Screw Cap',
    image: '/images/screw_cap.png',
    categories: ['screw-cap', 'pharma', 'custom'],
    material: 'Polypropylene (PP)',
    closureType: 'Continuous Thread Screw Cap',
    tamperEvidence: 'No (Lined/Unlined Available)',
    diameter: '24 mm',
    application: 'Cosmetics, Pharma Liquids, Solvents',
    specifications: ['High ribbed grip', 'Custom torque matching', 'Wad liner options'],
  },
  {
    id: 'sv-57-screw',
    name: 'SV 57mm Rigid Jerrycan Cap',
    image: '/images/screw_cap.png',
    categories: ['screw-cap', 'jerry-can', 'tamper-evident'],
    material: 'High-Density Polyethylene (HDPE)',
    closureType: 'Internal Thread Screw Cap',
    tamperEvidence: 'Outer Tear-Away Band',
    diameter: '57 mm',
    application: 'Chemical Jerrycans, Concentrates',
    specifications: ['Integrated EPDM gasket', 'Deflection venting system', 'Child-resistant compatible'],
  },
  {
    id: 'sv-25-flip',
    name: 'SV 25mm Dispensing Flip-Top Cap',
    image: '/images/flip_top_cap.png',
    categories: ['flip-top', 'food-grade', 'pharma', 'custom'],
    material: 'Polypropylene (PP)',
    closureType: 'Hinged Flip-Top',
    tamperEvidence: 'No (Pressure Induction Lined)',
    diameter: '25 mm',
    application: 'Sanitizers, Shampoos, Condiment Bottles',
    specifications: ['Snap-close hinge', 'Zero-clog orifice', 'Spill-free travel locking'],
  },
  {
    id: 'sv-custom',
    name: 'Bespoke Brand Closure Mold',
    image: '/images/logo.png',
    categories: ['custom'],
    material: 'HDPE / PP / Custom Polymers',
    closureType: 'Custom Spec Tooling',
    tamperEvidence: 'Tailored to Specifications',
    diameter: '18mm to 110mm',
    application: 'Unique Packaging, Brand Differentiated Caps',
    specifications: ['Custom embossed logos', 'Pantone color matching', 'Advanced hot runner tooling'],
  },
];

export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return productsData;
    return productsData.filter((product) => product.categories.includes(activeCategory));
  }, [activeCategory]);

  const handleEnquire = (productName: string) => {
    // Send customized event to ContactForm
    const event = new CustomEvent('select-product', { detail: productName });
    window.dispatchEvent(event);

    // Scroll to contact form
    const element = document.getElementById('contact');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleDownloadPDF = (product: Product) => {
    setDownloadingId(product.id);
    
    // Simulate high-fidelity client-side PDF generate & print
    setTimeout(() => {
      setDownloadingId(null);
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>SV Closures - Specification Sheet: ${product.name}</title>
              <style>
                body { font-family: 'Inter', sans-serif; padding: 40px; color: #1E2D3B; line-height: 1.5; }
                .header { border-bottom: 2px solid #40A4D6; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                .title { font-size: 24px; font-weight: bold; color: #1E2D3B; margin-top: 0; }
                .brand { font-size: 18px; color: #40A4D6; font-weight: bold; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
                .spec-group { border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px; }
                .spec-label { font-size: 12px; color: #5A6A7A; text-transform: uppercase; font-weight: bold; }
                .spec-value { font-size: 15px; font-weight: 600; margin-top: 4px; }
                .features { margin-bottom: 30px; }
                .features h3 { font-size: 16px; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; }
                .features ul { padding-left: 20px; }
                .footer { border-top: 1px solid #E2E8F0; padding-top: 20px; margin-top: 50px; font-size: 11px; color: #5A6A7A; text-align: center; }
              </style>
            </head>
            <body>
              <div class="header">
                <div>
                  <div class="brand">SV Closures Private Limited</div>
                  <div>Rajkot, Gujarat, India</div>
                </div>
                <div class="title">Product Data Sheet</div>
              </div>
              
              <h2>${product.name}</h2>
              
              <div class="grid">
                <div class="spec-group">
                  <div class="spec-label">Material composition</div>
                  <div class="spec-value">${product.material}</div>
                </div>
                <div class="spec-group">
                  <div class="spec-label">Closure mechanism</div>
                  <div class="spec-value">${product.closureType}</div>
                </div>
                <div class="spec-group">
                  <div class="spec-label">Tamper Evidence</div>
                  <div class="spec-value">${product.tamperEvidence}</div>
                </div>
                <div class="spec-group">
                  <div class="spec-label">Nominal diameter</div>
                  <div class="spec-value">${product.diameter}</div>
                </div>
                <div class="spec-group">
                  <div class="spec-label">Target industry application</div>
                  <div class="spec-value">${product.application}</div>
                </div>
              </div>
              
              <div class="features">
                <h3>Key Mechanical Performance Properties</h3>
                <ul>
                  ${product.specifications.map(s => `<li>${s}</li>`).join('')}
                </ul>
              </div>
              
              <p>For custom mold scaling, exact dimensional blueprints, or bulk container sizing assessments, contact <strong>info@svclosures.com</strong>.</p>
              
              <div class="footer">
                SV Closures Private Limited © ${new Date().getFullYear()} • ISO 9001:2015 Quality Assured • www.svclosures.com
              </div>
              <script>window.print();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }, 1200);
  };

  return (
    <section id="products" className="py-20 lg:py-28 relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-dark dark:text-white">
            Our Premium Product Range
          </h2>
          <p className="text-text-light dark:text-slate-400 font-light max-w-2xl mx-auto">
            Explore our industrial polymer closures. Sourced with virgin food-grade resins, each model has been drop-tested, seal-rated, and customized to global shipping specifications.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-5xl mx-auto">
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-primary-blue to-primary-green border-transparent text-white shadow-md shadow-primary-blue/15'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-text-light dark:text-slate-400 hover:border-primary-blue dark:hover:border-primary-green hover:text-text-dark dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Products Grid Layout */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((prod) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={prod.id}
                className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:shadow-primary-blue/5 dark:hover:shadow-primary-green/5 dark:hover:border-primary-green/20 hover:border-primary-blue/20"
              >
                {/* Product Image Area */}
                <div className="h-60 relative w-full bg-slate-100/50 dark:bg-slate-950/20 flex items-center justify-center p-6 overflow-hidden border-b border-slate-100 dark:border-slate-800/80">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-blue/5 to-primary-green/5 pointer-events-none" />
                  
                  {prod.image && (
                    <div className="relative w-44 h-44 transition-transform duration-500 group-hover:scale-110">
                      <Image
                        src={prod.image}
                        alt={prod.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Info and Specifications Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-text-dark dark:text-white group-hover:text-primary-blue dark:group-hover:text-primary-green transition-colors duration-200 leading-snug">
                      {prod.name}
                    </h3>

                    {/* Spec List */}
                    <div className="space-y-2.5 text-xs text-text-light dark:text-slate-400">
                      <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                        <span className="font-semibold text-slate-400">Material</span>
                        <span className="font-medium text-right max-w-[180px] text-text-dark dark:text-slate-200">{prod.material}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                        <span className="font-semibold text-slate-400">Closure Type</span>
                        <span className="font-medium text-right max-w-[180px] text-text-dark dark:text-slate-200">{prod.closureType}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                        <span className="font-semibold text-slate-400">Tamper Evidence</span>
                        <span className="font-medium text-right max-w-[180px] text-text-dark dark:text-slate-200">{prod.tamperEvidence}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                        <span className="font-semibold text-slate-400">Diameter</span>
                        <span className="font-medium text-right text-text-dark dark:text-slate-200">{prod.diameter}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/40">
                        <span className="font-semibold text-slate-400">Application</span>
                        <span className="font-medium text-right max-w-[180px] text-text-dark dark:text-slate-200">{prod.application}</span>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2">
                    {prod.specifications.map((spec, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-text-light dark:text-slate-300">
                        <ShieldCheck className="w-4 h-4 text-primary-green shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                    <button
                      onClick={() => handleDownloadPDF(prod)}
                      disabled={downloadingId === prod.id}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-text-dark dark:text-slate-300 hover:border-primary-blue hover:text-primary-blue dark:hover:text-primary-green dark:hover:border-primary-green transition-all duration-200 disabled:opacity-50"
                    >
                      {downloadingId === prod.id ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
                          Printing...
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          Specs PDF
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleEnquire(prod.name)}
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-primary-blue to-primary-green text-white text-xs font-semibold shadow-md shadow-primary-blue/10 hover:shadow-lg transition-all duration-200"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Enquire Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
