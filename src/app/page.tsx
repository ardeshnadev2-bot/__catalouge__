'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ClienteleSection from '@/components/ClienteleSection';
import AboutSection from '@/components/AboutSection';
import IndustriesSection from '@/components/IndustriesSection';
import ProductsSection from '@/components/ProductsSection';
import InfrastructureSection from '@/components/InfrastructureSection';
import SustainabilitySection from '@/components/SustainabilitySection';
import GlobalReachMap from '@/components/GlobalReachMap';
import Certifications from '@/components/Certifications';
import Testimonials from '@/components/Testimonials';
import GallerySection from '@/components/GallerySection';
import ContactSection from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function Home() {
  const [onlyProducts, setOnlyProducts] = useState(false);

  useEffect(() => {
    // 1. Initial URL hash check (safe for client side execution)
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#products' || hash === '#packaging') {
        setOnlyProducts(true);
      } else {
        setOnlyProducts(false);
      }
    };

    checkHash();

    // 2. Listen to URL hash change
    window.addEventListener('hashchange', checkHash);

    // 3. Listen to navigation events from Navbar/Hero
    const handleScrollToSection = (e: Event) => {
      const customEvent = e as CustomEvent<{ targetId: string }>;
      const targetId = customEvent.detail.targetId;
      
      if (targetId === 'products' || targetId === 'packaging') {
        setOnlyProducts(true);
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setOnlyProducts(false);
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    window.addEventListener('scroll-to-section', handleScrollToSection);

    // 4. Restore sections when selecting/enquiring a product (which scrolls to contact)
    const handleSelectProduct = () => {
      setOnlyProducts(false);
      setTimeout(() => {
        const el = document.getElementById('contact');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    };

    window.addEventListener('select-product', handleSelectProduct);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('scroll-to-section', handleScrollToSection);
      window.removeEventListener('select-product', handleSelectProduct);
    };
  }, []);

  return (
    <>
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Single Page Layout Sections */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {onlyProducts ? (
            <motion.div
              key="products-only-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <ProductsSection />
            </motion.div>
          ) : (
            <motion.div
              key="all-sections-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-0"
            >
              {/* 1. Hero Section & Statistics */}
              <HeroSection />

              {/* Clientele Showcase */}
              <ClienteleSection />

              {/* Our Exports Map */}
              <GlobalReachMap />

              {/* 3. Filterable Product Range & Dynamic PDF Spec sheets */}
              <ProductsSection />

              {/* 2. Legacy Introduction & Key Industrial Advantages */}
              <AboutSection />

              {/* 4. Target Industry Sectors Grid */}
              <IndustriesSection />

              {/* 5. Automated Factory Showcase & Metrics */}
              <InfrastructureSection />

              {/* 6. Green Sustainability Commitment */}
              <SustainabilitySection />

              {/* 8. Compliance & Accreditation Badges */}
              <Certifications />

              {/* 9. Verified Customer Reviews */}
              <Testimonials />

              {/* 10. Masonry Operation Gallery Grid */}
              <GallerySection />

              {/* 11. Custom Pre-filled Enquiry Contact Form */}
              <ContactSection />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Block */}
      <Footer />

      {/* WhatsApp Chat Floating Tool */}
      <WhatsAppButton />
    </>
  );
}
