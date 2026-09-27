'use client';

import { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';

function ProjectsSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M5.4 3h13.2A2.4 2.4 0 0 1 21 5.4v13.2a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 18.6V5.4A2.4 2.4 0 0 1 5.4 3ZM9 4h2v5h9v2h-9v9H9v-9H4V9h5V4Z" 
        fill="currentColor"
      />
    </svg>
  );
}

function JourneySvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg">
      <path 
        fill="currentColor" 
        d="M6.5,17h9.55c0.245,1.694,1.688,3,3.45,3s3.205-1.306,3.45-3h2.55c1.223,0,2.239-0.884,2.454-2.046 C29.67,14.729,31,13.277,31,11.5s-1.33-3.229-3.046-3.454C27.739,6.884,26.723,6,25.5,6h-6.55c-0.245-1.694-1.688-3-3.45-3 s-3.205,1.306-3.45,3H9.95C9.705,4.306,8.262,3,6.5,3C4.567,3,3,4.567,3,6.5S4.567,10,6.5,10c1.762,0,3.205-1.306,3.45-3h2.101 c0.245,1.694,1.688,3,3.45,3s3.205-1.306,3.45-3h6.55c0.672,0,1.236,0.447,1.426,1.058C25.268,8.333,24,9.764,24,11.5 s1.268,3.167,2.926,3.442C26.736,15.553,26.172,16,25.5,16h-2.55c-0.245-1.694-1.688-3-3.45-3s-3.205,1.306-3.45,3H6.5 c-1.223,0-2.239,0.884-2.454,2.046C2.33,18.271,1,19.723,1,21.5s1.33,3.229,3.046,3.454C4.261,26.116,5.277,27,6.5,27h2.55 c0.245,1.694,1.688,3,3.45,3s3.205-1.306,3.45-3h6.101c0.245,1.694,1.688,3,3.45,3c1.933,0,3.5-1.567,3.5-3.5S27.433,23,25.5,23 c-1.762,0-3.205,1.306-3.45,3H15.95c-0.245-1.694-1.688-3-3.45-3s-3.205,1.306-3.45,3H6.5c-0.672,0-1.236-0.447-1.426-1.058 C6.732,24.667,8,23.236,8,21.5s-1.268-3.167-2.926-3.442C5.264,17.447,5.828,17,6.5,17z M6.5,8C5.673,8,5,7.327,5,6.5S5.673,5,6.5,5 S8,5.673,8,6.5S7.327,8,6.5,8z M15.5,8C14.673,8,14,7.327,14,6.5S14.673,5,15.5,5S17,5.673,17,6.5S16.327,8,15.5,8z M26,11.5 c0-0.827,0.673-1.5,1.5-1.5s1.5,0.673,1.5,1.5S28.327,13,27.5,13S26,12.327,26,11.5z M19.5,15c0.827,0,1.5,0.673,1.5,1.5 S20.327,18,19.5,18S18,17.327,18,16.5S18.673,15,19.5,15z M25.5,25c0.827,0,1.5,0.673,1.5,1.5S26.327,28,25.5,28S24,27.327,24,26.5 S24.673,25,25.5,25z M12.5,25c0.827,0,1.5,0.673,1.5,1.5S13.327,28,12.5,28S11,27.327,11,26.5S11.673,25,12.5,25z M6,21.5 C6,22.327,5.327,23,4.5,23S3,22.327,3,21.5S3.673,20,4.5,20S6,20.673,6,21.5z"
      />
    </svg>
  );
}

function StackSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10l8 4 8-4v2l-8 4-8-4v-2zm0-4l8 4 8-4v2l-8 4-8-4V6zm8-6l8 4-8 4-8-4 8-4z" fillRule="evenodd" />
    </svg>
  );
}

function TestimonialsSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 478.248 478.248" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M456.02,44.821H264.83c-12.26,0-22.232,9.972-22.232,22.229v98.652c0,12.258,9.974,22.23,22.232,22.23h16.787v39.161 c0,2.707,1.58,5.165,4.043,6.292c0.92,0.42,1.901,0.627,2.875,0.627c1.631,0,3.244-0.576,4.523-1.685l51.383-44.396h111.576 c12.26,0,22.23-9.973,22.23-22.23V67.05C478.25,54.792,468.277,44.821,456.02,44.821z M319.922,112.252l-10.209,9.953 l2.41,14.054c0.174,1.015-0.242,2.038-1.076,2.643c-0.469,0.342-1.027,0.516-1.588,0.516c-0.428,0-0.861-0.103-1.256-0.31 l-12.621-6.635l-12.619,6.635c-0.912,0.478-2.016,0.398-2.848-0.206s-1.248-1.628-1.074-2.643l2.41-14.054l-10.211-9.953 c-0.734-0.718-1.002-1.792-0.685-2.769c0.317-0.978,1.164-1.691,2.183-1.839l14.11-2.05l6.31-12.786 c0.457-0.923,1.396-1.507,2.424-1.507s1.969,0.584,2.422,1.507l6.312,12.786l14.107,2.05c1.02,0.148,1.863,0.861,2.184,1.839 C320.924,110.46,320.658,111.535,319.922,112.252z M384.766,112.252l-10.211,9.953l2.412,14.054 c0.172,1.015-0.244,2.038-1.076,2.643c-0.469,0.342-1.025,0.516-1.588,0.516c-0.43,0-0.859-0.103-1.26-0.31l-12.619-6.635 l-12.619,6.635c-0.912,0.478-2.014,0.398-2.846-0.206c-0.834-0.604-1.25-1.628-1.076-2.643l2.41-14.054l-10.209-9.953 c-0.734-0.718-1.002-1.792-0.684-2.769c0.316-0.978,1.16-1.691,2.182-1.839l14.109-2.05l6.311-12.786 c0.455-0.923,1.396-1.507,2.422-1.507c1.029,0,1.967,0.584,2.422,1.507l6.312,12.786l14.109,2.05 c1.021,0.148,1.863,0.861,2.182,1.839C385.768,110.46,385.5,111.535,384.766,112.252z M449.607,112.252l-10.211,9.953 l2.408,14.054c0.176,1.015-0.238,2.038-1.072,2.643c-0.471,0.342-1.027,0.516-1.59,0.516c-0.43,0-0.859-0.103-1.258-0.31 l-12.621-6.635l-12.621,6.635c-0.908,0.478-2.012,0.398-2.844-0.206c-0.834-0.604-1.248-1.628-1.076-2.643l2.412-14.054 l-10.211-9.953c-0.734-0.718-1-1.792-0.684-2.769c0.316-0.978,1.164-1.691,2.182-1.839l14.111-2.05l6.311-12.786 c0.453-0.923,1.395-1.507,2.42-1.507c1.027,0,1.971,0.584,2.426,1.507L434,105.594l14.109,2.05 c1.018,0.148,1.861,0.861,2.182,1.839C450.609,110.46,450.344,111.535,449.607,112.252z"/> <path d="M152.844,112.924c-46.76,0-72.639,24.231-72.166,70.921c0.686,63.947,27.859,102.74,72.166,102.063 c0,0,72.131,2.924,72.131-102.063C224.975,137.155,200.605,112.924,152.844,112.924z"/> <path d="M280.428,334.444l-72.074-28.736l-16.877-14.223c-4.457-3.766-11.041-3.488-15.178,0.621l-23.463,23.336l-23.533-23.342 c-4.137-4.104-10.713-4.369-15.164-0.615l-16.881,14.223l-72.074,28.739C1.975,343.69,1.995,425.884,0,433.427h305.646 C303.656,425.9,303.646,343.679,280.428,334.444z"/>
    </svg>
  );
}

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('about');
  const [isVisible, setIsVisible] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipX, setTooltipX] = useState<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const navItems = [
    { label: 'About', href: '#about', icon: User },
    { label: 'Stack', href: '#stack', icon: StackSvg },
    { label: 'Projects', href: '#projects', icon: ProjectsSvg },
    { label: 'Journey', href: '#experience', icon: JourneySvg },
    { label: 'Testimonials', href: '#testimonials', icon: TestimonialsSvg },
  ];

  useEffect(() => {
    let prevY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // Auto-hide logic
      if (currentY <= 60) {
        setIsVisible(true);
      } else if (currentY > prevY && currentY > 100) {
        setIsVisible(false);
      } else if (currentY < prevY) {
        setIsVisible(true);
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

  const handleMouseEnter = (index: number) => {
    const navEl = navRef.current;
    const itemEl = itemRefs.current[index];
    if (!navEl || !itemEl) return;

    const navRect = navEl.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();

    setTooltipX(itemRect.left - navRect.left + itemRect.width / 2);
    setHoveredIndex(index);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <header 
      className={`fixed top-5 sm:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <div 
        ref={navRef}
        className="relative"
        onMouseLeave={handleMouseLeave}
      >
        <nav className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-black/80 ring-1 ring-white/5">
          {navItems.map((item, index) => {
            const sectionId = item.href.substring(1);
            const isActive = activeSection === sectionId;
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                ref={(el) => { itemRefs.current[index] = el; }}
                href={item.href}
                onMouseEnter={() => handleMouseEnter(index)}
                className={`relative p-2.5 sm:p-3 rounded-full transition-colors duration-200 flex items-center justify-center group z-10 ${
                  isActive
                    ? 'text-white bg-zinc-800/90 shadow-md ring-1 ring-white/10'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:scale-110" />
              </a>
            );
          })}
        </nav>

        {/* Ultra-Smooth GPU-Accelerated Hardware Tooltip */}
        <div
          className="absolute top-full mt-2 left-0 pointer-events-none z-50 will-change-transform"
          style={{
            transform: `translate3d(${tooltipX}px, 0, 0)`,
            transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            className={`-translate-x-1/2 flex flex-col items-center transition-all duration-200 ease-out ${
              isHovered && hoveredIndex !== null
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-75 -translate-y-1.5'
            }`}
          >
            {/* Arrow Notch */}
            <div className="w-2 h-2 -mb-1 rotate-45 bg-zinc-900 border-t border-l border-zinc-700/90 shadow-sm" />
            
            {/* Label Pill */}
            <div className="px-3 py-1 rounded-xl bg-zinc-900/95 border border-zinc-700/90 text-[11px] font-semibold tracking-wide text-zinc-100 shadow-2xl backdrop-blur-md whitespace-nowrap">
              {hoveredIndex !== null ? navItems[hoveredIndex].label : ''}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
