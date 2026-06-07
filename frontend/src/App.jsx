import React, { useState, useLayoutEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Showcase from './pages/Showcase';
import AboutUs from './pages/AboutUs';
import Booking from './pages/Booking';
import Blog from './pages/Blog';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Scroll BEFORE the new page mounts. Doing it inside setCurrentPage means
  // the browser is already at scrollY=0 when React commits the new DOM, so
  // there's no frame where the new (shorter) page is viewed through a
  // scrolled-down viewport.
  const changePage = (page) => {
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
        return <Showcase setCurrentPage={changePage} />;
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
          {renderPage()}
        </div>
      </main>

      <Footer setCurrentPage={changePage} currentPage={currentPage} />
    </div>
  );
}
