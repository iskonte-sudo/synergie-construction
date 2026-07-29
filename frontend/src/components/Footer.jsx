import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Youtube, MessageCircle, Music2, ArrowRight, Send } from 'lucide-react';
import { company, socials } from '../data/mock';
import { useServices } from '../hooks/useServices';
import { useQuoteModal } from '../contexts/QuoteModalContext';
import { useContent } from '../hooks/useContent';
import logo from '../assets/logo.png';

const SOCIAL_ICONS = { Facebook, Instagram, Linkedin, Twitter, Youtube, MessageCircle, Music2 };

export default function Footer() {
  const { openModal } = useQuoteModal();
  const { t } = useContent();
  const { services } = useServices();
  return (
    <footer className="bg-[#061629] text-gray-300">
      {/* CTA strip */}
      <div className="bg-[#FFB800]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#0A2540]/70">{t('footer.cta_pre', 'Prêt à démarrer ?')}</div>
            <h3 className="font-heading text-2xl md:text-3xl text-[#0A2540] font-bold mt-1">
              {t('footer.cta_title', 'Discutons de votre prochain projet de construction.')}
            </h3>
          </div>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 bg-[#0A2540] text-white px-7 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#143560] transition-colors"
          >
            {t('footer.cta_button', 'Demander un devis')} <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Brand */}
        <div className="lg:col-span-4">
          <div className="mb-5">
            <img src={logo} alt="Synergies Construction Group" className="h-16 w-auto object-contain" />
          </div>
          <p className="text-sm leading-relaxed text-gray-400 mb-6">
            {t('footer.about', "Entreprise spécialisée dans les études, la conception et la réalisation de projets de construction. Nous accompagnons particuliers, entreprises et institutions à chaque étape.")}
          </p>
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon] || Facebook;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  title={s.name}
                  className="w-10 h-10 flex items-center justify-center border border-gray-700 hover:border-[#FFB800] hover:bg-[#FFB800] hover:text-[#0A2540] text-gray-400 transition-colors"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Services */}
        <div className="lg:col-span-3">
          <h4 className="font-heading text-white text-lg font-bold mb-5 uppercase tracking-wider">{t('footer.services_title', 'Nos Services')}</h4>
          <ul className="space-y-3">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link
                  to={`/services/${s.slug}`}
                  className="text-sm text-gray-400 hover:text-[#FFB800] hover:pl-1 transition-all inline-flex items-center gap-2"
                >
                  <span className="w-1 h-1 bg-[#FFB800]" /> {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <h4 className="font-heading text-white text-lg font-bold mb-5 uppercase tracking-wider">{t('footer.contact_title', 'Contact')}</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm">
              <MapPin size={18} className="text-[#FFB800] shrink-0 mt-0.5" />
              <span className="text-gray-400">{company.address}</span>
            </li>
            <li className="flex gap-3 text-sm">
              <Phone size={18} className="text-[#FFB800] shrink-0 mt-0.5" />
              <a href={`tel:${company.phone}`} className="text-gray-400 hover:text-[#FFB800]">{company.phoneDisplay}</a>
            </li>
            <li className="flex gap-3 text-sm">
              <Mail size={18} className="text-[#FFB800] shrink-0 mt-0.5" />
              <a href={`mailto:${company.email}`} className="text-gray-400 hover:text-[#FFB800] break-all">{company.email}</a>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="lg:col-span-2">
          <h4 className="font-heading text-white text-lg font-bold mb-5 uppercase tracking-wider">{t('footer.newsletter_title', 'Newsletter')}</h4>
          <p className="text-sm text-gray-400 mb-4">{t('footer.newsletter_text', 'Recevez nos dernières actualités.')}</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex">
            <input
              type="email"
              required
              placeholder={t('footer.newsletter_placeholder', 'Votre email')}
              className="flex-1 min-w-0 bg-white/5 border border-gray-700 text-white text-sm px-3 py-3 placeholder:text-gray-500 focus:outline-none focus:border-[#FFB800]"
            />
            <button
              type="submit"
              className="bg-[#FFB800] text-[#0A2540] px-4 hover:bg-[#E5A500] transition-colors"
              aria-label="Subscribe"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>© {new Date().getFullYear()} Synergies Construction Group. Tous droits réservés.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FFB800]">Mentions légales</a>
            <a href="#" className="hover:text-[#FFB800]">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
