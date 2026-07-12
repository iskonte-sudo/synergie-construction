import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit2, X, Save, Upload, Star } from 'lucide-react';
import api, { mediaUrl } from '../../lib/api';
import { PageHeader, formatDate } from './Dashboard';
import { Field } from './Projects';
import './admin.css';

const ICONS = ['Hammer', 'HardHat', 'Wrench', 'Truck', 'PenTool', 'ClipboardCheck', 'Building2', 'Home'];

const EMPTY = {
  title: '', slug: '', short: '', description: '', long_description: '',
  image: '', icon: 'Hammer', features: [], featured: false, published: true, order: 0,
};

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/services'); setItems(data); }
    catch { toast.error('Erreur'); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Supprimer ce service ?')) return;
    await api.delete(`/admin/services/${id}`);
    toast.success('Supprimé');
    fetchData();
  };

  return (
    <div>
      <PageHeader title="Services" subtitle={`${items.length} service(s)`}
        actions={<button onClick={() => setEditing({ ...EMPTY })} className="adm-btn adm-btn-primary"><Plus size={14} /> Nouveau service</button>} />

      {loading ? <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div> :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((s) => (
            <div key={s.id} className="adm-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-[#FFB800]/15 flex items-center justify-center text-[#FFB800] font-heading font-bold text-xs">{s.icon}</div>
                {s.featured && <Star size={16} className="text-[#FFB800] fill-[#FFB800]" />}
              </div>
              <h3 className="font-heading font-bold text-[#0A2540] dark:text-white text-lg uppercase">{s.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{s.short}</p>
              {!s.published && <div className="inline-block mt-2 bg-slate-800 text-white text-[10px] font-bold uppercase px-2 py-1">Non publié</div>}
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEditing(s)} className="adm-btn adm-btn-ghost text-xs !py-1.5"><Edit2 size={12} /> Modifier</button>
                <button onClick={() => remove(s.id)} className="adm-btn adm-btn-danger text-xs !py-1.5"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="col-span-full text-center text-slate-400 p-12">Aucun service</div>}
        </div>
      }

      {editing && <ServiceForm item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetchData(); }} />}
    </div>
  );
}

function ServiceForm({ item, onClose, onSaved }) {
  const [f, setF] = useState(item);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const upd = (k, v) => setF({ ...f, [k]: v });

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('folder', 'services');
      const { data } = await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      upd('image', data.url);
    } catch { toast.error('Erreur upload'); }
    setUploading(false);
  };

  const save = async () => {
    if (!f.slug) {
      const slug = f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
      f.slug = slug;
    }
    setSaving(true);
    try {
      const payload = { ...f, order: parseInt(f.order, 10) || 0 };
      if (item.id) await api.patch(`/admin/services/${item.id}`, payload);
      else await api.post('/admin/services', payload);
      toast.success('Enregistré');
      onSaved();
    } catch (e) { toast.error(e?.response?.data?.detail || 'Erreur'); }
    setSaving(false);
  };

  const addFeature = () => upd('features', [...(f.features || []), '']);
  const removeFeature = (i) => upd('features', f.features.filter((_, idx) => idx !== i));
  const setFeature = (i, v) => upd('features', f.features.map((x, idx) => idx === i ? v : x));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 dark:text-white w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between sticky top-0 z-10">
          <h3 className="font-heading text-lg font-extrabold uppercase">{item.id ? 'Modifier' : 'Nouveau'} service</h3>
          <button onClick={onClose} className="w-9 h-9 hover:bg-[#FFB800] hover:text-[#0A2540] flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Titre" required><input value={f.title} onChange={(e) => upd('title', e.target.value)} className="adm-input" required /></Field>
            <Field label="Slug (URL)"><input value={f.slug} onChange={(e) => upd('slug', e.target.value)} className="adm-input" placeholder="auto-généré si vide" /></Field>
          </div>
          <Field label="Description courte"><input value={f.short} onChange={(e) => upd('short', e.target.value)} className="adm-input" /></Field>
          <Field label="Description"><textarea rows={2} value={f.description} onChange={(e) => upd('description', e.target.value)} className="adm-input resize-none" /></Field>
          <Field label="Description longue"><textarea rows={4} value={f.long_description || ''} onChange={(e) => upd('long_description', e.target.value)} className="adm-input resize-none" /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Icône"><select value={f.icon} onChange={(e) => upd('icon', e.target.value)} className="adm-input">{ICONS.map(i => <option key={i}>{i}</option>)}</select></Field>
            <Field label="Ordre d'affichage"><input type="number" value={f.order} onChange={(e) => upd('order', e.target.value)} className="adm-input" /></Field>
          </div>

          <Field label="Image d'illustration">
            {f.image && <div className="mb-2"><img src={mediaUrl(f.image)} alt="" className="h-32 object-cover border border-slate-200 dark:border-slate-700" /></div>}
            <label className="adm-btn adm-btn-ghost cursor-pointer">
              <Upload size={14} /> {uploading ? 'Upload...' : 'Choisir'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0])} />
            </label>
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="adm-label !mb-0">Caractéristiques</span>
              <button onClick={addFeature} className="adm-btn adm-btn-ghost text-xs !py-1"><Plus size={12} /> Ajouter</button>
            </div>
            <div className="space-y-2">
              {(f.features || []).map((feat, i) => (
                <div key={i} className="flex gap-2">
                  <input value={feat} onChange={(e) => setFeature(i, e.target.value)} className="adm-input flex-1" placeholder="Ex: Études géotechniques" />
                  <button onClick={() => removeFeature(i)} className="adm-btn adm-btn-danger !px-3"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={f.featured} onChange={(e) => upd('featured', e.target.checked)} /> <span className="text-sm">Mettre en avant</span></label>
            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={f.published} onChange={(e) => upd('published', e.target.checked)} /> <span className="text-sm">Publié</span></label>
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer</button>
            <button onClick={onClose} className="adm-btn adm-btn-ghost">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}
