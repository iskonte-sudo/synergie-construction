import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ChevronDown, ArrowUpRight, Facebook, Instagram, Linkedin, Youtube, MessageCircle, Music2 } from 'lucide-react';
import { navigation as fallbackNav, company, socials } from '../data/mock';
import { useQuoteModal } from '../contexts/QuoteModalContext';
import api from '../lib/api';
import logo from '../assets/logo.png';

const SOCIAL_ICONS = { Facebook, Instagram, Linkedin, Youtube, MessageCircle, Music2 };

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const [navigation, setNavigation] = useState(fallbackNav);
  const location = useLocation();
  const { openModal } = useQuoteModal();

  useEffect(() => {
    api.get('/public/menu-items').then(({ data }) => {
      const headerItems = (data || [])
        .filter((m) => m.location === 'header' && m.active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((m) => ({ label: m.label, path: m.path, external: m.external }));
      if (headerItems.length) {
        // Preserve services submenu from fallback if present
        const enriched = headerItems.map((item) => {
          const match = fallbackNav.find((f) => f.path === item.path && f.submenu);
          return match ? { ...item, submenu: match.submenu } : item;
        });
        setNavigation(enriched);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSubmenuOpen(null);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      {/* Top utility bar */}
      <div className={`bg-[#0A2540] text-white text-xs transition-all duration-300 overflow-hidden ${scrolled ? 'max-h-0 opacity-0' : 'max-h-12 opacity-100'}`}>
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-2 flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-5">
            <a href={`tel:${company.phone}`} className="inline-flex items-center gap-2 hover:text-[#FFB800] transition-colors">
              <Phone size={12} /> {company.phoneDisplay}
            </a>
            <a href={`mailto:${company.email}`} className="hidden lg:inline-flex items-center gap-2 hover:text-[#FFB800] transition-colors">
              <Mail size={12} /> {company.email}
            </a>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <span className="hidden sm:inline text-white/60 mr-2 uppercase tracking-widest text-[10px]">Suivez-nous :</span>
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
                  className="w-7 h-7 flex items-center justify-center hover:bg-[#FFB800] hover:text-[#0A2540] transition-colors"
                >
                  <Icon size={13} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-6 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img src={logo} alt="Synergies Construction Group" className="h-14 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0 whitespace-nowrap">
          {navigation.map((item) => (
            <div key={item.label} className="relative group">
              {item.submenu ? (
                <>
                  <button className="flex items-center gap-1 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-[#0A2540] hover:text-[#FFB800] transition-colors">
                    {item.label}
                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72">
                    <div className="bg-white shadow-xl border-t-2 border-[#FFB800] py-2">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="block px-5 py-3 text-sm text-[#0A2540] hover:bg-[#F5F7FA] hover:text-[#FFB800] hover:pl-6 transition-all border-b border-gray-100 last:border-0"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                      isActive ? 'text-[#FFB800]' : 'text-[#0A2540] hover:text-[#FFB800]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <a href={`tel:${company.phone}`} className="hidden xl:flex items-center gap-3 group whitespace-nowrap">
            <div className="w-11 h-11 rounded-full bg-[#FFB800]/15 flex items-center justify-center group-hover:bg-[#FFB800] transition-colors shrink-0">
              <Phone size={18} className="text-[#FFB800] group-hover:text-[#0A2540]" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-widest text-gray-500">Téléphone</div>
              <div className="text-sm font-bold text-[#0A2540]">{company.phoneDisplay}</div>
            </div>
          </a>
          <button onClick={() => openModal()} className="inline-flex btn-primary text-sm whitespace-nowrap">
            <ArrowUpRight size={16} /> Demandez un devis
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden w-11 h-11 flex items-center justify-center bg-[#0A2540] text-white"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[80vh] border-t border-gray-100' : 'max-h-0'
        }`}
      >
        <nav className="px-4 py-4 bg-white max-h-[80vh] overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.label} className="border-b border-gray-100">
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setSubmenuOpen(submenuOpen === item.label ? null : item.label)}
                    className="w-full flex items-center justify-between py-3 text-[#0A2540] font-semibold uppercase text-sm tracking-wider"
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${submenuOpen === item.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {submenuOpen === item.label && (
                    <div className="pl-4 pb-3">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.path}
                          to={sub.path}
                          className="block py-2 text-sm text-gray-700 hover:text-[#FFB800]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className="block py-3 text-[#0A2540] font-semibold uppercase text-sm tracking-wider hover:text-[#FFB800]"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <button onClick={() => openModal()} className="btn-primary w-full justify-center mt-4 text-sm">
            <ArrowUpRight size={16} /> Demandez un devis
          </button>
          <a href={`tel:${company.phone}`} className="flex items-center justify-center gap-2 mt-3 py-3 text-sm font-semibold text-[#0A2540]">
            <Phone size={16} /> {company.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
