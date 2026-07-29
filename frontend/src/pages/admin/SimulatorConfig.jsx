import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Trash2, Info } from 'lucide-react';
import api from '../../lib/api';
import { PageHeader } from './Dashboard';
import { Field } from './Projects';
import './admin.css';

const TABS = [
  { key: 'project_types', label: 'Types de projet', description: 'Prix au m² et durée par type' },
  { key: 'surface_options', label: 'Surfaces', description: 'Tranches de surface disponibles' },
  { key: 'prestation_options', label: 'Prestations', description: 'Prestations optionnelles proposées' },
  { key: 'budget_options', label: 'Budgets', description: 'Tranches de budget' },
  { key: 'delai_options', label: 'Délais', description: 'Options de délai' },
  { key: 'formula', label: 'Formule de calcul', description: 'Facteurs et multiplicateurs' },
];

export default function AdminSimulatorConfig() {
  const [cfg, setCfg] = useState(null);
  const [tab, setTab] = useState('project_types');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/simulator-config').then(({ data }) => setCfg(data)).catch(() => toast.error('Erreur'));
  }, []);

  const upd = (k, v) => setCfg({ ...cfg, [k]: v });

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...cfg };
      delete payload.id; delete payload.updated_at;
      await api.put('/admin/simulator-config', payload);
      toast.success('Configuration enregistrée');
    } catch (e) { toast.error(e?.response?.data?.detail || 'Erreur'); }
    setSaving(false);
  };

  if (!cfg) return <div className="flex justify-center p-12"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div>;

  return (
    <div>
      <PageHeader
        title="Configuration du simulateur"
        subtitle="Gérez tarifs, options et paramètres de calcul du simulateur public"
        actions={<button onClick={save} disabled={saving} className="adm-btn adm-btn-primary">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer</button>}
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`adm-btn ${tab === t.key ? 'adm-btn-primary' : 'adm-btn-ghost'}`}>{t.label}</button>
        ))}
      </div>

      <div className="adm-card p-6">
        <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
          <h3 className="font-heading font-bold text-lg text-[#0A2540] dark:text-white uppercase">
            {TABS.find((t) => t.key === tab)?.label}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{TABS.find((t) => t.key === tab)?.description}</p>
        </div>

        {tab === 'project_types' && (
          <ProjectTypesEditor items={cfg.project_types || []} onChange={(v) => upd('project_types', v)} />
        )}
        {tab === 'surface_options' && (
          <SimpleEditor items={cfg.surface_options || []} onChange={(v) => upd('surface_options', v)}
            fields={[
              { name: 'id', label: 'ID', placeholder: 's1', col: 2 },
              { name: 'label', label: 'Libellé', placeholder: 'Moins de 100 m²', col: 6 },
              { name: 'value', label: 'Surface référence (m²)', placeholder: '80', type: 'number', col: 4 },
            ]}
            newItem={() => ({ id: `s${Date.now()}`, label: '', value: 100 })}
          />
        )}
        {tab === 'prestation_options' && (
          <SimpleEditor items={cfg.prestation_options || []} onChange={(v) => upd('prestation_options', v)}
            fields={[
              { name: 'id', label: 'ID', placeholder: 'faisabilite', col: 3 },
              { name: 'label', label: 'Libellé', placeholder: 'Étude de faisabilité', col: 5 },
              { name: 'icon', label: 'Icône Lucide', placeholder: 'Search', col: 2 },
              { name: 'recommends', label: 'Service recommandé (slug)', placeholder: 'conseil-technique', col: 2 },
            ]}
            newItem={() => ({ id: `p${Date.now()}`, label: '', icon: 'Check', recommends: '' })}
          />
        )}
        {tab === 'budget_options' && (
          <SimpleEditor items={cfg.budget_options || []} onChange={(v) => upd('budget_options', v)}
            fields={[
              { name: 'id', label: 'ID', placeholder: 'b1', col: 2 },
              { name: 'label', label: 'Libellé', placeholder: 'Moins de 25 millions FCFA', col: 6 },
              { name: 'min', label: 'Min (millions)', placeholder: '0', type: 'number', col: 2 },
              { name: 'max', label: 'Max (millions)', placeholder: '25', type: 'number', col: 2 },
            ]}
            newItem={() => ({ id: `b${Date.now()}`, label: '', min: 0, max: 100 })}
          />
        )}
        {tab === 'delai_options' && (
          <SimpleEditor items={cfg.delai_options || []} onChange={(v) => upd('delai_options', v)}
            fields={[
              { name: 'id', label: 'ID', placeholder: 'd1', col: 2 },
              { name: 'label', label: 'Libellé', placeholder: 'Urgent (moins de 3 mois)', col: 7 },
              { name: 'months', label: 'Mois indicatifs', placeholder: '3', type: 'number', col: 3 },
            ]}
            newItem={() => ({ id: `d${Date.now()}`, label: '', months: 6 })}
          />
        )}
        {tab === 'formula' && (
          <FormulaEditor cfg={cfg} upd={upd} />
        )}
      </div>

      <div className="mt-6 adm-card p-5 flex gap-3 items-start bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-400">
        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Comment fonctionne le calcul ?</strong><br />
          Estimation = (Prix au m² du type × Surface de référence) × (1 + Nombre de prestations × Multiplicateur) × Facteur bas/haut.<br />
          Délai = Surface × Mois par m² du type, arrondi.<br />
          Modifiez ces paramètres pour affiner les estimations proposées au visiteur.
        </div>
      </div>
    </div>
  );
}

function ProjectTypesEditor({ items, onChange }) {
  const upd = (i, k, v) => onChange(items.map((x, idx) => idx === i ? { ...x, [k]: k === 'baseCostPerSqm' || k === 'monthsPerSqm' ? Number(v) : v } : x));
  const add = () => onChange([...items, { id: `t${Date.now()}`, label: 'Nouveau type', icon: 'Home', baseCostPerSqm: 250000, monthsPerSqm: 0.01 }]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
        <div className="col-span-2">ID</div>
        <div className="col-span-3">Libellé</div>
        <div className="col-span-2">Icône</div>
        <div className="col-span-2">Prix au m² (FCFA)</div>
        <div className="col-span-2">Mois par m²</div>
        <div className="col-span-1"></div>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input value={it.id} onChange={(e) => upd(i, 'id', e.target.value)} className="adm-input col-span-2" placeholder="villa" />
            <input value={it.label} onChange={(e) => upd(i, 'label', e.target.value)} className="adm-input col-span-3" placeholder="Villa" />
            <input value={it.icon} onChange={(e) => upd(i, 'icon', e.target.value)} className="adm-input col-span-2" placeholder="Home" />
            <input type="number" value={it.baseCostPerSqm} onChange={(e) => upd(i, 'baseCostPerSqm', e.target.value)} className="adm-input col-span-2" />
            <input type="number" step="0.001" value={it.monthsPerSqm} onChange={(e) => upd(i, 'monthsPerSqm', e.target.value)} className="adm-input col-span-2" />
            <button onClick={() => remove(i)} className="adm-btn adm-btn-danger col-span-1 !px-2 !py-2 justify-center"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
      <button onClick={add} className="adm-btn adm-btn-ghost mt-4"><Plus size={14} /> Ajouter un type de projet</button>
    </div>
  );
}

function SimpleEditor({ items, onChange, fields, newItem }) {
  const upd = (i, k, v) => onChange(items.map((x, idx) => idx === i ? { ...x, [k]: fields.find((f) => f.name === k)?.type === 'number' ? Number(v) : v } : x));
  const add = () => onChange([...items, newItem()]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-1">
        {fields.map((f) => <div key={f.name} className={`col-span-${f.col}`}>{f.label}</div>)}
        <div className="col-span-1"></div>
      </div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            {fields.map((f) => (
              <input
                key={f.name}
                type={f.type || 'text'}
                value={it[f.name] ?? ''}
                onChange={(e) => upd(i, f.name, e.target.value)}
                placeholder={f.placeholder}
                className={`adm-input col-span-${f.col}`}
              />
            ))}
            <button onClick={() => remove(i)} className="adm-btn adm-btn-danger col-span-1 !px-2 !py-2 justify-center"><Trash2 size={12} /></button>
          </div>
        ))}
      </div>
      <button onClick={add} className="adm-btn adm-btn-ghost mt-4"><Plus size={14} /> Ajouter</button>
    </div>
  );
}

function FormulaEditor({ cfg, upd }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
      <Field label="Multiplicateur prestation (%)">
        <input type="number" step="0.01" value={cfg.prestation_multiplier} onChange={(e) => upd('prestation_multiplier', Number(e.target.value))} className="adm-input" />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">+X% par prestation sélectionnée (ex: 0.04 = +4%)</p>
      </Field>
      <Field label="Facteur bas de l'estimation">
        <input type="number" step="0.01" value={cfg.estimate_low_factor} onChange={(e) => upd('estimate_low_factor', Number(e.target.value))} className="adm-input" />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ex: 0.9 = -10% du prix estimé</p>
      </Field>
      <Field label="Facteur haut de l'estimation">
        <input type="number" step="0.01" value={cfg.estimate_high_factor} onChange={(e) => upd('estimate_high_factor', Number(e.target.value))} className="adm-input" />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ex: 1.15 = +15% du prix estimé</p>
      </Field>
    </div>
  );
}
