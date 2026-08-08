import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Loader2, Search, Trash2, X, Mail, Send, Save, Phone } from 'lucide-react';
import api from '../../lib/api';
import { PageHeader, StatusBadge, formatDate } from './Dashboard';
import './admin.css';

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (status) params.status = status;
      if (q) params.q = q;
      const { data } = await api.get('/admin/messages', { params });
      setItems(data);
    } catch (e) {
      toast.error('Erreur');
    }
    setLoading(false);
  }, [status, q]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const removeItem = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    await api.delete(`/admin/messages/${id}`);
    toast.success('Supprimé');
    fetchData();
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div>
      <PageHeader title="Messages" subtitle={`${items.length} message(s)`} />

      <div className="flex flex-wrap gap-2 mb-4">
        {['', 'nouveau', 'lu', 'repondu', 'archive'].map((s) => (
          <button key={s || 'all'} onClick={() => setStatus(s)} className={`adm-btn ${status === s ? 'adm-btn-primary' : 'adm-btn-ghost'}`}>
            {s === '' ? 'Tous' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchData(); }} className="adm-card p-4 mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="adm-input pl-9" placeholder="Rechercher par nom, email, contenu..." />
        </div>
      </form>

      <div className="adm-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-400">Aucun message</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr><th>Date</th><th>Expéditeur</th><th>Sujet</th><th>Aperçu</th><th>Statut</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className="cursor-pointer" onClick={() => setSelected(i)}>
                    <td className="text-xs text-slate-500">{formatDate(i.created_at)}</td>
                    <td className="font-semibold text-[#0A2540] dark:text-white">{i.name}<br /><span className="text-xs text-slate-500 font-normal">{i.email}</span></td>
                    <td className="text-xs">{i.subject || '—'}</td>
                    <td className="text-xs text-slate-500 max-w-md truncate">{i.message}</td>
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

      {selected && <MessageDetail item={selected} onClose={() => setSelected(null)} onUpdated={(u) => { setSelected(u); fetchData(); }} />}
    </div>
  );
}

function MessageDetail({ item, onClose, onUpdated }) {
  const [reply, setReply] = useState(item.reply || '');
  const [status, setStatus] = useState(item.status === 'nouveau' ? 'lu' : item.status);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch(`/admin/messages/${item.id}`, { reply, status });
      toast.success('Enregistré');
      onUpdated(data);
    } catch (e) { toast.error('Erreur'); }
    setSaving(false);
  };

  const mailtoLink = `mailto:${item.email}?subject=${encodeURIComponent('Re: ' + (item.subject || 'Votre message'))}&body=${encodeURIComponent(reply || '')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 dark:text-white w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between">
          <h3 className="font-heading text-lg font-extrabold uppercase">Message de {item.name}</h3>
          <button onClick={onClose} className="w-9 h-9 hover:bg-[#FFB800] hover:text-[#0A2540] flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-slate-500 dark:text-slate-400 text-xs uppercase">Email</span><br /><a href={`mailto:${item.email}`} className="font-semibold text-[#0A2540] dark:text-white">{item.email}</a></div>
            {item.phone && <div><span className="text-slate-500 dark:text-slate-400 text-xs uppercase">Tél</span><br /><a href={`tel:${item.phone}`} className="font-semibold text-[#0A2540] dark:text-white">{item.phone}</a></div>}
          </div>
          <div>
            <div className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Message reçu</div>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 text-sm whitespace-pre-wrap border border-slate-100 dark:border-slate-700">{item.message}</div>
          </div>
          <div>
            <label className="adm-label">Réponse / Note interne</label>
            <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={5} className="adm-input resize-none" placeholder="Votre réponse..." />
          </div>
          <div>
            <label className="adm-label">Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="adm-input">
              <option value="nouveau">Nouveau</option>
              <option value="lu">Lu</option>
              <option value="repondu">Répondu</option>
              <option value="archive">Archivé</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer
            </button>
            <a href={mailtoLink} className="adm-btn adm-btn-dark"><Send size={14} /> Envoyer par email</a>
          </div>
        </div>
      </div>
    </div>
  );
}
