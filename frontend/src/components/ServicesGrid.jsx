import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Hammer, HardHat, Wrench, Truck, PenTool, ClipboardCheck } from 'lucide-react';
import { services } from '../data/mock';

const iconMap = { Hammer, HardHat, Wrench, Truck, PenTool, ClipboardCheck };

export default function ServicesGrid({ dark = false }) {
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
              <Link
                key={s.id}
                to={`/services/${s.id}`}
                className="service-card group relative bg-white overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl"
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img src={s.image} alt={s.title} loading="lazy" className="card-img w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/70 to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-[#FFB800] flex items-center justify-center text-[#0A2540]">
                    <Icon size={22} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-[#0A2540] uppercase leading-tight group-hover:text-[#FFB800] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">{s.description}</p>
                  <div className="mt-5 inline-flex items-center gap-2 text-[#0A2540] font-semibold text-sm uppercase tracking-wider group-hover:text-[#FFB800] transition-colors">
                    En savoir plus <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
