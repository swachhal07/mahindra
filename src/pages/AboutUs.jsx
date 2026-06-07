import React, { useState, useEffect } from 'react';
import { useT } from '../utils/i18n';
import storyImage1 from '../assets/IMG_5387.PNG';
import storyImage2 from '../assets/IMG_5388.PNG';
import storyImage3 from '../assets/IMG_5389.PNG';
import partnerVianet from '../assets/Vianet-Aba-Sabai_Connected-Red@4x.png';
import partnerJagdamba from '../assets/jagdamba-steels.png';
import partnerAboutUs from '../assets/about-us-logo-image-1024x1024.png';
import partnerLogo from '../assets/logo.png';
import { TOPO_CONTOUR_PATH } from '../utils/topoContour';
import { PAPER_BG_STYLE } from '../utils/paperTexture';

const partnerLogos = [
  { id: 'vianet', src: partnerVianet, alt: 'Vianet', className: 'h-10 sm:h-12' },
  { id: 'jagdamba', src: partnerJagdamba, alt: 'Jagdamba Steels', className: 'h-16 sm:h-20' },
  { id: 'about-us', src: partnerAboutUs, alt: 'Partner', className: 'h-16 sm:h-20' },
  { id: 'logo', src: partnerLogo, alt: 'Partner', className: 'h-12 sm:h-14' },
];

const storySlides = [storyImage1, storyImage2, storyImage3];

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
            <div className="relative w-full aspect-[16/10] rounded-2xl lg:rounded-l-none overflow-hidden shadow-xl">
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
            </div>
          </div>
          <div className="lg:-mr-[calc((100vw-72rem)/2)] lg:pr-10">
            <p className="text-[rgb(213,59,59)] text-base sm:text-lg font-black uppercase tracking-[0.3em] mb-5">
              {t('about.ourStory')}
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight leading-[1.05] mb-8">
              A dealership that{' '}
              <span className="text-[rgb(213,59,59)]">acts like a partner.</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-5">
              Dugar Auto Clinic was built to do one thing well. We deliver Mahindra vehicles and after-sales service across Nepal with a clear scope, expert technicians, and a commitment that does not slip. That is the entire model.
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

      {/* Trusted Partners — auto-scrolling logo strip */}
      <div style={PAPER_BG_STYLE}>
       <div className="pt-24 pb-14">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 text-center mb-14">
          <p className="text-[rgb(213,59,59)] text-base sm:text-lg font-black uppercase tracking-[0.3em] mb-5">
            {t('about.trustedPartners')}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight leading-[1.05]">
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

      {/* How We Work */}
      <div className="bg-white relative overflow-hidden">
       <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg">
         <path d={TOPO_CONTOUR_PATH} stroke="#d4d4d4" strokeWidth="0.7" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
       </svg>
       <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24 relative z-10">
        <div className="text-center mb-16">
          <p className="text-[rgb(213,59,59)] text-base sm:text-lg font-black uppercase tracking-[0.3em] mb-5">
            {t('about.howWeWork')}
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight leading-[1.05] mb-6">
            {t('about.howWeWork.title')}
          </h2>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl mx-auto">
            No moving parts. The lineup is clear, the team is the same, and the promise holds — from showroom to service bay.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 max-w-4xl mx-auto">
          {[
            {
              num: '01',
              title: 'Understand Your Need',
              desc: 'We start with a conversation — fleet route, payload, terrain, daily kilometres, budget. The right vehicle starts with the right questions.',
            },
            {
              num: '02',
              title: 'Match the Vehicle',
              desc: 'From heavy tippers to last-mile movers, we walk you through Mahindra options that actually fit your work. No upselling, no guesswork.',
            },
            {
              num: '03',
              title: 'Test Drive & Finalise',
              desc: 'Drive it on real roads. Get clear, written pricing, finance options, and paperwork — no surprise add-ons, no hidden charges.',
            },
            {
              num: '04',
              title: 'Service That Shows Up',
              desc: 'Genuine parts, trained technicians, scheduled service visits. We do not disappear after delivery — we stay with the vehicle.',
            },
          ].map((step) => (
            <div key={step.num} className="flex gap-5">
              <span className="text-[rgb(213,59,59)] text-3xl font-black tracking-tight shrink-0">
                {step.num}
              </span>
              <div>
                <h3 className="text-gray-950 text-2xl sm:text-3xl font-extrabold uppercase tracking-tight mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-base leading-relaxed">
                  {step.desc}
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
          <h2 className="text-4xl sm:text-5xl font-black text-gray-950 uppercase tracking-tight leading-[1.05] mb-6">
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
