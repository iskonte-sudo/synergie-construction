import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown, ArrowUpRight } from 'lucide-react';
import { navigation, company } from '../data/mock';
import logo from '../assets/logo.png';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const location = useLocation();

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
        scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur-sm py-3'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-6">
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
          <Link to="/contact" className="inline-flex btn-primary text-sm whitespace-nowrap">
            <ArrowUpRight size={16} /> Demandez un devis
          </Link>
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
          <Link to="/contact" className="btn-primary w-full justify-center mt-4 text-sm">
            <ArrowUpRight size={16} /> Demandez un devis
          </Link>
          <a href={`tel:${company.phone}`} className="flex items-center justify-center gap-2 mt-3 py-3 text-sm font-semibold text-[#0A2540]">
            <Phone size={16} /> {company.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
