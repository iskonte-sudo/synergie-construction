import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Target, Eye, Heart, ArrowUpRight } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import { useContent } from '../hooks/useContent';
import { mediaUrl } from '../lib/api';

export default function About() {
  const { t } = useContent();

  const bannerImage = mediaUrl(
    t(
      'about.banner.image',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80'
    )
  );

  const introImage = mediaUrl(
    t(
      'about.intro.image',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    )
  );

  const features = [
    t('about.intro.feature1', 'Entreprise certifiée et référencée'),
    t('about.intro.feature2', 'Plus de 250 projets livrés'),
    t('about.intro.feature3', 'Équipe de 45 experts qualifiés'),
    t('about.intro.feature4', 'Garantie décennale sur tous nos ouvrages'),
  ];

  return (
    <>
      <PageBanner
        title={t('about.banner.title', 'À propos de Synergies')}
        subtitle={t('about.banner.subtitle', 'Notre Histoire')}
        breadcrumbs={[{ label: 'À propos' }]}
        image={bannerImage}
      />

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={introImage}
              alt=""
              loading="lazy"
              className="w-full h-[520px] object-cover shadow-xl"
            />
          </div>

          <div>
            <div className="section-label mb-4">
              {t('about.intro.badge', 'Qui Sommes-Nous')}
            </div>

            <h2 className="font-heading text-4xl lg:text-5xl text-[#0A2540] font-extrabold uppercase leading-[0.95] text-balance">
              {t(
                'about.intro.title',
                "30 ans d'excellence au service du bâtiment"
              )}
            </h2>

            <p className="text-gray-600 mt-5 leading-relaxed">
              {t(
                'about.intro.paragraph1',
                "Synergies Construction Group accompagne particuliers et professionnels dans la réalisation de projets innovants, fiables et pérennes. Notre équipe pluridisciplinaire d'ingénieurs, architectes et techniciens met son expertise au service de votre vision."
              )}
            </p>

            <p className="text-gray-600 mt-4 leading-relaxed">
              {t(
                'about.intro.paragraph2',
                "De l'étude préliminaire jusqu'à la remise des clés, nous garantissons un suivi rigoureux, le respect des délais et la qualité des prestations."
              )}
            </p>

            <ul className="mt-6 space-y-3">
              {features.map((text, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <CheckCircle2
                    size={20}
                    className="text-[#FFB800] shrink-0 mt-0.5"
                  />
                  {text}
                </li>
              ))}
            </ul>

            <Link
              to="/contact"
              className="btn-primary mt-8"
            >
              <ArrowUpRight size={18} />
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#F5F7FA]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="section-label justify-center mb-3">
              {t('about.values.badge', 'Nos Valeurs')}
            </div>

            <h2 className="font-heading text-4xl lg:text-5xl text-[#0A2540] font-extrabold uppercase">
              {t('about.values.title', 'Ce qui nous guide')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: t('about.mission.title', 'Notre Mission'),
                text: t(
                  'about.mission.text',
                  'Concevoir et réaliser des ouvrages durables qui répondent aux besoins de nos clients tout en respectant les normes les plus exigeantes.'
                ),
              },
              {
                icon: Eye,
                title: t('about.vision.title', 'Notre Vision'),
                text: t(
                  'about.vision.text',
                  "Être l'entreprise de construction de référence en Afrique de l'Ouest grâce à notre engagement qualité et notre innovation."
                ),
              },
              {
                icon: Heart,
                title: t('about.valeurs.title', 'Nos Valeurs'),
                text: t(
                  'about.valeurs.text',
                  'Intégrité, excellence, innovation et engagement environnemental guident chacune de nos actions au quotidien.'
                ),
              },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-white p-8 group hover:bg-[#0A2540] transition-colors duration-500 border-b-4 border-[#FFB800]"
              >
                <div className="w-14 h-14 bg-[#FFB800] flex items-center justify-center text-[#0A2540] mb-5">
                  <v.icon size={26} />
                </div>

                <h3 className="font-heading text-2xl font-bold text-[#0A2540] uppercase group-hover:text-white">
                  {v.title}
                </h3>

                <p className="text-gray-600 mt-3 leading-relaxed group-hover:text-gray-300">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection />
      <TestimonialsSection />
    </>
  );
}