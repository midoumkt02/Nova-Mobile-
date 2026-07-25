import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';
import { DEMO_PRODUCTS } from './demo-products.js';

const FIREBASE_SDK = 'https://www.gstatic.com/firebasejs/10.14.1';

const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const loginBtn = document.getElementById('loginBtn');
const userEmailEl = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const adminGrid = document.getElementById('adminGrid');
const seedBtn = document.getElementById('seedBtn');
const productForm = document.getElementById('productForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('photoPreview');
const photoDropLabel = document.getElementById('photoDropLabel');

// ---------- Mode "Firebase non configuré" : on bloque proprement ----------
if (!isFirebaseConfigured) {
  loginForm.style.display = 'none';
  const banner = document.createElement('div');
  banner.className = 'login-error visible';
  banner.style.marginTop = '0';
  banner.innerHTML = 'Cet espace n\'est pas encore configuré.<br>Ouvrez le fichier <code>SETUP-ADMIN.md</code> à la racine du projet pour l\'activer (5-10 minutes, gratuit).';
  loginForm.insertAdjacentElement('afterend', banner);
  throw new Error('Firebase non configuré — voir SETUP-ADMIN.md');
}

let auth, db, currentUser = null;
let selectedPhotoDataUrl = null;

init();

async function init() {
  const { initializeApp } = await import(`${FIREBASE_SDK}/firebase-app.js`);
  const authMod = await import(`${FIREBASE_SDK}/firebase-auth.js`);
  const firestoreMod = await import(`${FIREBASE_SDK}/firebase-firestore.js`);

  const app = initializeApp(firebaseConfig);
  auth = authMod.getAuth(app);
  db = firestoreMod.getFirestore(app);

  authMod.onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
      loginScreen.classList.add('hidden');
      dashboard.classList.add('visible');
      userEmailEl.textContent = user.email;
      watchProducts();
    } else {
      loginScreen.classList.remove('hidden');
      dashboard.classList.remove('visible');
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.remove('visible');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Connexion...';
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    try {
      await authMod.signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      loginError.textContent = translateAuthError(err.code);
      loginError.classList.add('visible');
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Se connecter';
    }
  });

  logoutBtn.addEventListener('click', () => authMod.signOut(auth));

  seedBtn.addEventListener('click', async () => {
    seedBtn.disabled = true;
    seedBtn.textContent = 'Import en cours...';
    try {
      for (const p of DEMO_PRODUCTS) {
        const { id, ...data } = p;
        await firestoreMod.addDoc(firestoreMod.collection(db, 'products'), {
          ...data,
          createdAt: firestoreMod.serverTimestamp()
        });
      }
    } catch (err) {
      alert('Erreur pendant l\'import : ' + err.message);
    } finally {
      seedBtn.disabled = false;
      seedBtn.textContent = 'Importer le catalogue de démonstration';
    }
  });

  function watchProducts() {
    const q = firestoreMod.query(firestoreMod.collection(db, 'products'), firestoreMod.orderBy('createdAt', 'desc'));
    firestoreMod.onSnapshot(q, (snap) => {
      const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderAdminGrid(products);
      seedBtn.style.display = products.length ? 'none' : 'inline-flex';
    }, (err) => {
      adminGrid.innerHTML = `<p class="empty-state">Erreur de chargement : ${escapeHtml(err.message)}</p>`;
    });
  }

  function renderAdminGrid(products) {
    if (!products.length) {
      adminGrid.innerHTML = '<p class="empty-state">Aucun téléphone en ligne. Ajoutez-en un ci-dessus, ou importez le catalogue de démonstration.</p>';
      return;
    }
    adminGrid.innerHTML = products.map(p => `
      <div class="admin-card" data-id="${p.id}">
        <div class="admin-card-photo"><img src="${p.image || 'assets/products/placeholder.svg'}" alt=""></div>
        ${p.badgeLabel ? `<div class="admin-card-badge">${escapeHtml(p.badgeLabel)}</div>` : ''}
        <h4>${escapeHtml(p.name)}</h4>
        <span class="price">${formatPrice(p.price)}</span>
        <div class="admin-card-actions">
          <button class="btn-delete" data-id="${p.id}">Supprimer</button>
        </div>
      </div>
    `).join('');

    adminGrid.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Supprimer ce téléphone du site ? Cette action est immédiate et irréversible.')) return;
        btn.disabled = true;
        btn.textContent = 'Suppression...';
        try {
          await firestoreMod.deleteDoc(firestoreMod.doc(db, 'products', btn.dataset.id));
        } catch (err) {
          alert('Erreur : ' + err.message);
          btn.disabled = false;
          btn.textContent = 'Supprimer';
        }
      });
    });
  }

  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    formStatus.className = 'form-status';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Ajout en cours...';

    try {
      const badgeType = document.getElementById('fieldBadge').value;
      const badgeLabels = { new: 'Nouveau', hot: 'Populaire', promo: 'Promo' };
      const tags = [document.getElementById('fieldStorage').value.trim(), document.getElementById('fieldTag').value.trim()].filter(Boolean);

      const product = {
        name: document.getElementById('fieldName').value.trim(),
        price: Number(document.getElementById('fieldPrice').value),
        desc: document.getElementById('fieldDesc').value.trim(),
        tags,
        badgeType: badgeType || null,
        badgeLabel: badgeType ? badgeLabels[badgeType] : null,
        image: selectedPhotoDataUrl || 'assets/products/placeholder.svg',
        createdAt: firestoreMod.serverTimestamp()
      };

      await firestoreMod.addDoc(firestoreMod.collection(db, 'products'), product);

      productForm.reset();
      selectedPhotoDataUrl = null;
      photoPreview.style.display = 'none';
      photoDropLabel.style.display = 'flex';
      formStatus.textContent = 'Téléphone ajouté et visible sur le site !';
      formStatus.className = 'form-status success';
    } catch (err) {
      formStatus.textContent = 'Erreur : ' + err.message;
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Ajouter le téléphone';
    }
  });
}

// ---------- Photo : sélection + compression côté navigateur ----------
photoInput.addEventListener('change', async () => {
  const file = photoInput.files[0];
  if (!file) return;
  photoDropLabel.textContent = 'Traitement de la photo...';
  try {
    selectedPhotoDataUrl = await compressImage(file);
    photoPreview.src = selectedPhotoDataUrl;
    photoPreview.style.display = 'block';
    photoDropLabel.style.display = 'none';
  } catch (err) {
    alert('Impossible de charger cette image : ' + err.message);
  }
});

function compressImage(file, maxWidth = 900, startQuality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image invalide'));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = startQuality;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        // Reste sous ~650 Ko (limite Firestore par document ~1 Mo) en réduisant la qualité si besoin.
        while (dataUrl.length > 650000 && quality > 0.35) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function formatPrice(price) {
  if (typeof price === 'number') return price.toLocaleString('fr-FR') + ' DA';
  return price || '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function translateAuthError(code) {
  const map = {
    'auth/invalid-email': 'Adresse email invalide.',
    'auth/user-not-found': 'Aucun compte ne correspond à cet email.',
    'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/invalid-credential': 'Email ou mot de passe incorrect.',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez dans quelques minutes.',
    'auth/network-request-failed': 'Problème de connexion internet.'
  };
  return map[code] || 'Connexion impossible. Vérifiez vos identifiants.';
}
