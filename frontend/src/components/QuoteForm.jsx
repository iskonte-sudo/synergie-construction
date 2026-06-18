import React, { useState } from 'react';
import { ArrowUpRight, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function QuoteForm({ compact = false, title = 'Demandez votre devis gratuit', subtitle }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', projectType: 'Maison', address: '', budget: '', description: ''
  });

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success('Demande envoyée ! Un expert vous contactera sous 24h.');
      try { localStorage.setItem('scg_last_quote', JSON.stringify({ ...form, at: new Date().toISOString() })); } catch(_e){}
      setTimeout(() => setSent(false), 4000);
      setForm({ name: '', phone: '', email: '', projectType: 'Maison', address: '', budget: '', description: '' });
    }, 1200);
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className={`bg-white ${compact ? 'p-6' : 'p-8 lg:p-10'} shadow-xl border-t-4 border-[#FFB800]`}>
      <div className="mb-6">
        {subtitle && <div className="section-label mb-3">{subtitle}</div>}
        <h3 className="font-heading text-3xl lg:text-4xl text-[#0A2540] font-extrabold uppercase leading-tight">{title}</h3>
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nom complet" required>
          <input name="name" required value={form.name} onChange={onChange} type="text" className="form-input" placeholder="Votre nom" />
        </Field>
        <Field label="Téléphone" required>
          <input name="phone" required value={form.phone} onChange={onChange} type="tel" className="form-input" placeholder="+221 ..." />
        </Field>
        <Field label="Email" required>
          <input name="email" required value={form.email} onChange={onChange} type="email" className="form-input" placeholder="vous@email.com" />
        </Field>
        <Field label="Type de projet">
          <select name="projectType" value={form.projectType} onChange={onChange} className="form-input">
            {['Maison', 'Villa', 'Immeuble', 'Bâtiment commercial', 'Bureau', 'Rénovation', 'Autre'].map(o => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Adresse">
          <input name="address" value={form.address} onChange={onChange} type="text" className="form-input" placeholder="Ville, quartier" />
        </Field>
        <Field label="Budget estimatif">
          <input name="budget" value={form.budget} onChange={onChange} type="text" className="form-input" placeholder="Ex: 25 000 000 FCFA" />
        </Field>
        <Field label="Description du projet" full>
          <textarea name="description" rows={4} value={form.description} onChange={onChange} className="form-input resize-none" placeholder="Décrivez brièvement votre projet..." />
        </Field>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading || sent}
            className="btn-primary w-full justify-center disabled:opacity-70"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</> :
             sent ? <><CheckCircle2 size={18} /> Demande envoyée</> :
             <><ArrowUpRight size={18} /> Envoyer ma demande</>}
          </button>
          <p className="text-xs text-gray-500 mt-3 text-center">Vos informations restent confidentielles. Réponse sous 24h.</p>
        </div>
      </form>
      <style>{`
        .form-input { width: 100%; border: 1px solid #e5e7eb; padding: 0.75rem 0.875rem; font-size: 0.9rem; background: #F9FAFB; transition: border-color 0.2s ease, background-color 0.2s ease; }
        .form-input:focus { outline: none; border-color: #FFB800; background: #fff; box-shadow: 0 0 0 3px rgba(255,184,0,0.12); }
      `}</style>
    </div>
  );
}

function Field({ label, required, full, children }) {
  return (
    <label className={`block ${full ? 'md:col-span-2' : ''}`}>
      <span className="block text-xs font-semibold uppercase tracking-wider text-[#0A2540] mb-1.5">
        {label} {required && <span className="text-[#FFB800]">*</span>}
      </span>
      {children}
    </label>
  );
}
