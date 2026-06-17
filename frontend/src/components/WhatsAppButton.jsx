import React from 'react';
import { MessageCircle } from 'lucide-react';
import { company } from '../data/mock';

export default function WhatsAppButton() {
  const message = encodeURIComponent('Bonjour, je souhaite obtenir un devis pour mon projet de construction.');
  return (
    <a
      href={`https://wa.me/${company.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40"
      aria-label="WhatsApp"
    >
      <div className="relative">
        <span className="pulse-ring absolute inset-0 rounded-full" />
        <div className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
          <MessageCircle size={26} fill="white" />
        </div>
      </div>
    </a>
  );
}
