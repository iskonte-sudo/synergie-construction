import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';
import api from '../../lib/api';
import { PageHeader } from './Dashboard';
import { Field } from './Projects';
import './admin.css';

const SOCIAL_ICONS = ['Facebook', 'Instagram', 'Linkedin', 'Twitter', 'Youtube', 'MessageCircle', 'Music2'];

export default function AdminSettings() {
  const [s, setS] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try { const { data } = await api.get('/admin/settings'); setS(data); }
    catch { toast.error('Erreur'); }
  };
  useEffect(() => { load(); }, []);

  const upd = (k, v) => setS({ ...s, [k]: v });

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...s };
      delete payload.id; delete payload.updated_at;
      await api.put('/admin/settings', payload);
      toast.success('Paramètres enregistrés');
    } catch (e) { toast.error(e?.response?.data?.detail || 'Erreur'); }
    setSaving(false);
  };

  if (!s) return <div className="flex justify-center p-12"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div>;

  const addSocial = () => upd('socials', [...(s.socials || []), { name: '', icon: 'Facebook', url: '' }]);
  const updSocial = (i, k, v) => upd('socials', s.socials.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const removeSocial = (i) => upd('socials', s.socials.filter((_, idx) => idx !== i));

  return (
    <div>
      <PageHeader title="Paramètres du site" subtitle="Coordonnées, réseaux sociaux et SEO"
        actions={<button onClick={save} disabled={saving} className="adm-btn adm-btn-primary" data-testid="settings-save">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer</button>} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="adm-card p-6 space-y-4">
          <h3 className="font-heading font-bold text-lg text-[#0A2540] dark:text-white uppercase">Informations de l'entreprise</h3>
          <Field label="Nom de l'entreprise"><input value={s.company_name || ''} onChange={(e) => upd('company_name', e.target.value)} className="adm-input" /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Téléphone (format E164)"><input value={s.phone || ''} onChange={(e) => upd('phone', e.target.value)} className="adm-input" placeholder="+221761582020" data-testid="settings-phone" /></Field>
            <Field label="Téléphone (affichage)"><input value={s.phone_display || ''} onChange={(e) => upd('phone_display', e.target.value)} className="adm-input" placeholder="+221 76 158 20 20" data-testid="settings-phone-display" /></Field>
          </div>
          <Field label="WhatsApp (chiffres uniquement)"><input value={s.whatsapp || ''} onChange={(e) => upd('whatsapp', e.target.value)} className="adm-input" placeholder="221761582020" data-testid="settings-whatsapp" /></Field>
          <Field label="Email"><input type="email" value={s.email || ''} onChange={(e) => upd('email', e.target.value)} className="adm-input" data-testid="settings-email" /></Field>
          <Field label="Adresse"><textarea rows={2} value={s.address || ''} onChange={(e) => upd('address', e.target.value)} className="adm-input resize-none" data-testid="settings-address" /></Field>
          <Field label="Lien Google Maps"><input value={s.google_maps_link || ''} onChange={(e) => upd('google_maps_link', e.target.value)} className="adm-input" placeholder="https://maps.google.com/?q=..." data-testid="settings-maps-link" /></Field>
          <Field label="Horaires"><input value={s.hours || ''} onChange={(e) => upd('hours', e.target.value)} className="adm-input" data-testid="settings-hours" /></Field>
        </div>

        <div className="adm-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-[#0A2540] dark:text-white uppercase">Réseaux sociaux</h3>
            <button onClick={addSocial} className="adm-btn adm-btn-ghost text-xs !py-1.5"><Plus size={12} /> Ajouter</button>
          </div>
          <div className="space-y-2">
            {(s.socials || []).map((so, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input value={so.name} onChange={(e) => updSocial(i, 'name', e.target.value)} className="adm-input col-span-3" placeholder="Nom" />
                <select value={so.icon} onChange={(e) => updSocial(i, 'icon', e.target.value)} className="adm-input col-span-3">
                  {SOCIAL_ICONS.map(x => <option key={x}>{x}</option>)}
                </select>
                <input value={so.url} onChange={(e) => updSocial(i, 'url', e.target.value)} className="adm-input col-span-5" placeholder="URL" />
                <button onClick={() => removeSocial(i)} className="adm-btn adm-btn-danger !px-2 !py-2 col-span-1"><Trash2 size={12} /></button>
              </div>
            ))}
            {(s.socials || []).length === 0 && <div className="text-sm text-slate-400 text-center py-4">Aucun réseau social configuré</div>}
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />

          <h3 className="font-heading font-bold text-lg text-[#0A2540] dark:text-white uppercase">SEO</h3>
          <Field label="Titre SEO"><input value={s.seo_title || ''} onChange={(e) => upd('seo_title', e.target.value)} className="adm-input" /></Field>
          <Field label="Description SEO"><textarea rows={3} value={s.seo_description || ''} onChange={(e) => upd('seo_description', e.target.value)} className="adm-input resize-none" /></Field>
        </div>
      </div>
    </div>
  );
}
