import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit2, X, Save, Star, Upload } from 'lucide-react';
import api, { mediaUrl } from '../../lib/api';
import { PageHeader, formatDate } from './Dashboard';
import './admin.css';

const CATEGORIES = ['Résidentiel', 'Commercial', 'Industriel', 'Institutionnel', 'Rénovation'];
const STATUSES = [
  { value: 'en_etude', label: 'En étude' },
  { value: 'en_cours', label: 'En cours' },
  { value: 'termine', label: 'Terminé' },
];

const EMPTY = {
  title: '', category: 'Résidentiel', location: '', year: new Date().getFullYear(),
  description: '', image: '', images: [], images_before: [], images_after: [],
  documents: [], status: 'termine', featured: false, published: true,
};

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/projects'); setItems(data); }
    catch { toast.error('Erreur'); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Supprimer ce projet ?')) return;
    await api.delete(`/admin/projects/${id}`);
    toast.success('Supprimé');
    fetchData();
  };

  return (
    <div>
      <PageHeader title="Projets" subtitle={`${items.length} projet(s)`}
        actions={<button onClick={() => setEditing({ ...EMPTY })} className="adm-btn adm-btn-primary"><Plus size={14} /> Nouveau projet</button>} />

      {loading ? <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div> :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="adm-card overflow-hidden">
              <div className="relative h-40 bg-slate-100 dark:bg-slate-700">
                {p.image ? <img src={mediaUrl(p.image)} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Aucune image</div>}
                {p.featured && <div className="absolute top-2 left-2 bg-[#FFB800] text-[#0A2540] text-[10px] font-bold uppercase px-2 py-1 flex items-center gap-1"><Star size={10} fill="currentColor" /> Vedette</div>}
                {!p.published && <div className="absolute top-2 right-2 bg-slate-800 text-white text-[10px] font-bold uppercase px-2 py-1">Non publié</div>}
              </div>
              <div className="p-4">
                <div className="text-[10px] uppercase tracking-widest text-[#FFB800] font-semibold">{p.category}</div>
                <h3 className="font-heading font-bold text-[#0A2540] dark:text-white text-lg uppercase leading-tight mt-1">{p.title}</h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.location} • {p.year}</div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing(p)} className="adm-btn adm-btn-ghost text-xs !py-1.5"><Edit2 size={12} /> Modifier</button>
                  <button onClick={() => remove(p.id)} className="adm-btn adm-btn-danger text-xs !py-1.5"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="col-span-full text-center text-slate-400 p-12">Aucun projet</div>}
        </div>
      }

      {editing && <ProjectForm item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetchData(); }} />}
    </div>
  );
}

function ProjectForm({ item, onClose, onSaved }) {
  const [f, setF] = useState(item);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const upd = (k, v) => setF({ ...f, [k]: v });

  const uploadImage = async (files, field) => {
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'projects');
        const { data } = await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        uploaded.push(data.url);
      }
      if (field === 'image') upd('image', uploaded[0]);
      else upd(field, [...(f[field] || []), ...uploaded]);
      toast.success('Image(s) téléchargée(s)');
    } catch { toast.error('Erreur d\'upload'); }
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...f, year: parseInt(f.year, 10) };
      if (item.id) await api.patch(`/admin/projects/${item.id}`, payload);
      else await api.post('/admin/projects', payload);
      toast.success('Enregistré');
      onSaved();
    } catch { toast.error('Erreur'); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 dark:text-white w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between sticky top-0 z-10">
          <h3 className="font-heading text-lg font-extrabold uppercase">{item.id ? 'Modifier' : 'Nouveau'} projet</h3>
          <button onClick={onClose} className="w-9 h-9 hover:bg-[#FFB800] hover:text-[#0A2540] flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Titre du projet" required><input value={f.title} onChange={(e) => upd('title', e.target.value)} className="adm-input" required /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Catégorie"><select value={f.category} onChange={(e) => upd('category', e.target.value)} className="adm-input">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Localisation"><input value={f.location} onChange={(e) => upd('location', e.target.value)} className="adm-input" placeholder="Ex: Dakar" /></Field>
            <Field label="Année"><input type="number" value={f.year} onChange={(e) => upd('year', e.target.value)} className="adm-input" /></Field>
          </div>
          <Field label="Description"><textarea rows={3} value={f.description} onChange={(e) => upd('description', e.target.value)} className="adm-input resize-none" /></Field>
          <Field label="Statut du projet">
            <select value={f.status} onChange={(e) => upd('status', e.target.value)} className="adm-input">
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>

          <Field label="Image principale">
            {f.image && <div className="mb-2"><img src={mediaUrl(f.image)} alt="" className="h-32 object-cover border border-slate-200 dark:border-slate-700" /></div>}
            <label className="adm-btn adm-btn-ghost cursor-pointer">
              <Upload size={14} /> {uploading ? 'Upload...' : 'Choisir une image'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadImage([e.target.files[0]], 'image')} />
            </label>
          </Field>

          <ImageList label="Galerie" items={f.images} onRemove={(i) => upd('images', f.images.filter((_, idx) => idx !== i))} onAdd={(files) => uploadImage(files, 'images')} uploading={uploading} />
          <ImageList label="Avant travaux" items={f.images_before} onRemove={(i) => upd('images_before', f.images_before.filter((_, idx) => idx !== i))} onAdd={(files) => uploadImage(files, 'images_before')} uploading={uploading} />
          <ImageList label="Après travaux" items={f.images_after} onRemove={(i) => upd('images_after', f.images_after.filter((_, idx) => idx !== i))} onAdd={(files) => uploadImage(files, 'images_after')} uploading={uploading} />

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

export function Field({ label, required, children }) {
  return <label className="block"><span className="adm-label">{label} {required && <span className="text-[#FFB800]">*</span>}</span>{children}</label>;
}

function ImageList({ label, items, onRemove, onAdd, uploading }) {
  return (
    <div>
      <div className="adm-label">{label} ({(items || []).length})</div>
      <div className="flex flex-wrap gap-2">
        {(items || []).map((img, i) => (
          <div key={i} className="relative group w-24 h-24 border border-slate-200 dark:border-slate-700">
            <img src={mediaUrl(img)} alt="" className="w-full h-full object-cover" />
            <button onClick={() => onRemove(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"><X size={12} /></button>
          </div>
        ))}
        <label className="w-24 h-24 border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-[#FFB800] text-slate-400 hover:text-[#FFB800]">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /><span className="text-[10px] mt-1">Ajouter</span></>}
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files.length && onAdd(Array.from(e.target.files))} />
        </label>
      </div>
    </div>
  );
}
