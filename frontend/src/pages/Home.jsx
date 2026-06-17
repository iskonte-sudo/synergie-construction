import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import ServicesGrid from '../components/ServicesGrid';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import FAQSection from '../components/FAQSection';
import QuoteForm from '../components/QuoteForm';
import { company, process as steps } from '../data/mock';

export default function Home() {
  return (
    <>
      <HeroSlider />

      {/* About strip */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 dot-pattern hidden lg:block" />
            <img
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
              alt="Modern villa"
              loading="lazy"
              className="relative w-full h-[460px] object-cover shadow-xl"
            />
            <div className="absolute -bottom-8 -right-8 bg-[#FFB800] p-6 hidden md:block shadow-xl">
              <div className="font-heading text-5xl font-extrabold text-[#0A2540] leading-none">{company.projects}+</div>
              <div className="text-xs uppercase tracking-widest text-[#0A2540] font-semibold mt-2">Projets réalisés</div>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="section-label mb-4">À Propos de Nous</div>
            <h2 className="font-heading text-4xl lg:text-5xl xl:text-6xl text-[#0A2540] font-extrabold uppercase leading-[0.95] text-balance">
              Construisons vos projets avec expertise et confiance
            </h2>
            <p className="text-gray-600 mt-6 leading-relaxed">
              <strong className="text-[#0A2540]">Synergies Construction Group (SCG)</strong> est une entreprise spécialisée dans les études, la conception et la réalisation de projets de construction. Nous accompagnons particuliers, entreprises et institutions à chaque étape de leurs projets, de l'idée initiale jusqu'à la livraison finale.
            </p>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Équipe pluridisciplinaire', 'Matériaux certifiés', 'Garantie décennale', 'Devis gratuit & rapide'].map((l) => (
                <li key={l} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={18} className="text-[#FFB800] shrink-0" /> {l}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/a-propos" className="btn-primary"><ArrowUpRight size={18} /> En savoir plus</Link>
              <Link to="/realisations" className="inline-flex items-center gap-2 text-[#0A2540] font-semibold uppercase tracking-wider text-sm border-b-2 border-[#0A2540] hover:border-[#FFB800] hover:text-[#FFB800] pb-1 transition-colors">
                Voir nos réalisations <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ServicesGrid />
      <FeaturesSection />

      {/* CTA + Form */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A2540]/92" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6 text-white pt-6">
            <div className="section-label mb-4">Notre Processus</div>
            <h2 className="font-heading text-4xl lg:text-5xl font-extrabold uppercase leading-[0.95] text-balance">
              De la conception à la réalisation
            </h2>
            <p className="text-white/80 mt-5 leading-relaxed max-w-xl">
              Synergies Construction Group vous offre un accompagnement complet tout au long de votre projet. De l'élaboration des plans 2D et 3D jusqu'à la livraison finale, nous mettons à votre disposition une équipe qualifiée et engagée.
            </p>
            <div className="mt-10 space-y-3">
              {steps.map((s, i) => (
                <div key={i} className="group flex items-center gap-5 border-b border-white/15 pb-3 hover:border-[#FFB800]">
                  <span className="font-heading text-3xl font-extrabold text-[#FFB800] w-14 shrink-0">{s.step}</span>
                  <div>
                    <div className="font-heading font-bold uppercase text-lg">{s.title}</div>
                    <div className="text-sm text-white/70">{s.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6">
            <QuoteForm />
          </div>
        </div>
      </section>

      <TestimonialsSection />
      <FAQSection />
    </>
  );
}
