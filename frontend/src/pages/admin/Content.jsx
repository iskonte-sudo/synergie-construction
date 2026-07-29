import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import api, { mediaUrl } from '../../lib/api';
import { PageHeader } from './Dashboard';
import { Field } from './Projects';
import './admin.css';

// ============================================================================
// EXHAUSTIVE PAGE CONFIG - Every editable text, image, link on the site
// ============================================================================
const PAGES = [
  {
    key: 'header', label: 'Header (Barre supérieure + Menu)', icon: '📌',
    blocks: [
      { key: 'header.social_label', label: 'Texte "Suivez-nous"', type: 'text' },
      { key: 'header.cta_label', label: 'Bouton "Demandez un devis"', type: 'text' },
    ],
  },
  {
    key: 'home_hero', label: 'Accueil — Hero (Slider)', icon: '🎬',
    blocks: [
      { key: 'home.hero.badge', label: 'Badge au-dessus du titre', type: 'text' },
      { key: 'home.hero.cta_primary', label: 'Bouton principal (texte)', type: 'text' },
      { key: 'home.hero.cta_secondary', label: 'Bouton secondaire (texte)', type: 'text' },
      { key: 'home.hero.experience_number', label: 'Chiffre expérience (ex: 30+)', type: 'text' },
      { key: 'home.hero.experience_label', label: 'Libellé sous le chiffre', type: 'text' },
    ],
  },
  {
    key: 'home_about', label: 'Accueil — Section À propos', icon: '📖',
    blocks: [
      { key: 'home.about.badge', label: 'Badge de section', type: 'text' },
      { key: 'home.about.title', label: 'Titre principal', type: 'text' },
      { key: 'home.about.description', label: 'Description', type: 'textarea' },
      { key: 'home.about.image', label: 'Image de la section', type: 'image' },
      { key: 'home.about.stat_number', label: 'Chiffre en surimpression (ex: 250+)', type: 'text' },
      { key: 'home.about.stat_label', label: 'Libellé du chiffre', type: 'text' },
      { key: 'home.about.feature_1', label: 'Point fort 1', type: 'text' },
      { key: 'home.about.feature_2', label: 'Point fort 2', type: 'text' },
      { key: 'home.about.feature_3', label: 'Point fort 3', type: 'text' },
      { key: 'home.about.feature_4', label: 'Point fort 4', type: 'text' },
      { key: 'home.about.cta_primary', label: 'Bouton principal', type: 'text' },
      { key: 'home.about.cta_secondary', label: 'Lien secondaire', type: 'text' },
    ],
  },
  {
    key: 'home_services', label: 'Accueil — Section Services', icon: '🔧',
    blocks: [
      { key: 'home.services.badge', label: 'Badge de section', type: 'text' },
      { key: 'home.services.title', label: 'Titre principal', type: 'text' },
      { key: 'home.services.cta_label', label: 'Bouton "Tous nos services"', type: 'text' },
    ],
  },
  {
    key: 'home_features', label: 'Accueil — Section Pourquoi nous choisir', icon: '⭐',
    blocks: [
      { key: 'home.features.badge', label: 'Badge de section', type: 'text' },
      { key: 'home.features.title', label: 'Titre principal', type: 'text' },
      { key: 'home.features.description', label: 'Description', type: 'textarea' },
      { key: 'home.features.item1_title', label: 'Atout 1 — Titre', type: 'text' },
      { key: 'home.features.item1_desc', label: 'Atout 1 — Description', type: 'textarea' },
      { key: 'home.features.item1_icon', label: 'Atout 1 — Icône Lucide', type: 'text' },
      { key: 'home.features.item2_title', label: 'Atout 2 — Titre', type: 'text' },
      { key: 'home.features.item2_desc', label: 'Atout 2 — Description', type: 'textarea' },
      { key: 'home.features.item2_icon', label: 'Atout 2 — Icône Lucide', type: 'text' },
      { key: 'home.features.item3_title', label: 'Atout 3 — Titre', type: 'text' },
      { key: 'home.features.item3_desc', label: 'Atout 3 — Description', type: 'textarea' },
      { key: 'home.features.item3_icon', label: 'Atout 3 — Icône Lucide', type: 'text' },
      { key: 'home.features.item4_title', label: 'Atout 4 — Titre', type: 'text' },
      { key: 'home.features.item4_desc', label: 'Atout 4 — Description', type: 'textarea' },
      { key: 'home.features.item4_icon', label: 'Atout 4 — Icône Lucide', type: 'text' },
    ],
  },
  {
    key: 'home_stats', label: 'Accueil — Statistiques', icon: '📊',
    blocks: [
      { key: 'home.stats.experience_number', label: "Chiffre — Années d'expérience", type: 'text' },
      { key: 'home.stats.experience_label', label: "Libellé — Années d'expérience", type: 'text' },
      { key: 'home.stats.projects_number', label: 'Chiffre — Projets réalisés', type: 'text' },
      { key: 'home.stats.projects_label', label: 'Libellé — Projets réalisés', type: 'text' },
      { key: 'home.stats.clients_number', label: 'Chiffre — Clients satisfaits', type: 'text' },
      { key: 'home.stats.clients_label', label: 'Libellé — Clients satisfaits', type: 'text' },
      { key: 'home.stats.team_number', label: 'Chiffre — Experts qualifiés', type: 'text' },
      { key: 'home.stats.team_label', label: 'Libellé — Experts qualifiés', type: 'text' },
    ],
  },
  {
    key: 'home_process', label: 'Accueil — Section Processus', icon: '📋',
    blocks: [
      { key: 'home.process.badge', label: 'Badge de section', type: 'text' },
      { key: 'home.process.title', label: 'Titre principal', type: 'text' },
      { key: 'home.process.description', label: 'Description', type: 'textarea' },
      { key: 'home.process.background_image', label: 'Image de fond', type: 'image' },
      { key: 'home.process.step1_num', label: 'Étape 1 — Numéro', type: 'text' },
      { key: 'home.process.step1_title', label: 'Étape 1 — Titre', type: 'text' },
      { key: 'home.process.step1_desc', label: 'Étape 1 — Description', type: 'text' },
      { key: 'home.process.step2_num', label: 'Étape 2 — Numéro', type: 'text' },
      { key: 'home.process.step2_title', label: 'Étape 2 — Titre', type: 'text' },
      { key: 'home.process.step2_desc', label: 'Étape 2 — Description', type: 'text' },
      { key: 'home.process.step3_num', label: 'Étape 3 — Numéro', type: 'text' },
      { key: 'home.process.step3_title', label: 'Étape 3 — Titre', type: 'text' },
      { key: 'home.process.step3_desc', label: 'Étape 3 — Description', type: 'text' },
      { key: 'home.process.step4_num', label: 'Étape 4 — Numéro', type: 'text' },
      { key: 'home.process.step4_title', label: 'Étape 4 — Titre', type: 'text' },
      { key: 'home.process.step4_desc', label: 'Étape 4 — Description', type: 'text' },
      { key: 'home.process.step5_num', label: 'Étape 5 — Numéro', type: 'text' },
      { key: 'home.process.step5_title', label: 'Étape 5 — Titre', type: 'text' },
      { key: 'home.process.step5_desc', label: 'Étape 5 — Description', type: 'text' },
    ],
  },
  {
    key: 'home_testimonials', label: 'Accueil — Section Témoignages', icon: '💬',
    blocks: [
      { key: 'home.testimonials.badge', label: 'Badge de section', type: 'text' },
      { key: 'home.testimonials.title', label: 'Titre principal', type: 'text' },
    ],
  },
  {
    key: 'home_faq', label: 'Accueil — Section FAQ', icon: '❓',
    blocks: [
      { key: 'home.faq.badge', label: 'Badge de section', type: 'text' },
      { key: 'home.faq.title', label: 'Titre principal', type: 'text' },
      { key: 'home.faq.description', label: 'Description', type: 'textarea' },
      { key: 'home.faq.help_title', label: 'Bloc aide — Titre', type: 'text' },
      { key: 'home.faq.help_subtitle', label: 'Bloc aide — Sous-titre', type: 'text' },
    ],
  },
  {
    key: 'about', label: 'Page À propos', icon: '🏢',
    blocks: [
      { key: 'about.banner.title', label: 'Bannière — Titre', type: 'text' },
      { key: 'about.banner.subtitle', label: 'Bannière — Sous-titre', type: 'text' },
      { key: 'about.banner.image', label: 'Bannière — Image', type: 'image' },
      { key: 'about.intro.badge', label: 'Intro — Badge', type: 'text' },
      { key: 'about.intro.title', label: 'Intro — Titre', type: 'text' },
      { key: 'about.intro.paragraph1', label: 'Intro — Paragraphe 1', type: 'textarea' },
      { key: 'about.intro.paragraph2', label: 'Intro — Paragraphe 2', type: 'textarea' },
      { key: 'about.intro.image', label: 'Intro — Image', type: 'image' },
      { key: 'about.intro.feature1', label: 'Point fort 1', type: 'text' },
      { key: 'about.intro.feature2', label: 'Point fort 2', type: 'text' },
      { key: 'about.intro.feature3', label: 'Point fort 3', type: 'text' },
      { key: 'about.intro.feature4', label: 'Point fort 4', type: 'text' },
      { key: 'about.values.badge', label: 'Valeurs — Badge', type: 'text' },
      { key: 'about.values.title', label: 'Valeurs — Titre section', type: 'text' },
      { key: 'about.mission.title', label: 'Notre Mission — Titre', type: 'text' },
      { key: 'about.mission.text', label: 'Notre Mission — Texte', type: 'textarea' },
      { key: 'about.vision.title', label: 'Notre Vision — Titre', type: 'text' },
      { key: 'about.vision.text', label: 'Notre Vision — Texte', type: 'textarea' },
      { key: 'about.valeurs.title', label: 'Nos Valeurs — Titre', type: 'text' },
      { key: 'about.valeurs.text', label: 'Nos Valeurs — Texte', type: 'textarea' },
    ],
  },
  {
    key: 'services', label: 'Page Services', icon: '⚙️',
    blocks: [
      { key: 'services.banner.title', label: 'Bannière — Titre', type: 'text' },
      { key: 'services.banner.subtitle', label: 'Bannière — Sous-titre', type: 'text' },
      { key: 'services.banner.image', label: 'Bannière — Image', type: 'image' },
    ],
  },
  {
    key: 'projects', label: 'Page Réalisations', icon: '🏗️',
    blocks: [
      { key: 'projects.banner.title', label: 'Bannière — Titre', type: 'text' },
      { key: 'projects.banner.subtitle', label: 'Bannière — Sous-titre', type: 'text' },
      { key: 'projects.banner.image', label: 'Bannière — Image', type: 'image' },
      { key: 'projects.cta.title', label: 'CTA final — Titre', type: 'text' },
      { key: 'projects.cta.button', label: 'CTA final — Bouton', type: 'text' },
    ],
  },
  {
    key: 'contact', label: 'Page Contact', icon: '📞',
    blocks: [
      { key: 'contact.banner.title', label: 'Bannière — Titre', type: 'text' },
      { key: 'contact.banner.subtitle', label: 'Bannière — Sous-titre', type: 'text' },
      { key: 'contact.banner.image', label: 'Bannière — Image', type: 'image' },
      { key: 'contact.form.title', label: 'Formulaire — Titre', type: 'text' },
      { key: 'contact.form.subtitle', label: 'Formulaire — Sous-titre', type: 'text' },
      { key: 'contact.side.badge', label: 'Bloc contact — Badge', type: 'text' },
      { key: 'contact.side.title', label: 'Bloc contact — Titre', type: 'text' },
      { key: 'contact.side.description', label: 'Bloc contact — Description', type: 'textarea' },
    ],
  },
  {
    key: 'blog', label: 'Page Blog', icon: '📰',
    blocks: [
      { key: 'blog.banner.title', label: 'Bannière — Titre', type: 'text' },
      { key: 'blog.banner.subtitle', label: 'Bannière — Sous-titre', type: 'text' },
      { key: 'blog.banner.image', label: 'Bannière — Image', type: 'image' },
      { key: 'blog.empty_message', label: 'Message si aucun article', type: 'text' },
    ],
  },
  {
    key: 'simulator', label: 'Page Simulateur', icon: '🧮',
    blocks: [
      { key: 'simulator.banner.title', label: 'Bannière — Titre', type: 'text' },
      { key: 'simulator.banner.subtitle', label: 'Bannière — Sous-titre', type: 'text' },
      { key: 'simulator.intro.title', label: 'Intro — Titre', type: 'text' },
      { key: 'simulator.intro.description', label: 'Intro — Description', type: 'textarea' },
    ],
  },
  {
    key: 'footer', label: 'Footer', icon: '⬇️',
    blocks: [
      { key: 'footer.about', label: 'Texte de présentation', type: 'textarea' },
      { key: 'footer.services_title', label: 'Titre section Services', type: 'text' },
      { key: 'footer.contact_title', label: 'Titre section Contact', type: 'text' },
      { key: 'footer.newsletter_title', label: 'Titre Newsletter', type: 'text' },
      { key: 'footer.newsletter_text', label: 'Texte Newsletter', type: 'text' },
      { key: 'footer.newsletter_placeholder', label: 'Placeholder email', type: 'text' },
      { key: 'footer.cta_pre', label: 'Bandeau CTA — Pré-titre', type: 'text' },
      { key: 'footer.cta_title', label: 'Bandeau CTA — Titre', type: 'text' },
      { key: 'footer.cta_button', label: 'Bandeau CTA — Bouton', type: 'text' },
      { key: 'footer.copyright', label: 'Copyright', type: 'text' },
      { key: 'footer.legal_link1', label: 'Lien légal 1', type: 'text' },
      { key: 'footer.legal_link2', label: 'Lien légal 2', type: 'text' },
    ],
  },
];

export default function AdminContent() {
  const [selectedPage, setSelectedPage] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [defaults, setDefaults] = useState({});

  useEffect(() => {
    // Load public defaults (from mock) to prefill empty blocks
    api.get('/public/content-defaults').then(({ data }) => setDefaults(data || {})).catch(() => {});
  }, []);

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

  const uploadImage = async (file, key) => {
    setUploading(key);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'content');
      const { data } = await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      upd(key, data.url);
      toast.success('Image téléchargée');
    } catch { toast.error('Erreur upload'); }
    setUploading(null);
  };

  const savePage = async () => {
    setSaving(true);
    const page = PAGES.find((p) => p.key === selectedPage);
    try {
      for (const b of page.blocks) {
        await api.put('/admin/content', { key: b.key, value: values[b.key] ?? '', page: selectedPage, label: b.label });
      }
      toast.success('Contenu enregistré');
    } catch (e) { toast.error('Erreur'); }
    setSaving(false);
  };

  if (!selectedPage) {
    return (
      <div>
        <PageHeader title="Contenu du site" subtitle="Modifier les textes et images de chaque section" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAGES.map((p) => (
            <button key={p.key} onClick={() => loadPage(p.key)} className="adm-card p-6 text-left hover:shadow-md hover:border-[#FFB800] transition-shadow">
              <div className="text-2xl mb-2">{p.icon}</div>
              <div className="font-heading text-lg font-bold text-[#0A2540] dark:text-white uppercase">{p.label}</div>
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
        title={`${page.icon} ${page.label}`}
        subtitle={`${page.blocks.length} bloc(s) à personnaliser`}
        actions={
          <>
            <button onClick={() => setSelectedPage(null)} className="adm-btn adm-btn-ghost"><ArrowLeft size={14} /> Toutes les pages</button>
            <button onClick={savePage} disabled={saving} className="adm-btn adm-btn-primary">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer</button>
          </>
        }
      />

      {loading ? <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div> :
        <div className="adm-card p-6 space-y-5 max-w-4xl">
          {page.blocks.map((b) => {
            const current = values[b.key];
            const placeholder = defaults[b.key] || '';
            return (
              <Field key={b.key} label={b.label}>
                {b.type === 'textarea' ? (
                  <textarea rows={4} value={current || ''} onChange={(e) => upd(b.key, e.target.value)} className="adm-input resize-none" placeholder={placeholder} />
                ) : b.type === 'image' ? (
                  <div>
                    {current ? (
                      <div className="mb-2 relative inline-block">
                        <img src={mediaUrl(current)} alt="" className="h-32 object-cover border border-slate-200 dark:border-slate-700" />
                        <button onClick={() => upd(b.key, '')} className="mt-2 ml-2 text-xs text-red-500 hover:underline">Retirer</button>
                      </div>
                    ) : placeholder ? (
                      <div className="mb-2 text-xs text-slate-400 flex items-center gap-2"><ImageIcon size={14} /> Image actuelle : <img src={placeholder} alt="" className="h-16 object-cover border border-slate-200 dark:border-slate-700 inline-block" /></div>
                    ) : null}
                    <label className="adm-btn adm-btn-ghost cursor-pointer">
                      <Upload size={14} /> {uploading === b.key ? 'Upload...' : 'Choisir une image'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], b.key)} />
                    </label>
                    <input value={current || ''} onChange={(e) => upd(b.key, e.target.value)} className="adm-input mt-2" placeholder="Ou coller une URL directe" />
                  </div>
                ) : (
                  <input value={current || ''} onChange={(e) => upd(b.key, e.target.value)} className="adm-input" placeholder={placeholder} />
                )}
                <p className="text-[10px] text-slate-400 mt-1 font-mono">{b.key}{placeholder && b.type !== 'image' ? ` · défaut: « ${String(placeholder).substring(0, 60)}${String(placeholder).length > 60 ? '…' : ''} »` : ''}</p>
              </Field>
            );
          })}
        </div>
      }
    </div>
  );
}
