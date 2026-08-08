import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Mail, MapPin, ChevronDown } from 'lucide-react';
import mahindraLogo from '../assets/mahindra-logo-03-freelogovectors-net_-640x400.png';
import dugarLogo from '../assets/dugar-logo.png';
import { useT } from '../utils/i18n';

export default function Navbar({ currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHovered, setNavHovered] = useState(false);
  const t = useT();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // On page change, reset the scrolled flag and transient hover state.
  useEffect(() => {
    setScrolled(false);
    setNavHovered(false);
  }, [currentPage]);

  const navItems = [
    { id: 'home', labelKey: 'nav.home' },
    { id: 'showcase', labelKey: 'nav.showcase' },
    { id: 'blog', labelKey: 'nav.blog' },
    {
      id: 'about',
      labelKey: 'nav.about',
      submenu: [
        { id: 'about', labelKey: 'nav.overview' },
        { id: 'leadership', labelKey: 'nav.leadership' },
      ],
    },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setIsOpen(false);
  };

  // Solid white nav (with dark link colours) on inner pages, on hover, and as
  // soon as the home page scrolls past the hero.
  const useDarkContent = currentPage !== 'home' || navHovered || scrolled;

  return (
    // The white backdrop lives on this fixed wrapper, not on the <nav> below.
    // The nav's background is animated, and over a WebGL map canvas the
    // browser can keep showing the pre-transition (transparent) layer, so the
    // map bleeds through the bar. Painting an opaque colour here — on a
    // promoted layer that always sits above the canvas — keeps the bar solid.
    <div
      className="fixed top-0 left-0 right-0 z-50 isolate"
      style={{ transform: 'translateZ(0)', willChange: 'transform' }}
    >
      {/* Opaque backdrop. Fading opacity (rather than animating the nav's own
          background-color) keeps this on the compositor, so it stays solid
          even while it sits over the WebGL map canvas. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-white pointer-events-none transition-opacity duration-500"
        style={{ opacity: useDarkContent ? 1 : 0 }}
      />
      {/* Top utility strip — solid red, contact quick-links */}
      <div className="hidden md:block" style={{ background: 'rgb(227, 24, 55)' }}>
        <div className="w-full px-6 lg:px-10 h-8 flex items-center justify-center gap-6 text-white text-[11px] font-medium tracking-wide">
          <a href="tel:+9779802748575" className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <Phone className="w-3 h-3" />
            <span>Sales: 9802748575 / 9801028519</span>
          </a>
          <a href="mailto:Sales.Mahindra@mvdugar.com" className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <Mail className="w-3 h-3" />
            <span>Sales.Mahindra@mvdugar.com</span>
          </a>
          <span className="inline-flex items-center gap-1.5 text-white/85">
            <MapPin className="w-3 h-3" />
            <span>Nationwide</span>
          </span>
        </div>
      </div>
    <nav
      onMouseEnter={() => setNavHovered(true)}
      onMouseLeave={() => setNavHovered(false)}
      className="relative transition-[border-color,box-shadow] duration-500"
      style={
        useDarkContent
          ? { borderBottom: '1px solid #e5e5e5', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }
          : { borderBottom: '1px solid rgba(255, 255, 255, 0.25)', boxShadow: 'none' }
      }
    >
      <div className="w-full px-6 lg:px-10">
        <div className="relative flex items-center justify-between h-[88px] gap-8">


          {(() => {
            const renderLink = (item) => {
              const isActive =
                currentPage === item.id ||
                (item.submenu && item.submenu.some((s) => s.id === currentPage));
              const linkButton = (
                <button
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`group relative px-4 py-2 text-lg font-semibold tracking-wide transition-colors duration-200 rounded-md whitespace-nowrap ${
                    useDarkContent
                      ? isActive
                        ? 'text-[#e31837]'
                        : 'text-gray-500 hover:text-gray-900'
                      : 'text-white hover:text-white/80'
                  }`}
                >
                  {t(item.labelKey)}
                  <span
                    className={`pointer-events-none absolute left-3 right-3 bottom-1 h-0.5 origin-left transition-transform duration-300 ease-out ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                    style={{ background: 'rgb(227, 24, 55)' }}
                  />
                </button>
              );

              if (!item.submenu) {
                return <React.Fragment key={item.id}>{linkButton}</React.Fragment>;
              }

              // Item with a hover dropdown (e.g. About Us → Overview / Leadership).
              // Connected white card with an upward caret and divided rows.
              return (
                <div key={item.id} className="relative group/menu">
                  <button
                    id={`nav-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`group relative flex items-center gap-1.5 px-4 py-2 text-lg font-semibold tracking-wide transition-colors duration-200 rounded-md whitespace-nowrap ${
                      useDarkContent
                        ? isActive
                          ? 'text-[#e31837]'
                          : 'text-gray-500 hover:text-gray-900'
                        : 'text-white hover:text-white/80'
                    }`}
                  >
                    {t(item.labelKey)}
                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover/menu:rotate-180" />
                    <span
                      className={`pointer-events-none absolute left-3 right-7 bottom-1 h-0.5 origin-left transition-transform duration-300 ease-out ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                      style={{ background: 'rgb(227, 24, 55)' }}
                    />
                  </button>

                  {/* pt-3 bridges the gap so the menu stays open while moving the cursor down */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 opacity-0 invisible transition-[opacity,visibility] duration-200 ease-out group-hover/menu:opacity-100 group-hover/menu:visible">
                    <div className="origin-top scale-95 -translate-y-1 opacity-0 transition-all duration-200 ease-out group-hover/menu:scale-100 group-hover/menu:translate-y-0 group-hover/menu:opacity-100">
                      {/* Upward caret */}
                      <div
                        aria-hidden="true"
                        className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rotate-45 bg-white"
                        style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderLeft: '1px solid rgba(0,0,0,0.06)' }}
                      />
                      {/* Card */}
                      <div
                        className="relative min-w-[220px] bg-white rounded-2xl overflow-hidden py-1.5"
                        style={{ boxShadow: '0 24px 50px -12px rgba(0,0,0,0.22)', border: '1px solid rgba(0,0,0,0.06)' }}
                      >
                        {item.submenu.map((sub, si) => {
                          const subActive = currentPage === sub.id;
                          return (
                            <button
                              key={sub.id}
                              id={`nav-${sub.id}`}
                              onClick={() => handleNavClick(sub.id)}
                              className={`block w-full text-left px-6 py-3 text-[15px] font-bold tracking-wide transition-colors duration-150 ${
                                si > 0 ? 'border-t border-black/[0.06]' : ''
                              } ${subActive ? 'text-[#e31837] bg-black/[0.025]' : 'text-gray-900 hover:bg-black/[0.04]'}`}
                            >
                              {t(sub.labelKey)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            };
            return (
              <>
                {/* LEFT — MV Dugar Group mark + divider + Mahindra wordmark */}
                <div
                  className="flex items-center gap-4 cursor-pointer select-none flex-shrink-0"
                  onClick={() => handleNavClick('home')}
                >
                  <img
                    src={dugarLogo}
                    alt="MV Dugar Group"
                    className="h-11 md:h-14 w-auto object-contain"
                  />
                  <span
                    aria-hidden="true"
                    className="h-8 md:h-10 w-px"
                    style={{ background: useDarkContent ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.4)' }}
                  />
                  <img
                    src={mahindraLogo}
                    alt="Mahindra Logo"
                    className={`h-[3.25rem] md:h-[4.5rem] w-auto object-contain filter brightness-0 ${useDarkContent ? '' : 'invert'}`}
                  />
                </div>

                {/* CENTER — all nav links, centred on the bar independently of
                    the logo and CTA widths so they never shift the row. */}
                <div
                  className="hidden md:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  {navItems.map(renderLink)}
                </div>
              </>
            );
          })()}

          {/* RIGHT — solid red Contact Us pill */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <button
              id="nav-cta-contact"
              onClick={() => handleNavClick('booking')}
              className="bg-[#e31837] hover:bg-[#c01430] text-white text-lg font-bold px-7 py-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-100"
            >
              {t('nav.contact')}
            </button>
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
          isOpen ? 'max-h-[34rem] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          background: '#ffffff',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
        }}
      >
        <div className="px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <React.Fragment key={item.id}>
              <button
                id={`nav-mobile-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                  currentPage === item.id
                    ? 'text-gray-950 bg-black/5 border-l-2'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
                }`}
                style={currentPage === item.id ? { borderLeftColor: 'rgb(227, 24, 55)' } : {}}
              >
                {t(item.labelKey)}
              </button>
              {item.submenu &&
                item.submenu.map((sub) => (
                  <button
                    key={sub.id}
                    id={`nav-mobile-${sub.id}`}
                    onClick={() => handleNavClick(sub.id)}
                    className={`block w-full text-left pl-8 pr-4 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 ${
                      currentPage === sub.id
                        ? 'text-gray-950 bg-black/5 border-l-2'
                        : 'text-gray-400 hover:text-gray-900 hover:bg-black/5'
                    }`}
                    style={currentPage === sub.id ? { borderLeftColor: 'rgb(227, 24, 55)' } : {}}
                  >
                    {t(sub.labelKey)}
                  </button>
                ))}
            </React.Fragment>
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
    </div>
  );
}
