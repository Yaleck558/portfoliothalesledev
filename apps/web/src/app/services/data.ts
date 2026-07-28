// apps/web/src/app/services/data.ts

export interface Service {
  slug: string;
  category: 'dev' | 'design';
  badge: string;
  title: string;
  tagline: string;
  image: string;
  description: string;
  inclus: string[];
  delai: string;
}

export const services: Service[] = [
  {
    slug: 'site-vitrine',
    category: 'dev',
    badge: 'Site vitrine',
    title: 'Sites vitrines pour métiers & commerces locaux',
    tagline: 'Restaurants, salons, boutiques, cabinets, artisans — une image pro qui donne envie.',
    image: '/img/services/service-01-site-vitrine.png',
    description:
      "Votre activité mérite une vitrine à la hauteur de votre savoir-faire. Je conçois des sites soignés, rapides et pensés pour donner confiance dès les premières secondes — que ce soit pour présenter un restaurant, un salon, une boutique ou un cabinet.",
    inclus: [
      'Design sur-mesure adapté à votre identité',
      'Version mobile optimisée',
      'Présentation claire de vos services / menu / catalogue',
      'Formulaire de contact intégré',
      'Optimisation vitesse de chargement',
    ],
    delai: '1 à 3 semaines selon la complexité',
  },
  {
    slug: 'boutique-en-ligne',
    category: 'dev',
    badge: 'Boutique en ligne',
    title: 'Boutiques en ligne',
    tagline: 'Vendez vos produits ou services 24h/24, sans limite géographique.',
    image: '/img/services/service-02-boutique-en-ligne.png',
    description:
      "Une boutique en ligne claire, rassurante et facile à gérer au quotidien. Du catalogue produit au paiement, chaque étape est pensée pour convertir vos visiteurs en clients.",
    inclus: [
      'Catalogue produits avec gestion des stocks',
      'Panier & tunnel de commande simplifié',
      'Paiement en ligne sécurisé',
      'Espace de gestion pour vos commandes',
      'Version mobile optimisée',
    ],
    delai: '3 à 6 semaines selon le catalogue',
  },
  {
    slug: 'landing-page',
    category: 'dev',
    badge: 'Landing page',
    title: 'Landing pages',
    tagline: 'Une page, un objectif : convertir vos visiteurs en leads ou en ventes.',
    image: '/img/services/service-03-landing-page.png',
    description:
      "Idéale pour un lancement, une campagne publicitaire ou une offre spéciale. Une landing page va droit au but : un message clair, une preuve de valeur, et un appel à l'action impossible à manquer.",
    inclus: [
      'Structure orientée conversion',
      'Copywriting persuasif (en option)',
      'Design percutant et rapide à charger',
      'Intégration avec vos outils marketing',
      'Suivi des performances (analytics)',
    ],
    delai: '1 à 2 semaines',
  },
  {
    slug: 'application-web',
    category: 'dev',
    badge: 'Application web',
    title: 'Applications web métier',
    tagline: 'Des outils sur-mesure pour gérer réservations, stocks, billetterie ou plateformes internes.',
    image: '/img/services/service-04-application-web.png',
    description:
      "Chaque activité a ses propres besoins. Je développe des outils métier personnalisés — gestion de réservations, de stock, de billetterie (comme XwéDò pour les festivals) ou plateformes internes — pour automatiser ce qui vous fait perdre du temps.",
    inclus: [
      'Analyse de vos besoins spécifiques',
      'Interface d\u2019administration sur-mesure',
      'Base de données sécurisée',
      'Gestion des rôles et accès utilisateurs',
      'Accompagnement après livraison',
    ],
    delai: '4 à 10 semaines selon le périmètre',
  },
  {
    slug: 'refonte-site',
    category: 'dev',
    badge: 'Refonte de site',
    title: 'Refonte de sites existants',
    tagline: 'Votre site est vieillissant ou ne convertit pas ? Je le transforme en vitrine moderne.',
    image: '/img/services/service-05-refonte-site.png',
    description:
      "Un site daté, lent ou peu lisible sur mobile fait fuir vos visiteurs. Je reprends l'existant pour lui donner un design moderne, des performances optimisées et une expérience mobile irréprochable — sans perdre votre référencement acquis.",
    inclus: [
      'Audit du site actuel',
      'Nouveau design aligné à votre image',
      'Optimisation vitesse & mobile',
      'Migration du contenu existant',
      'Préservation du référencement SEO',
    ],
    delai: '2 à 4 semaines',
  },
  {
    slug: 'formation-en-ligne',
    category: 'dev',
    badge: 'Formation en ligne',
    title: 'Plateformes de formation en ligne (LMS)',
    tagline: 'Vendez et diffusez vos cours, formations et contenus pédagogiques.',
    image: '/img/services/service-06-formation-en-ligne.png',
    description:
      "Une plateforme pour héberger vos vidéos, suivre la progression de vos apprenants et vendre l'accès à vos formations — le tout dans une interface simple à utiliser, pour vous comme pour vos élèves.",
    inclus: [
      'Espace membre avec authentification',
      'Lecteur vidéo et suivi de progression',
      'Vente d\u2019accès aux formations',
      'Espace d\u2019administration des contenus',
      'Certificats de complétion (en option)',
    ],
    delai: '4 à 8 semaines',
  },
  {
    slug: 'maintenance-support',
    category: 'dev',
    badge: 'Maintenance & support',
    title: 'Maintenance & évolutions',
    tagline: 'Votre site, toujours à jour, sans que vous ayez à y penser.',
    image: '/img/services/service-07-maintenance-support.png',
    description:
      "Un site vit après sa mise en ligne : corrections, mises à jour de sécurité, petites évolutions. Je m'occupe de garder votre site fiable et performant sur la durée, avec un suivi réactif.",
    inclus: [
      'Corrections de bugs',
      'Mises à jour de sécurité',
      'Petites évolutions fonctionnelles',
      'Suivi des performances',
      'Support réactif par WhatsApp ou email',
    ],
    delai: 'Forfait mensuel ou intervention ponctuelle',
  },
  {
    slug: 'maquette-au-site',
    category: 'dev',
    badge: 'Intégration Figma',
    title: 'Intégration de maquettes (Figma → code)',
    tagline: 'Votre design est prêt ? Je le transforme en site fonctionnel, pixel par pixel.',
    image: '/img/services/service-08-maquette-au-site.png',
    description:
      "Vous avez déjà une maquette validée (Figma, Canva ou autre) ? Je la développe fidèlement en site fonctionnel, rapide et responsive, sans dénaturer le travail de conception déjà réalisé.",
    inclus: [
      'Respect fidèle de la maquette fournie',
      'Version responsive (mobile, tablette, desktop)',
      'Animations et micro-interactions',
      'Code propre et maintenable',
      'Tests multi-navigateurs',
    ],
    delai: '2 à 4 semaines selon la maquette',
  },
  {
    slug: 'identite-visuelle',
    category: 'design',
    badge: 'Identité visuelle',
    title: 'Identité visuelle complète',
    tagline: 'Logo, palette, typographie — la base visuelle de votre marque.',
    image: '/img/services/service-09-identite-visuelle.png',
    description:
      "Avant même de penser au site, une marque a besoin d'une identité cohérente. Logo, palette de couleurs, typographie et charte graphique posent les bases visuelles sur lesquelles tout le reste va s'appuyer.",
    inclus: [
      'Logo principal + déclinaisons',
      'Palette de couleurs',
      'Typographies de marque',
      'Charte graphique complète',
      'Fichiers sources livrés',
    ],
    delai: '2 à 3 semaines',
  },
  {
    slug: 'creation-logo',
    category: 'design',
    badge: 'Logo',
    title: 'Création de logo',
    tagline: 'Une marque, une identité, un symbole qui vous représente.',
    image: '/img/services/service-10-creation-logo.png',
    description:
      "Un logo seul, pensé pour être simple, mémorable et adapté à tous vos supports — du site web à la carte de visite.",
    inclus: [
      'Plusieurs pistes créatives',
      'Révisions incluses',
      'Livraison en plusieurs formats',
      'Version couleur et monochrome',
    ],
    delai: '1 à 2 semaines',
  },
  {
    slug: 'supports-comm',
    category: 'design',
    badge: 'Supports de comm',
    title: 'Supports de communication',
    tagline: 'Flyers, affiches, cartes de visite — prêts à imprimer.',
    image: '/img/services/service-11-supports-comm.png',
    description:
      "Des supports print soignés pour votre communication locale, cohérents avec votre identité visuelle.",
    inclus: [
      'Design sur-mesure',
      'Fichiers prêts pour l\u2019impression',
      'Adaptation à vos formats souhaités',
    ],
    delai: '1 à 2 semaines',
  },
  {
    slug: 'visuels-reseaux-sociaux',
    category: 'design',
    badge: 'Réseaux sociaux',
    title: 'Visuels pour réseaux sociaux',
    tagline: "Une présence qui capte l'œil sur Instagram et Facebook.",
    image: '/img/services/service-12-visuels-reseaux-sociaux.png',
    description:
      "Posts, bannières et stories cohérents avec votre identité de marque, pensés pour capter l'attention dans un feed.",
    inclus: [
      'Templates réutilisables',
      'Posts sur-mesure',
      'Cohérence visuelle sur tous les formats',
    ],
    delai: '1 à 2 semaines',
  },
  {
    slug: 'ui-ux-design',
    category: 'design',
    badge: 'UI/UX Design',
    title: 'UI/UX Design',
    tagline: "Penser l'expérience avant le code, pour un résultat qui fonctionne vraiment.",
    image: '/img/services/service-13-ui-ux-design.png',
    description:
      "Conception de l'interface et de l'expérience utilisateur avant le développement — maquettes Figma détaillées, prêtes à être validées ou intégrées.",
    inclus: [
      'Wireframes et maquettes Figma',
      'Parcours utilisateur réfléchi',
      'Design system cohérent',
      'Livrables prêts pour le développement',
    ],
    delai: '2 à 4 semaines',
  },
  {
    slug: 'referencement-seo',
    category: 'dev',
    badge: 'SEO',
    title: 'Référencement SEO',
    tagline: 'Être visible sur Google, pour que vos clients vous trouvent enfin.',
    image: '/img/services/service-14-referencement-seo.png',
    description:
      "Un site magnifique ne sert à rien s'il reste invisible sur les moteurs de recherche. J'optimise la structure, le contenu et les performances techniques de votre site pour améliorer votre visibilité sur Google.",
    inclus: [
      'Audit SEO complet',
      'Optimisation technique (vitesse, structure)',
      'Optimisation des contenus et mots-clés',
      'Configuration Google Search Console',
      'Recommandations de contenu continu',
    ],
    delai: '2 à 4 semaines + suivi continu',
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug);
}