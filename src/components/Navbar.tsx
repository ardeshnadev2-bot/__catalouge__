'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Products', href: '#products' },
  { name: 'Industries', href: '#industries' },
  { name: 'Infrastructure', href: '#infrastructure' },
  { name: 'Sustainability', href: '#sustainability' },
  { name: 'Global Reach', href: '#global-reach' },
  { name: 'Gallery', href: '#gallery' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // Add background blur when scrolled
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scroll Spy logic
      const sections = ['home', 'about', 'products', 'industries', 'infrastructure', 'sustainability', 'global-reach', 'gallery', 'contact'];
      const scrollPosition = window.scrollY + 100; // offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Scroll to hash on page load (e.g. from shared link)
    const initialHash = window.location.hash;
    if (initialHash) {
      setTimeout(() => {
        const targetId = initialHash.replace('#', '');
        const element = document.getElementById(targetId);
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
      }, 600);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80; // height of fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Update URL hash
      window.history.pushState(null, '', href);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav py-3 shadow-sm' : 'bg-transparent py-5'
      }`}
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" onClick={(e) => handleLinkClick(e, '#home')} className="flex items-center">
              <div className="relative h-12 w-32 bg-white dark:bg-white rounded-lg p-1.5 transition-transform duration-300 hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="SV Closures Logo"
                  fill
                  className="object-contain p-0.5"
                  priority
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const active = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 relative group ${
                    active
                      ? 'text-primary-blue dark:text-primary-green font-semibold'
                      : 'text-text-dark dark:text-slate-300 hover:text-primary-blue dark:hover:text-primary-green'
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2px] bg-primary-green transition-transform duration-300 origin-left ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              );
            })}
          </div>

          {/* Theme Toggle & Contact Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeToggle />
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-blue to-primary-green hover:from-primary-green hover:to-primary-blue text-white text-sm font-semibold tracking-wide shadow-md shadow-primary-blue/20 dark:shadow-primary-green/10 hover:shadow-lg transition-all duration-300 group"
              id="nav-contact-btn"
            >
              Contact Us
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* Mobile menu and toggle */}
          <div className="flex lg:hidden items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-dark dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ease-in-out transform ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className="absolute inset-0 bg-slate-900/30 dark:bg-slate-950/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Drawer contents */}
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between border-l border-slate-100 dark:border-slate-800/80 shadow-2xl">
          <div className="flex flex-col space-y-6 mt-16">
            {navLinks.map((link) => {
              const active = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-lg font-medium py-1 transition-colors ${
                    active
                      ? 'text-primary-blue dark:text-primary-green border-l-2 border-primary-green pl-2'
                      : 'text-text-dark dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
              className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl bg-gradient-to-r from-primary-blue to-primary-green text-white font-semibold shadow-md"
            >
              Contact Us
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
