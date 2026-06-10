import React, { useState, useEffect } from 'react';

/**
 * Vertical "Book a Test Drive" tab pinned to the right edge of the viewport.
 *
 * Visibility:
 *  - Hidden on the booking page (would be redundant).
 *  - Everywhere else: hidden initially, slides in once the user scrolls
 *    past ~60% of the viewport height.
 *
 * Style:
 *  - Resting state is transparent with a red border + red text.
 *  - On hover the fill turns red and the text turns white.
 */
export default function BookTestDriveTab({ setCurrentPage, currentPage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentPage === 'booking') {
      setVisible(false);
      return;
    }

    // Every non-booking page: appearance is tied to scroll position so the
    // tab doesn't sit over the hero / page header.
    setVisible(false);
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentPage]);

  // Don't render at all on the booking page so it can't be tabbed to.
  if (currentPage === 'booking') return null;

  return (
    <button
      id="floating-book-tab"
      onClick={() => setCurrentPage('booking')}
      aria-label="Book a test drive"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`hidden sm:flex fixed right-0 top-1/2 z-40 items-center justify-center bg-transparent hover:bg-[#e21b22] text-black hover:text-white border-2 border-black hover:border-[#e21b22] cursor-pointer rounded-l-md shadow-lg hover:shadow-[0_10px_30px_-10px_rgba(226,27,34,0.6)] backdrop-blur-sm transition-all duration-500 ease-out ${
        visible
          ? 'translate-x-0 -translate-y-1/2 opacity-100'
          : 'translate-x-full -translate-y-1/2 opacity-0 pointer-events-none'
      }`}
      style={{
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        padding: '20px 10px',
        letterSpacing: '0.25em',
        fontWeight: 800,
        fontSize: '12px',
        textTransform: 'uppercase',
      }}
    >
      Book a Test Drive
    </button>
  );
}
