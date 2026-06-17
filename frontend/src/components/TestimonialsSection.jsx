import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/mock';

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="relative py-20 lg:py-28 bg-[#0A2540] text-white overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="text-center mb-14">
          <div className="section-label mb-3 justify-center">Témoignages Clients</div>
          <h2 className="font-heading text-4xl lg:text-6xl font-extrabold uppercase">Ils nous font confiance</h2>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <Quote size={48} className="text-[#FFB800] mx-auto mb-6" />
          <p key={active} className="text-xl lg:text-2xl leading-relaxed font-light animate-fade-up text-balance">
            “{t.content}”
          </p>
          <div className="flex justify-center mt-6 gap-1">
            {Array.from({ length: t.rating }).map((_, i) => (
              <Star key={i} size={18} className="fill-[#FFB800] text-[#FFB800]" />
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#FFB800]" />
            <div className="text-left">
              <div className="font-heading text-lg font-bold">{t.name}</div>
              <div className="text-sm text-[#FFB800]">{t.role}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-10">
          <button
            onClick={() => setActive((active - 1 + testimonials.length) % testimonials.length)}
            className="w-12 h-12 border border-white/20 hover:bg-[#FFB800] hover:text-[#0A2540] hover:border-[#FFB800] flex items-center justify-center transition-colors"
            aria-label="Précédent"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setActive((active + 1) % testimonials.length)}
            className="w-12 h-12 border border-white/20 hover:bg-[#FFB800] hover:text-[#0A2540] hover:border-[#FFB800] flex items-center justify-center transition-colors"
            aria-label="Suivant"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
