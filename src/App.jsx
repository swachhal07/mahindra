import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Showcase from './pages/Showcase';
import AgriTech from './pages/AgriTech';
import Booking from './pages/Booking';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Smooth scroll to top when changing pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Page switcher logic
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'showcase':
        return <Showcase setCurrentPage={setCurrentPage} />;
      case 'agri-tech':
        return <AgriTech setCurrentPage={setCurrentPage} />;
      case 'booking':
        return <Booking />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-mahindra-black text-white">
      {/* Header with Navigation */}
      <header>
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer Area */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
