import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Hammer, HardHat, Wrench, Truck, PenTool, ClipboardCheck, FileText } from 'lucide-react';
import { services } from '../data/mock';
import { useQuoteModal } from '../contexts/QuoteModalContext';

const iconMap = { Hammer, HardHat, Wrench, Truck, PenTool, ClipboardCheck };

export default function ServicesGrid({ dark = false }) {
  const { openModal } = useQuoteModal();
  return (
    <section className={`py-20 lg:py-28 ${dark ? 'bg-[#0A2540] text-white' : 'bg-white'}`}>
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-3xl">
            <div className="section-label mb-4">Découvrez Nos Services</div>
            <h2 className={`font-heading text-4xl lg:text-6xl font-extrabold uppercase leading-[0.95] text-balance ${dark ? 'text-white' : 'text-[#0A2540]'}`}>
              Des solutions innovantes pour bâtir vos ambitions
            </h2>
          </div>
          <Link to="/services" className="btn-primary self-start lg:self-end shrink-0">
            <ArrowUpRight size={18} /> Tous nos services
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = iconMap[s.icon] || Hammer;
            return (
              <div
                key={s.id}
                className="service-card group relative bg-white overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl flex flex-col"
              >
                <Link to={`/services/${s.id}`} className="block relative h-56 overflow-hidden bg-gray-100">
                  <img src={s.image} alt={s.title} loading="lazy" className="card-img w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/70 to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-[#FFB800] flex items-center justify-center text-[#0A2540]">
                    <Icon size={22} />
                  </div>
                </Link>
                <div className="p-6 flex-1 flex flex-col">
                  <Link to={`/services/${s.id}`}>
                    <h3 className="font-heading text-xl font-bold text-[#0A2540] uppercase leading-tight group-hover:text-[#FFB800] transition-colors">
                      {s.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3 flex-1">{s.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <Link
                      to={`/services/${s.id}`}
                      className="inline-flex items-center gap-1.5 text-[#0A2540] font-semibold text-xs uppercase tracking-wider hover:text-[#FFB800] transition-colors"
                    >
                      En savoir plus <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
                    </Link>
                    <button
                      onClick={() => openModal(s.id)}
                      className="inline-flex items-center gap-1.5 bg-[#FFB800] text-[#0A2540] px-3 py-2 font-semibold text-xs uppercase tracking-wider hover:bg-[#E5A500] transition-colors"
                    >
                      <FileText size={13} /> Devis
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
