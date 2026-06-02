import { Navbar } from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
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
  return (
    <>
      {/* Global Navigation Bar */}
      <Navbar />

      {/* Main Single Page Layout Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section & Statistics */}
        <HeroSection />

        {/* 2. Legacy Introduction & Key Industrial Advantages */}
        <AboutSection />

        {/* 3. Filterable Product Range & Dynamic PDF Spec sheets */}
        <ProductsSection />

        {/* 4. Target Industry Sectors Grid */}
        <IndustriesSection />

        {/* 5. Automated Factory Showcase & Metrics */}
        <InfrastructureSection />

        {/* 6. Green Sustainability Commitment */}
        <SustainabilitySection />

        {/* 7. Interactive Global Presence Map & Arcs */}
        <GlobalReachMap />

        {/* 8. Compliance & Accreditation Badges */}
        <Certifications />

        {/* 9. Verified Customer Reviews */}
        <Testimonials />

        {/* 10. Masonry Operation Gallery Grid */}
        <GallerySection />

        {/* 11. Custom Pre-filled Enquiry Contact Form */}
        <ContactSection />
      </main>

      {/* Footer Block */}
      <Footer />

      {/* WhatsApp Chat Floating Tool */}
      <WhatsAppButton />
    </>
  );
}
