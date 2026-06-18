import React from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import QuoteForm from '../components/QuoteForm';
import FAQSection from '../components/FAQSection';
import { company } from '../data/mock';

export default function Contact() {
  const message = encodeURIComponent('Bonjour, je souhaite obtenir un devis pour mon projet.');
  return (
    <>
      <PageBanner
        title="Contactez-nous"
        subtitle="Parlons de votre projet"
        breadcrumbs={[{ label: 'Contact' }]}
        image="https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&w=1920&q=80"
      />

      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: MapPin, title: 'Adresse', content: company.address },
              { icon: Phone, title: 'Téléphone', content: company.phoneDisplay, href: `tel:${company.phone}` },
              { icon: Mail, title: 'Email', content: company.email, href: `mailto:${company.email}` },
              { icon: Clock, title: 'Horaires', content: 'Lun-Ven: 8h-18h | Sam: 9h-13h' },
            ].map((c, i) => (
              <div key={i} className="group p-7 bg-[#F5F7FA] hover:bg-[#0A2540] transition-colors duration-500 border-b-4 border-[#FFB800]">
                <div className="w-14 h-14 bg-[#FFB800] flex items-center justify-center text-[#0A2540] mb-4">
                  <c.icon size={24} />
                </div>
                <div className="font-heading text-xl font-bold text-[#0A2540] uppercase group-hover:text-white">{c.title}</div>
                {c.href ? (
                  <a href={c.href} className="block text-gray-600 mt-2 group-hover:text-gray-300 break-words">{c.content}</a>
                ) : (
                  <div className="text-gray-600 mt-2 group-hover:text-gray-300">{c.content}</div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <QuoteForm subtitle="Écrivez-nous" title="Envoyez-nous un message" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0A2540] text-white p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 dot-pattern opacity-30" />
                <div className="relative">
                  <div className="section-label mb-3">Discutons</div>
                  <h3 className="font-heading text-3xl font-extrabold uppercase">Plusieurs façons de nous joindre</h3>
                  <p className="text-white/80 mt-4">Choisissez le canal qui vous convient le mieux. Nous répondons sous 24h en moyenne.</p>
                  <div className="mt-6 space-y-3">
                    <a href={`tel:${company.phone}`} className="flex items-center gap-3 p-4 bg-white/5 hover:bg-[#FFB800] hover:text-[#0A2540] transition-colors">
                      <Phone size={20} /> <span className="font-semibold">{company.phoneDisplay}</span>
                    </a>
                    <a href={`mailto:${company.email}`} className="flex items-center gap-3 p-4 bg-white/5 hover:bg-[#FFB800] hover:text-[#0A2540] transition-colors">
                      <Mail size={20} /> <span className="font-semibold break-all">{company.email}</span>
                    </a>
                    <a href={`https://wa.me/${company.whatsapp}?text=${message}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#25D366] text-white hover:bg-[#1da851] transition-colors">
                      <MessageCircle size={20} fill="white" /> <span className="font-semibold">WhatsApp</span>
                      <Send size={14} className="ml-auto" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="h-64 overflow-hidden border border-gray-200">
                <iframe
                  title="Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15512.0!2d-17.4404!3d14.7651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zUGFyY2VsbGVzIEFzc2FpbmllcywgRGFrYXIsIFPDqW7DqWdhbA!5e0!3m2!1sfr!2ssn!4v1"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection />
    </>
  );
}
