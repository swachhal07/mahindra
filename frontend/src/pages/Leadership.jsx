import React from 'react';
import photoMotiLal from '../assets/af0b8ecf-4ddc-41f9-9dd1-ba5c0df1b212.webp';
import photoVivek from '../assets/ae68fbad-4028-45aa-81d5-44d526f4f5af.webp';
import photoShubham from '../assets/af5ea000-e8c5-4f03-ac64-9fd3a8bb8009.webp';
import photoNaman from '../assets/eb7eb529-8d15-4359-8ac0-df51b7393d00.webp';
import boardBgWorkshop from '../assets/IMG_1596.jpg';
import photoSudeepSingh from '../assets/mgmt-sudeep-singh.jpeg';
import photoSudipSubedi from '../assets/mgmt-sudip-subedi.jpeg';
import photoMishra from '../assets/mgmt-mishra.jpeg';
import photoThakur from '../assets/mgmt-thakur.jpeg';
import photoLaxmiYadav from '../assets/mgmt-laxmi-yadav.jpeg';

const RED = 'rgb(227, 24, 55)';

const boardOfDirectors = [
  {
    index: '01',
    name: 'Moti Lal Dugar',
    role: 'Chairman',
    generation: 'First Generation',
    responsibility: 'Strategy, partnerships, and long-term vision.',
    photo: photoMotiLal,
    focal: 'center 18%',
  },
  {
    index: '02',
    name: 'Vivek Dugar',
    role: 'Vice Chairman',
    generation: 'Second Generation',
    responsibility: 'Operations, dealer network, Mahindra liaison.',
    photo: photoVivek,
    focal: 'center 25%',
  },
  {
    index: '03',
    name: 'Shubham Dugar',
    role: 'Director',
    generation: 'Third Generation',
    responsibility: 'Fleet sales, commercial vehicles, government accounts.',
    photo: photoShubham,
    focal: 'center 30%',
  },
  {
    index: '04',
    name: 'Naman Dugar',
    role: 'Director',
    generation: 'Third Generation',
    responsibility: 'Service network, spare parts, technician training.',
    photo: photoNaman,
    focal: 'center 25%',
  },
];

// Management Team — Automotive Division. Photo paths are placeholders until
// portraits are dropped into src/assets and imported here.
const managementTeam = [
  { name: 'Sudeep Raj Subedi', role: 'Business Head', photo: photoSudipSubedi },
  { name: 'Sudeep Singh', role: 'Sales Head', photo: photoSudeepSingh },
  { name: 'Abhisheek Mishary', role: 'Spare Parts Head', photo: photoMishra },
  { name: 'Laxmi Prasad Yadav', role: 'Service Head', photo: photoLaxmiYadav },
  { name: 'Shatrudhan Thakur', role: 'Service Head-CE', photo: photoThakur },
];

function initialsOf(name) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Leadership() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0807' }}>
      {/* ============================================================
          BOARD OF DIRECTORS — editorial dark stage
          ============================================================ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0a0807' }}>
        {/* Navbar spacer */}
        <div className="h-[88px]" />

        {/* Atmospheric workshop backdrop — texture, not subject */}
        <img
          src={boardBgWorkshop}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          style={{ opacity: 0.32, filter: 'grayscale(0.85) brightness(0.72) contrast(1.12)', transform: 'scale(1.06)' }}
        />

        {/* Master grade — dark frame top/bottom */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,8,7,0.92) 0%, rgba(10,8,7,0.28) 32%, rgba(10,8,7,0.28) 68%, rgba(10,8,7,0.96) 100%)',
          }}
        />

        {/* Overhead stage light */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 45%)',
          }}
        />

        {/* Brand-red wash — floor only */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 55% 30% at 50% 100%, rgba(227,24,55,0.12) 0%, rgba(227,24,55,0) 70%)',
          }}
        />

        {/* Architectural verticals */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, transparent 0, transparent 119px, rgba(255,255,255,0.02) 119px, rgba(255,255,255,0.02) 120px)',
          }}
        />

        <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10 pt-16 pb-28">
          {/* Eyebrow + headline — centered */}
          <div className="flex flex-col items-center text-center mb-24">
            <div className="flex items-center gap-4 mb-8">
              <span className="inline-block w-10 h-px" style={{ background: RED }} />
              <span className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-[0.35em]" style={{ color: RED }}>
                Our Leadership
              </span>
              <span className="inline-block w-10 h-px" style={{ background: RED }} />
            </div>
            <h1
              className="font-black uppercase tracking-[-0.02em] text-white leading-[0.92]"
              style={{ fontSize: 'clamp(42px, 6.5vw, 100px)' }}
            >
              Three generations.<br />
              <span style={{ color: RED }}>One road.</span>
            </h1>
          </div>

          {/* Director cards — staggered editorial grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-7 gap-y-16">
            {boardOfDirectors.map((d, i) => {
              const offset = i % 2 === 1 ? 'lg:mt-16' : 'lg:mt-0';
              return (
                <article
                  key={d.name}
                  className={`group relative flex flex-col director-card ${offset}`}
                  style={{ animation: `leadFadeUp 700ms cubic-bezier(0.16,1,0.3,1) ${i * 100}ms backwards` }}
                >
                  {/* Portrait */}
                  <div className="portrait-frame relative z-10 aspect-[3/4] overflow-hidden bg-stone-900 border border-white/[0.07]">
                    {/* Red corner accent — always visible, grows on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-0 z-20 h-1 w-12 transition-all duration-500 group-hover:w-24"
                      style={{ background: RED }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-0 z-20 w-1 h-12 transition-all duration-500 group-hover:h-24"
                      style={{ background: RED }}
                    />

                    <img
                      src={d.photo}
                      alt={d.name}
                      loading="lazy"
                      className="board-portrait w-full h-full object-cover transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ objectPosition: d.focal }}
                    />

                    {/* Vignette */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: 'radial-gradient(ellipse 90% 110% at 50% 30%, transparent 50%, rgba(0,0,0,0.6) 100%)' }}
                    />

                    {/* Hover sheen — diagonal light sweep across the portrait */}
                    <span aria-hidden="true" className="portrait-sheen absolute inset-0 z-20 pointer-events-none" />
                  </div>

                  {/* Copy block */}
                  <div className="relative z-10 pt-5">
                    <div className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3 flex items-center gap-2" style={{ color: RED }}>
                      <span className="inline-block w-5 h-px transition-all duration-500 group-hover:w-10" style={{ background: RED }} />
                      {d.role}
                    </div>
                    <h2
                      className="text-white font-black uppercase tracking-[-0.02em] leading-[0.95]"
                      style={{ fontSize: 'clamp(22px, 2.2vw, 30px)' }}
                    >
                      {d.name}
                    </h2>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes leadFadeUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          /* Card lifts as a whole on hover */
          .director-card {
            transition: transform 600ms cubic-bezier(0.16,1,0.3,1);
          }
          .director-card:hover {
            transform: translateY(-12px);
          }

          /* Portrait frame: deep base shadow → red-tinted glow + red border on hover */
          .portrait-frame {
            box-shadow: 0 30px 60px -28px rgba(0,0,0,0.9);
            transition: box-shadow 600ms cubic-bezier(0.16,1,0.3,1), border-color 600ms ease;
          }
          .director-card:hover .portrait-frame {
            border-color: rgba(227,24,55,0.55);
            box-shadow: 0 40px 80px -30px rgba(0,0,0,0.95);
          }

          .board-portrait {
            filter: grayscale(0.78) brightness(0.86) contrast(1.14) saturate(0.88);
          }
          .director-card:hover .board-portrait {
            filter: grayscale(0) brightness(1.02) contrast(1.06) saturate(1.06);
            transform: scale(1.05);
          }

          /* Diagonal light sweep across the portrait on hover */
          .portrait-sheen {
            background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0.04) 56%, transparent 70%);
            transform: translateX(-120%);
            opacity: 0;
          }
          .director-card:hover .portrait-sheen {
            opacity: 1;
            transform: translateX(120%);
            transition: transform 900ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease;
          }
          .mgmt-portrait {
            filter: contrast(1.02);
          }
          .group:hover .mgmt-portrait {
            filter: contrast(1.02);
            transform: scale(1.03);
          }
        `}</style>
      </section>

      {/* ============================================================
          MANAGEMENT TEAM — Automotive Division (light section)
          ============================================================ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 lg:px-10 pt-24 pb-32">
          {/* Eyebrow + headline — centered */}
          <div className="flex flex-col items-center text-center mb-20">
            <div className="flex items-center gap-4 mb-8">
              <span className="inline-block w-10 h-px" style={{ background: RED }} />
              <span className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-[0.35em]" style={{ color: RED }}>
                Management Team
              </span>
              <span className="inline-block w-10 h-px" style={{ background: RED }} />
            </div>
            <h2
              className="font-black uppercase tracking-[-0.02em] leading-[0.92]"
              style={{ fontSize: 'clamp(36px, 5.5vw, 80px)', color: '#111' }}
            >
              Running the <span style={{ color: RED }}>day-to-day.</span>
            </h2>
          </div>

          {/* Grid — flex-wrap so an incomplete last row stays centered */}
          <div className="flex flex-wrap justify-center gap-x-6 lg:gap-x-7 gap-y-14">
            {managementTeam.map((m, i) => (
              <article
                key={m.name}
                className="group relative flex flex-col basis-full sm:basis-[calc((100%_-_1.5rem)/2)] lg:basis-[calc((100%_-_3.5rem)/3)]"
                style={{ animation: `leadFadeUp 700ms cubic-bezier(0.16,1,0.3,1) ${i * 100}ms backwards` }}
              >
                <div
                  className="relative z-10 aspect-[3/4] overflow-hidden bg-gray-100 border border-black/[0.06]"
                  style={{ boxShadow: '0 24px 50px -30px rgba(0,0,0,0.35)' }}
                >
                  {/* Red corner accent */}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 z-20 h-1 w-12 transition-all duration-500 group-hover:w-24"
                    style={{ background: RED }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 z-20 w-1 h-12 transition-all duration-500 group-hover:h-24"
                    style={{ background: RED }}
                  />

                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="mgmt-portrait w-full h-full object-cover transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ objectPosition: m.focal || 'center 25%' }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: 'radial-gradient(ellipse 75% 60% at 50% 38%, #f3f4f6 0%, #e5e7eb 75%)' }}
                    >
                      <span
                        className="font-black tracking-[-0.04em]"
                        style={{ fontSize: 'clamp(56px, 6vw, 88px)', color: 'rgba(17,17,17,0.14)' }}
                      >
                        {initialsOf(m.name)}
                      </span>
                    </div>
                  )}

                </div>

                <div className="relative z-10 pt-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3 flex items-center gap-2" style={{ color: RED }}>
                    <span className="inline-block w-5 h-px transition-all duration-500 group-hover:w-10" style={{ background: RED }} />
                    {m.role}
                  </div>
                  <h3
                    className="font-black uppercase tracking-[-0.02em] leading-[0.95] whitespace-nowrap"
                    style={{ fontSize: 'clamp(14px, 1.35vw, 19px)', color: '#111' }}
                  >
                    {m.name}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
