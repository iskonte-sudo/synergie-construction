import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Download, Trash2, X, Eye } from 'lucide-react';
import api, { API_BASE } from '../../lib/api';
import { PageHeader, formatDate } from './Dashboard';
import './admin.css';

export default function AdminSimulations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/simulations');
      setItems(data);
    } catch (e) { toast.error('Erreur'); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const exportExcel = async () => {
    try {
      const token = localStorage.getItem('scg_admin_token');
      const res = await fetch(`${API_BASE}/admin/simulations/export`, { headers: { Authorization: `Bearer ${token}` } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'simulations.xlsx'; a.click();
      URL.revokeObjectURL(url);
      toast.success('Export téléchargé');
    } catch (e) { toast.error('Erreur d\'export'); }
  };

  const removeItem = async (id) => {
    if (!window.confirm('Supprimer cette simulation ?')) return;
    await api.delete(`/admin/simulations/${id}`);
    toast.success('Supprimé');
    fetchData();
  };

  const fmt = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA';

  return (
    <div>
      <PageHeader
        title="Simulations"
        subtitle={`${items.length} simulation(s) réalisée(s)`}
        actions={<button onClick={exportExcel} className="adm-btn adm-btn-dark"><Download size={14} /> Exporter Excel</button>}
      />

      <div className="adm-card overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-400">Aucune simulation réalisée</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr><th>Date</th><th>Réf.</th><th>Type</th><th>Surface</th><th>Estimation</th><th>Client</th><th></th></tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td className="text-xs text-slate-500">{formatDate(i.created_at)}</td>
                    <td className="text-xs font-mono text-[#FFB800] font-bold">{i.reference}</td>
                    <td className="font-semibold capitalize">{i.project_type}</td>
                    <td className="text-xs">{i.surface}</td>
                    <td className="text-xs">{fmt(i.estimate_low)} <br /> — {fmt(i.estimate_high)}</td>
                    <td className="text-xs">
                      <div className="font-semibold text-[#0A2540] dark:text-white">{i.contact?.name}</div>
                      <div className="text-slate-500">{i.contact?.phone}</div>
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => setSelected(i)} className="text-[#0A2540] dark:text-white hover:text-[#FFB800] p-1 mr-1"><Eye size={14} /></button>
                      <button onClick={() => removeItem(i.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-slate-800 dark:text-white w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[#FFB800] font-semibold">Réf: {selected.reference}</div>
                <h3 className="font-heading text-xl font-extrabold uppercase capitalize">Simulation - {selected.project_type}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="w-9 h-9 hover:bg-[#FFB800] hover:text-[#0A2540] flex items-center justify-center"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <Info label="Type de projet" v={selected.project_type} />
              <Info label="Surface" v={selected.surface} />
              <Info label="Budget annoncé" v={selected.budget} />
              <Info label="Délai souhaité" v={selected.delai} />
              <Info label="Prestations" v={(selected.prestations || []).join(', ')} />
              <Info label="Estimation basse" v={fmt(selected.estimate_low)} />
              <Info label="Estimation haute" v={fmt(selected.estimate_high)} />
              <Info label="Délai estimé" v={`${selected.months_low} à ${selected.months_high} mois`} />
              <hr className="border-slate-200 dark:border-slate-700" />
              <Info label="Client" v={selected.contact?.name} />
              <Info label="Email" v={selected.contact?.email} />
              <Info label="Téléphone" v={selected.contact?.phone} />
              <Info label="Adresse" v={selected.contact?.address} />
              {selected.contact?.notes && <Info label="Notes" v={selected.contact.notes} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, v }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-2 last:border-0">
      <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">{label}</span>
      <span className="font-semibold text-[#0A2540] dark:text-white sm:text-right">{v || '—'}</span>
    </div>
  );
}
