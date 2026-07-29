import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Users, Lightbulb, Clock, ShieldCheck, Award, Building2 } from 'lucide-react';
import { useContent } from '../hooks/useContent';

export default function FeaturesSection() {
  const { t } = useContent();

  const features = [1, 2, 3, 4].map((i) => ({
    title: t(`home.features.item${i}_title`, ['Une équipe qualifiée', 'Solutions innovantes', 'Respect des délais', 'Qualité garantie'][i - 1]),
    description: t(`home.features.item${i}_desc`, ['Des professionnels expérimentés à votre service.', 'Chaque projet est unique et mérite une attention particulière.', 'Nous nous engageons à livrer nos prestations dans les délais convenus.', 'Nous appliquons les meilleures pratiques du secteur.'][i - 1]),
    iconName: t(`home.features.item${i}_icon`, ['Users', 'Lightbulb', 'Clock', 'ShieldCheck'][i - 1]),
  }));

  const stats = [
    { value: t('home.stats.experience_number', '30+'), label: t('home.stats.experience_label', "Ans d'expérience"), icon: Award },
    { value: t('home.stats.projects_number', '250+'), label: t('home.stats.projects_label', 'Projets réalisés'), icon: Building2 },
    { value: t('home.stats.clients_number', '180+'), label: t('home.stats.clients_label', 'Clients satisfaits'), icon: Users },
    { value: t('home.stats.team_number', '45+'), label: t('home.stats.team_label', 'Experts qualifiés'), icon: ShieldCheck },
  ];

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F7FA] to-white" />
      <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7">
            <div className="section-label mb-4">{t('home.features.badge', 'Pourquoi Nous Choisir')}</div>
            <h2 className="font-heading text-4xl lg:text-6xl text-[#0A2540] font-extrabold uppercase leading-[0.95] text-balance">
              {t('home.features.title', "L'expertise qui fait la différence")}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-gray-600 leading-relaxed text-lg">
              {t('home.features.description', "Notre expertise, notre rigueur et notre engagement nous permettent de transformer chaque projet en une réalisation durable, fiable et conforme à vos attentes.")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-200 bg-white">
          {features.map((f, i) => {
            const Icon = LucideIcons[f.iconName] || Users;
            return (
              <div key={i} className="group relative p-8 border-r last:border-r-0 border-gray-200 hover:bg-[#0A2540] transition-colors duration-500">
                <div className="w-14 h-14 bg-[#FFB800] flex items-center justify-center text-[#0A2540] mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#0A2540] uppercase group-hover:text-white transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-600 mt-3 group-hover:text-gray-300 transition-colors">{f.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-6 bg-white border-b-4 border-[#FFB800]">
              <s.icon size={32} className="text-[#FFB800] mx-auto mb-3" />
              <div className="font-heading text-4xl lg:text-5xl font-extrabold text-[#0A2540]">{s.value}</div>
              <div className="text-sm uppercase tracking-wider text-gray-600 mt-2 font-semibold">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
