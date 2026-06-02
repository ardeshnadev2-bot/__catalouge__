'use client';

import { useState, useEffect } from 'react';
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
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
      } else {
        setActiveTab('home');
      }
      // Scroll to top when changing tabs so the new section is seen from the start
      window.scrollTo(0, 0);
    };

    handleHashChange(); // run on initial mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Tab-based Page Layout */}
      <main className="flex-grow pt-20">
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <ClienteleSection />
            <Testimonials />
          </>
        )}

        {activeTab === 'about' && (
          <>
            <AboutSection />
            <Certifications />
          </>
        )}

        {activeTab === 'products' && <ProductsSection />}

        {activeTab === 'industries' && <IndustriesSection />}

        {activeTab === 'infrastructure' && <InfrastructureSection />}

        {activeTab === 'sustainability' && <SustainabilitySection />}

        {activeTab === 'global-reach' && <GlobalReachMap />}

        {activeTab === 'gallery' && <GallerySection />}

        {activeTab === 'contact' && <ContactSection />}
      </main>

      {/* Footer Block */}
      <Footer />

      {/* WhatsApp Chat Floating Tool */}
      <WhatsAppButton />
    </>
  );
}
