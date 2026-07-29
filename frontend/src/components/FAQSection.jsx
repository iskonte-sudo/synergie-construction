import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { faqs as fallback, company } from '../data/mock';
import { useContent } from '../hooks/useContent';
import api from '../lib/api';

export default function FAQSection() {
  const [items, setItems] = useState(fallback);
  const [open, setOpen] = useState(0);
  const { t } = useContent();

  useEffect(() => {
    api.get('/public/faqs').then(({ data }) => {
      if (data && data.length) setItems(data);
    }).catch(() => {});
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-[#F5F7FA]">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="section-label mb-4">{t('home.faq.badge', 'Questions Fréquentes')}</div>
          <h2 className="font-heading text-4xl lg:text-5xl text-[#0A2540] font-extrabold uppercase leading-[0.95]">
            {t('home.faq.title', 'Vos questions, nos réponses')}
          </h2>
          <p className="mt-5 text-gray-600 leading-relaxed">
            {t('home.faq.description', "Tout ce que vous devez savoir avant de démarrer votre projet de construction. Notre équipe reste disponible pour toute autre question.")}
          </p>
          <div className="mt-8 p-6 bg-[#0A2540] text-white">
            <div className="text-sm uppercase tracking-wider text-[#FFB800] font-semibold mb-2">{t('home.faq.help_subtitle', "Besoin d'aide ?")}</div>
            <div className="font-heading text-2xl font-bold mb-3">{t('home.faq.help_title', 'Parlez à un expert')}</div>
            <a href={`tel:${company.phone}`} className="inline-block text-[#FFB800] font-bold text-xl hover:underline">{company.phoneDisplay}</a>
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="space-y-3">
            {items.map((f, i) => (
              <div key={i} className="bg-white border border-gray-200 hover:border-[#FFB800] transition-colors">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-heading text-lg font-bold text-[#0A2540]">{f.question}</span>
                  <span className={`w-9 h-9 shrink-0 flex items-center justify-center transition-colors ${open === i ? 'bg-[#FFB800] text-[#0A2540]' : 'bg-[#F5F7FA] text-[#0A2540]'}`}>
                    {open === i ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{f.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
