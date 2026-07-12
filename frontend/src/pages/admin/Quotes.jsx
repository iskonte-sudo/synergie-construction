import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Loader2, Search, Download, X, Trash2, Filter, Phone, Mail, Save, Calendar as CalIcon } from 'lucide-react';
import api, { API_BASE } from '../../lib/api';
import { PageHeader, StatusBadge, formatDate } from './Dashboard';
import './admin.css';

const STATUSES = [
  { value: 'nouveau', label: 'Nouveau' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'envoye', label: 'Envoyé' },
  { value: 'accepte', label: 'Accepté' },
  { value: 'refuse', label: 'Refusé' },
];

export default function AdminQuotes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (status) params.status = status;
      if (q) params.q = q;
      if (fromDate) params.from_date = new Date(fromDate).toISOString();
      if (toDate) params.to_date = new Date(toDate + 'T23:59:59').toISOString();
      const { data } = await api.get('/admin/quotes', { params });
      setItems(data);
    } catch (e) {
      toast.error('Erreur de chargement');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [status, fromDate, toDate]);

  const doSearch = (e) => { e.preventDefault(); fetchData(); };

  const exportExcel = async () => {
    try {
      const token = localStorage.getItem('scg_admin_token');
      const res = await fetch(`${API_BASE}/admin/quotes/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'devis.xlsx'; a.click();
      URL.revokeObjectURL(url);
      toast.success('Export téléchargé');
    } catch (e) {
      toast.error('Erreur d\'export');
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Supprimer définitivement ce devis ?')) return;
    await api.delete(`/admin/quotes/${id}`);
    toast.success('Devis supprimé');
    fetchData();
    if (selected?.id === id) setSelected(null);
  };

  const counts = useMemo(() => {
    const c = { total: items.length };
    STATUSES.forEach((s) => { c[s.value] = items.filter((i) => i.status === s.value).length; });
    return c;
  }, [items]);

  return (
    <div>
      <PageHeader
        title="Devis"
        subtitle={`${counts.total} demande(s) - ${counts.nouveau || 0} nouveau(x)`}
        actions={<button onClick={exportExcel} className="adm-btn adm-btn-dark"><Download size={14} /> Exporter Excel</button>}
      />

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setStatus('')} className={`adm-btn ${status === '' ? 'adm-btn-primary' : 'adm-btn-ghost'}`}>Tous ({counts.total})</button>
        {STATUSES.map((s) => (
          <button key={s.value} onClick={() => setStatus(s.value)} className={`adm-btn ${status === s.value ? 'adm-btn-primary' : 'adm-btn-ghost'}`}>
            {s.label} ({counts[s.value] || 0})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="adm-card p-4 mb-6">
        <form onSubmit={doSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="adm-input pl-9" placeholder="Nom, email ou téléphone..." />
          </div>
          <div className="relative">
            <CalIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="adm-input pl-9" />
          </div>
          <div className="relative">
            <CalIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="adm-input pl-9" />
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="adm-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-400">Aucun devis trouvé</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Contact</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className="cursor-pointer" onClick={() => setSelected(i)}>
                    <td className="text-xs text-slate-500">{formatDate(i.created_at)}</td>
                    <td className="font-semibold text-[#0A2540] dark:text-white">{i.name}</td>
                    <td className="text-xs">{i.service_title || i.service}</td>
                    <td className="text-xs text-slate-500">{i.phone}<br />{i.email}</td>
                    <td><StatusBadge status={i.status} /></td>
                    <td className="text-right">
                      <button onClick={(e) => { e.stopPropagation(); removeItem(i.id); }} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && <QuoteDetail item={selected} onClose={() => setSelected(null)} onUpdated={(u) => { setSelected(u); fetchData(); }} />}
    </div>
  );
}

function QuoteDetail({ item, onClose, onUpdated }) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.notes || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch(`/admin/quotes/${item.id}`, { status, notes });
      toast.success('Enregistré');
      onUpdated(data);
    } catch (e) {
      toast.error('Erreur');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 dark:text-white w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#FFB800] font-semibold">Devis</div>
            <h3 className="font-heading text-xl font-extrabold uppercase">{item.service_title || item.service}</h3>
          </div>
          <button onClick={onClose} className="w-9 h-9 hover:bg-[#FFB800] hover:text-[#0A2540] flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoField label="Client" value={item.name} />
            <InfoField label="Date" value={formatDate(item.created_at)} />
            <InfoField label="Téléphone" value={<a href={`tel:${item.phone}`} className="text-[#0A2540] dark:text-[#FFB800] flex items-center gap-1"><Phone size={12} /> {item.phone}</a>} />
            <InfoField label="Email" value={<a href={`mailto:${item.email}`} className="text-[#0A2540] dark:text-[#FFB800] flex items-center gap-1"><Mail size={12} /> {item.email}</a>} />
          </div>

          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Détails du formulaire</div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 space-y-2 border border-slate-100 dark:border-slate-700">
              {Object.entries(item.values || {}).length ? Object.entries(item.values || {}).map(([k, v]) => (
                v ? <div key={k} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm border-b border-slate-200 dark:border-slate-700 pb-2 last:border-0 last:pb-0">
                  <span className="text-slate-500 dark:text-slate-400 capitalize">{k.replace(/_/g, ' ')}</span>
                  <span className="font-semibold text-[#0A2540] dark:text-white sm:text-right">{String(v)}</span>
                </div> : null
              )) : <div className="text-sm text-slate-400">Aucun détail supplémentaire</div>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="adm-label">Statut</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="adm-input">
                {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="adm-label">Notes internes</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="adm-input resize-none" placeholder="Ajoutez vos notes..." />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer
            </button>
            <a href={`https://wa.me/${item.phone.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-dark">Contacter via WhatsApp</a>
            <a href={`mailto:${item.email}`} className="adm-btn adm-btn-ghost"><Mail size={14} /> Envoyer un email</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">{label}</div>
      <div className="text-sm font-semibold text-[#0A2540] dark:text-white mt-1">{value}</div>
    </div>
  );
}
