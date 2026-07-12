import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Home, Building2, Briefcase, Store, Hotel, Warehouse, Wrench,
  Search, PenTool, Box, Image as ImageIcon, ShieldCheck, HardHat, Users, ClipboardCheck,
  ChevronLeft, ChevronRight, Check, CheckCircle2, Calculator, Clock, Wallet,
  ArrowUpRight, Download, Mail, MessageCircle, RotateCcw, Sparkles, Loader2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import PageBanner from '../components/PageBanner';
import {
  projectTypes, surfaceOptions, prestationOptions, budgetOptions, delaiOptions,
  services, company,
} from '../data/mock';
import api from '../lib/api';

const ICONS = {
  Home, Building2, Briefcase, Store, Hotel, Warehouse, Wrench,
  Search, PenTool, Box, Image: ImageIcon, ShieldCheck, HardHat, Users, ClipboardCheck,
};

const STEPS = [
  { id: 1, label: 'Type de projet', short: 'Type' },
  { id: 2, label: 'Surface estimée', short: 'Surface' },
  { id: 3, label: 'Prestations', short: 'Prestations' },
  { id: 4, label: 'Budget', short: 'Budget' },
  { id: 5, label: 'Délai', short: 'Délai' },
  { id: 6, label: 'Coordonnées', short: 'Contact' },
];

const formatFCFA = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n)) + ' FCFA';

export default function Simulator({ embedded = false }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    projectType: null,
    surface: null,
    prestations: [],
    budget: null,
    delai: null,
    contact: { name: '', email: '', phone: '', address: '', notes: '' },
  });
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const togglePrestation = (id) => {
    setData((d) => ({
      ...d,
      prestations: d.prestations.includes(id)
        ? d.prestations.filter((x) => x !== id)
        : [...d.prestations, id],
    }));
  };

  const canNext = useMemo(() => {
    if (step === 1) return !!data.projectType;
    if (step === 2) return !!data.surface;
    if (step === 3) return data.prestations.length > 0;
    if (step === 4) return !!data.budget;
    if (step === 5) return !!data.delai;
    if (step === 6) return data.contact.name && data.contact.email && data.contact.phone;
    return false;
  }, [step, data]);

  const compute = () => {
    const pt = projectTypes.find((p) => p.id === data.projectType);
    const sf = surfaceOptions.find((s) => s.id === data.surface);
    const dl = delaiOptions.find((d) => d.id === data.delai);

    const baseCost = pt.baseCostPerSqm * sf.value;
    const prestationMultiplier = 1 + data.prestations.length * 0.04;
    const estimateLow = baseCost * prestationMultiplier * 0.9;
    const estimateHigh = baseCost * prestationMultiplier * 1.15;

    const baseMonths = Math.ceil(sf.value * pt.monthsPerSqm);
    const monthsLow = Math.max(2, baseMonths);
    const monthsHigh = Math.max(monthsLow + 2, baseMonths + Math.ceil(data.prestations.length / 2));

    const recommendedServiceIds = Array.from(
      new Set(
        data.prestations
          .map((id) => prestationOptions.find((p) => p.id === id)?.recommends)
          .filter(Boolean)
      )
    );
    const recommendedServices = recommendedServiceIds
      .map((id) => services.find((s) => s.id === id))
      .filter(Boolean);

    return {
      projectType: pt,
      surface: sf,
      prestations: data.prestations.map((id) => prestationOptions.find((p) => p.id === id)),
      budget: budgetOptions.find((b) => b.id === data.budget),
      delai: dl,
      contact: data.contact,
      estimateLow,
      estimateHigh,
      monthsLow,
      monthsHigh,
      recommendedServices,
      reference: 'SIM-' + Date.now().toString().slice(-8),
      createdAt: new Date().toISOString(),
    };
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const res = compute();
    // Send to backend
    api.post('/public/simulations', {
      project_type: res.projectType.label,
      surface: res.surface.label,
      prestations: res.prestations.map((p) => p.label),
      budget: res.budget.label,
      delai: res.delai.label,
      contact: res.contact,
      estimate_low: res.estimateLow,
      estimate_high: res.estimateHigh,
      months_low: res.monthsLow,
      months_high: res.monthsHigh,
      recommended_services: res.recommendedServices.map((s) => s.id),
    })
      .then(({ data }) => {
        res.reference = data.reference || res.reference;
        setResult(res);
        toast.success('Simulation enregistrée ! Un expert vous contactera sous 24h.');
      })
      .catch(() => {
        setResult(res);
        toast.warning('Simulation calculée. La sauvegarde en ligne a échoué mais vos résultats sont ci-dessous.');
      })
      .finally(() => {
        setSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  };

  const reset = () => {
    setData({
      projectType: null, surface: null, prestations: [], budget: null, delai: null,
      contact: { name: '', email: '', phone: '', address: '', notes: '' },
    });
    setStep(1);
    setResult(null);
  };

  if (result) return <ResultView result={result} onReset={reset} embedded={embedded} />;

  return (
    <>
      {!embedded && (
        <PageBanner
          title="Simulateur de Projet"
          subtitle="Estimez votre projet en 2 minutes"
          breadcrumbs={[{ label: 'Simulateur' }]}
          image="https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&w=1920&q=80"
        />
      )}

      <section className={`${embedded ? 'py-20 lg:py-28' : 'py-12 lg:py-16 min-h-[60vh]'} bg-[#F5F7FA]`}>
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          {embedded && (
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <div className="section-label justify-center mb-3 inline-flex">Simulateur de Projet</div>
              <h2 className="font-heading text-4xl lg:text-6xl text-[#0A2540] font-extrabold uppercase leading-[0.95] text-balance">
                Estimez votre projet en 2 minutes
              </h2>
              <p className="text-gray-600 mt-5 leading-relaxed">
                Répondez à quelques questions simples et obtenez instantanément une estimation indicative de votre budget, du délai et des services recommandés.
              </p>
            </div>
          )}
          {/* Stepper */}
          <Stepper currentStep={step} />

          <div className="bg-white shadow-xl border-t-4 border-[#FFB800] mt-8 p-6 sm:p-10">
            {step === 1 && <Step1 data={data} setData={setData} />}
            {step === 2 && <Step2 data={data} setData={setData} />}
            {step === 3 && <Step3 data={data} togglePrestation={togglePrestation} />}
            {step === 4 && <Step4 data={data} setData={setData} />}
            {step === 5 && <Step5 data={data} setData={setData} />}
            {step === 6 && <Step6 data={data} setData={setData} />}

            {/* Nav buttons */}
            <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-200">
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={step === 1}
                className="inline-flex items-center gap-2 px-5 py-3 border border-gray-300 text-[#0A2540] font-semibold uppercase tracking-wider text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Précédent
              </button>
              <div className="text-xs text-gray-500 hidden sm:block">
                Étape <span className="font-bold text-[#0A2540]">{step}</span> / {STEPS.length}
              </div>
              {step < STEPS.length ? (
                <button
                  onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
                  disabled={!canNext}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canNext || submitting}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Calcul...</>
                  ) : (
                    <><Sparkles size={16} /> Obtenir l'estimation</>
                  )}
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6 max-w-2xl mx-auto">
            ℹ️ Cette estimation est indicative et basée sur les standards du marché ivoirien. Un devis détaillé personnalisé vous sera fourni par nos experts après analyse complète de votre projet.
          </p>
        </div>
      </section>
    </>
  );
}

/* ---------- Stepper ---------- */
function Stepper({ currentStep }) {
  return (
    <div className="bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2 overflow-x-auto">
        {STEPS.map((s, i) => {
          const done = currentStep > s.id;
          const active = currentStep === s.id;
          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  done ? 'bg-[#FFB800] text-[#0A2540]' :
                  active ? 'bg-[#0A2540] text-white ring-4 ring-[#FFB800]/30' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {done ? <Check size={18} /> : s.id}
                </div>
                <div className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-center ${active ? 'text-[#0A2540]' : 'text-gray-500'} hidden sm:block`}>
                  {s.short}
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] transition-colors ${done ? 'bg-[#FFB800]' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Step components ---------- */
function StepHeader({ subtitle, title, description }) {
  return (
    <div className="mb-8">
      <div className="section-label mb-3">{subtitle}</div>
      <h2 className="font-heading text-3xl lg:text-4xl text-[#0A2540] font-extrabold uppercase leading-tight">{title}</h2>
      {description && <p className="text-gray-600 mt-3">{description}</p>}
    </div>
  );
}

function SelectCard({ active, onClick, icon: Icon, label, sub, multi = false }) {
  return (
    <button
      onClick={onClick}
      className={`group relative text-left p-5 border-2 transition-all ${
        active
          ? 'border-[#FFB800] bg-[#FFFAEB] shadow-md'
          : 'border-gray-200 bg-white hover:border-[#FFB800] hover:bg-[#FFFCF5]'
      }`}
    >
      {active && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-[#FFB800] text-[#0A2540] rounded-full flex items-center justify-center">
          <Check size={14} strokeWidth={3} />
        </div>
      )}
      {Icon && (
        <div className={`w-12 h-12 flex items-center justify-center mb-3 transition-colors ${
          active ? 'bg-[#0A2540] text-[#FFB800]' : 'bg-[#F5F7FA] text-[#0A2540] group-hover:bg-[#0A2540] group-hover:text-[#FFB800]'
        }`}>
          <Icon size={22} />
        </div>
      )}
      <div className="font-heading font-bold text-[#0A2540] uppercase tracking-wider text-sm">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </button>
  );
}

function Step1({ data, setData }) {
  return (
    <div>
      <StepHeader
        subtitle="Étape 1 / 6"
        title="Quel type de projet souhaitez-vous réaliser ?"
        description="Sélectionnez la catégorie qui correspond le mieux à votre projet."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {projectTypes.map((p) => (
          <SelectCard
            key={p.id}
            icon={ICONS[p.icon]}
            label={p.label}
            active={data.projectType === p.id}
            onClick={() => setData({ ...data, projectType: p.id })}
          />
        ))}
      </div>
    </div>
  );
}

function Step2({ data, setData }) {
  return (
    <div>
      <StepHeader
        subtitle="Étape 2 / 6"
        title="Quelle est la surface estimée ?"
        description="Une estimation approximative suffit. Nous affinerons ensemble lors de l'étude."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {surfaceOptions.map((s) => (
          <SelectCard
            key={s.id}
            label={s.label}
            sub={`~ ${s.value} m² de référence`}
            active={data.surface === s.id}
            onClick={() => setData({ ...data, surface: s.id })}
          />
        ))}
      </div>
    </div>
  );
}

function Step3({ data, togglePrestation }) {
  return (
    <div>
      <StepHeader
        subtitle="Étape 3 / 6"
        title="Quelles prestations souhaitez-vous ?"
        description="Sélectionnez toutes les prestations qui vous intéressent (plusieurs choix possibles)."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prestationOptions.map((p) => (
          <SelectCard
            key={p.id}
            icon={ICONS[p.icon]}
            label={p.label}
            active={data.prestations.includes(p.id)}
            onClick={() => togglePrestation(p.id)}
          />
        ))}
      </div>
      {data.prestations.length > 0 && (
        <div className="mt-6 text-sm text-[#0A2540] font-semibold">
          ✓ {data.prestations.length} prestation{data.prestations.length > 1 ? 's' : ''} sélectionnée{data.prestations.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

function Step4({ data, setData }) {
  return (
    <div>
      <StepHeader
        subtitle="Étape 4 / 6"
        title="Quel est votre budget estimatif ?"
        description="Cette information nous aide à proposer les solutions les mieux adaptées."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {budgetOptions.map((b) => (
          <SelectCard
            key={b.id}
            label={b.label}
            active={data.budget === b.id}
            onClick={() => setData({ ...data, budget: b.id })}
          />
        ))}
      </div>
    </div>
  );
}

function Step5({ data, setData }) {
  return (
    <div>
      <StepHeader
        subtitle="Étape 5 / 6"
        title="Quel délai souhaitez-vous pour la réalisation ?"
        description="Indiquez la durée idéale pour démarrer et achever votre projet."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {delaiOptions.map((d) => (
          <SelectCard
            key={d.id}
            label={d.label}
            active={data.delai === d.id}
            onClick={() => setData({ ...data, delai: d.id })}
          />
        ))}
      </div>
    </div>
  );
}

function Step6({ data, setData }) {
  const c = data.contact;
  const upd = (k, v) => setData({ ...data, contact: { ...c, [k]: v } });
  return (
    <div>
      <StepHeader
        subtitle="Étape 6 / 6"
        title="Vos coordonnées"
        description="Pour vous envoyer l'estimation et vous recontacter avec un devis personnalisé."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nom complet" required value={c.name} onChange={(v) => upd('name', v)} placeholder="Jean Dupont" />
        <Input label="Téléphone" required value={c.phone} onChange={(v) => upd('phone', v)} type="tel" placeholder="+221 ..." />
        <Input label="Email" required type="email" value={c.email} onChange={(v) => upd('email', v)} placeholder="vous@email.com" />
        <Input label="Adresse / Localisation" value={c.address} onChange={(v) => upd('address', v)} placeholder="Parcelles Assainies, Dakar" />
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0A2540] mb-1.5">Notes complémentaires</label>
          <textarea
            value={c.notes}
            onChange={(e) => upd('notes', e.target.value)}
            rows={4}
            placeholder="Précisions, contraintes particulières, références..."
            className="w-full border border-gray-200 px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-[#FFB800] focus:bg-white resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function Input({ label, required, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-[#0A2540] mb-1.5">
        {label} {required && <span className="text-[#FFB800]">*</span>}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:border-[#FFB800] focus:bg-white"
      />
    </label>
  );
}

/* ---------- Result View ---------- */
function ResultView({ result, onReset, embedded = false }) {
  const downloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const w = doc.internal.pageSize.getWidth();
    let y = 50;

    // Header
    doc.setFillColor(10, 37, 64);
    doc.rect(0, 0, w, 90, 'F');
    doc.setTextColor(255, 184, 0);
    doc.setFontSize(22).setFont('helvetica', 'bold');
    doc.text('SYNERGIES CONSTRUCTION GROUP', 40, 45);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11).setFont('helvetica', 'normal');
    doc.text('Estimation de projet - ' + result.reference, 40, 65);
    y = 130;

    doc.setTextColor(10, 37, 64);
    doc.setFontSize(18).setFont('helvetica', 'bold');
    doc.text('RÉSUMÉ DE VOTRE PROJET', 40, y); y += 30;

    doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(50, 50, 50);
    const lines = [
      ['Type de projet', result.projectType.label],
      ['Surface estimée', result.surface.label],
      ['Prestations', result.prestations.map((p) => p.label).join(', ')],
      ['Budget annoncé', result.budget.label],
      ['Délai souhaité', result.delai.label],
      ['', ''],
      ['Client', result.contact.name],
      ['Email', result.contact.email],
      ['Téléphone', result.contact.phone],
      ['Adresse', result.contact.address || '—'],
    ];
    lines.forEach(([k, v]) => {
      if (k) {
        doc.setFont('helvetica', 'bold').setTextColor(10, 37, 64).text(k + ':', 40, y);
        doc.setFont('helvetica', 'normal').setTextColor(60, 60, 60);
        const wrapped = doc.splitTextToSize(v, w - 200);
        doc.text(wrapped, 180, y);
        y += Math.max(16, wrapped.length * 14);
      } else { y += 8; }
    });

    y += 10;
    doc.setDrawColor(255, 184, 0).setLineWidth(2).line(40, y, w - 40, y); y += 25;

    doc.setFontSize(16).setFont('helvetica', 'bold').setTextColor(10, 37, 64);
    doc.text('ESTIMATION INDICATIVE', 40, y); y += 25;

    doc.setFontSize(11).setFont('helvetica', 'normal').setTextColor(50, 50, 50);
    doc.text('Budget estimé:', 40, y);
    doc.setFont('helvetica', 'bold').setTextColor(255, 140, 0);
    doc.text(formatFCFA(result.estimateLow) + '  -  ' + formatFCFA(result.estimateHigh), 180, y); y += 20;

    doc.setFont('helvetica', 'normal').setTextColor(50, 50, 50);
    doc.text('Délai estimé:', 40, y);
    doc.setFont('helvetica', 'bold').setTextColor(10, 37, 64);
    doc.text(result.monthsLow + ' à ' + result.monthsHigh + ' mois', 180, y); y += 30;

    if (result.recommendedServices.length) {
      doc.setFontSize(13).setFont('helvetica', 'bold').setTextColor(10, 37, 64);
      doc.text('SERVICES RECOMMANDÉS', 40, y); y += 18;
      doc.setFontSize(10).setFont('helvetica', 'normal').setTextColor(60, 60, 60);
      result.recommendedServices.forEach((s) => {
        doc.text('• ' + s.title, 50, y); y += 14;
      });
    }

    // Footer
    doc.setFillColor(10, 37, 64);
    doc.rect(0, 800, w, 42, 'F');
    doc.setTextColor(255, 255, 255).setFontSize(9);
    doc.text(company.phoneDisplay + '  |  ' + company.email + '  |  ' + company.address, 40, 825);

    doc.save('estimation-' + result.reference + '.pdf');
    toast.success('PDF téléchargé');
  };

  const whatsappShare = () => {
    const lines = [
      '*Demande de devis - Synergies Construction*',
      'Référence: ' + result.reference,
      '',
      '*Projet:* ' + result.projectType.label,
      '*Surface:* ' + result.surface.label,
      '*Prestations:* ' + result.prestations.map((p) => p.label).join(', '),
      '*Budget annoncé:* ' + result.budget.label,
      '*Délai:* ' + result.delai.label,
      '',
      '*Estimation:* ' + formatFCFA(result.estimateLow) + ' - ' + formatFCFA(result.estimateHigh),
      '*Délai estimé:* ' + result.monthsLow + ' à ' + result.monthsHigh + ' mois',
      '',
      '*Client:* ' + result.contact.name,
      '*Email:* ' + result.contact.email,
      '*Téléphone:* ' + result.contact.phone,
    ];
    const msg = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${company.whatsapp}?text=${msg}`, '_blank');
  };

  const emailShare = () => {
    const subject = encodeURIComponent('Devis - ' + result.projectType.label + ' (' + result.reference + ')');
    const body = encodeURIComponent(
      'Bonjour Synergies Construction,\n\n' +
      'Suite à ma simulation en ligne, je souhaite obtenir un devis détaillé pour mon projet.\n\n' +
      '--- RÉSUMÉ ---\n' +
      'Référence: ' + result.reference + '\n' +
      'Type: ' + result.projectType.label + '\n' +
      'Surface: ' + result.surface.label + '\n' +
      'Prestations: ' + result.prestations.map((p) => p.label).join(', ') + '\n' +
      'Budget annoncé: ' + result.budget.label + '\n' +
      'Délai souhaité: ' + result.delai.label + '\n\n' +
      'Estimation indicative: ' + formatFCFA(result.estimateLow) + ' - ' + formatFCFA(result.estimateHigh) + '\n' +
      'Délai estimé: ' + result.monthsLow + ' à ' + result.monthsHigh + ' mois\n\n' +
      'Mes coordonnées:\n' +
      'Nom: ' + result.contact.name + '\n' +
      'Téléphone: ' + result.contact.phone + '\n' +
      'Email: ' + result.contact.email + '\n' +
      (result.contact.address ? 'Adresse: ' + result.contact.address + '\n' : '') +
      (result.contact.notes ? '\nNotes: ' + result.contact.notes + '\n' : '') +
      '\nMerci de me recontacter pour finaliser le devis.\n\nCordialement,\n' + result.contact.name
    );
    window.location.href = `mailto:${company.email}?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {!embedded && (
        <PageBanner
          title="Votre estimation"
          subtitle="Résultat de la simulation"
          breadcrumbs={[{ label: 'Simulateur', path: '/simulateur' }, { label: 'Résultat' }]}
          image="https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&w=1920&q=80"
        />
      )}

      <section className={`${embedded ? 'py-16 lg:py-20' : 'py-12 lg:py-16'} bg-[#F5F7FA]`}>
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          {embedded && (
            <div className="text-center mb-8">
              <div className="section-label justify-center inline-flex mb-3">Résultat de votre simulation</div>
              <h2 className="font-heading text-4xl lg:text-5xl text-[#0A2540] font-extrabold uppercase">Votre estimation est prête</h2>
            </div>
          )}
          {/* Success banner */}
          <div className="bg-white shadow-xl border-l-4 border-[#FFB800] p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-4 mb-8">
            <div className="w-14 h-14 bg-[#FFB800] flex items-center justify-center text-[#0A2540] shrink-0">
              <CheckCircle2 size={28} />
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-[#FFB800] font-bold">Référence: {result.reference}</div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0A2540] uppercase mt-1">
                Votre demande a bien été enregistrée
              </h2>
              <p className="text-gray-600 mt-2">
                Un expert vous contactera sous 24h ouvrées avec un devis détaillé personnalisé. Vous pouvez aussi nous contacter directement ci-dessous.
              </p>
            </div>
          </div>

          {/* Main results grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Budget */}
            <div className="bg-gradient-to-br from-[#FFB800] to-[#F0A800] p-6 text-[#0A2540]">
              <div className="flex items-center justify-between mb-3">
                <Wallet size={28} />
                <div className="text-xs uppercase tracking-widest font-bold opacity-70">Budget estimé</div>
              </div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold leading-tight">
                {formatFCFA(result.estimateLow)}
              </div>
              <div className="text-sm font-semibold opacity-80 my-1">à</div>
              <div className="text-2xl sm:text-3xl font-heading font-extrabold leading-tight">
                {formatFCFA(result.estimateHigh)}
              </div>
              <div className="text-xs mt-3 opacity-70 italic">Estimation indicative</div>
            </div>

            {/* Délai */}
            <div className="bg-[#0A2540] p-6 text-white">
              <div className="flex items-center justify-between mb-3">
                <Clock size={28} className="text-[#FFB800]" />
                <div className="text-xs uppercase tracking-widest font-bold text-[#FFB800]">Délai estimé</div>
              </div>
              <div className="font-heading text-5xl font-extrabold leading-none">
                {result.monthsLow}<span className="text-2xl text-white/60"> à </span>{result.monthsHigh}
              </div>
              <div className="text-lg font-heading font-bold mt-2 uppercase">mois</div>
              <div className="text-xs mt-3 text-white/60 italic">Hors phase d'études préliminaires</div>
            </div>

            {/* Services */}
            <div className="bg-white p-6 border-b-4 border-[#FFB800]">
              <div className="flex items-center justify-between mb-3">
                <Calculator size={28} className="text-[#0A2540]" />
                <div className="text-xs uppercase tracking-widest font-bold text-[#0A2540]">Services recommandés</div>
              </div>
              {result.recommendedServices.length ? (
                <ul className="space-y-2">
                  {result.recommendedServices.map((s) => (
                    <li key={s.id}>
                      <Link to={`/services/${s.id}`} className="text-sm font-semibold text-[#0A2540] hover:text-[#FFB800] flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-[#FFB800] shrink-0 mt-0.5" /> {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Nos experts détermineront les services adaptés.</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white shadow-md p-6 sm:p-8 mt-6">
            <h3 className="font-heading text-2xl text-[#0A2540] font-extrabold uppercase mb-5">Résumé complet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <SummaryRow label="Type de projet" value={result.projectType.label} />
              <SummaryRow label="Surface" value={result.surface.label} />
              <SummaryRow label="Budget annoncé" value={result.budget.label} />
              <SummaryRow label="Délai souhaité" value={result.delai.label} />
              <SummaryRow label="Client" value={result.contact.name} />
              <SummaryRow label="Téléphone" value={result.contact.phone} />
              <SummaryRow label="Email" value={result.contact.email} />
              <SummaryRow label="Adresse" value={result.contact.address || '—'} />
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Prestations sélectionnées</div>
              <div className="flex flex-wrap gap-2">
                {result.prestations.map((p) => (
                  <span key={p.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F7FA] text-[#0A2540] text-xs font-semibold">
                    <Check size={12} className="text-[#FFB800]" /> {p.label}
                  </span>
                ))}
              </div>
            </div>
            {result.contact.notes && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Notes</div>
                <p className="text-sm text-gray-700">{result.contact.notes}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-[#0A2540] text-white p-6 sm:p-8 mt-6">
            <h3 className="font-heading text-xl sm:text-2xl font-extrabold uppercase mb-2">Que souhaitez-vous faire ?</h3>
            <p className="text-white/70 text-sm mb-5">Recevez votre estimation par le canal de votre choix.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={emailShare}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0A2540] px-5 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#FFB800] transition-colors"
              >
                <Mail size={18} /> Recevoir par email
              </button>
              <button
                onClick={whatsappShare}
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#1da851] transition-colors"
              >
                <MessageCircle size={18} fill="white" /> Envoyer via WhatsApp
              </button>
              <button
                onClick={downloadPdf}
                className="inline-flex items-center justify-center gap-2 bg-[#FFB800] text-[#0A2540] px-5 py-4 font-semibold uppercase tracking-wider text-sm hover:bg-[#E5A500] transition-colors"
              >
                <Download size={18} /> Télécharger en PDF
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 text-[#0A2540] font-semibold uppercase tracking-wider text-sm border-b-2 border-[#0A2540] hover:border-[#FFB800] hover:text-[#FFB800] pb-1 transition-colors"
            >
              <RotateCcw size={16} /> Refaire une simulation
            </button>
            <Link to="/contact" className="btn-primary">
              <ArrowUpRight size={16} /> Contacter un expert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-gray-100">
      <span className="text-sm text-gray-500 font-semibold">{label}</span>
      <span className="text-sm text-[#0A2540] font-bold text-right">{value}</span>
    </div>
  );
}
