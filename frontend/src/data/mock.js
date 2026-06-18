// Mock data for Synergie Construction Group

export const company = {
  name: 'Synergie Construction Group',
  shortName: 'SCG',
  tagline: 'Construire l\'avenir avec précision',
  phone: '+225 0701 234 567',
  phoneDisplay: '+225 07 01 23 45 67',
  whatsapp: '2250701234567',
  email: 'contact@synergieconstruction.com',
  address: 'Cocody Riviera, Abidjan, Côte d\'Ivoire',
  experience: 30,
  projects: 250,
  clients: 180,
  teamMembers: 45,
};

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
    title: 'Villa Moderne Cocody',
    category: 'Résidentiel',
    location: 'Cocody, Abidjan',
    year: 2025,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'Construction d\'une villa moderne de 4 chambres avec piscine.',
  },
  {
    id: 2,
    title: 'Immeuble Commercial Plateau',
    category: 'Commercial',
    location: 'Plateau, Abidjan',
    year: 2024,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    description: 'Immeuble de bureaux R+5 avec parking sous-sol.',
  },
  {
    id: 3,
    title: 'Résidence Premium Marcory',
    category: 'Résidentiel',
    location: 'Marcory, Abidjan',
    year: 2025,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    description: 'Résidence haut standing de 12 logements.',
  },
  {
    id: 4,
    title: 'Centre Médical Yopougon',
    category: 'Institutionnel',
    location: 'Yopougon, Abidjan',
    year: 2024,
    image: 'https://images.unsplash.com/photo-1587582423116-ec07293f0395?auto=format&fit=crop&w=1200&q=80',
    description: 'Centre médical moderne avec équipements de pointe.',
  },
  {
    id: 5,
    title: 'Complexe Industriel Yamoussoukro',
    category: 'Industriel',
    location: 'Yamoussoukro',
    year: 2023,
    image: 'https://images.unsplash.com/photo-1536895058696-a69b1c7ba34f?auto=format&fit=crop&w=1200&q=80',
    description: 'Usine de transformation avec entrepôts.',
  },
  {
    id: 6,
    title: 'Rénovation Villa Riviera',
    category: 'Rénovation',
    location: 'Riviera, Abidjan',
    year: 2025,
    image: 'https://images.unsplash.com/photo-1621511075938-f03482369feb?auto=format&fit=crop&w=1200&q=80',
    description: 'Réhabilitation complète d\'une villa des années 90.',
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Konan Yao',
    role: 'Propriétaire',
    content: 'Synergie Construction a transformé notre projet en réalité. Leur professionnalisme et leur rigueur sont remarquables. Je recommande vivement.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 2,
    name: 'Aïcha Diabaté',
    role: 'Directrice, Diabaté SARL',
    content: 'Notre nouvel immeuble de bureaux est exactement ce que nous voulions. Travail livré dans les délais et budget respecté.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=44',
  },
  {
    id: 3,
    name: 'Pierre Kouamé',
    role: 'Promoteur Immobilier',
    content: 'Une équipe d\'experts, à l\'écoute et toujours disponibles. Plusieurs projets réalisés ensemble, toujours avec excellence.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: 4,
    name: 'Fatou Bamba',
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
    question: 'Intervenez-vous en dehors d\'Abidjan ?',
    answer: 'Oui, nous intervenons dans toute la Côte d\'Ivoire et dans la sous-région ouest-africaine selon les projets.',
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
