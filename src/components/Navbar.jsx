import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import mahindraLogo from '../assets/mahindra-logo-freelogovectors.net_.png';

export default function Navbar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'showcase', label: 'Vehicle Showcase' },
    { id: 'agri-tech', label: 'Agri-Tech Solutions' },
    { id: 'booking', label: 'Book Test Drive' },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(240, 240, 248, 0.25)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.30)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.12)' : 'none',
      }}
    >
      <div className="w-full px-6 lg:px-10">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-[68px] gap-8">


          {/* LEFT — Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none flex-shrink-0"
            onClick={() => handleNavClick('home')}
          >
            {/* Logo image */}
            <div className="h-12 flex items-center justify-center flex-shrink-0">
              <img
                src={mahindraLogo}
                alt="Mahindra Logo"
                className="h-11 w-auto object-contain filter brightness-0 invert"
              />
            </div>
            {/* Brand text */}
            <span className="text-white font-black text-2xl tracking-widest uppercase">
              Mahindra
            </span>
          </div>

          {/* CENTER — Nav Links */}
          <div className="hidden md:flex items-center justify-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 text-base font-semibold tracking-wide transition-colors duration-200 rounded-md whitespace-nowrap ${
                  currentPage === item.id
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/90'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: 'rgb(221, 5, 44)' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* RIGHT — Contact Us CTA */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <button
              id="nav-cta-contact"
              onClick={() => handleNavClick('booking')}
              className="text-white text-base font-bold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-100"
              style={{
                background: scrolled ? 'rgba(30, 30, 40, 0.85)' : 'rgba(255, 255, 255, 0.15)',
                border: scrolled ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgb(221, 5, 44)';
                e.currentTarget.style.border = '1px solid rgb(221, 5, 44)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = scrolled ? 'rgba(30, 30, 40, 0.85)' : 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.border = scrolled ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(255, 255, 255, 0.25)';
              }}
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex justify-end">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Toggle menu</span>
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          background: 'rgba(10, 10, 15, 0.92)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                currentPage === item.id
                  ? 'text-white bg-white/10 border-l-2'
                  : 'text-white/55 hover:text-white hover:bg-white/5'
              }`}
              style={currentPage === item.id ? { borderLeftColor: 'rgb(221, 5, 44)' } : {}}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 pb-1 flex flex-col gap-2">
            <button
              id="nav-mobile-cta-contact"
              onClick={() => handleNavClick('booking')}
              className="w-full text-center text-white py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-200"
              style={{ background: 'rgb(221, 5, 44)', boxShadow: '0 4px 16px rgba(221, 5, 44, 0.4)' }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
}
