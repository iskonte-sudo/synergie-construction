import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides as fallbackSlides, company } from '../data/mock';
import { useQuoteModal } from '../contexts/QuoteModalContext';
import api, { mediaUrl } from '../lib/api';

export default function HeroSlider() {
  const [slides, setSlides] = useState(fallbackSlides);
  const [active, setActive] = useState(0);
  const { openModal } = useQuoteModal();

  useEffect(() => {
    api.get('/public/slides').then(({ data }) => {
      if (data && data.length) {
        setSlides(data.map((s) => ({
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          image: mediaUrl(s.image),
          button_label: s.button_label,
          button_link: s.button_link,
        })));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <section className="relative h-[88vh] min-h-[600px] max-h-[820px] overflow-hidden bg-[#0A2540]">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === active ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover ${i === active ? 'scale-105' : 'scale-100'} transition-transform duration-[8000ms] ease-out`}
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-8 mt-16">
          <div className="lg:col-span-8">
            <div key={active} className="animate-fade-up">
              <div className="section-label !text-[#FFB800] mb-5">Synergies Construction Group</div>
              <h1 className="font-heading text-white text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-[0.95] tracking-tight max-w-4xl text-balance uppercase">
                {slides[active]?.title}
              </h1>
              <p className="text-white/85 text-lg mt-6 max-w-xl">{slides[active]?.subtitle}</p>
              <div className="flex flex-wrap gap-4 mt-8">
                {slides[active]?.button_link ? (
                  <Link to={slides[active].button_link} className="btn-primary">
                    <ArrowUpRight size={18} /> {slides[active].button_label || 'En savoir plus'}
                  </Link>
                ) : (
                  <button onClick={() => openModal()} className="btn-primary">
                    <ArrowUpRight size={18} /> Demander un devis
                  </button>
                )}
                <Link to="/services" className="btn-outline-light">Nos services</Link>
              </div>
            </div>
          </div>

          {/* Experience badge */}
          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="bg-[#0A2540]/85 backdrop-blur-sm border border-[#FFB800]/30 px-10 py-12 text-right">
              <div className="font-heading text-white text-7xl xl:text-8xl font-extrabold leading-none">{company.experience}+</div>
              <div className="text-[#FFB800] uppercase tracking-[0.2em] text-sm font-semibold mt-3">Ans d'expérience</div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => setActive((active - 1 + slides.length) % slides.length)}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-[#FFB800] text-white hover:text-[#0A2540] flex items-center justify-center backdrop-blur-sm transition-colors"
        aria-label="Précédent"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={() => setActive((active + 1) % slides.length)}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-[#FFB800] text-white hover:text-[#0A2540] flex items-center justify-center backdrop-blur-sm transition-colors"
        aria-label="Suivant"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-1.5 transition-all ${i === active ? 'w-10 bg-[#FFB800]' : 'w-5 bg-white/40'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
