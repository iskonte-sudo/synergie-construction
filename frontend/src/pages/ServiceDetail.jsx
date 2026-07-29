import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ArrowUpRight, Hammer, HardHat, Wrench, Truck, PenTool, ClipboardCheck, Building2, Home, Layers, FileText, ShieldCheck, Users, HelpCircle, Loader2 } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { process as steps, company } from '../data/mock';
import { useQuoteModal } from '../contexts/QuoteModalContext';
import { useService, useServices } from '../hooks/useServices';

const iconMap = { Hammer, HardHat, Wrench, Truck, PenTool, ClipboardCheck, Building2, Home, Layers, FileText, ShieldCheck, Users };

export default function ServiceDetail() {
  const { serviceId } = useParams();
  const { service, loading, notFound } = useService(serviceId);
  const { services: allServices } = useServices();
  const { openModal } = useQuoteModal();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[#FFB800]" />
      </div>
    );
  }
  if (notFound || !service) return <Navigate to="/services" replace />;

  const Icon = iconMap[service.icon] || Hammer;
  const others = allServices.filter((s) => s.slug !== service.slug).slice(0, 5);
  const heroImg = service.hero_image || service.image;
  const ctaTitle = service.cta_title || `Prêt à lancer votre projet de ${service.title.toLowerCase()} ?`;
  const ctaText = service.cta_text || 'Remplissez un formulaire dédié à ce service et recevez un devis détaillé sous 24h.';
  const ctaBtn = service.cta_button_label || 'Demander un devis pour ce service';

  return (
    <>
      <PageBanner
        title={service.title}
        subtitle="Notre Service"
        breadcrumbs={[{ label: 'Services', path: '/services' }, { label: service.title }]}
        image={heroImg}
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
                    key={s.slug}
                    to={`/services/${s.slug}`}
                    data-testid={`sidebar-service-${s.slug}`}
                    className={`flex items-center justify-between gap-3 p-3 transition-colors ${
                      s.slug === service.slug ? 'bg-[#0A2540] text-white' : 'bg-white hover:bg-[#FFB800] hover:text-[#0A2540] text-[#0A2540]'
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
                <button onClick={() => openModal(service.slug)} className="btn-primary mt-5 text-sm" data-testid="sidebar-quote-btn"><ArrowUpRight size={16} /> Demander un devis</button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <article className="lg:col-span-8 order-1 lg:order-2">
            <img src={service.image} alt={service.title} className="w-full h-[400px] object-cover" data-testid="service-detail-image" />
            <div className="flex items-center gap-4 mt-8">
              <div className="w-14 h-14 bg-[#FFB800] flex items-center justify-center text-[#0A2540]">
                <Icon size={26} />
              </div>
              <h2 className="font-heading text-3xl lg:text-5xl text-[#0A2540] font-extrabold uppercase leading-[1]" data-testid="service-detail-title">
                {service.title}
              </h2>
            </div>
            <p className="text-gray-600 mt-6 leading-relaxed text-lg whitespace-pre-line" data-testid="service-detail-long-description">
              {service.long_description || service.description}
            </p>

            {(service.features || []).length > 0 && (
              <>
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
              </>
            )}

            {(service.sub_services || []).length > 0 && (
              <>
                <h3 className="font-heading text-2xl text-[#0A2540] font-bold uppercase mt-12 mb-5">Nos prestations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {service.sub_services.map((sub, i) => {
                    const SubIcon = iconMap[sub.icon] || FileText;
                    return (
                      <div key={i} className="bg-white border border-gray-200 p-5 hover:border-[#FFB800] transition-colors" data-testid={`subservice-${i}`}>
                        <div className="w-10 h-10 bg-[#FFB800]/15 text-[#FFB800] flex items-center justify-center mb-3">
                          <SubIcon size={20} />
                        </div>
                        <div className="font-bold text-[#0A2540] uppercase text-sm">{sub.title}</div>
                        <div className="text-sm text-gray-600 mt-2">{sub.description}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {(service.gallery || []).length > 0 && (
              <>
                <h3 className="font-heading text-2xl text-[#0A2540] font-bold uppercase mt-12 mb-5">Galerie</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {service.gallery.map((img, i) => (
                    <img key={i} src={img} alt={`${service.title} ${i + 1}`} className="w-full h-40 object-cover" loading="lazy" data-testid={`gallery-img-${i}`} />
                  ))}
                </div>
              </>
            )}

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

            {(service.faqs || []).length > 0 && (
              <>
                <h3 className="font-heading text-2xl text-[#0A2540] font-bold uppercase mt-12 mb-5">Questions fréquentes</h3>
                <div className="space-y-3">
                  {service.faqs.map((f, i) => (
                    <details key={i} className="group bg-[#F5F7FA] p-5 border-l-4 border-[#FFB800]" data-testid={`service-faq-${i}`}>
                      <summary className="flex items-start gap-3 cursor-pointer list-none">
                        <HelpCircle size={20} className="text-[#FFB800] shrink-0 mt-0.5" />
                        <span className="font-semibold text-[#0A2540] flex-1">{f.question}</span>
                      </summary>
                      <div className="mt-3 pl-8 text-sm text-gray-600 whitespace-pre-line">{f.answer}</div>
                    </details>
                  ))}
                </div>
              </>
            )}
          </article>
        </div>
      </section>

      <section className="relative py-20 bg-[#0A2540] text-white overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <div className="section-label justify-center inline-flex mb-4">Démarrer Maintenant</div>
          <h2 className="font-heading text-3xl lg:text-5xl font-extrabold uppercase leading-tight" data-testid="service-cta-title">
            {ctaTitle}
          </h2>
          <p className="text-white/80 mt-4 max-w-xl mx-auto" data-testid="service-cta-text">
            {ctaText}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => openModal(service.slug)} className="btn-primary" data-testid="service-cta-button">
              <ArrowUpRight size={18} /> {ctaBtn}
            </button>
            <a href={`tel:${company.phone}`} className="btn-outline-light">
              Nous appeler
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
