import React, { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Edit2, X, Save, Upload, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import api, { mediaUrl } from '../../lib/api';
import { PageHeader } from './Dashboard';
import { Field } from './Projects';
import './admin.css';

const STAR = '★';

/**
 * Generic CRUD list page.
 * Props:
 *  - endpoint: '/admin/slides'
 *  - title, subtitle
 *  - columns: [{key, label, render?}] shown in the table
 *  - fields: [{name,label,type,required,options,placeholder,full,help}] for the form
 *  - imageField: name of the field that stores an uploaded image URL (single)
 *  - uploadFolder: media folder for uploads
 *  - defaults: default values for a new item
 *  - orderable: true/false show up/down buttons
 */
export default function GenericCrudPage({
  endpoint, title, subtitle,
  columns, fields, imageField, uploadFolder = 'general',
  defaults = {}, orderable = true,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get(endpoint);
      setItems(data);
    } catch {
      toast.error('Erreur');
    }

    setLoading(false);
  }, [endpoint]);

 useEffect(() => {
  fetchData();
}, [fetchData]);

  const remove = async (id) => {
    if (!window.confirm('Supprimer définitivement ?')) return;
    await api.delete(`${endpoint}/${id}`);
    toast.success('Supprimé');
    fetchData();
  };

  const move = async (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const a = items[idx], b = items[target];
    try {
      await api.patch(`${endpoint}/${a.id}`, { ...a, order: b.order || target });
      await api.patch(`${endpoint}/${b.id}`, { ...b, order: a.order || idx });
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  const toggleActive = async (it) => {
    try {
      await api.patch(`${endpoint}/${it.id}`, { ...it, active: !it.active });
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  return (
    <div>
      <PageHeader title={title} subtitle={`${items.length} élément(s) - ${subtitle || ''}`}
        actions={<button onClick={() => setEditing({ ...defaults, order: items.length })} className="adm-btn adm-btn-primary"><Plus size={14} /> Nouveau</button>} />

      <div className="adm-card overflow-hidden">
        {loading ? <div className="p-12 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FFB800]" /></div> :
          items.length === 0 ? <div className="p-12 text-center text-slate-400">Aucun élément</div> :
          <div className="overflow-x-auto">
            <table className="adm-table">
              <thead>
                <tr>
                  {orderable && <th className="w-8"></th>}
                  {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                  <th className="w-8"></th>
                  <th className="w-32"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={it.id}>
                    {orderable && (
                      <td>
                        <button onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-400 hover:text-[#0A2540] dark:hover:text-white disabled:opacity-30 p-0.5"><ArrowUp size={12} /></button>
                        <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-slate-400 hover:text-[#0A2540] dark:hover:text-white disabled:opacity-30 p-0.5 ml-1"><ArrowDown size={12} /></button>
                      </td>
                    )}
                    {columns.map((c) => <td key={c.key}>{c.render ? c.render(it) : it[c.key]}</td>)}
                    <td>
                      <button onClick={() => toggleActive(it)} className={it.active !== false ? 'text-green-600' : 'text-slate-400'} title={it.active !== false ? 'Actif' : 'Désactivé'}>
                        {it.active !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <button onClick={() => setEditing(it)} className="text-[#0A2540] dark:text-white hover:text-[#FFB800] p-1 mr-1"><Edit2 size={14} /></button>
                      <button onClick={() => remove(it.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

      {editing && (
        <GenericForm
          item={editing}
          fields={fields}
          imageField={imageField}
          uploadFolder={uploadFolder}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); fetchData(); }}
          endpoint={endpoint}
          title={title}
        />
      )}
    </div>
  );
}

function GenericForm({ item, fields, imageField, uploadFolder, onClose, onSaved, endpoint, title }) {
  const [f, setF] = useState(item);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

const upd = (k, v) => setF(prev => ({ ...prev, [k]: v }));
  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', uploadFolder);
      const { data } = await api.post('/admin/media', fd);
setF(prev => ({ ...prev, [imageField]: data.url }));
toast.success('Image téléchargée');
    } catch { toast.error('Erreur upload'); }
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...f };
      if (item.id) await api.patch(`${endpoint}/${item.id}`, payload);
      else await api.post(endpoint, payload);
      toast.success('Enregistré');
      onSaved();
    } catch (e) { toast.error(e?.response?.data?.detail || 'Erreur'); }
    setSaving(false);
  };

  return (
<div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 dark:text-white w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between sticky top-0 z-10">
          <h3 className="font-heading text-lg font-extrabold uppercase">{item.id ? 'Modifier' : 'Nouveau'} - {title}</h3>
          <button onClick={onClose} className="w-9 h-9 hover:bg-[#FFB800] hover:text-[#0A2540] flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((fld) => (
            <div key={fld.name} className={fld.full ? 'md:col-span-2' : ''}>
              <Field label={fld.label} required={fld.required}>
                {fld.type === 'textarea' ? (
                  <textarea rows={fld.rows || 4} required={fld.required} value={f[fld.name] || ''} onChange={(e) => upd(fld.name, e.target.value)} className="adm-input resize-none" placeholder={fld.placeholder} />
                ) : fld.type === 'select' ? (
                  <select value={f[fld.name] || ''} onChange={(e) => upd(fld.name, e.target.value)} className="adm-input">
                    <option value="">--</option>
                    {fld.options.map((o) => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
                  </select>
                ) : fld.type === 'image' ? (
  <div>
    {f[fld.name] && (
      <div className="mb-3">
        <img
          src={mediaUrl(f[fld.name])}
          alt=""
          className="w-full max-h-48 object-cover border border-slate-200 rounded"
        />
      </div>
    )}

    <button
      type="button"
      onClick={() => fileInputRef.current?.click()}
      disabled={uploading}
      className="adm-btn adm-btn-ghost inline-flex items-center gap-2"
    >
      <Upload size={14} />
      {uploading ? 'Upload...' : 'Choisir une image'}
    </button>

    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      disabled={uploading}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) uploadImage(file);
        e.target.value = '';
      }}
    />
  </div>
                ) : fld.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={!!f[fld.name]} onChange={(e) => upd(fld.name, e.target.checked)} />
                    <span className="text-sm">{fld.checkLabel || 'Oui'}</span>
                  </label>
                ) : (
                  <input
                    type={fld.type || 'text'}
                    required={fld.required}
                    value={f[fld.name] || (fld.type === 'number' ? 0 : '')}
                    onChange={(e) => upd(fld.name, fld.type === 'number' ? Number(e.target.value) : e.target.value)}
                    placeholder={fld.placeholder}
                    className="adm-input"
                  />
                )}
                {fld.help && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{fld.help}</p>}
              </Field>
            </div>
          ))}

          <div className="md:col-span-2 flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={save} disabled={saving} className="adm-btn adm-btn-primary">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer</button>
            <button onClick={onClose} className="adm-btn adm-btn-ghost">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}
