import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, FileText, MessageSquare, Briefcase, Calculator, Wrench,
  TrendingUp, Eye, ArrowUpRight, Clock, Loader2,
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from 'recharts';
import api from '../../lib/api';
import './admin.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => { setData(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!data) return <div className="text-red-500">Erreur de chargement</div>;

  const { stats, months, top_pages, recent_quotes, recent_messages } = data;
  const cards = [
    { title: 'Visiteurs', value: stats.visits.total, sub: `+${stats.visits.today} aujourd'hui`, icon: Eye, color: 'blue' },
    { title: 'Devis reçus', value: stats.quotes.total, sub: `${stats.quotes.new} nouveaux`, icon: FileText, color: 'yellow', link: '/admin/devis' },
    { title: 'Messages', value: stats.messages.total, sub: `${stats.messages.new} non lus`, icon: MessageSquare, color: 'green', link: '/admin/messages' },
    { title: 'Projets', value: stats.projects.total, sub: `${stats.projects.published} publiés`, icon: Briefcase, color: 'purple', link: '/admin/projets' },
    { title: 'Simulations', value: stats.simulations.total, sub: 'Historique', icon: Calculator, color: 'pink', link: '/admin/simulations' },
    { title: 'Services', value: stats.services.total, sub: 'Publiés', icon: Wrench, color: 'orange', link: '/admin/services' },
  ];

  return (
    <div>
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de votre activité" />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {cards.map((c) => <StatCard key={c.title} {...c} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 adm-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#0A2540] dark:text-white">Évolution mensuelle</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Devis, visites et simulations</p>
            </div>
            <TrendingUp size={20} className="text-[#FFB800]" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#0A2540" strokeWidth={2} name="Visites" />
                <Line type="monotone" dataKey="quotes" stroke="#FFB800" strokeWidth={2} name="Devis" />
                <Line type="monotone" dataKey="simulations" stroke="#25D366" strokeWidth={2} name="Simulations" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="adm-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#0A2540] dark:text-white">Pages populaires</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Top pages visitées</p>
            </div>
          </div>
          <div className="h-72">
            {top_pages.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top_pages} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="path" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FFB800" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">Aucune donnée</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="adm-card">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-[#0A2540] dark:text-white">Derniers devis</h3>
            <Link to="/admin/devis" className="text-xs font-semibold uppercase tracking-wider text-[#FFB800] hover:underline flex items-center gap-1">
              Voir tout <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recent_quotes.length ? recent_quotes.map((q) => (
              <Link key={q.id} to={`/admin/devis?highlight=${q.id}`} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                <div>
                  <div className="font-semibold text-sm text-[#0A2540] dark:text-white">{q.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{q.service_title || q.service} • {q.phone}</div>
                </div>
                <div className="text-right">
                  <StatusBadge status={q.status} />
                  <div className="text-[10px] text-slate-400 mt-1">{formatDate(q.created_at)}</div>
                </div>
              </Link>
            )) : <Empty label="Aucun devis pour le moment" />}
          </div>
        </div>

        <div className="adm-card">
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-[#0A2540] dark:text-white">Derniers messages</h3>
            <Link to="/admin/messages" className="text-xs font-semibold uppercase tracking-wider text-[#FFB800] hover:underline flex items-center gap-1">
              Voir tout <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {recent_messages.length ? recent_messages.map((m) => (
              <Link key={m.id} to="/admin/messages" className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm text-[#0A2540] dark:text-white truncate">{m.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{m.message?.substring(0, 60)}...</div>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <StatusBadge status={m.status} />
                  <div className="text-[10px] text-slate-400 mt-1">{formatDate(m.created_at)}</div>
                </div>
              </Link>
            )) : <Empty label="Aucun message" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-[#FFB800] font-semibold">Administration</div>
        <h1 className="font-heading text-2xl lg:text-3xl font-extrabold text-[#0A2540] dark:text-white uppercase">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

function StatCard({ title, value, sub, icon: Icon, link }) {
  const Wrap = link ? Link : 'div';
  return (
    <Wrap to={link} className="adm-card p-4 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-[#FFB800]/15 flex items-center justify-center text-[#FFB800]">
          <Icon size={18} />
        </div>
        {link && <ArrowUpRight size={14} className="text-slate-400 group-hover:text-[#FFB800]" />}
      </div>
      <div className="font-heading text-3xl font-extrabold text-[#0A2540] dark:text-white leading-none">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold uppercase tracking-wider">{title}</div>
      <div className="text-[11px] text-slate-400 mt-1">{sub}</div>
    </Wrap>
  );
}

export function StatusBadge({ status }) {
  const map = {
    nouveau: { label: 'Nouveau', cls: 'adm-badge-new' },
    en_cours: { label: 'En cours', cls: 'adm-badge-progress' },
    envoye: { label: 'Envoyé', cls: 'adm-badge-sent' },
    accepte: { label: 'Accepté', cls: 'adm-badge-accepted' },
    refuse: { label: 'Refusé', cls: 'adm-badge-refused' },
    lu: { label: 'Lu', cls: 'adm-badge-neutral' },
    archive: { label: 'Archivé', cls: 'adm-badge-neutral' },
    repondu: { label: 'Répondu', cls: 'adm-badge-accepted' },
  };
  const c = map[status] || { label: status, cls: 'adm-badge-neutral' };
  return <span className={`adm-badge ${c.cls}`}>{c.label}</span>;
}

export function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Empty({ label }) {
  return <div className="p-6 text-center text-sm text-slate-400">{label}</div>;
}

function Loading() {
  return <div className="flex items-center justify-center h-96"><Loader2 size={32} className="animate-spin text-[#FFB800]" /></div>;
}
