import React, { useState, useEffect } from 'react';
import { useT } from '../utils/i18n';
import storyImage1 from '../assets/WhatsApp Image 2026-06-10 at 11.23.50 AM.jpeg';
import storyImage2 from '../assets/WhatsApp Image 2026-06-10 at 11.23.51 AM.jpeg';
import storyImage3 from '../assets/WhatsApp Image 2026-06-10 at 11.23.51 AM (1).jpeg';
import storyImage4 from '../assets/WhatsApp Image 2026-06-10 at 11.23.52 AM.jpeg';
import partnerVianet from '../assets/Vianet-Aba-Sabai_Connected-Red@4x.png';
import partnerJagdamba from '../assets/jagdamba-steels.png';
import partnerAboutUs from '../assets/about-us-logo-image-1024x1024.png';
import partnerLogo from '../assets/logo.png';
import teamSales from '../assets/salesteam.JPG';
import teamTechnical from '../assets/technicalteam.JPG';
import teamService from '../assets/IMG_0320.JPG';
import photoMotiLal from '../assets/af0b8ecf-4ddc-41f9-9dd1-ba5c0df1b212.webp';
import photoVivek from '../assets/ae68fbad-4028-45aa-81d5-44d526f4f5af.webp';
import photoShubham from '../assets/af5ea000-e8c5-4f03-ac64-9fd3a8bb8009.webp';
import photoNaman from '../assets/eb7eb529-8d15-4359-8ac0-df51b7393d00.webp';
import boardBgWorkshop from '../assets/IMG_1596.jpg';
import { TOPO_CONTOUR_PATH } from '../utils/topoContour';
import { PAPER_BG_STYLE, PAPER_TEXTURE } from '../utils/paperTexture';

const partnerLogos = [
  { id: 'vianet', src: partnerVianet, alt: 'Vianet', className: 'h-10 sm:h-12' },
  { id: 'jagdamba', src: partnerJagdamba, alt: 'Jagdamba Steels', className: 'h-16 sm:h-20' },
  { id: 'about-us', src: partnerAboutUs, alt: 'Partner', className: 'h-16 sm:h-20' },
  { id: 'logo', src: partnerLogo, alt: 'Partner', className: 'h-12 sm:h-14' },
];

const storySlides = [storyImage1, storyImage2, storyImage3, storyImage4];

const serveCategories = [
  'Logistics & Transport',
  'Construction & Mining',
  'Agriculture & Farming',
  'Last-Mile Delivery',
  'Passenger Transport',
  'Government Fleets',
  'Small Businesses',
  'Rental Operators',
];

const boardOfDirectors = [
  { name: 'Moti Lal Dugar', role: 'Chairman', tag: 'Strategy, partnerships, and long-term vision.', photo: photoMotiLal, focal: 'center 18%' },
  { name: 'Vivek Dugar', role: 'Vice Chairman', tag: 'Operations, dealer network, Mahindra liaison.', photo: photoVivek, focal: 'center 25%' },
  { name: 'Shubham Dugar', role: 'Director', tag: 'Fleet sales, commercial vehicles, government accounts.', photo: photoShubham, focal: 'center 30%' },
  { name: 'Naman Dugar', role: 'Director', tag: 'Service network, spare parts, technician training.', photo: photoNaman, focal: 'center 25%' },
];

export default function AboutUs({ setCurrentPage }) {
  const [storySlide, setStorySlide] = useState(0);
  const t = useT();

  useEffect(() => {
    const id = setInterval(() => {
      setStorySlide((s) => (s + 1) % storySlides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen" style={PAPER_BG_STYLE}>

      {/* Hero */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 110% 90% at 90% 20%, rgba(150,35,35,0.45) 0%, rgba(100,20,20,0.28) 25%, rgba(50,10,10,0.15) 50%, rgba(15,3,3,0.05) 75%, rgba(0,0,0,0) 95%), radial-gradient(ellipse 80% 60% at 10% 5%, rgba(100,25,25,0.22) 0%, rgba(40,8,8,0.08) 45%, rgba(0,0,0,0) 80%), #000',
        }}
      >
        {/* Navbar spacer */}
        <div className="absolute top-0 left-0 right-0 h-[88px]" />

        <div className="relative z-10 text-center px-6 lg:px-10 pt-[140px] pb-24 max-w-6xl mx-auto w-full">
          <p className="text-[rgb(213,59,59)] text-xs sm:text-sm font-bold uppercase tracking-[0.35em] mb-8">
            {t('about.eyebrow')}
          </p>
          <h1 className="font-black uppercase tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl">
            <span className="text-white">{t('about.headline1')}</span><br />
            <span className="text-[rgb(213,59,59)]">{t('about.headline2')}</span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg mt-10 max-w-2xl mx-auto leading-relaxed">
            {t('about.sub')}
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="bg-white relative overflow-hidden">
       <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
         <path d={TOPO_CONTOUR_PATH} stroke="#d4d4d4" strokeWidth="0.7" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
       <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative lg:-ml-[calc((100vw-72rem)/2)]">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-xl">
              {storySlides.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    i === storySlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
              {storySlides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {storySlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setStorySlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === storySlide ? 'w-8 bg-white' : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="lg:-mr-[calc((100vw-72rem)/2)] lg:pr-10">
            <p className="text-[rgb(213,59,59)] text-base sm:text-lg font-black uppercase tracking-[0.3em] mb-5">
              {t('about.ourStory')}
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight leading-[1.05] mb-8 after:content-[''] after:block after:w-14 after:h-1 after:bg-[#e31837] after:rounded-full after:mt-5">
              A dealership that{' '}
              <span className="text-[rgb(213,59,59)]">acts like a partner.</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-5">
              Dugar Brothers and Sons Pvt LTD was built to do one thing well. We deliver Mahindra vehicles and after-sales service across Nepal with a clear scope, expert technicians, and a commitment that does not slip. That is the entire model.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-5">
              Get in touch with our sales team at{' '}
              <a href="mailto:Sales.Mahindra@mvdugar.com" className="text-[rgb(213,59,59)] font-semibold hover:underline">
                Sales.Mahindra@mvdugar.com
              </a>.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-5">
              Fleet operators, business owners, and individual buyers choose us because the vehicles keep moving, the service gets done on time, and they do not have to chase us for support.
            </p>
            <p className="text-gray-500 text-base leading-relaxed">
              We do not stretch ourselves thin across brands or side ventures. Mahindra is the work. Every showroom visit, every test drive, every service appointment is built around it.
            </p>
          </div>
        </div>
       </div>
      </div>

      {/* Board of Directors — editorial dark stage */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#0a0807' }}>
        {/* 1. Atmospheric workshop backdrop — texture, not subject */}
        <img
          src={boardBgWorkshop}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{
            opacity: 0.14,
            filter: 'grayscale(0.92) brightness(0.50) contrast(1.22)',
            transform: 'scale(1.06)',
          }}
        />

        {/* 2. Master grade — dark frame at top/bottom, slight relief through the middle band where portraits sit */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,8,7,0.96) 0%, rgba(10,8,7,0.40) 32%, rgba(10,8,7,0.40) 72%, rgba(10,8,7,0.96) 100%)',
          }}
        />

        {/* 3. Overhead stage light — warm cone from top-center, like a showroom spotlight */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 65% 75% at 50% 0%, rgba(255,215,185,0.085) 0%, rgba(255,200,170,0.03) 35%, transparent 60%)',
          }}
        />

        {/* 4. Brand-red floor wash — anchors the stage, very subtle */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 30% at 50% 100%, rgba(227,24,55,0.14) 0%, rgba(180,30,45,0.05) 45%, transparent 70%)',
          }}
        />

        {/* 5. Architectural verticals — fine editorial structure (steel-beam suggestion) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0, transparent 119px, rgba(255,255,255,0.022) 119px, rgba(255,255,255,0.022) 120px)',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 relative z-10">
          {/* Title */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <p className="text-[rgb(213,59,59)] text-base sm:text-lg font-black uppercase tracking-[0.3em] mb-5">
              Our Leadership
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.05] mb-6">
              The people who{' '}
              <span
                className="text-[rgb(213,59,59)] normal-case"
                style={{ fontStyle: 'italic', fontWeight: 900, letterSpacing: '-0.02em' }}
              >
                steer the wheel.
              </span>
            </h2>
            <p className="text-stone-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
              Four directors. One family. Three generations running Mahindra in Nepal since 1965.
            </p>
          </div>

          {/* Director grid — 4 in a row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 lg:gap-x-7 relative">
            {boardOfDirectors.map((d, i) => {
              return (
                <article
                  key={d.name}
                  className="group relative flex flex-col"
                  style={{ animation: `boardFadeIn 600ms ease-out ${i * 90}ms backwards` }}
                >
                  {/* Spotlight bleed — soft red glow appears behind the card on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -m-8 opacity-0 group-hover:opacity-100 transition-opacity duration-[700ms] ease-out pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 70% 70% at 50% 55%, rgba(227,24,55,0.28) 0%, rgba(227,24,55,0.10) 40%, transparent 70%)',
                      zIndex: 0,
                    }}
                  />

                  {/* Portrait — taller 4:5, B&W default → full color on hover */}
                  <div className="relative z-10 aspect-[4/5] overflow-hidden bg-stone-900 border border-white/[0.06] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]">
                    <img
                      src={d.photo}
                      alt={d.name}
                      loading="lazy"
                      className="board-portrait w-full h-full object-cover transition-[filter] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ objectPosition: d.focal }}
                    />

                    {/* Vignette to fade edges into the bg */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(ellipse 90% 110% at 50% 30%, transparent 50%, rgba(0,0,0,0.6) 100%)',
                      }}
                    />

                    {/* Bottom darken */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
                      style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.88))' }}
                    />

                    {/* Bottom-overlay role + name */}
                    <div className="absolute inset-x-0 bottom-0 px-5 lg:px-6 pb-5 lg:pb-6">
                      <span
                        aria-hidden="true"
                        className="block w-9 h-[2px] bg-[#e31837] mb-3 transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-24"
                      />
                      <p className="text-[rgb(213,59,59)] text-[10px] lg:text-[11px] font-black uppercase tracking-[0.3em] mb-2">
                        {d.role}
                      </p>
                      <h3
                        className="text-white font-black uppercase leading-[0.95] tracking-tight whitespace-nowrap"
                        style={{ fontSize: 'clamp(17px, 1.55vw, 22px)', letterSpacing: '-0.025em' }}
                      >
                        {d.name}
                      </h3>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes boardFadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .board-portrait {
            filter: grayscale(0.78) brightness(0.86) contrast(1.14) saturate(0.88);
          }
          .group:hover .board-portrait {
            filter: grayscale(0) brightness(1.02) contrast(1.06) saturate(1.06);
          }
        `}</style>
      </div>

      {/* Trusted Partners — auto-scrolling logo strip */}
      <div style={PAPER_BG_STYLE}>
       <div className="pt-24 pb-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 text-center mb-14">
          <p className="text-[rgb(213,59,59)] text-base sm:text-lg font-black uppercase tracking-[0.3em] mb-5">
            {t('about.trustedPartners')}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight leading-[1.05] after:content-[''] after:block after:w-14 after:h-1 after:bg-[#e31837] after:rounded-full after:mt-5 after:mx-auto">
            {t('about.trustedPartners.title')}
          </h2>
        </div>

        <div className="logo-marquee-container">
          <div className="logo-marquee-track">
            {[...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, idx) => (
              <div
                key={`${logo.id}-${idx}`}
                className="flex items-center justify-center shrink-0 px-12"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`${logo.className} w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300`}
                />
              </div>
            ))}
          </div>
        </div>
       </div>

       <style>{`
         .logo-marquee-container {
           overflow: hidden;
           width: 100%;
         }
         .logo-marquee-track {
           display: flex;
           width: max-content;
           align-items: center;
           animation: logoMarqueeLtr 35s linear infinite;
         }
         .logo-marquee-track:hover {
           animation-play-state: paused;
         }
         @keyframes logoMarqueeLtr {
           0% { transform: translateX(-25%); }
           100% { transform: translateX(0); }
         }
       `}</style>
      </div>

      {/* Meet Our Team */}
      <div className="bg-white relative overflow-hidden">
       <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
         <path d={TOPO_CONTOUR_PATH} stroke="#d4d4d4" strokeWidth="0.7" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
       <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[rgb(213,59,59)] text-base sm:text-lg font-black uppercase tracking-[0.3em] mb-5">
            {t('about.ourTeam')}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight leading-[1.05] mb-6 after:content-[''] after:block after:w-14 after:h-1 after:bg-[#e31837] after:rounded-full after:mt-5 after:mx-auto">
            {t('about.ourTeam.title')}
          </h2>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl mx-auto">
            Three teams, one promise. From the first conversation to long after delivery, the same people stay with your vehicle.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              num: '01',
              title: 'Sales Team',
              desc: 'Your first point of contact. Walks you through the lineup, matches the right Mahindra to your work, and writes you a clear, no-surprise quote.',
              image: teamSales,
            },
            {
              num: '02',
              title: 'Services Team',
              desc: 'Specs, demos, and the harder questions. They know payloads, mileage figures, and the difference one gear ratio makes on a hill route.',
              image: teamTechnical,
            },
            {
              num: '03',
              title: 'Spare Parts Team',
              desc: 'Genuine parts, trained technicians, scheduled visits. We do not disappear after delivery — we stay with the vehicle, for the long haul.',
              image: teamService,
            },
          ].map((team) => (
            <div
              key={team.num}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
            >
              {/* Image */}
              <div className="overflow-hidden h-72 lg:h-80 bg-gray-100">
                <img
                  src={team.image}
                  alt={`${team.title} at Mahindra Nepal`}
                  className={`w-full h-full ${team.fit === 'contain' ? 'object-contain' : 'object-cover'} object-center transition-transform duration-500 group-hover:scale-105`}
                  style={{ filter: 'brightness(0.9) contrast(1.08)', objectPosition: team.fit === 'contain' ? 'center center' : 'center 40%' }}
                  loading="lazy"
                />
              </div>
              {/* Content */}
              <div className="px-8 pt-7 pb-7">
                <span className="text-[#e31837] text-sm font-black block mb-3">{team.num}</span>
                <h3 className="text-gray-950 text-xl font-black uppercase tracking-tight leading-tight mb-4">
                  {team.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">
                  {team.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
       </div>
      </div>

      {/* Who We Serve */}
      <div style={PAPER_BG_STYLE}>
       <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <div className="text-center mb-12">
          <p className="text-[rgb(213,59,59)] text-base sm:text-lg font-black uppercase tracking-[0.3em] mb-5">
            {t('about.whoWeServe')}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight leading-[1.05] mb-6 after:content-[''] after:block after:w-14 after:h-1 after:bg-[#e31837] after:rounded-full after:mt-5 after:mx-auto">
            {t('about.whoWeServe.title')}
          </h2>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl mx-auto">
            If it moves goods, people, or earth across Nepal — we have likely put a Mahindra to work doing it.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {serveCategories.map((category) => (
            <div
              key={category}
              className="group bg-white border border-gray-100 rounded-lg px-6 py-7 text-center shadow-sm hover:shadow-md hover:border-[rgb(213,59,59)]/30 transition-all duration-300 cursor-pointer"
            >
              <p className="text-gray-950 text-sm font-extrabold uppercase tracking-tight leading-tight transition-colors duration-300 group-hover:text-[rgb(213,59,59)]">
                {category}
              </p>
            </div>
          ))}
        </div>
       </div>
      </div>

    </div>
  );
}
