import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowUpRight, X } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { projects } from '../data/mock';

const categories = ['Tous', 'Résidentiel', 'Commercial', 'Industriel', 'Institutionnel', 'Rénovation'];

export default function Projects() {
  const [filter, setFilter] = useState('Tous');
  const [active, setActive] = useState(null);
  const filtered = filter === 'Tous' ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      <PageBanner
        title="Nos Réalisations"
        subtitle="Portfolio"
        breadcrumbs={[{ label: 'Réalisations' }]}
        image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2.5 text-sm font-semibold uppercase tracking-wider border transition-colors ${
                  filter === c
                    ? 'bg-[#0A2540] text-white border-[#0A2540]'
                    : 'bg-white text-[#0A2540] border-gray-300 hover:border-[#FFB800] hover:text-[#FFB800]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div key={p.id} className="service-card group relative overflow-hidden shadow-sm hover:shadow-2xl bg-white">
                <div className="relative h-72 overflow-hidden bg-gray-100">
                  <img src={p.image} alt={p.title} loading="lazy" className="card-img w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/95 via-[#0A2540]/30 to-transparent opacity-90" />
                  <div className="absolute top-4 left-4 bg-[#FFB800] text-[#0A2540] text-xs font-bold uppercase px-3 py-1 tracking-wider">{p.category}</div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-heading text-2xl font-bold uppercase leading-tight">{p.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
                      <span className="flex items-center gap-1.5"><MapPin size={13} /> {p.location}</span>
                      <span className="flex items-center gap-1.5"><Calendar size={13} /> {p.year}</span>
                    </div>
                    <button onClick={() => setActive(p)} className="mt-4 inline-flex items-center gap-2 text-[#FFB800] font-semibold uppercase tracking-wider text-xs hover:gap-3 transition-all">
                      Voir le projet <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0A2540] text-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <h3 className="font-heading text-3xl lg:text-4xl font-bold uppercase max-w-2xl">Votre projet mérite de figurer dans notre portfolio</h3>
          <Link to="/contact" className="btn-primary"><ArrowUpRight size={18} /> Démarrer mon projet</Link>
        </div>
      </section>

      {/* Modal */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setActive(null)}>
          <div className="relative bg-white max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setActive(null)} className="absolute top-4 right-4 w-10 h-10 bg-[#0A2540] text-white flex items-center justify-center z-10 hover:bg-[#FFB800] hover:text-[#0A2540]">
              <X size={20} />
            </button>
            <img src={active.image} alt={active.title} className="w-full h-80 object-cover" />
            <div className="p-8">
              <div className="inline-block bg-[#FFB800] text-[#0A2540] text-xs font-bold uppercase px-3 py-1 tracking-wider mb-3">{active.category}</div>
              <h3 className="font-heading text-3xl text-[#0A2540] font-extrabold uppercase">{active.title}</h3>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {active.location}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {active.year}</span>
              </div>
              <p className="text-gray-600 mt-5 leading-relaxed">{active.description}</p>
              <Link to="/contact" onClick={() => setActive(null)} className="btn-primary mt-6">
                <ArrowUpRight size={18} /> Projet similaire ? Demander un devis
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
