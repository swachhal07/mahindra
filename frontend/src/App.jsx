import React, { useState, useLayoutEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Home loads eagerly — it's the landing page so we want zero TTI overhead.
import Home from './pages/Home';

// Everything else is route-code-split: the bundle for these pages is only
// downloaded the first time the user navigates to them. This keeps the
// initial home-page JS payload small and makes navigation feel snappier
// once a page has been visited (results are cached by the browser).
const Showcase = lazy(() => import('./pages/Showcase'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Booking = lazy(() => import('./pages/Booking'));
const Blog = lazy(() => import('./pages/Blog'));

// Lightweight placeholder shown while a page chunk is being fetched. Kept
// minimal so it doesn't look heavier than the page it's standing in for.
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-white">
      <div className="flex items-center gap-3 text-gray-500">
        <span className="w-2.5 h-2.5 rounded-full bg-[#e21b22] animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-[0.25em]">Loading…</span>
      </div>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showcaseFilter, setShowcaseFilter] = useState('all');

  // Scroll BEFORE the new page mounts. Doing it inside setCurrentPage means
  // the browser is already at scrollY=0 when React commits the new DOM, so
  // there's no frame where the new (shorter) page is viewed through a
  // scrolled-down viewport.
  const changePage = (page, opts = {}) => {
    if (page === 'showcase') {
      setShowcaseFilter(opts.showcaseFilter ?? 'all');
    }
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };

  // Belt-and-braces: also reset synchronously after commit in case anything
  // (e.g. an unmounting Map component) shifted scroll during the transition.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={changePage} />;
      case 'showcase':
        return <Showcase setCurrentPage={changePage} initialFilter={showcaseFilter} />;
      case 'about':
        return <AboutUs setCurrentPage={changePage} />;
      case 'booking':
        return <Booking />;
      case 'blog':
        return <Blog />;
      default:
        return <Home setCurrentPage={changePage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header>
        <Navbar currentPage={currentPage} setCurrentPage={changePage} />
      </header>

      {/* `key` forces a fresh subtree on page change, and the keyed div
          replays a CSS fade-in. The fade hides any one-frame paint gap that
          would otherwise look like a white flash. */}
      <main className="flex-grow">
        <div key={currentPage} className="page-fade">
          <Suspense fallback={<PageLoader />}>
            {renderPage()}
          </Suspense>
        </div>
      </main>

      <Footer setCurrentPage={changePage} currentPage={currentPage} />
    </div>
  );
}
