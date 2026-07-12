import React, { useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, User as UserIcon, Key, ShieldCheck, Mail } from 'lucide-react';
import api from '../../lib/api';
import { PageHeader } from './Dashboard';
import { Field } from './Projects';
import { useAuth } from '../../contexts/AuthContext';
import './admin.css';

export default function AdminProfile() {
  const { user } = useAuth();
  const [pwd, setPwd] = useState({ current_password: '', new_password: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const roleLabel = { super_admin: 'Super Admin', admin: 'Administrateur', editor: 'Éditeur' }[user.role] || user.role;

  const changePwd = async (e) => {
    e.preventDefault();
    if (pwd.new_password.length < 8) { toast.error('Mot de passe trop court (8 caractères min)'); return; }
    if (pwd.new_password !== pwd.confirm) { toast.error('Les mots de passe ne correspondent pas'); return; }
    setSaving(true);
    try {
      await api.post('/auth/change-password', { current_password: pwd.current_password, new_password: pwd.new_password });
      toast.success('Mot de passe modifié');
      setPwd({ current_password: '', new_password: '', confirm: '' });
    } catch (e) { toast.error(e?.response?.data?.detail || 'Erreur'); }
    setSaving(false);
  };

  return (
    <div>
      <PageHeader title="Mon profil" subtitle="Informations et sécurité de votre compte" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="adm-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#FFB800] text-[#0A2540] rounded-full flex items-center justify-center font-heading font-extrabold text-2xl">
              {user.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-[#0A2540] dark:text-white">{user.name}</h3>
              <div className="text-[10px] uppercase tracking-widest text-[#FFB800] font-semibold flex items-center gap-1 mt-1">
                <ShieldCheck size={11} /> {roleLabel}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Info label="Email" icon={Mail} value={user.email} />
            <Info label="Rôle" icon={ShieldCheck} value={roleLabel} />
            <Info label="Créé le" icon={UserIcon} value={new Date(user.created_at).toLocaleDateString('fr-FR')} />
            {user.last_login && <Info label="Dernière connexion" icon={Key} value={new Date(user.last_login).toLocaleString('fr-FR')} />}
          </div>
        </div>

        <div className="adm-card p-6">
          <h3 className="font-heading text-lg font-bold text-[#0A2540] dark:text-white uppercase mb-4">Changer le mot de passe</h3>
          <form onSubmit={changePwd} className="space-y-4">
            <Field label="Mot de passe actuel" required>
              <input type="password" value={pwd.current_password} onChange={(e) => setPwd({ ...pwd, current_password: e.target.value })} className="adm-input" required />
            </Field>
            <Field label="Nouveau mot de passe (8 caractères min)" required>
              <input type="password" value={pwd.new_password} onChange={(e) => setPwd({ ...pwd, new_password: e.target.value })} className="adm-input" required minLength={8} />
            </Field>
            <Field label="Confirmer le nouveau mot de passe" required>
              <input type="password" value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} className="adm-input" required minLength={8} />
            </Field>
            <button type="submit" disabled={saving} className="adm-btn adm-btn-primary">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Info({ label, icon: Icon, value }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <Icon size={14} className="text-[#FFB800]" />
      <div className="flex-1">
        <div className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">{label}</div>
        <div className="text-sm font-semibold text-[#0A2540] dark:text-white">{value}</div>
      </div>
    </div>
  );
}
