import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ArrowUpRight, Hammer, HardHat, Wrench, Truck, PenTool, ClipboardCheck } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import QuoteForm from '../components/QuoteForm';
import { services, process as steps, company } from '../data/mock';

const iconMap = { Hammer, HardHat, Wrench, Truck, PenTool, ClipboardCheck };

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const service = services.find((s) => s.id === serviceId);
  if (!service) return <Navigate to="/services" replace />;
  const Icon = iconMap[service.icon] || Hammer;
  const others = services.filter((s) => s.id !== service.id).slice(0, 5);

  return (
    <>
      <PageBanner
        title={service.title}
        subtitle="Notre Service"
        breadcrumbs={[{ label: 'Services', path: '/services' }, { label: service.title }]}
        image={service.image}
      />

      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="bg-[#F5F7FA] p-6">
              <h4 className="font-heading text-xl font-bold text-[#0A2540] uppercase mb-4">Tous nos services</h4>
              <div className="space-y-2">
                {[service, ...others].map((s) => (
                  <Link
                    key={s.id}
                    to={`/services/${s.id}`}
                    className={`flex items-center justify-between gap-3 p-3 transition-colors ${
                      s.id === service.id ? 'bg-[#0A2540] text-white' : 'bg-white hover:bg-[#FFB800] hover:text-[#0A2540] text-[#0A2540]'
                    }`}
                  >
                    <span className="text-sm font-semibold">{s.title}</span>
                    <ArrowUpRight size={16} />
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-6 bg-[#0A2540] text-white p-7 relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-24 h-24 dot-pattern opacity-30" />
              <div className="relative">
                <div className="text-xs uppercase tracking-widest text-[#FFB800] font-semibold">Besoin d'aide ?</div>
                <div className="font-heading text-2xl font-bold mt-2 leading-tight">Parlez à un expert dès maintenant</div>
                <a href={`tel:${company.phone}`} className="text-[#FFB800] font-bold text-lg block mt-3">{company.phoneDisplay}</a>
                <Link to="/contact" className="btn-primary mt-5 text-sm"><ArrowUpRight size={16} /> Demander un devis</Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <article className="lg:col-span-8 order-1 lg:order-2">
            <img src={service.image} alt={service.title} className="w-full h-[400px] object-cover" />
            <div className="flex items-center gap-4 mt-8">
              <div className="w-14 h-14 bg-[#FFB800] flex items-center justify-center text-[#0A2540]">
                <Icon size={26} />
              </div>
              <h2 className="font-heading text-3xl lg:text-5xl text-[#0A2540] font-extrabold uppercase leading-[1]">
                {service.title}
              </h2>
            </div>
            <p className="text-gray-600 mt-6 leading-relaxed text-lg">{service.longDescription}</p>

            <h3 className="font-heading text-2xl text-[#0A2540] font-bold uppercase mt-10 mb-5">Ce que nous proposons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.features.map((f) => (
                <div key={f} className="flex items-start gap-3 bg-[#F5F7FA] p-4 border-l-4 border-[#FFB800]">
                  <CheckCircle2 size={20} className="text-[#FFB800] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#0A2540]">{f}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-heading text-2xl text-[#0A2540] font-bold uppercase mt-12 mb-5">Notre processus</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {steps.map((st, i) => (
                <div key={i} className="bg-white border border-gray-200 p-5 hover:border-[#FFB800] transition-colors">
                  <div className="font-heading text-3xl font-extrabold text-[#FFB800]">{st.step}</div>
                  <div className="font-bold text-[#0A2540] mt-2 uppercase text-sm">{st.title}</div>
                  <div className="text-xs text-gray-600 mt-2">{st.description}</div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-3xl mx-auto px-4">
          <QuoteForm subtitle="Démarrer Maintenant" title="Demandez un devis pour ce service" />
        </div>
      </section>
    </>
  );
}
