import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function PageBanner({ title, subtitle, breadcrumbs = [], image }) {
  const bg = image || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80';
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="absolute inset-0">
        <img src={bg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/95 via-[#0A2540]/85 to-[#0A2540]/60" />
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-1/3 dot-pattern opacity-30 hidden lg:block" />
      <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8">
        {subtitle && <div className="section-label mb-4">{subtitle}</div>}
        <h1 className="font-heading text-white text-5xl lg:text-7xl font-extrabold uppercase leading-[0.95] max-w-4xl text-balance">
          {title}
        </h1>
        <nav className="flex items-center gap-2 mt-6 text-sm text-white/80">
          <Link to="/" className="flex items-center gap-1.5 hover:text-[#FFB800]">
            <Home size={14} /> Accueil
          </Link>
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              <ChevronRight size={14} className="text-[#FFB800]" />
              {b.path ? (
                <Link to={b.path} className="hover:text-[#FFB800]">{b.label}</Link>
              ) : (
                <span className="text-[#FFB800]">{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
