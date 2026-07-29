import React from 'react';
import { mediaUrl } from '../../lib/api';
import GenericCrudPage from './GenericCrud';

export function AdminSlides() {
  return (
    <GenericCrudPage
      endpoint="/admin/slides"
      title="Slider de la page d'accueil"
      subtitle="Ajouter, modifier et réorganiser les slides"
      uploadFolder="slides"
      imageField="image"
      defaults={{ title: '', subtitle: '', text: '', image: '', button_label: '', button_link: '', order: 0, active: true }}
      columns={[
        { key: 'image', label: 'Image', render: (i) => i.image ? <img src={mediaUrl(i.image)} alt="" className="h-14 w-24 object-cover" /> : <span className="text-slate-400 text-xs">-</span> },
        { key: 'title', label: 'Titre', render: (i) => <div><div className="font-semibold text-[#0A2540] dark:text-white">{i.title}</div><div className="text-xs text-slate-500">{i.subtitle}</div></div> },
        { key: 'button_label', label: 'Bouton', render: (i) => i.button_label ? <span className="text-xs">{i.button_label} → {i.button_link}</span> : <span className="text-slate-400 text-xs">-</span> },
        { key: 'order', label: 'Ordre' },
      ]}
      fields={[
        { name: 'title', label: 'Titre', required: true, placeholder: 'Transformer vos projets en réalité' },
        { name: 'subtitle', label: 'Sous-titre', placeholder: 'Excellence dans chaque construction' },
        { name: 'text', label: 'Texte descriptif', type: 'textarea', full: true, rows: 2 },
        { name: 'image', label: 'Image de fond', type: 'image', full: true, help: 'Recommandé : 1920x1080 minimum' },
        { name: 'button_label', label: 'Texte du bouton', placeholder: 'Nos services' },
        { name: 'button_link', label: 'Lien du bouton', placeholder: '/services' },
        { name: 'order', label: 'Ordre d\'affichage', type: 'number' },
        { name: 'active', label: 'Actif', type: 'checkbox', checkLabel: 'Afficher ce slide sur le site' },
      ]}
    />
  );
}

export function AdminTestimonials() {
  return (
    <GenericCrudPage
      endpoint="/admin/testimonials"
      title="Témoignages clients"
      subtitle="Gérer les avis affichés sur le site"
      uploadFolder="testimonials"
      imageField="image"
      defaults={{ name: '', role: '', content: '', rating: 5, image: '', order: 0, active: true }}
      columns={[
        { key: 'image', label: '', render: (i) => i.image ? <img src={mediaUrl(i.image)} alt="" className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-slate-200" /> },
        { key: 'name', label: 'Client', render: (i) => <div><div className="font-semibold text-[#0A2540] dark:text-white">{i.name}</div><div className="text-xs text-slate-500">{i.role}</div></div> },
        { key: 'content', label: 'Témoignage', render: (i) => <div className="text-xs text-slate-600 dark:text-slate-400 max-w-md line-clamp-2">{i.content}</div> },
        { key: 'rating', label: 'Note', render: (i) => <span className="text-[#FFB800]">{'★'.repeat(i.rating || 0)}</span> },
      ]}
      fields={[
        { name: 'name', label: 'Nom', required: true },
        { name: 'role', label: 'Rôle / Fonction', placeholder: 'Propriétaire, Architecte, ...' },
        { name: 'content', label: 'Témoignage', type: 'textarea', required: true, full: true, rows: 4 },
        { name: 'rating', label: 'Note (1 à 5)', type: 'number', placeholder: '5' },
        { name: 'image', label: 'Photo', type: 'image', full: true },
        { name: 'order', label: 'Ordre d\'affichage', type: 'number' },
        { name: 'active', label: 'Actif', type: 'checkbox', checkLabel: 'Afficher ce témoignage' },
      ]}
    />
  );
}

export function AdminFAQs() {
  return (
    <GenericCrudPage
      endpoint="/admin/faqs"
      title="Foire aux questions"
      subtitle="Gérer les questions et réponses"
      defaults={{ question: '', answer: '', category: 'general', order: 0, active: true }}
      columns={[
        { key: 'question', label: 'Question', render: (i) => <div className="font-semibold text-[#0A2540] dark:text-white">{i.question}</div> },
        { key: 'answer', label: 'Réponse', render: (i) => <div className="text-xs text-slate-600 dark:text-slate-400 max-w-md line-clamp-2">{i.answer}</div> },
        { key: 'category', label: 'Catégorie', render: (i) => <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 uppercase tracking-wider font-semibold">{i.category}</span> },
      ]}
      fields={[
        { name: 'question', label: 'Question', required: true, full: true },
        { name: 'answer', label: 'Réponse', type: 'textarea', required: true, full: true, rows: 5 },
        { name: 'category', label: 'Catégorie', placeholder: 'general, services, tarifs...' },
        { name: 'order', label: 'Ordre', type: 'number' },
        { name: 'active', label: 'Actif', type: 'checkbox', checkLabel: 'Afficher cette FAQ' },
      ]}
    />
  );
}

export function AdminTeam() {
  return (
    <GenericCrudPage
      endpoint="/admin/team"
      title="Équipe"
      subtitle="Membres de l'équipe présentés sur le site"
      uploadFolder="team"
      imageField="photo"
      defaults={{ name: '', role: '', photo: '', bio: '', email: '', phone: '', socials: [], order: 0, active: true }}
      columns={[
        { key: 'photo', label: '', render: (i) => i.photo ? <img src={mediaUrl(i.photo)} alt="" className="h-12 w-12 rounded-full object-cover" /> : <div className="h-12 w-12 rounded-full bg-slate-200" /> },
        { key: 'name', label: 'Nom', render: (i) => <div><div className="font-semibold text-[#0A2540] dark:text-white">{i.name}</div><div className="text-xs text-[#FFB800]">{i.role}</div></div> },
        { key: 'email', label: 'Contact', render: (i) => <div className="text-xs text-slate-500">{i.email}<br />{i.phone}</div> },
      ]}
      fields={[
        { name: 'name', label: 'Nom complet', required: true },
        { name: 'role', label: 'Fonction / Poste', required: true, placeholder: 'Directeur technique' },
        { name: 'photo', label: 'Photo', type: 'image', full: true },
        { name: 'bio', label: 'Biographie', type: 'textarea', full: true, rows: 3 },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Téléphone', type: 'tel' },
        { name: 'order', label: 'Ordre', type: 'number' },
        { name: 'active', label: 'Actif', type: 'checkbox', checkLabel: 'Afficher sur le site' },
      ]}
    />
  );
}

export function AdminPartners() {
  return (
    <GenericCrudPage
      endpoint="/admin/partners"
      title="Partenaires"
      subtitle="Logos des partenaires affichés sur le site"
      uploadFolder="partners"
      imageField="logo"
      defaults={{ name: '', logo: '', url: '', order: 0, active: true }}
      columns={[
        { key: 'logo', label: 'Logo', render: (i) => i.logo ? <img src={mediaUrl(i.logo)} alt="" className="h-12 w-24 object-contain" /> : <span className="text-slate-400 text-xs">-</span> },
        { key: 'name', label: 'Nom' },
        { key: 'url', label: 'URL', render: (i) => <span className="text-xs text-slate-500 truncate max-w-xs inline-block">{i.url}</span> },
      ]}
      fields={[
        { name: 'name', label: 'Nom du partenaire', required: true },
        { name: 'logo', label: 'Logo', type: 'image', full: true, help: 'Format PNG transparent recommandé' },
        { name: 'url', label: 'Site web', type: 'url', placeholder: 'https://...' },
        { name: 'order', label: 'Ordre', type: 'number' },
        { name: 'active', label: 'Actif', type: 'checkbox', checkLabel: 'Afficher le partenaire' },
      ]}
    />
  );
}

export function AdminMenuItems() {
  return (
    <GenericCrudPage
      endpoint="/admin/menu-items"
      title="Menus du site"
      subtitle="Gérer les entrées du menu principal, mobile et footer"
      defaults={{ label: '', path: '/', location: 'header', order: 0, active: true, external: false }}
      columns={[
        { key: 'label', label: 'Libellé', render: (i) => <div className="font-semibold text-[#0A2540] dark:text-white">{i.label}</div> },
        { key: 'path', label: 'Lien', render: (i) => <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5">{i.path}</code> },
        { key: 'location', label: 'Emplacement', render: (i) => <span className="adm-badge adm-badge-neutral">{i.location}</span> },
      ]}
      fields={[
        { name: 'label', label: 'Libellé', required: true },
        { name: 'path', label: 'Lien / URL', required: true, placeholder: '/services' },
        { name: 'location', label: 'Emplacement', type: 'select', options: [{ value: 'header', label: 'Menu principal (Header)' }, { value: 'footer', label: 'Footer' }, { value: 'mobile', label: 'Menu mobile' }] },
        { name: 'order', label: 'Ordre', type: 'number' },
        { name: 'external', label: 'Lien externe', type: 'checkbox', checkLabel: 'Ouvrir dans un nouvel onglet' },
        { name: 'active', label: 'Actif', type: 'checkbox', checkLabel: 'Afficher cet élément' },
      ]}
    />
  );
}
