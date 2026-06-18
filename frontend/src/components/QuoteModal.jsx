import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
  ArrowUpRight, Loader2, CheckCircle2, X,
  FileText, Hammer, HardHat, Wrench, Truck, PenTool, ClipboardCheck,
  MessageCircle,
} from 'lucide-react';
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from './ui/dialog';
import { useQuoteModal } from '../contexts/QuoteModalContext';
import { serviceForms, services, company } from '../data/mock';

const ICONS = { FileText, Hammer, HardHat, Wrench, Truck, PenTool, ClipboardCheck };

export default function QuoteModal() {
  const { open, serviceId, closeModal, setOpen } = useQuoteModal();
  const config = useMemo(() => serviceForms[serviceId] || serviceForms.default, [serviceId]);
  const service = useMemo(() => services.find((s) => s.id === serviceId), [serviceId]);
  const Icon = ICONS[config.icon] || FileText;

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Reset form when modal opens with new service
  useEffect(() => {
    if (open) {
      const init = {};
      config.fields.forEach((f) => { init[f.name] = ''; });
      setValues(init);
      setSent(false);
    }
  }, [open, serviceId, config]);

  const update = (name, val) => setValues((v) => ({ ...v, [name]: val }));

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      // Persist
      try {
        const arr = JSON.parse(localStorage.getItem('scg_quotes') || '[]');
        arr.push({
          service: serviceId || 'general',
          serviceTitle: service?.title || 'Devis général',
          values,
          at: new Date().toISOString(),
        });
        localStorage.setItem('scg_quotes', JSON.stringify(arr));
      } catch (_) {}
      toast.success('Demande envoyée ! Un expert vous contactera sous 24h.');
    }, 1100);
  };

  const sendWhatsApp = () => {
    const lines = [`*Demande de devis - ${config.title}*`, ''];
    config.fields.forEach((f) => {
      const v = values[f.name];
      if (v) lines.push(`*${f.label}:* ${v}`);
    });
    const msg = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${company.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent
          className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-0 bg-white p-0 shadow-2xl duration-200 max-h-[92vh] overflow-hidden border-0"
          onPointerDownOutside={(e) => sent && closeModal()}
        >
          {/* Header */}
          <div className="relative bg-[#0A2540] text-white p-6 pr-14">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center hover:bg-[#FFB800] hover:text-[#0A2540] transition-colors"
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FFB800] flex items-center justify-center text-[#0A2540] shrink-0">
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#FFB800] font-semibold">{config.subtitle}</div>
                <h2 className="font-heading text-xl sm:text-2xl font-extrabold uppercase leading-tight truncate">{config.title}</h2>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto p-6 sm:p-8 max-h-[calc(92vh-100px)]">
            {sent ? (
              <SuccessView onClose={closeModal} onWhatsApp={sendWhatsApp} />
            ) : (
              <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.fields.map((f) => (
                  <FieldRenderer key={f.name} field={f} value={values[f.name]} onChange={(v) => update(f.name, v)} />
                ))}
                <div className="md:col-span-2 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center disabled:opacity-70"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</>
                    ) : (
                      <><ArrowUpRight size={16} /> Envoyer ma demande</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // Build whatsapp message from current form values
                      const lines = [`*Demande de devis - ${config.title}*`, ''];
                      config.fields.forEach((f) => {
                        const v = values[f.name];
                        if (v) lines.push(`*${f.label}:* ${v}`);
                      });
                      const msg = encodeURIComponent(lines.join('\n'));
                      window.open(`https://wa.me/${company.whatsapp}?text=${msg}`, '_blank');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3.5 font-semibold uppercase tracking-wider text-sm hover:bg-[#1da851] transition-colors"
                  >
                    <MessageCircle size={16} fill="white" /> Envoyer via WhatsApp
                  </button>
                </div>
                <p className="md:col-span-2 text-xs text-gray-500 text-center mt-1">
                  Vos informations restent confidentielles. Réponse sous 24h ouvrées.
                </p>
              </form>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function SuccessView({ onClose, onWhatsApp }) {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 mx-auto bg-[#FFB800] flex items-center justify-center mb-5">
        <CheckCircle2 size={42} className="text-[#0A2540]" />
      </div>
      <h3 className="font-heading text-3xl text-[#0A2540] font-extrabold uppercase">Demande envoyée !</h3>
      <p className="text-gray-600 mt-3 max-w-md mx-auto">
        Merci pour votre confiance. Un de nos experts vous contactera sous <strong>24 heures ouvrées</strong> pour discuter de votre projet.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
        <button onClick={onWhatsApp} className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 font-semibold uppercase tracking-wider text-sm hover:bg-[#1da851]">
          <MessageCircle size={16} fill="white" /> Continuer sur WhatsApp
        </button>
        <button onClick={onClose} className="btn-primary">
          Fermer
        </button>
      </div>
    </div>
  );
}

function FieldRenderer({ field, value, onChange }) {
  const colClass = field.full ? 'md:col-span-2' : '';
  const labelEl = (
    <span className="block text-xs font-semibold uppercase tracking-wider text-[#0A2540] mb-1.5">
      {field.label} {field.required && <span className="text-[#FFB800]">*</span>}
    </span>
  );
  const inputBase = "w-full border border-gray-200 px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-[#FFB800] focus:bg-white transition-colors";

  if (field.type === 'textarea') {
    return (
      <label className={`block ${colClass}`}>
        {labelEl}
        <textarea
          required={field.required}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={field.placeholder}
          className={`${inputBase} resize-none`}
        />
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <label className={`block ${colClass}`}>
        {labelEl}
        <select
          required={field.required}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputBase}
        >
          <option value="">-- Sélectionnez --</option>
          {field.options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === 'radio') {
    return (
      <div className={`block ${colClass}`}>
        {labelEl}
        <div className="flex flex-wrap gap-2 mt-1">
          {field.options.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={`px-4 py-2.5 text-sm border transition-colors ${
                value === o
                  ? 'border-[#FFB800] bg-[#FFFAEB] text-[#0A2540] font-semibold'
                  : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-[#FFB800]'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <label className={`block ${colClass}`}>
      {labelEl}
      <input
        type={field.type}
        required={field.required}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={inputBase}
      />
    </label>
  );
}
