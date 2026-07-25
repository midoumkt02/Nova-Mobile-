// Catalogue de démonstration affiché tant qu'aucun téléphone n'a été ajouté
// depuis l'espace gérant (admin.html), ou si Firebase n'est pas encore configuré.
export const DEMO_PRODUCTS = [
  {
    id: 'demo-1',
    name: 'Iphone 15 Pro Max',
    price: 165000,
    tags: ['256 Go', '5G'],
    desc: 'Écran OLED 6.7", triple capteur photo, autonomie 2 jours.',
    badgeType: 'new',
    badgeLabel: 'Nouveau',
    image: 'assets/products/iphone-15-pro-max.jpg'
  },
  {
    id: 'demo-2',
    name: 'Galaxy Zenith S24',
    price: 135000,
    tags: ['128 Go', '5G'],
    desc: 'Design incurvé, charge ultra-rapide, S-Pen inclus.',
    badgeType: 'hot',
    badgeLabel: 'Populaire',
    image: 'assets/products/galaxy-zenith-s24.jpg'
  },
  {
    id: 'demo-3',
    name: 'Google Pixel 9 Pro',
    price: 98000,
    tags: ['256 Go', 'Reconditionné'],
    desc: 'Photographie IA, Android pur, comme neuf, garantie 12 mois.',
    badgeType: 'promo',
    badgeLabel: 'Promo -15%',
    image: 'assets/products/google-pixel-9-pro.jpg'
  },
  {
    id: 'demo-4',
    name: 'NOVA Edge 15 Ultra',
    price: 210000,
    tags: ['512 Go', 'Titane'],
    desc: 'Châssis titane, zoom optique 5x, le fleuron de la gamme.',
    badgeType: 'new',
    badgeLabel: 'Nouveau',
    image: 'assets/products/nova-edge-15-ultra.jpg'
  },
  {
    id: 'demo-5',
    name: 'OnePlus Flux 12',
    price: 110000,
    tags: ['128 Go', 'Léger'],
    desc: 'Rapidité fulgurante, charge 100W, parfait pour le gaming.',
    badgeType: 'hot',
    badgeLabel: 'Populaire',
    image: 'assets/products/oneplus-flux-12.jpg'
  },
  {
    id: 'demo-6',
    name: 'Xiaomi Prime Note 14',
    price: 45000,
    tags: ['128 Go', 'Entrée de gamme'],
    desc: 'Le meilleur rapport qualité-prix pour un usage quotidien.',
    badgeType: 'promo',
    badgeLabel: 'Promo -20%',
    image: 'assets/products/xiaomi-prime-note-14.jpg'
  }
];
