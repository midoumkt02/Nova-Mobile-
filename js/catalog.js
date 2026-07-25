import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';
import { DEMO_PRODUCTS } from './demo-products.js';

const grid = document.getElementById('productGrid');
const FIREBASE_SDK = 'https://www.gstatic.com/firebasejs/10.14.1';

function badgeClass(type) {
  return { new: 'badge-new', hot: 'badge-hot', promo: 'badge-promo' }[type] || 'badge-new';
}

function formatPrice(price) {
  if (typeof price === 'number') return price.toLocaleString('fr-FR') + ' DA';
  return price;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function renderProducts(products) {
  if (!products.length) {
    grid.innerHTML = '<p class="product-empty">Aucun téléphone disponible pour le moment. Repassez bientôt !</p>';
    return;
  }
  grid.innerHTML = products.map(p => `
    <article class="product-card">
      ${p.badgeLabel ? `<div class="product-badge ${badgeClass(p.badgeType)}">${escapeHtml(p.badgeLabel)}</div>` : ''}
      <div class="product-visual">
        <img class="product-photo" src="${p.image || 'assets/products/placeholder.svg'}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='assets/products/placeholder.svg';">
      </div>
      <div class="product-body">
        <div class="product-tags">${(p.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="product-desc">${escapeHtml(p.desc || '')}</p>
        <div class="product-foot">
          <span class="price">${formatPrice(p.price)}</span>
          <a href="#contact" class="btn btn-outline btn-sm">Voir détails</a>
        </div>
      </div>
    </article>
  `).join('');
}

// Affichage immédiat du catalogue de démo, remplacé par les données live si Firebase est configuré.
renderProducts(DEMO_PRODUCTS);

if (isFirebaseConfigured) {
  (async () => {
    try {
      const { initializeApp } = await import(`${FIREBASE_SDK}/firebase-app.js`);
      const { getFirestore, collection, onSnapshot, query, orderBy } = await import(`${FIREBASE_SDK}/firebase-firestore.js`);

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

      onSnapshot(q, (snap) => {
        const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderProducts(products.length ? products : DEMO_PRODUCTS);
      }, (err) => {
        console.error('Erreur de chargement du catalogue Firestore :', err);
      });
    } catch (err) {
      console.error('Erreur d\'initialisation Firebase :', err);
    }
  })();
}
