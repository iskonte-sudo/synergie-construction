import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, MessageSquare, Briefcase, Wrench, Calculator,
  Users, Settings as SettingsIcon, Image as ImageIcon, ScrollText, Sliders,
  Quote as QuoteIcon, HelpCircle, UserCircle2, Handshake, Newspaper, MenuSquare, FileType2,
  Menu, X, LogOut, Moon, Sun, ChevronDown, ExternalLink, User as UserIcon, ShieldCheck, Loader2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const MENU = [
  { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard, end: true },
  { section: 'Contenu' },
  { label: 'Contenu des pages', path: '/admin/contenu', icon: FileType2 },
  { label: 'Slider accueil', path: '/admin/slider', icon: Sliders },
  { label: 'Menus', path: '/admin/menus', icon: MenuSquare, adminOnly: true },
  { label: 'Blog', path: '/admin/blog', icon: Newspaper },
  { section: 'Ressources' },
  { label: 'Projets', path: '/admin/projets', icon: Briefcase },
  { label: 'Services', path: '/admin/services', icon: Wrench },
  { label: 'Témoignages', path: '/admin/temoignages', icon: QuoteIcon },
  { label: 'FAQ', path: '/admin/faq', icon: HelpCircle },
  { label: 'Équipe', path: '/admin/equipe', icon: UserCircle2 },
  { label: 'Partenaires', path: '/admin/partenaires', icon: Handshake },
  { section: 'Interactions' },
  { label: 'Devis', path: '/admin/devis', icon: FileText },
  { label: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { label: 'Simulations', path: '/admin/simulations', icon: Calculator },
  { label: 'Config simulateur', path: '/admin/simulateur-config', icon: Calculator, adminOnly: true },
  { section: 'Système' },
  { label: 'Médiathèque', path: '/admin/media', icon: ImageIcon },
  { label: 'Utilisateurs', path: '/admin/utilisateurs', icon: Users, superOnly: true },
  { label: 'Journal d\'actions', path: '/admin/journal', icon: ScrollText, adminOnly: true },
  { label: 'Paramètres', path: '/admin/parametres', icon: SettingsIcon, adminOnly: true },
];

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('scg_admin_dark') === '1');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('scg_admin_dark', dark ? '1' : '0');
  }, [dark]);

  useEffect(() => { setSidebarOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A2540]">
        <Loader2 size={40} className="animate-spin text-[#FFB800]" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  const doLogout = () => {
    logout();
    nav('/admin/login', { replace: true });
  };

  const visibleMenu = MENU.filter((m) => {
    if (m.superOnly) return user.role === 'super_admin';
    if (m.adminOnly) return user.role === 'super_admin' || user.role === 'admin';
    return true;
  });

  const roleLabel = { super_admin: 'Super Admin', admin: 'Administrateur', editor: 'Éditeur' }[user.role] || user.role;

  return (
    <div className={`min-h-screen ${dark ? 'bg-slate-900' : 'bg-slate-50'} flex`}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 z-40 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${dark ? 'bg-slate-950 border-slate-800' : 'bg-[#0A2540] border-[#143560]'} border-r flex flex-col`}
      >
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <img src={logo} alt="SCG" className="h-11 w-auto object-contain shrink-0" />
          <div className="leading-tight min-w-0">
            <div className="text-[9px] uppercase tracking-[0.2em] text-[#FFB800] font-semibold">Admin</div>
            <div className="font-heading font-bold text-white truncate">Synergie</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {visibleMenu.map((item, idx) => {
            if (item.section) {
              return (
                <div key={`s-${idx}`} className="px-5 pt-4 pb-2 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  {item.section}
                </div>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-2.5 text-sm font-semibold transition-colors border-l-2 ${
                    isActive
                      ? 'bg-white/10 text-[#FFB800] border-[#FFB800]'
                      : 'text-white/70 hover:text-white hover:bg-white/5 border-transparent'
                  }`
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-white/60 hover:text-[#FFB800] mb-3"
          >
            <ExternalLink size={14} /> Voir le site public
          </a>
          <button
            onClick={() => setDark(!dark)}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
            {dark ? 'Mode clair' : 'Mode sombre'}
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className={`sticky top-0 z-20 ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-b`}>
          <div className="flex items-center justify-between gap-4 px-4 lg:px-8 h-16">
            <button
              className={`lg:hidden w-10 h-10 flex items-center justify-center ${dark ? 'text-white' : 'text-[#0A2540]'}`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex-1 min-w-0">
              <div className={`text-[10px] uppercase tracking-widest ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Espace Administration</div>
              <div className={`font-heading font-bold text-lg truncate ${dark ? 'text-white' : 'text-[#0A2540]'}`}>Synergie Construction Group</div>
            </div>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-3 px-3 py-2 border ${dark ? 'border-slate-700 hover:bg-slate-800 text-white' : 'border-slate-200 hover:bg-slate-100 text-[#0A2540]'}`}
              >
                <div className="w-8 h-8 bg-[#FFB800] text-[#0A2540] rounded-full flex items-center justify-center font-heading font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <div className="text-sm font-semibold truncate max-w-[120px]">{user.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#FFB800] flex items-center gap-1">
                    <ShieldCheck size={10} /> {roleLabel}
                  </div>
                </div>
                <ChevronDown size={14} className="hidden sm:block" />
              </button>
              {userMenuOpen && (
                <div className={`absolute right-0 top-full mt-2 w-56 shadow-xl border ${dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-[#0A2540]'}`}>
                  <div className={`px-4 py-3 border-b ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <div className="text-xs text-slate-500">Connecté en tant que</div>
                    <div className="text-sm font-semibold truncate">{user.email}</div>
                  </div>
                  <Link
                    to="/admin/profil"
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm ${dark ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
                  >
                    <UserIcon size={14} /> Mon profil
                  </Link>
                  <button
                    onClick={doLogout}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 ${dark ? 'hover:bg-slate-700' : 'hover:bg-red-50'}`}
                  >
                    <LogOut size={14} /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={`flex-1 p-4 lg:p-8 ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
