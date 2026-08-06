import React, { useEffect, useState } from 'react';
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

  const fetchData = async () => {
    setLoading(true);
    try { const { data } = await api.get(endpoint); setItems(data); }
    catch { toast.error('Erreur'); }
    setLoading(false);
  };
  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [endpoint]);

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
  const [previewUrl, setPreviewUrl] = useState(null); // local blob preview shown instantly
  const [uploadError, setUploadError] = useState('');
  const [imgError, setImgError] = useState(false);
  const backdropMouseDown = React.useRef(false);

  const upd = (k, v) => setF((prev) => ({ ...prev, [k]: v }));

  // Clean up blob URLs when component unmounts or preview swapped
  React.useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const uploadImage = async (file) => {
    setUploadError('');
    setImgError(false);
    // Basic client-side validation
    if (!file.type.startsWith('image/')) {
      const msg = `Fichier ignoré : ${file.name} n'est pas une image (${file.type || 'inconnu'}).`;
      setUploadError(msg); toast.error(msg);
      return;
    }
    const MAX_MB = 15;
    if (file.size > MAX_MB * 1024 * 1024) {
      const msg = `Image trop volumineuse (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum ${MAX_MB} Mo.`;
      setUploadError(msg); toast.error(msg);
      return;
    }
    // Instant local preview
    const blob = URL.createObjectURL(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(blob);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', uploadFolder);
      const { data } = await api.post('/admin/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (!data?.url) throw new Error("Réponse invalide du serveur (URL manquante)");
      upd(imageField, data.url);
      // Prefer server URL after successful upload: revoke blob so admin sees the real stored image
      URL.revokeObjectURL(blob);
      setPreviewUrl(null);
      toast.success('Image téléchargée');
    } catch (e) {
      const detail = e?.response?.data?.detail || e?.message || 'Échec de l\'upload';
      setUploadError(String(detail));
      toast.error(`Erreur upload : ${detail}`);
      // Revert preview on error
      URL.revokeObjectURL(blob);
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUploadError('');
    setImgError(false);
    upd(imageField, '');
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...f };
      if (item.id) await api.patch(`${endpoint}/${item.id}`, payload);
      else await api.post(endpoint, payload);
      toast.success('Enregistré');
      onSaved();
    } catch (e) {
      const detail = e?.response?.data?.detail || 'Erreur';
      toast.error(String(detail));
    } finally {
      setSaving(false);
    }
  };

  // Safe outside-click close: only fire when the user both pressed AND released on the backdrop.
  // Prevents accidental close after native file picker closes.
  const onBackdropMouseDown = (e) => { backdropMouseDown.current = e.target === e.currentTarget; };
  const onBackdropClick = (e) => {
    if (backdropMouseDown.current && e.target === e.currentTarget) onClose();
    backdropMouseDown.current = false;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onMouseDown={onBackdropMouseDown}
      onClick={onBackdropClick}
      data-testid="crud-modal-backdrop"
    >
      <div className="bg-white dark:bg-slate-800 dark:text-white w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()} data-testid="crud-modal">
        <div className="bg-[#0A2540] text-white p-5 flex items-center justify-between sticky top-0 z-10">
          <h3 className="font-heading text-lg font-extrabold uppercase">{item.id ? 'Modifier' : 'Nouveau'} - {title}</h3>
          <button onClick={onClose} className="w-9 h-9 hover:bg-[#FFB800] hover:text-[#0A2540] flex items-center justify-center" data-testid="crud-modal-close"><X size={18} /></button>
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
                  <ImageUploader
                    value={f[fld.name]}
                    previewUrl={previewUrl}
                    onUpload={uploadImage}
                    onClear={clearImage}
                    uploading={uploading}
                    error={uploadError}
                    imgError={imgError}
                    setImgError={setImgError}
                  />
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
            <button onClick={save} disabled={saving || uploading} className="adm-btn adm-btn-primary" data-testid="crud-modal-save">{saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Enregistrer</button>
            <button onClick={onClose} className="adm-btn adm-btn-ghost" data-testid="crud-modal-cancel">Annuler</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageUploader({ value, previewUrl, onUpload, onClear, uploading, error, imgError, setImgError }) {
  // Display source: local blob preview (freshest) → server URL → nothing
  const displaySrc = previewUrl || (value ? mediaUrl(value) : null);
  return (
    <div>
      {displaySrc && !imgError && (
        <div className="mb-2 relative inline-block" data-testid="image-preview-wrap">
          <img
            src={displaySrc}
            alt=""
            className="h-32 object-cover border border-slate-200 dark:border-slate-700 max-w-full"
            onError={() => setImgError(true)}
            data-testid="image-preview"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white" data-testid="image-uploading">
              <Loader2 size={22} className="animate-spin" />
            </div>
          )}
          {!uploading && value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1"
              data-testid="image-clear"
              title="Retirer"
            >
              <X size={12} />
            </button>
          )}
        </div>
      )}
      {imgError && (
        <div className="mb-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 p-2" data-testid="image-error">
          <X size={14} /> L&apos;image ne s&apos;affiche pas — URL cassée ou fichier introuvable. Réessayez l&apos;upload.
        </div>
      )}
      <div className="flex items-center gap-2">
        <label className="adm-btn adm-btn-ghost cursor-pointer" data-testid="image-upload-btn">
          <Upload size={14} /> {uploading ? 'Envoi en cours...' : (value ? 'Remplacer' : 'Choisir une image')}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              // Reset input so re-selecting the same file still triggers change
              e.target.value = '';
            }}
            data-testid="image-input"
          />
        </label>
        {uploading && <span className="text-xs text-slate-500 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Upload…</span>}
      </div>
      {error && (
        <p className="text-xs text-red-600 mt-2" data-testid="upload-error">{error}</p>
      )}
    </div>
  );
}
