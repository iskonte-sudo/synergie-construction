import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, Search, Copy, X } from 'lucide-react';
import api, { mediaUrl } from '../../lib/api';
import { PageHeader, formatDate } from './Dashboard';
import './admin.css';

export default function AdminMedia() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [q, setQ] = useState('');
  const [folder, setFolder] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (folder) params.folder = folder;
      const { data } = await api.get('/admin/media', { params });
      setItems(data);
    } catch { toast.error('Erreur'); }
    setLoading(false);
  };
const fetchData = useCallback(async () => {
  // contenu actuel de fetchData
}, []);

useEffect(() => {
  fetchData();
}, [fetchData]);
  const doUpload = async (files) => {
    setUploading(true);
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', folder || 'general');
        await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      toast.success('Upload terminé');
      fetchData();
    } catch { toast.error('Erreur upload'); }
    setUploading(false);
  };

  const remove = async (id) => {
    if (!window.confirm('Supprimer ce média ?')) return;
    await api.delete(`/admin/media/${id}`);
    toast.success('Supprimé');
    fetchData();
  };

  const copy = (url) => {
    navigator.clipboard.writeText(mediaUrl(url));
    toast.success('URL copiée');
  };

  const folders = ['general', 'projects', 'services', 'blog', 'documents'];

  return (
    <div>
      <PageHeader title="Médiathèque" subtitle={`${items.length} fichier(s)`}
        actions={
          <label className="adm-btn adm-btn-primary cursor-pointer">
            <Upload size={14} /> {uploading ? 'Upload...' : 'Télécharger'}
            <input type="file" multiple className="hidden" onChange={(e) => e.target.files.length && doUpload(Array.from(e.target.files))} />
          </label>
        } />

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFolder('')} className={`adm-btn ${folder === '' ? 'adm-btn-primary' : 'adm-btn-ghost'}`}>Tous</button>
        {folders.map((f) => (
          <button key={f} onClick={() => setFolder(f)} className={`adm-btn ${folder === f ? 'adm-btn-primary' : 'adm-btn-ghost'}`}>{f}</button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); fetchData(); }} className="adm-card p-4 mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="adm-input pl-9" placeholder="Rechercher par nom..." />
        </div>
      </form>

      {loading ? <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div> :
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {items.map((m) => {
            const isImage = m.mime?.startsWith('image/');
            return (
              <div key={m.id} className="adm-card overflow-hidden group">
                <div className="relative aspect-square bg-slate-100 dark:bg-slate-700">
                  {isImage ? (
                    <img src={mediaUrl(m.url)} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs p-2 text-center">{m.mime}</div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <button onClick={() => copy(m.url)} className="w-9 h-9 bg-white text-[#0A2540] flex items-center justify-center hover:bg-[#FFB800]"><Copy size={14} /></button>
                    <button onClick={() => remove(m.id)} className="w-9 h-9 bg-red-500 text-white flex items-center justify-center hover:bg-red-700"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="p-2">
                  <div className="text-xs font-semibold text-[#0A2540] dark:text-white truncate">{m.name}</div>
                  <div className="text-[10px] text-slate-500">{(m.size / 1024).toFixed(1)} Ko • {m.folder}</div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && <div className="col-span-full text-center text-slate-400 p-12">Aucun média</div>}
        </div>
      }
    </div>
  );
}
