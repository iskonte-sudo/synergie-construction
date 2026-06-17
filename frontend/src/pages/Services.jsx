import React from 'react';
import PageBanner from '../components/PageBanner';
import ServicesGrid from '../components/ServicesGrid';
import FAQSection from '../components/FAQSection';

export default function Services() {
  return (
    <>
      <PageBanner
        title="Nos Services"
        subtitle="Ce Que Nous Faisons"
        breadcrumbs={[{ label: 'Services' }]}
        image="https://images.unsplash.com/photo-1536895058696-a69b1c7ba34f?auto=format&fit=crop&w=1920&q=80"
      />
      <ServicesGrid />
      <FAQSection />
    </>
  );
}
