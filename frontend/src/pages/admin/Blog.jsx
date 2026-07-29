import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit2, X, Save, Upload, Eye } from 'lucide-react';
import api, { mediaUrl } from '../../lib/api';
import { PageHeader, formatDate } from './Dashboard';
import { Field } from './Projects';
import './admin.css';

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '', cover_image: '',
  category: 'Actualités', tags: [], author: '',
  seo_title: '', seo_description: '', og_image: '',
  published: false,
};

export default function AdminBlog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/blog'); setItems(data); }
    catch { toast.error('Erreur'); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    await api.delete(`/admin/blog/${id}`);
    toast.success('Supprimé');
    fetchData();
  };

  return (
    <div>
      <PageHeader title="Blog / Actualités" subtitle={`${items.length} article(s)`}
        actions={<button onClick={() => setEditing({ ...EMPTY })} className="adm-btn adm-btn-primary"><Plus size={14} /> Nouvel article</button>} />

      <div className="adm-card overflow-hidden">
        {loading ? <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div> :
          items.length === 0 ? <div className="p-12 text-center text-slate-400">Aucun article</div> :
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead><tr><th>Article</th><th>Catégorie</th><th>Statut</th><th>Vues</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {p.cover_image ? <img src={mediaUrl(p.cover_image)} alt="" className="h-12 w-16 object-cover" /> : <div className="h-12 w-16 bg-slate-200" />}
                        <div>
                          <div className="font-semibold text-[#0A2540] dark:text-white">{p.title}</div>
                          <div className="text-xs text-slate-500">/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="adm-badge adm-badge-neutral">{p.category}</span></td>
                    <td>{p.published ? <span className="adm-badge adm-badge-accepted">Publié</span> : <span className="adm-badge adm-badge-neutral">Brouillon</span>}</td>
                    <td className="text-xs"><Eye size={12} className="inline mr-1" />{p.views || 0}</td>
                    <td className="text-xs text-slate-500">{formatDate(p.created_at)}</td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => setEditing(p)} className="text-[#0A2540] dark:text-white hover:text-[#FFB800] p-1 mr-1"><Edit2 size={14} /></button>
                      <button onClick={() => remove(p.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {editing && <BlogForm item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetchData(); }} />}
    </div>
  );
}

function BlogForm({ item, onClose, onSaved }) {
  const [f, setF] = useState(item);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState('content');
  const upd = (k, v) => setF({ ...f, [k]: v });

  const uploadImage = async (file, field) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('folder', 'blog');
      const { data } = await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      upd(field, data.url);
    } catch { toast.error('Erreur upload'); }
    setUploading(false);
  };

  const save = async () => {
    if (!f.slug && f.title) {
      f.slug = f.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 80);
    }
    setSaving(true);
    try {
      const payload = { ...f };
      if (typeof payload.tags === 'string') payload.tags = payload.tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (item.id) await api.patch(`/admin/blog/${item.id}`, payload);
      else await api.post('/admin/blog', payload);
      toast.success('Enregistré');
      onSaved();
    } catch (e) { toast.error(e?.response?.data?.detail || 'Erreur'); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 dark:text-white w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between sticky top-0 z-10">
          <h3 className="font-heading text-lg font-extrabold uppercase">{item.id ? 'Modifier' : 'Nouvel'} article</h3>
          <button onClick={onClose} className="w-9 h-9 hover:bg-[#FFB800] hover:text-[#0A2540] flex items-center justify-center"><X size={18} /></button>
        </div>

        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 px-6 sticky top-[68px] bg-white dark:bg-slate-800 z-10">
          {[{ k: 'content', l: 'Contenu' }, { k: 'seo', l: 'SEO' }, { k: 'meta', l: 'Métadonnées' }].map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`px-4 py-3 text-sm font-semibold uppercase tracking-wider border-b-2 ${tab === t.k ? 'border-[#FFB800] text-[#FFB800]' : 'border-transparent text-slate-500 hover:text-[#0A2540] dark:hover:text-white'}`}>{t.l}</button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {tab === 'content' && (
            <>
              <Field label="Titre de l'article" required><input value={f.title} onChange={(e) => upd('title', e.target.value)} className="adm-input" /></Field>
              <Field label="Slug (URL)" ><input value={f.slug} onChange={(e) => upd('slug', e.target.value)} className="adm-input" placeholder="auto-généré si vide" /></Field>
              <Field label="Résumé / Extrait"><textarea rows={2} value={f.excerpt} onChange={(e) => upd('excerpt', e.target.value)} className="adm-input resize-none" placeholder="Court résumé pour la liste des articles" /></Field>
              <Field label="Image de couverture">
                {f.cover_image && <div className="mb-2"><img src={mediaUrl(f.cover_image)} alt="" className="h-32 object-cover border border-slate-200 dark:border-slate-700" /></div>}
                <label className="adm-btn adm-btn-ghost cursor-pointer"><Upload size={14} /> {uploading ? 'Upload...' : 'Choisir'}<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], 'cover_image')} /></label>
              </Field>
              <Field label="Contenu (Markdown)">
                <textarea rows={18} value={f.content} onChange={(e) => upd('content', e.target.value)} className="adm-input resize-y font-mono text-sm" placeholder="# Titre\n\nVotre contenu en **Markdown**..." />
                <p className="text-xs text-slate-500 mt-1">Vous pouvez utiliser du **gras**, *italique*, [lien](url), listes, titres # ## ###, etc.</p>
              </Field>
            </>
          )}
          {tab === 'seo' && (
            <>
              <Field label="Titre SEO (balise meta title)"><input value={f.seo_title} onChange={(e) => upd('seo_title', e.target.value)} className="adm-input" placeholder="Titre affiché dans Google (60 car. max)" /></Field>
              <Field label="Description SEO (meta description)"><textarea rows={3} value={f.seo_description} onChange={(e) => upd('seo_description', e.target.value)} className="adm-input resize-none" placeholder="Description affichée dans les résultats de recherche (155 car. max)" /></Field>
              <Field label="Image de partage (Open Graph)">
                {f.og_image && <div className="mb-2"><img src={mediaUrl(f.og_image)} alt="" className="h-32 object-cover border border-slate-200 dark:border-slate-700" /></div>}
                <label className="adm-btn adm-btn-ghost cursor-pointer"><Upload size={14} /> Choisir<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], 'og_image')} /></label>
                <p className="text-xs text-slate-500 mt-1">Image affichée quand l'article est partagé sur Facebook, LinkedIn, WhatsApp (1200x630 recommandé)</p>
              </Field>
            </>
          )}
          {tab === 'meta' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Catégorie"><input value={f.category} onChange={(e) => upd('category', e.target.value)} className="adm-input" placeholder="Actualités, Conseils, ..." /></Field>
                <Field label="Auteur"><input value={f.author} onChange={(e) => upd('author', e.target.value)} className="adm-input" placeholder="Nom de l'auteur" /></Field>
              </div>
              <Field label="Tags (séparés par virgule)"><input value={Array.isArray(f.tags) ? f.tags.join(', ') : f.tags} onChange={(e) => upd('tags', e.target.value)} className="adm-input" placeholder="construction, conseils, dakar" /></Field>
              <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <input type="checkbox" checked={f.published} onChange={(e) => upd('published', e.target.checked)} />
                <span className="text-sm font-semibold">Publier cet article (visible publiquement)</span>
              </label>
            </>
          )}
          <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer</button>
            <button onClick={onClose} className="adm-btn adm-btn-ghost">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}
