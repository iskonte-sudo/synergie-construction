import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit2, X, Save, ShieldCheck } from 'lucide-react';
import api from '../../lib/api';
import { PageHeader, formatDate } from './Dashboard';
import { Field } from './Projects';
import { useAuth } from '../../contexts/AuthContext';
import './admin.css';

const ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Administrateur' },
  { value: 'editor', label: 'Éditeur' },
];

export default function AdminUsers() {
  const { user: current } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/users'); setItems(data); }
    catch (e) { toast.error('Erreur'); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try { await api.delete(`/admin/users/${id}`); toast.success('Supprimé'); fetchData(); }
    catch (e) { toast.error(e?.response?.data?.detail || 'Erreur'); }
  };

  return (
    <div>
      <PageHeader title="Utilisateurs" subtitle={`${items.length} utilisateur(s)`}
        actions={<button onClick={() => setEditing({ email: '', name: '', role: 'editor', password: '', active: true })} className="adm-btn adm-btn-primary"><Plus size={14} /> Nouvel utilisateur</button>} />

      <div className="adm-card overflow-hidden">
        {loading ? <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div> :
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead><tr><th>Utilisateur</th><th>Rôle</th><th>Statut</th><th>Dernière connexion</th><th></th></tr></thead>
              <tbody>
                {items.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="font-semibold text-[#0A2540] dark:text-white">{u.name}</div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </td>
                    <td><span className="adm-badge adm-badge-sent flex items-center gap-1"><ShieldCheck size={10} /> {ROLES.find(r => r.value === u.role)?.label || u.role}</span></td>
                    <td>{u.active ? <span className="adm-badge adm-badge-accepted">Actif</span> : <span className="adm-badge adm-badge-refused">Désactivé</span>}</td>
                    <td className="text-xs text-slate-500">{u.last_login ? formatDate(u.last_login) : 'Jamais'}</td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => setEditing({ ...u, password: '' })} className="text-[#0A2540] dark:text-white hover:text-[#FFB800] p-1 mr-1"><Edit2 size={14} /></button>
                      {u.id !== current.id && <button onClick={() => remove(u.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={14} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {editing && <UserForm item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); fetchData(); }} />}
    </div>
  );
}

function UserForm({ item, onClose, onSaved }) {
  const [f, setF] = useState(item);
  const [saving, setSaving] = useState(false);
  const upd = (k, v) => setF({ ...f, [k]: v });

  const save = async () => {
    setSaving(true);
    try {
      if (item.id) {
        const payload = { name: f.name, role: f.role, active: f.active };
        if (f.password) payload.password = f.password;
        await api.patch(`/admin/users/${item.id}`, payload);
      } else {
        await api.post('/admin/users', { email: f.email, name: f.name, role: f.role, password: f.password, active: f.active });
      }
      toast.success('Enregistré');
      onSaved();
    } catch (e) { toast.error(e?.response?.data?.detail || 'Erreur'); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 dark:text-white w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between">
          <h3 className="font-heading text-lg font-extrabold uppercase">{item.id ? 'Modifier' : 'Nouvel'} utilisateur</h3>
          <button onClick={onClose} className="w-9 h-9 hover:bg-[#FFB800] hover:text-[#0A2540] flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          <Field label="Nom complet" required><input value={f.name} onChange={(e) => upd('name', e.target.value)} className="adm-input" required /></Field>
          <Field label="Email" required><input type="email" value={f.email} onChange={(e) => upd('email', e.target.value)} className="adm-input" required disabled={!!item.id} /></Field>
          <Field label="Rôle"><select value={f.role} onChange={(e) => upd('role', e.target.value)} className="adm-input">{ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></Field>
          <Field label={item.id ? 'Nouveau mot de passe (laisser vide pour conserver)' : 'Mot de passe (8 caractères min)'} required={!item.id}>
            <input type="password" value={f.password} onChange={(e) => upd('password', e.target.value)} className="adm-input" required={!item.id} minLength={8} />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={f.active} onChange={(e) => upd('active', e.target.checked)} />
            <span className="text-sm">Compte actif</span>
          </label>
          <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer</button>
            <button onClick={onClose} className="adm-btn adm-btn-ghost">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}
