import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit2, X, Save, Upload, Star, Image as ImageIcon } from 'lucide-react';
import api, { mediaUrl } from '../../lib/api';
import { PageHeader } from './Dashboard';
import { Field } from './Projects';
import './admin.css';

const ICONS = ['Hammer', 'HardHat', 'Wrench', 'Truck', 'PenTool', 'ClipboardCheck', 'Building2', 'Home', 'Layers', 'FileText', 'ShieldCheck', 'Users'];

const EMPTY = {
  title: '', slug: '', short: '', description: '', long_description: '',
  image: '', hero_image: '',
  icon: 'Hammer',
  features: [],
  gallery: [],
  sub_services: [],
  faqs: [],
  cta_title: '', cta_text: '', cta_button_label: 'Demander un devis',
  seo_title: '', seo_description: '', seo_og_image: '',
  featured: false, published: true, order: 0,
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
      <PageHeader title="Services" subtitle={`${items.length} service(s) — Contenu de chaque page entièrement éditable`}
        actions={<button onClick={() => setEditing({ ...EMPTY })} className="adm-btn adm-btn-primary" data-testid="new-service-btn"><Plus size={14} /> Nouveau service</button>} />

      {loading ? <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div> :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="services-list">
          {items.map((s) => (
            <div key={s.id} className="adm-card p-5" data-testid={`admin-service-${s.slug}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-[#FFB800]/15 flex items-center justify-center text-[#FFB800] font-heading font-bold text-xs">{s.icon}</div>
                {s.featured && <Star size={16} className="text-[#FFB800] fill-[#FFB800]" />}
              </div>
              <h3 className="font-heading font-bold text-[#0A2540] dark:text-white text-lg uppercase">{s.title}</h3>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">/services/{s.slug}</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{s.short}</p>
              <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500">
                <span>{(s.features || []).length} caract.</span>
                <span>·</span>
                <span>{(s.sub_services || []).length} prestations</span>
                <span>·</span>
                <span>{(s.faqs || []).length} FAQ</span>
              </div>
              {!s.published && <div className="inline-block mt-2 bg-slate-800 text-white text-[10px] font-bold uppercase px-2 py-1">Non publié</div>}
              <div className="flex gap-2 mt-4">
                <button onClick={() => setEditing(s)} className="adm-btn adm-btn-ghost text-xs !py-1.5" data-testid={`edit-service-${s.slug}`}><Edit2 size={12} /> Modifier</button>
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
  const [f, setF] = useState({ ...EMPTY, ...item });
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [tab, setTab] = useState('info');
  const upd = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const uploadImageTo = async (file, key) => {
    setUploadingKey(key);
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('folder', 'services');
      const { data } = await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      upd(key, data.url);
    } catch { toast.error('Erreur upload'); }
    setUploadingKey(null);
  };

  const uploadGalleryImage = async (file) => {
    setUploadingKey('gallery');
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('folder', 'services');
      const { data } = await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      upd('gallery', [...(f.gallery || []), data.url]);
    } catch { toast.error('Erreur upload'); }
    setUploadingKey(null);
  };

  const save = async () => {
    if (!f.slug) {
      const slug = (f.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
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

  // Features
  const addFeature = () => upd('features', [...(f.features || []), '']);
  const removeFeature = (i) => upd('features', f.features.filter((_, idx) => idx !== i));
  const setFeature = (i, v) => upd('features', f.features.map((x, idx) => idx === i ? v : x));

  // Sub services
  const addSub = () => upd('sub_services', [...(f.sub_services || []), { title: '', description: '', icon: 'FileText' }]);
  const removeSub = (i) => upd('sub_services', f.sub_services.filter((_, idx) => idx !== i));
  const setSub = (i, key, v) => upd('sub_services', f.sub_services.map((x, idx) => idx === i ? { ...x, [key]: v } : x));

  // FAQ
  const addFaq = () => upd('faqs', [...(f.faqs || []), { question: '', answer: '' }]);
  const removeFaq = (i) => upd('faqs', f.faqs.filter((_, idx) => idx !== i));
  const setFaq = (i, key, v) => upd('faqs', f.faqs.map((x, idx) => idx === i ? { ...x, [key]: v } : x));

  // Gallery
  const removeGalleryItem = (i) => upd('gallery', f.gallery.filter((_, idx) => idx !== i));

  const TABS = [
    { id: 'info', label: 'Informations' },
    { id: 'content', label: 'Contenu détaillé' },
    { id: 'features', label: 'Caractéristiques' },
    { id: 'sub', label: 'Prestations' },
    { id: 'gallery', label: 'Galerie' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cta', label: 'CTA' },
    { id: 'seo', label: 'SEO' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 dark:text-white w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between sticky top-0 z-10">
          <h3 className="font-heading text-lg font-extrabold uppercase">{item.id ? 'Modifier' : 'Nouveau'} service</h3>
          <button onClick={onClose} className="w-9 h-9 hover:bg-[#FFB800] hover:text-[#0A2540] flex items-center justify-center"><X size={18} /></button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-700 sticky top-[68px] bg-white dark:bg-slate-800 z-10 overflow-x-auto">
          <div className="flex gap-1 px-4 whitespace-nowrap">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                data-testid={`tab-${id}`}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                  tab === id ? 'border-[#FFB800] text-[#0A2540] dark:text-[#FFB800]' : 'border-transparent text-slate-500 hover:text-[#0A2540] dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {tab === 'info' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Titre" required><input value={f.title} onChange={(e) => upd('title', e.target.value)} className="adm-input" data-testid="input-title" required /></Field>
                <Field label="Slug (URL)"><input value={f.slug} onChange={(e) => upd('slug', e.target.value)} className="adm-input" placeholder="auto-généré si vide" data-testid="input-slug" /></Field>
              </div>
              <Field label="Description courte (utilisée dans les listings)"><input value={f.short} onChange={(e) => upd('short', e.target.value)} className="adm-input" /></Field>
              <Field label="Description (résumé)"><textarea rows={2} value={f.description} onChange={(e) => upd('description', e.target.value)} className="adm-input resize-none" /></Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Icône"><select value={f.icon} onChange={(e) => upd('icon', e.target.value)} className="adm-input">{ICONS.map(i => <option key={i}>{i}</option>)}</select></Field>
                <Field label="Ordre d'affichage"><input type="number" value={f.order} onChange={(e) => upd('order', e.target.value)} className="adm-input" /></Field>
              </div>
              <ImageField label="Image d'illustration (miniature carte)" value={f.image} uploading={uploadingKey === 'image'} onUpload={(file) => uploadImageTo(file, 'image')} onClear={() => upd('image', '')} testid="upload-image" />
              <ImageField label="Image de bannière (hero page détail)" value={f.hero_image} uploading={uploadingKey === 'hero_image'} onUpload={(file) => uploadImageTo(file, 'hero_image')} onClear={() => upd('hero_image', '')} testid="upload-hero" />
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={f.featured} onChange={(e) => upd('featured', e.target.checked)} /> <span className="text-sm">Mettre en avant</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={f.published} onChange={(e) => upd('published', e.target.checked)} data-testid="input-published" /> <span className="text-sm">Publié</span></label>
              </div>
            </>
          )}

          {tab === 'content' && (
            <Field label="Description longue (affichée sur la page de détail)">
              <textarea rows={12} value={f.long_description || ''} onChange={(e) => upd('long_description', e.target.value)} className="adm-input resize-y" data-testid="input-long-description" placeholder="Décrivez le service en détail. Les sauts de ligne sont conservés." />
            </Field>
          )}

          {tab === 'features' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="adm-label !mb-0">Caractéristiques</div>
                  <div className="text-xs text-slate-500 mt-1">Liste à puces affichée sur la page du service.</div>
                </div>
                <button onClick={addFeature} className="adm-btn adm-btn-ghost text-xs !py-1" data-testid="add-feature"><Plus size={12} /> Ajouter</button>
              </div>
              <div className="space-y-2">
                {(f.features || []).map((feat, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={feat} onChange={(e) => setFeature(i, e.target.value)} className="adm-input flex-1" placeholder="Ex: Études géotechniques" data-testid={`feature-${i}`} />
                    <button onClick={() => removeFeature(i)} className="adm-btn adm-btn-danger !px-3"><Trash2 size={14} /></button>
                  </div>
                ))}
                {(f.features || []).length === 0 && <div className="text-sm text-slate-400 py-4 text-center">Aucune caractéristique.</div>}
              </div>
            </div>
          )}

          {tab === 'sub' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="adm-label !mb-0">Sous-services / Prestations</div>
                  <div className="text-xs text-slate-500 mt-1">Cartes détaillées avec titre, description et icône.</div>
                </div>
                <button onClick={addSub} className="adm-btn adm-btn-ghost text-xs !py-1" data-testid="add-sub"><Plus size={12} /> Ajouter</button>
              </div>
              <div className="space-y-3">
                {(f.sub_services || []).map((sub, i) => (
                  <div key={i} className="p-4 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input value={sub.title || ''} onChange={(e) => setSub(i, 'title', e.target.value)} className="adm-input sm:col-span-2" placeholder="Titre" data-testid={`sub-title-${i}`} />
                      <select value={sub.icon || 'FileText'} onChange={(e) => setSub(i, 'icon', e.target.value)} className="adm-input">{ICONS.map(ic => <option key={ic}>{ic}</option>)}</select>
                    </div>
                    <textarea rows={2} value={sub.description || ''} onChange={(e) => setSub(i, 'description', e.target.value)} className="adm-input resize-none" placeholder="Description" />
                    <div className="flex justify-end">
                      <button onClick={() => removeSub(i)} className="adm-btn adm-btn-danger text-xs !py-1"><Trash2 size={12} /> Supprimer</button>
                    </div>
                  </div>
                ))}
                {(f.sub_services || []).length === 0 && <div className="text-sm text-slate-400 py-4 text-center">Aucun sous-service.</div>}
              </div>
            </div>
          )}

          {tab === 'gallery' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="adm-label !mb-0">Galerie d&apos;images</div>
                  <div className="text-xs text-slate-500 mt-1">Images additionnelles affichées sur la page du service.</div>
                </div>
                <label className="adm-btn adm-btn-ghost cursor-pointer text-xs !py-1" data-testid="add-gallery">
                  <Upload size={12} /> {uploadingKey === 'gallery' ? 'Upload...' : 'Ajouter une image'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadGalleryImage(e.target.files[0])} />
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(f.gallery || []).map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={mediaUrl(url)} alt="" className="w-full h-24 object-cover border border-slate-200 dark:border-slate-700" />
                    <button onClick={() => removeGalleryItem(i)} className="absolute top-1 right-1 bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity" data-testid={`remove-gallery-${i}`}><X size={12} /></button>
                  </div>
                ))}
                {(f.gallery || []).length === 0 && <div className="col-span-full text-sm text-slate-400 py-6 text-center flex flex-col items-center gap-2"><ImageIcon size={24} /> Aucune image</div>}
              </div>
            </div>
          )}

          {tab === 'faq' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="adm-label !mb-0">FAQ propres à ce service</div>
                  <div className="text-xs text-slate-500 mt-1">Questions/réponses spécifiques.</div>
                </div>
                <button onClick={addFaq} className="adm-btn adm-btn-ghost text-xs !py-1" data-testid="add-faq"><Plus size={12} /> Ajouter</button>
              </div>
              <div className="space-y-3">
                {(f.faqs || []).map((faq, i) => (
                  <div key={i} className="p-4 border border-slate-200 dark:border-slate-700 space-y-2">
                    <input value={faq.question || ''} onChange={(e) => setFaq(i, 'question', e.target.value)} className="adm-input" placeholder="Question" data-testid={`faq-q-${i}`} />
                    <textarea rows={3} value={faq.answer || ''} onChange={(e) => setFaq(i, 'answer', e.target.value)} className="adm-input resize-none" placeholder="Réponse" />
                    <div className="flex justify-end">
                      <button onClick={() => removeFaq(i)} className="adm-btn adm-btn-danger text-xs !py-1"><Trash2 size={12} /> Supprimer</button>
                    </div>
                  </div>
                ))}
                {(f.faqs || []).length === 0 && <div className="text-sm text-slate-400 py-4 text-center">Aucune FAQ propre.</div>}
              </div>
            </div>
          )}

          {tab === 'cta' && (
            <>
              <div className="text-xs text-slate-500 mb-2">Bloc d&apos;appel à l&apos;action affiché en bas de la page du service.</div>
              <Field label="Titre du CTA"><input value={f.cta_title || ''} onChange={(e) => upd('cta_title', e.target.value)} className="adm-input" data-testid="input-cta-title" placeholder="Ex: Prêt à lancer votre projet ?" /></Field>
              <Field label="Texte du CTA"><textarea rows={3} value={f.cta_text || ''} onChange={(e) => upd('cta_text', e.target.value)} className="adm-input resize-none" placeholder="Description qui incite à passer à l'action." /></Field>
              <Field label="Libellé du bouton"><input value={f.cta_button_label || ''} onChange={(e) => upd('cta_button_label', e.target.value)} className="adm-input" placeholder="Ex: Demander un devis" /></Field>
            </>
          )}

          {tab === 'seo' && (
            <>
              <div className="text-xs text-slate-500 mb-2">Optimisation moteurs de recherche & partages sociaux.</div>
              <Field label="Titre SEO (meta title)"><input value={f.seo_title || ''} onChange={(e) => upd('seo_title', e.target.value)} className="adm-input" maxLength={70} data-testid="input-seo-title" /></Field>
              <Field label="Description SEO (meta description)"><textarea rows={3} value={f.seo_description || ''} onChange={(e) => upd('seo_description', e.target.value)} className="adm-input resize-none" maxLength={160} /></Field>
              <ImageField label="Image Open Graph (partage réseaux sociaux)" value={f.seo_og_image} uploading={uploadingKey === 'seo_og_image'} onUpload={(file) => uploadImageTo(file, 'seo_og_image')} onClear={() => upd('seo_og_image', '')} testid="upload-og" />
            </>
          )}

          <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700 sticky bottom-0 bg-white dark:bg-slate-800 -mx-6 -mb-6 px-6 py-4">
            <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary" data-testid="save-service-btn">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer</button>
            <button onClick={onClose} className="adm-btn adm-btn-ghost">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageField({ label, value, uploading, onUpload, onClear, testid }) {
  return (
    <Field label={label}>
      {value && (
        <div className="mb-2 relative inline-block">
          <img src={mediaUrl(value)} alt="" className="h-32 object-cover border border-slate-200 dark:border-slate-700" />
          <button onClick={onClear} className="absolute top-1 right-1 bg-red-600 text-white p-1"><X size={12} /></button>
        </div>
      )}
      <label className="adm-btn adm-btn-ghost cursor-pointer" data-testid={testid}>
        <Upload size={14} /> {uploading ? 'Upload...' : (value ? 'Remplacer' : 'Choisir')}
        <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])} />
      </label>
    </Field>
  );
}
