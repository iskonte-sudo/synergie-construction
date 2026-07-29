import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import api from '../../lib/api';
import { PageHeader } from './Dashboard';
import { Field } from './Projects';
import './admin.css';

// Predefined pages and their editable blocks
const PAGES = [
  {
    key: 'home', label: 'Accueil',
    blocks: [
      { key: 'home.hero.badge', label: 'Badge du hero', type: 'text' },
      { key: 'home.about.badge', label: 'Badge section À propos', type: 'text' },
      { key: 'home.about.title', label: 'Titre section À propos', type: 'text' },
      { key: 'home.about.description', label: 'Description À propos', type: 'textarea' },
      { key: 'home.services.badge', label: 'Badge section Services', type: 'text' },
      { key: 'home.services.title', label: 'Titre section Services', type: 'text' },
      { key: 'home.features.badge', label: 'Badge section Pourquoi nous choisir', type: 'text' },
      { key: 'home.features.title', label: 'Titre section Pourquoi nous choisir', type: 'text' },
      { key: 'home.features.description', label: 'Description Pourquoi nous choisir', type: 'textarea' },
      { key: 'home.process.badge', label: 'Badge section Processus', type: 'text' },
      { key: 'home.process.title', label: 'Titre section Processus', type: 'text' },
      { key: 'home.process.description', label: 'Description Processus', type: 'textarea' },
    ],
  },
  {
    key: 'about', label: 'À propos',
    blocks: [
      { key: 'about.hero.title', label: 'Titre principal', type: 'text' },
      { key: 'about.hero.subtitle', label: 'Sous-titre', type: 'text' },
      { key: 'about.intro.title', label: 'Titre d\'introduction', type: 'text' },
      { key: 'about.intro.paragraph1', label: 'Paragraphe 1', type: 'textarea' },
      { key: 'about.intro.paragraph2', label: 'Paragraphe 2', type: 'textarea' },
      { key: 'about.mission.title', label: 'Titre Notre Mission', type: 'text' },
      { key: 'about.mission.text', label: 'Texte Notre Mission', type: 'textarea' },
      { key: 'about.vision.title', label: 'Titre Notre Vision', type: 'text' },
      { key: 'about.vision.text', label: 'Texte Notre Vision', type: 'textarea' },
      { key: 'about.values.title', label: 'Titre Nos Valeurs', type: 'text' },
      { key: 'about.values.text', label: 'Texte Nos Valeurs', type: 'textarea' },
    ],
  },
  {
    key: 'contact', label: 'Contact',
    blocks: [
      { key: 'contact.hero.title', label: 'Titre principal', type: 'text' },
      { key: 'contact.hero.subtitle', label: 'Sous-titre', type: 'text' },
      { key: 'contact.form.title', label: 'Titre formulaire', type: 'text' },
      { key: 'contact.side.title', label: 'Titre section côté', type: 'text' },
      { key: 'contact.side.description', label: 'Description côté', type: 'textarea' },
    ],
  },
  {
    key: 'footer', label: 'Footer',
    blocks: [
      { key: 'footer.about', label: 'Texte de présentation', type: 'textarea' },
      { key: 'footer.cta.title', label: 'Titre appel à l\'action', type: 'text' },
      { key: 'footer.cta.subtitle', label: 'Sous-titre appel à l\'action', type: 'text' },
      { key: 'footer.copyright', label: 'Copyright', type: 'text' },
    ],
  },
];

export default function AdminContent() {
  const [selectedPage, setSelectedPage] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPage = async (pageKey) => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/content');
      const map = {};
      data.forEach((b) => { map[b.key] = b.value; });
      setValues(map);
      setSelectedPage(pageKey);
    } catch { toast.error('Erreur'); }
    setLoading(false);
  };

  const upd = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const savePage = async () => {
    setSaving(true);
    const page = PAGES.find((p) => p.key === selectedPage);
    try {
      for (const b of page.blocks) {
        await api.put('/admin/content', { key: b.key, value: values[b.key] || '', page: selectedPage, label: b.label });
      }
      toast.success('Contenu enregistré');
    } catch (e) { toast.error('Erreur'); }
    setSaving(false);
  };

  if (!selectedPage) {
    return (
      <div>
        <PageHeader title="Contenu du site" subtitle="Modifier les textes des différentes pages" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAGES.map((p) => (
            <button key={p.key} onClick={() => loadPage(p.key)} className="adm-card p-6 text-left hover:shadow-md hover:border-[#FFB800] transition-shadow">
              <div className="font-heading text-xl font-bold text-[#0A2540] dark:text-white uppercase">{p.label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.blocks.length} bloc(s) éditable(s)</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const page = PAGES.find((p) => p.key === selectedPage);

  return (
    <div>
      <PageHeader
        title={`Contenu - ${page.label}`}
        subtitle="Modifiez les textes de cette page"
        actions={
          <>
            <button onClick={() => setSelectedPage(null)} className="adm-btn adm-btn-ghost"><ArrowLeft size={14} /> Toutes les pages</button>
            <button onClick={savePage} disabled={saving} className="adm-btn adm-btn-primary">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer</button>
          </>
        }
      />

      {loading ? <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div> :
        <div className="adm-card p-6 space-y-4 max-w-4xl">
          {page.blocks.map((b) => (
            <Field key={b.key} label={b.label}>
              {b.type === 'textarea' ? (
                <textarea rows={4} value={values[b.key] || ''} onChange={(e) => upd(b.key, e.target.value)} className="adm-input resize-none" />
              ) : (
                <input value={values[b.key] || ''} onChange={(e) => upd(b.key, e.target.value)} className="adm-input" />
              )}
              <p className="text-[10px] text-slate-400 mt-1 font-mono">{b.key}</p>
            </Field>
          ))}
        </div>
      }
    </div>
  );
}
