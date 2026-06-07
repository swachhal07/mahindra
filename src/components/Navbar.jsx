import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import mahindraLogo from '../assets/mahindra-logo-03-freelogovectors.net_-640x400.png';
import { useT } from '../utils/i18n';

export default function Navbar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);
  const [navHovered, setNavHovered] = useState(false);
  const lastScrollY = React.useRef(0);
  const t = useT();

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 40);
      setHidden(current > lastScrollY.current && current > 80);
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On page change, make sure the navbar is visible and the scroll baseline
  // is reset — otherwise it stays hidden (stale state from the previous page).
  useEffect(() => {
    setHidden(false);
    setScrolled(false);
    setCtaHovered(false);
    setNavHovered(false);
    lastScrollY.current = 0;
  }, [currentPage]);

  const navItems = [
    { id: 'home', labelKey: 'nav.home' },
    { id: 'showcase', labelKey: 'nav.showcase' },
    { id: 'blog', labelKey: 'nav.blog' },
    { id: 'about', labelKey: 'nav.about' },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsOpen(false);
  };

  const useDarkContent = currentPage !== 'home' || navHovered;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
      style={
        currentPage !== 'home' || navHovered
          ? { background: '#ffffff', borderBottom: '1px solid #e5e5e5', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }
          : {
              background: scrolled ? 'rgba(240, 240, 248, 0.25)' : 'transparent',
              backdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'none',
              WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(200%)' : 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.12)' : 'none',
            }
      }
    >
      <div className="w-full px-6 lg:px-10">
        <div className="relative flex items-center justify-between h-[88px] gap-8">


          {(() => {
            const half = Math.ceil(navItems.length / 2);
            const leftItems = navItems.slice(0, half);
            const rightItems = navItems.slice(half);
            const renderLink = (item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 text-lg font-semibold tracking-wide transition-colors duration-200 rounded-md whitespace-nowrap ${
                  useDarkContent
                    ? currentPage === item.id
                      ? 'text-gray-950'
                      : 'text-gray-500 hover:text-gray-900'
                    : currentPage === item.id
                      ? 'text-white'
                      : 'text-white hover:text-white/80'
                }`}
              >
                {t(item.labelKey)}
                {currentPage === item.id && (
                  <span
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: 'rgb(221, 5, 44)' }}
                  />
                )}
              </button>
            );
            return (
              <>
                {/* LEFT — first half of nav links, ending at fixed distance from logo */}
                <div
                  className="hidden md:flex flex-1 items-center justify-end gap-2 pr-[120px]"
                  onMouseEnter={() => setNavHovered(true)}
                  onMouseLeave={() => setNavHovered(false)}
                >
                  {leftItems.map(renderLink)}
                </div>

                {/* CENTER — Logo (absolutely centered) */}
                <div
                  className="flex items-center gap-3 cursor-pointer select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  onClick={() => handleNavClick('home')}
                >
                  <div className="h-20 flex items-center justify-center flex-shrink-0">
                    <img
                      src={mahindraLogo}
                      alt="Mahindra Logo"
                      className={`h-20 w-auto object-contain filter brightness-0 ${useDarkContent ? '' : 'invert'}`}
                    />
                  </div>
                </div>

                {/* RIGHT-OF-LOGO — second half of nav links, starting at fixed distance from logo */}
                <div
                  className="hidden md:flex flex-1 items-center justify-start gap-2 pl-[120px]"
                  onMouseEnter={() => setNavHovered(true)}
                  onMouseLeave={() => setNavHovered(false)}
                >
                  {rightItems.map(renderLink)}
                </div>
              </>
            );
          })()}

          {/* RIGHT — Contact Us CTA (absolutely positioned so the two flex
              halves remain perfectly symmetric around the centered logo) */}
          <div className="hidden md:flex items-center gap-3 absolute right-0 top-1/2 -translate-y-1/2">
            {(() => {
              const ctaStyle = ctaHovered
                ? { background: 'rgb(221, 5, 44)', border: '1px solid rgb(221, 5, 44)', color: 'white' }
                : useDarkContent
                  ? { background: 'transparent', border: '1px solid rgba(0,0,0,0.3)', color: '#111' }
                  : { background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.6)', color: 'white' };
              return (
                <button
                  id="nav-cta-contact"
                  onClick={() => handleNavClick('booking')}
                  onMouseEnter={() => setCtaHovered(true)}
                  onMouseLeave={() => setCtaHovered(false)}
                  className="text-lg font-bold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-100"
                  style={ctaStyle}
                >
                  {t('nav.contact')}
                </button>
              );
            })()}

          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex justify-end ml-auto">
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                useDarkContent
                  ? 'text-gray-700 hover:text-gray-900 hover:bg-black/5'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
              aria-expanded={isOpen}
            >
              <span className="sr-only">Toggle menu</span>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
          background: '#ffffff',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
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
                  ? 'text-gray-950 bg-black/5 border-l-2'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
              }`}
              style={currentPage === item.id ? { borderLeftColor: 'rgb(221, 5, 44)' } : {}}
            >
              {t(item.labelKey)}
            </button>
          ))}
          <div className="pt-3 pb-1 flex flex-col gap-2">
            <button
              id="nav-mobile-cta-contact"
              onClick={() => handleNavClick('booking')}
              className="w-full text-center text-gray-900 py-3 rounded-full text-sm font-bold tracking-wide bg-transparent border border-gray-800 hover:bg-gray-900 hover:text-white transition-colors duration-200"
            >
              {t('nav.contact')}
            </button>
          </div>
        </div>
      </div>

    </nav>
  );
}
