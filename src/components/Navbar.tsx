'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('about');
  const [isVisible, setIsVisible] = useState(true);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Journey', href: '#experience' },
    { label: 'Stack', href: '#stack' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  useEffect(() => {
    let prevY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // Auto-hide logic
      if (currentY <= 60) {
        setIsVisible(true);
      } else if (currentY > prevY && currentY > 100) {
        setIsVisible(false); // Scroll down
      } else if (currentY < prevY) {
        setIsVisible(true); // Scroll up
      }
      prevY = currentY;

      // Active section detection
      const sections = navItems.map((item) => item.href.substring(1));
      const scrollPosition = currentY + 220;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[96vw] sm:max-w-fit px-2 transition-all duration-300 ease-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <nav className="flex items-center justify-between sm:justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-black/80 ring-1 ring-white/5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const sectionId = item.href.substring(1);
          const isActive = activeSection === sectionId;
          return (
            <a
              key={item.label}
              href={item.href}
              className={`relative whitespace-nowrap px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs md:text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white bg-zinc-800/90 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
