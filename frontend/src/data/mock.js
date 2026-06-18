// Mock data for Synergie Construction Group

export const company = {
  name: 'Synergie Construction Group',
  shortName: 'SCG',
  tagline: 'Construire l\'avenir avec précision',
  phone: '+221771658042',
  phoneDisplay: '+221 77 165 80 42',
  whatsapp: '221771658042',
  email: 'contact@synergieconstruction.com',
  address: 'Parcelles Assainies, Dakar, Sénégal',
  experience: 30,
  projects: 250,
  clients: 180,
  teamMembers: 45,
};

export const socials = [
  { name: 'Facebook', icon: 'Facebook', url: 'https://www.facebook.com/synergieconstruction' },
  { name: 'Instagram', icon: 'Instagram', url: 'https://www.instagram.com/synergieconstruction' },
  { name: 'LinkedIn', icon: 'Linkedin', url: 'https://www.linkedin.com/company/synergieconstruction' },
  { name: 'WhatsApp', icon: 'MessageCircle', url: 'https://wa.me/221771658042' },
  { name: 'YouTube', icon: 'Youtube', url: 'https://www.youtube.com/@synergieconstruction' },
  { name: 'TikTok', icon: 'Music2', url: 'https://www.tiktok.com/@synergieconstruction' },
];

export const navigation = [
  { label: 'Accueil', path: '/' },
  { label: 'À propos', path: '/a-propos' },
  {
    label: 'Services',
    path: '/services',
    submenu: [
      { label: 'Études et Plans de Fondations', path: '/services/etudes-fondations' },
      { label: 'Suivi et Contrôle des Travaux', path: '/services/suivi-controle' },
      { label: 'Rénovation et Réhabilitation', path: '/services/renovation' },
      { label: 'VRD & Travaux Publics', path: '/services/vrd-travaux-publics' },
      { label: 'Plans Architecturaux 2D & 3D', path: '/services/plans-2d-3d' },
      { label: 'Conseil et Assistance Technique', path: '/services/conseil-technique' },
    ],
  },
  { label: 'Nos Réalisations', path: '/realisations' },
  { label: 'Contact', path: '/contact' },
];

export const heroSlides = [
  {
    id: 1,
    title: 'Transformer vos projets en réalité',
    subtitle: 'Excellence et innovation dans chaque construction',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 2,
    title: 'Construire l\'avenir avec précision',
    subtitle: 'Des fondations solides pour des projets durables',
    image: 'https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?auto=format&fit=crop&w=1920&q=80',
  },
  {
    id: 3,
    title: 'L\'expertise au service de vos projets',
    subtitle: '30 ans d\'expérience dans la construction',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1920&q=80',
  },
];

export const services = [
  {
    id: 'etudes-fondations',
    title: 'Études et Plans de Fondations',
    short: 'Études techniques pour garantir solidité et durabilité.',
    description: 'Nos experts réalisent les études techniques nécessaires pour garantir la solidité et la durabilité de vos ouvrages.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    icon: 'Hammer',
    features: ['Études Géotechniques', 'Dimensionnement des Fondations', 'Calculs Structuraux', 'Études de Stabilité'],
    longDescription: 'Nous réalisons des études techniques approfondies pour déterminer les solutions de fondation les mieux adaptées à la nature du sol et aux exigences de votre projet. Notre approche combine expertise géotechnique, précision des calculs et conformité aux normes en vigueur.',
  },
  {
    id: 'suivi-controle',
    title: 'Suivi et Contrôle des Travaux',
    short: 'Accompagnement et supervision rigoureuse des chantiers.',
    description: 'Nos spécialistes vous accompagnent dans toutes vos prises de décision liées à la construction.',
    image: 'https://images.unsplash.com/photo-1587582423116-ec07293f0395?auto=format&fit=crop&w=1200&q=80',
    icon: 'HardHat',
    features: ['Coordination des Travaux', 'Contrôle Qualité', 'Suivi Budgétaire', 'Respect des Délais'],
    longDescription: 'Nous assurons une supervision rigoureuse de chaque étape de votre chantier afin de garantir le respect des normes, des budgets et des délais convenus.',
  },
  {
    id: 'renovation',
    title: 'Rénovation et Réhabilitation',
    short: 'Modernisation et réhabilitation de bâtiments existants.',
    description: 'Nous redonnons vie à vos bâtiments grâce à des solutions modernes et adaptées.',
    image: 'https://images.unsplash.com/photo-1621511075938-f03482369feb?auto=format&fit=crop&w=1200&q=80',
    icon: 'Wrench',
    features: ['Diagnostic Complet', 'Rénovation Intérieure', 'Réhabilitation Structurelle', 'Mise aux Normes'],
    longDescription: 'Nous redonnons vie à vos bâtiments grâce à des solutions modernes et adaptées. De la rénovation légère à la réhabilitation complète, nous transformons vos espaces.',
  },
  {
    id: 'vrd-travaux-publics',
    title: 'VRD & Travaux Publics',
    short: 'Voirie et réseaux divers pour tous types de projets.',
    description: 'Nous intervenons dans les travaux de Voirie et Réseaux Divers pour les projets résidentiels, industriels et institutionnels.',
    image: 'https://images.unsplash.com/photo-1536895058696-a69b1c7ba34f?auto=format&fit=crop&w=1200&q=80',
    icon: 'Truck',
    features: ['Voirie & Chaussées', 'Réseaux d\'Eau', 'Réseaux Électriques', 'Assainissement'],
    longDescription: 'Nous intervenons dans les travaux de Voirie et Réseaux Divers (VRD) pour les projets résidentiels, industriels et institutionnels, garantissant des infrastructures fiables.',
  },
  {
    id: 'plans-2d-3d',
    title: 'Plans Architecturaux 2D & 3D',
    short: 'Visualisez votre projet avant sa réalisation.',
    description: 'Nous réalisons des plans détaillés et des modélisations 3D permettant de visualiser votre projet avant sa construction.',
    image: 'https://images.unsplash.com/photo-1608303588026-884930af2559?auto=format&fit=crop&w=1200&q=80',
    icon: 'PenTool',
    features: ['Plans 2D Détaillés', 'Modélisation 3D', 'Rendus Photoréalistes', 'Visites Virtuelles'],
    longDescription: 'Nous réalisons des plans détaillés et des modélisations 3D permettant de visualiser votre projet avant sa construction, facilitant la prise de décision.',
  },
  {
    id: 'conseil-technique',
    title: 'Conseil et Assistance Technique',
    short: 'Expertise technique pour réussir vos projets.',
    description: 'Nous assurons un suivi rigoureux de vos chantiers afin de garantir le respect des normes, des budgets et des délais.',
    image: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&w=1200&q=80',
    icon: 'ClipboardCheck',
    features: ['Audit Technique', 'Conseil Stratégique', 'Optimisation des Coûts', 'Assistance Réglementaire'],
    longDescription: 'Notre équipe d\'experts vous offre un conseil personnalisé et une assistance technique complète pour optimiser la réussite de vos projets de construction.',
  },
];

export const features = [
  { title: 'Une équipe qualifiée', description: 'Des professionnels expérimentés à votre service.', icon: 'Users' },
  { title: 'Solutions innovantes', description: 'Chaque projet est unique et mérite une attention particulière.', icon: 'Lightbulb' },
  { title: 'Respect des délais', description: 'Nous nous engageons à livrer nos prestations dans les délais convenus.', icon: 'Clock' },
  { title: 'Qualité garantie', description: 'Nous appliquons les meilleures pratiques du secteur.', icon: 'ShieldCheck' },
];

export const projects = [
  {
    id: 1,
    title: 'Villa Moderne Almadies',
    category: 'Résidentiel',
    location: 'Almadies, Dakar',
    year: 2025,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'Construction d\'une villa moderne de 4 chambres avec piscine.',
  },
  {
    id: 2,
    title: 'Immeuble Commercial Plateau',
    category: 'Commercial',
    location: 'Plateau, Dakar',
    year: 2024,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    description: 'Immeuble de bureaux R+5 avec parking sous-sol.',
  },
  {
    id: 3,
    title: 'Résidence Premium Mermoz',
    category: 'Résidentiel',
    location: 'Mermoz, Dakar',
    year: 2025,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    description: 'Résidence haut standing de 12 logements.',
  },
  {
    id: 4,
    title: 'Centre Médical Parcelles',
    category: 'Institutionnel',
    location: 'Parcelles Assainies, Dakar',
    year: 2024,
    image: 'https://images.unsplash.com/photo-1587582423116-ec07293f0395?auto=format&fit=crop&w=1200&q=80',
    description: 'Centre médical moderne avec équipements de pointe.',
  },
  {
    id: 5,
    title: 'Complexe Industriel Thiès',
    category: 'Industriel',
    location: 'Thiès, Sénégal',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1536895058696-a69b1c7ba34f?auto=format&fit=crop&w=1200&q=80',
    description: 'Usine de transformation avec entrepôts.',
  },
  {
    id: 6,
    title: 'Rénovation Villa Yoff',
    category: 'Rénovation',
    location: 'Yoff, Dakar',
    year: 2025,
    image: 'https://images.unsplash.com/photo-1621511075938-f03482369feb?auto=format&fit=crop&w=1200&q=80',
    description: 'Réhabilitation complète d\'une villa des années 90.',
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Mamadou Diop',
    role: 'Propriétaire',
    content: 'Synergie Construction a transformé notre projet en réalité. Leur professionnalisme et leur rigueur sont remarquables. Je recommande vivement.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 2,
    name: 'Aïssatou Ndiaye',
    role: 'Directrice, Ndiaye & Co',
    content: 'Notre nouvel immeuble de bureaux est exactement ce que nous voulions. Travail livré dans les délais et budget respecté.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=44',
  },
  {
    id: 3,
    name: 'Cheikh Fall',
    role: 'Promoteur Immobilier',
    content: 'Une équipe d\'experts, à l\'écoute et toujours disponibles. Plusieurs projets réalisés ensemble, toujours avec excellence.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: 4,
    name: 'Fatou Sarr',
    role: 'Architecte',
    content: 'Collaboration exceptionnelle. Les plans 3D ont permis à mes clients de visualiser parfaitement leur projet. Merci SCG !',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=47',
  },
];

export const faqs = [
  {
    question: 'Quels types de projets prenez-vous en charge ?',
    answer: 'Nous prenons en charge tous types de projets : résidentiels (villas, immeubles), commerciaux, industriels et institutionnels. De la conception à la livraison clé en main.',
  },
  {
    question: 'Comment se déroule la demande de devis ?',
    answer: 'Remplissez notre formulaire en ligne ou contactez-nous par WhatsApp. Un expert vous rappelle sous 24h pour étudier votre projet et établir un devis détaillé gratuit.',
  },
  {
    question: 'Quels sont vos délais d\'intervention ?',
    answer: 'Les délais varient selon la nature et l\'ampleur du projet. Une étude préliminaire est réalisée sous 48h, puis un planning détaillé est établi avec le client.',
  },
  {
    question: 'Proposez-vous des financements ?',
    answer: 'Oui, nous travaillons avec des partenaires financiers pour faciliter le financement de vos projets. Échelonnement possible selon les étapes du chantier.',
  },
  {
    question: 'Quelles garanties offrez-vous ?',
    answer: 'Tous nos travaux sont couverts par une garantie décennale. Nous garantissons également la qualité des matériaux et la conformité aux normes en vigueur.',
  },
  {
    question: 'Intervenez-vous en dehors de Dakar ?',
    answer: 'Oui, nous intervenons dans tout le Sénégal (Thiès, Saint-Louis, Saly, Mbour, Touba, Ziguinchor...) et dans la sous-région ouest-africaine selon les projets.',
  },
];

export const process = [
  { step: '01', title: 'Analyse des besoins', description: 'Étude approfondie de votre projet et de vos attentes.' },
  { step: '02', title: 'Conception des plans', description: 'Élaboration des plans techniques et architecturaux.' },
  { step: '03', title: 'Modélisation 3D', description: 'Visualisation réaliste de votre projet avant construction.' },
  { step: '04', title: 'Ajustements et validation', description: 'Affinement du projet selon vos retours.' },
  { step: '05', title: 'Livraison finale', description: 'Remise des clés et accompagnement post-livraison.' },
];

// ---- Project Simulator data ----

export const projectTypes = [
  { id: 'villa', label: 'Villa', icon: 'Home', baseCostPerSqm: 280000, monthsPerSqm: 0.012 },
  { id: 'immeuble', label: 'Immeuble', icon: 'Building2', baseCostPerSqm: 350000, monthsPerSqm: 0.015 },
  { id: 'bureau', label: 'Bureau', icon: 'Briefcase', baseCostPerSqm: 320000, monthsPerSqm: 0.013 },
  { id: 'commerce', label: 'Commerce', icon: 'Store', baseCostPerSqm: 300000, monthsPerSqm: 0.011 },
  { id: 'hotel', label: 'Hôtel', icon: 'Hotel', baseCostPerSqm: 420000, monthsPerSqm: 0.018 },
  { id: 'entrepot', label: 'Entrepôt', icon: 'Warehouse', baseCostPerSqm: 180000, monthsPerSqm: 0.008 },
  { id: 'renovation', label: 'Rénovation', icon: 'Wrench', baseCostPerSqm: 150000, monthsPerSqm: 0.009 },
];

export const surfaceOptions = [
  { id: 's1', label: 'Moins de 100 m²', value: 80 },
  { id: 's2', label: '100 à 250 m²', value: 175 },
  { id: 's3', label: '250 à 500 m²', value: 375 },
  { id: 's4', label: '500 à 1000 m²', value: 750 },
  { id: 's5', label: 'Plus de 1000 m²', value: 1500 },
];

export const prestationOptions = [
  { id: 'faisabilite', label: 'Étude de faisabilité', icon: 'Search', recommends: 'conseil-technique' },
  { id: 'plans-archi', label: 'Plans architecturaux', icon: 'PenTool', recommends: 'plans-2d-3d' },
  { id: 'modelisation-3d', label: 'Modélisation 3D', icon: 'Box', recommends: 'plans-2d-3d' },
  { id: 'rendus', label: 'Rendus photoréalistes', icon: 'Image', recommends: 'plans-2d-3d' },
  { id: 'controle-qualite', label: 'Contrôle qualité', icon: 'ShieldCheck', recommends: 'suivi-controle' },
  { id: 'suivi-chantier', label: 'Suivi de chantier', icon: 'HardHat', recommends: 'suivi-controle' },
  { id: 'coordination', label: 'Coordination des intervenants', icon: 'Users', recommends: 'suivi-controle' },
  { id: 'amoa', label: 'Assistance maîtrise d\'ouvrage', icon: 'ClipboardCheck', recommends: 'conseil-technique' },
];

export const budgetOptions = [
  { id: 'b1', label: 'Moins de 25 millions FCFA', min: 0, max: 25 },
  { id: 'b2', label: '25 à 50 millions FCFA', min: 25, max: 50 },
  { id: 'b3', label: '50 à 100 millions FCFA', min: 50, max: 100 },
  { id: 'b4', label: 'Plus de 100 millions FCFA', min: 100, max: 999 },
];

export const delaiOptions = [
  { id: 'd1', label: 'Urgent (moins de 3 mois)', months: 2 },
  { id: 'd2', label: '3 à 6 mois', months: 5 },
  { id: 'd3', label: '6 à 12 mois', months: 9 },
  { id: 'd4', label: '12 à 24 mois', months: 18 },
  { id: 'd5', label: 'Plus de 24 mois', months: 28 },
  { id: 'd6', label: 'Flexible', months: 12 },
];

// ---- Service-specific form configurations ----
// Each service has a custom set of fields appended to the common ones (name, phone, email, notes).

const COMMON_FIELDS = [
  { name: 'name', label: 'Nom complet', type: 'text', required: true, placeholder: 'Votre nom complet', col: 1 },
  { name: 'phone', label: 'Téléphone', type: 'tel', required: true, placeholder: '+221 ...', col: 1 },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'vous@email.com', col: 2 },
];

export const serviceForms = {
  // Generic devis form (no specific service)
  default: {
    title: 'Demandez votre devis gratuit',
    subtitle: 'Parlez-nous de votre projet',
    icon: 'FileText',
    fields: [
      ...COMMON_FIELDS,
      { name: 'projectType', label: 'Type de projet', type: 'select', options: ['Maison', 'Villa', 'Immeuble', 'Bâtiment commercial', 'Bureau', 'Rénovation', 'VRD', 'Autre'], col: 1 },
      { name: 'address', label: 'Adresse / Localisation', type: 'text', placeholder: 'Ville, quartier', col: 1 },
      { name: 'budget', label: 'Budget estimatif', type: 'text', placeholder: 'Ex: 25 000 000 FCFA', col: 2 },
      { name: 'notes', label: 'Description du projet', type: 'textarea', placeholder: 'Décrivez brièvement votre projet...', full: true },
    ],
  },

  'etudes-fondations': {
    title: 'Étude de fondations',
    subtitle: 'Devis pour étude et plans de fondations',
    icon: 'Hammer',
    fields: [
      ...COMMON_FIELDS,
      { name: 'typeEtude', label: 'Type d\'étude souhaitée', type: 'select', required: true, options: ['Étude géotechnique', 'Dimensionnement des fondations', 'Calculs structuraux', 'Étude de stabilité', 'Étude complète'], col: 1 },
      { name: 'typeBatiment', label: 'Type de bâtiment', type: 'select', options: ['Maison individuelle', 'Villa', 'Immeuble R+1', 'Immeuble R+2 et plus', 'Bâtiment commercial', 'Ouvrage industriel', 'Autre'], col: 1 },
      { name: 'localisation', label: 'Localisation du terrain', type: 'text', placeholder: 'Ville, quartier', col: 2 },
      { name: 'superficie', label: 'Superficie du terrain (m²)', type: 'text', placeholder: 'Ex: 500', col: 1 },
      { name: 'niveaux', label: 'Nombre de niveaux prévus', type: 'select', options: ['RDC', 'R+1', 'R+2', 'R+3', 'R+4 et plus'], col: 1 },
      { name: 'etudeSol', label: 'Étude de sol déjà réalisée ?', type: 'radio', options: ['Oui', 'Non', 'Je ne sais pas'], col: 2 },
      { name: 'dateDemarrage', label: 'Date souhaitée de démarrage', type: 'date', col: 1 },
      { name: 'documents', label: 'Documents disponibles', type: 'select', options: ['Plan architectural', 'Plan architectural + étude de sol', 'Croquis uniquement', 'Aucun document'], col: 1 },
      { name: 'budget', label: 'Budget estimatif', type: 'text', placeholder: 'Ex: 5 000 000 FCFA', col: 2 },
      { name: 'notes', label: 'Description du projet', type: 'textarea', placeholder: 'Précisions, contraintes particulières...', full: true },
    ],
  },

  'suivi-controle': {
    title: 'Suivi et contrôle des travaux',
    subtitle: 'Devis pour supervision de chantier',
    icon: 'HardHat',
    fields: [
      ...COMMON_FIELDS,
      { name: 'phaseChantier', label: 'Phase actuelle du chantier', type: 'select', required: true, options: ['À démarrer', 'Fondations en cours', 'Gros œuvre', 'Second œuvre', 'Finitions', 'Réception'], col: 1 },
      { name: 'typeOuvrage', label: 'Type d\'ouvrage', type: 'select', options: ['Villa', 'Immeuble', 'Bâtiment commercial', 'Ouvrage industriel', 'Lotissement', 'Autre'], col: 1 },
      { name: 'surface', label: 'Surface du chantier (m²)', type: 'text', placeholder: 'Ex: 250', col: 2 },
      { name: 'duree', label: 'Durée prévue du chantier', type: 'select', options: ['Moins de 3 mois', '3 à 6 mois', '6 à 12 mois', '12 à 24 mois', 'Plus de 24 mois'], col: 1 },
      { name: 'niveauSupervision', label: 'Niveau de supervision', type: 'select', options: ['Visite hebdomadaire', 'Visite bi-hebdomadaire', 'Présence quotidienne', 'À la demande'], col: 1 },
      { name: 'localisation', label: 'Localisation du chantier', type: 'text', placeholder: 'Ville, quartier', col: 2 },
      { name: 'budget', label: 'Budget mensuel envisagé', type: 'text', placeholder: 'FCFA / mois', col: 1 },
      { name: 'notes', label: 'Précisions sur la mission', type: 'textarea', placeholder: 'Contraintes, intervenants déjà mobilisés...', full: true },
    ],
  },

  'renovation': {
    title: 'Rénovation et Réhabilitation',
    subtitle: 'Devis pour vos travaux de rénovation',
    icon: 'Wrench',
    fields: [
      ...COMMON_FIELDS,
      { name: 'typeBien', label: 'Type de bien', type: 'select', required: true, options: ['Maison', 'Villa', 'Appartement', 'Immeuble entier', 'Local commercial', 'Bureau', 'Autre'], col: 1 },
      { name: 'typeTravaux', label: 'Type de travaux', type: 'select', required: true, options: ['Rénovation légère (peinture, sols)', 'Rénovation lourde (cloisons, plomberie, électricité)', 'Réhabilitation structurelle', 'Mise aux normes', 'Tous corps d\'état'], col: 1 },
      { name: 'surface', label: 'Surface à rénover (m²)', type: 'text', placeholder: 'Ex: 120', col: 2 },
      { name: 'anneeConstruction', label: 'Année de construction du bien', type: 'text', placeholder: 'Ex: 1995', col: 1 },
      { name: 'bienOccupe', label: 'Bien occupé pendant les travaux ?', type: 'radio', options: ['Oui', 'Non', 'Partiellement'], col: 1 },
      { name: 'localisation', label: 'Adresse du bien', type: 'text', placeholder: 'Ville, quartier', col: 2 },
      { name: 'dateDemarrage', label: 'Date souhaitée de démarrage', type: 'date', col: 1 },
      { name: 'budget', label: 'Budget envisagé', type: 'text', placeholder: 'Ex: 10 000 000 FCFA', col: 1 },
      { name: 'notes', label: 'Description des travaux', type: 'textarea', placeholder: 'Pièces concernées, matériaux souhaités...', full: true },
    ],
  },

  'vrd-travaux-publics': {
    title: 'VRD & Travaux Publics',
    subtitle: 'Devis pour voirie et réseaux divers',
    icon: 'Truck',
    fields: [
      ...COMMON_FIELDS,
      { name: 'typeProjet', label: 'Type de projet', type: 'select', required: true, options: ['Lotissement résidentiel', 'Zone industrielle', 'Projet institutionnel', 'Résidence privée', 'Voirie urbaine', 'Autre'], col: 1 },
      { name: 'surfaceTerrain', label: 'Surface du terrain (m²)', type: 'text', placeholder: 'Ex: 10 000', col: 1 },
      { name: 'typeTravaux', label: 'Travaux nécessaires', type: 'select', required: true, options: ['Voirie & chaussées', 'Réseaux d\'eau potable', 'Réseaux électriques', 'Assainissement', 'Tout VRD intégré'], col: 2 },
      { name: 'nombreLots', label: 'Nombre de lots / parcelles', type: 'text', placeholder: 'Ex: 25', col: 1 },
      { name: 'localisation', label: 'Localisation du projet', type: 'text', placeholder: 'Ville, commune', col: 1 },
      { name: 'delai', label: 'Délai souhaité', type: 'select', options: ['Urgent (< 3 mois)', '3 à 6 mois', '6 à 12 mois', 'Plus de 12 mois', 'Flexible'], col: 2 },
      { name: 'budget', label: 'Budget envisagé', type: 'text', placeholder: 'FCFA', col: 1 },
      { name: 'notes', label: 'Description du projet', type: 'textarea', placeholder: 'Topographie, raccordements existants...', full: true },
    ],
  },

  'plans-2d-3d': {
    title: 'Plans Architecturaux 2D & 3D',
    subtitle: 'Devis pour vos plans et modélisations',
    icon: 'PenTool',
    fields: [
      ...COMMON_FIELDS,
      { name: 'typePlan', label: 'Type de prestation', type: 'select', required: true, options: ['Plans 2D uniquement', 'Modélisation 3D uniquement', 'Plans 2D + 3D', 'Rendus photoréalistes', 'Visite virtuelle', 'Pack complet (2D + 3D + rendus)'], col: 1 },
      { name: 'typeBatiment', label: 'Type de bâtiment', type: 'select', options: ['Villa', 'Maison individuelle', 'Immeuble', 'Bâtiment commercial', 'Bureau', 'Hôtel', 'Autre'], col: 1 },
      { name: 'surface', label: 'Surface du bâtiment (m²)', type: 'text', placeholder: 'Ex: 200', col: 2 },
      { name: 'niveaux', label: 'Nombre de niveaux', type: 'select', options: ['RDC', 'R+1', 'R+2', 'R+3', 'R+4 et plus'], col: 1 },
      { name: 'style', label: 'Style architectural', type: 'select', options: ['Moderne', 'Contemporain', 'Classique', 'Traditionnel', 'Tropical', 'Mixte', 'À définir'], col: 1 },
      { name: 'documentsExistants', label: 'Documents existants', type: 'select', options: ['Aucun', 'Croquis', 'Plans 2D existants', 'Photos du terrain', 'Plans + photos'], col: 2 },
      { name: 'delai', label: 'Délai souhaité', type: 'select', options: ['Urgent (< 2 semaines)', '2 à 4 semaines', '1 à 2 mois', 'Flexible'], col: 1 },
      { name: 'budget', label: 'Budget envisagé', type: 'text', placeholder: 'FCFA', col: 1 },
      { name: 'notes', label: 'Précisions sur votre projet', type: 'textarea', placeholder: 'Style souhaité, références, contraintes...', full: true },
    ],
  },

  'conseil-technique': {
    title: 'Conseil et Assistance Technique',
    subtitle: 'Devis pour expertise et conseil',
    icon: 'ClipboardCheck',
    fields: [
      ...COMMON_FIELDS,
      { name: 'typeMission', label: 'Type de mission', type: 'select', required: true, options: ['Audit technique', 'Conseil stratégique', 'Assistance maîtrise d\'ouvrage (AMOA)', 'Optimisation des coûts', 'Assistance réglementaire', 'Mission complète'], col: 1 },
      { name: 'stadeProjet', label: 'Stade du projet', type: 'select', options: ['Idée / Réflexion', 'Conception', 'Pré-chantier', 'En cours d\'exécution', 'Réception / Litige'], col: 1 },
      { name: 'typeBatiment', label: 'Type de bâtiment concerné', type: 'select', options: ['Villa', 'Immeuble', 'Bâtiment commercial', 'Ouvrage industriel', 'Bureau', 'Autre'], col: 2 },
      { name: 'surface', label: 'Surface du projet (m²)', type: 'text', placeholder: 'Ex: 500', col: 1 },
      { name: 'dureeMission', label: 'Durée envisagée de la mission', type: 'select', options: ['Ponctuelle (1 visite)', 'Quelques jours', '1 à 3 mois', '3 à 6 mois', '6 mois et +'], col: 1 },
      { name: 'localisation', label: 'Localisation', type: 'text', placeholder: 'Ville, quartier', col: 2 },
      { name: 'budget', label: 'Budget envisagé', type: 'text', placeholder: 'FCFA', col: 1 },
      { name: 'notes', label: 'Problématique principale', type: 'textarea', required: true, placeholder: 'Décrivez la situation, les enjeux et vos attentes...', full: true },
    ],
  },
};
