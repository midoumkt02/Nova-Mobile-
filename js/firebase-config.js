// ===================================================================
// Configuration Firebase — à remplacer par les valeurs de VOTRE projet.
// Voir le fichier SETUP-ADMIN.md à la racine du projet pour la marche
// à suivre complète, étape par étape (5-10 minutes, gratuit).
// ===================================================================
export const firebaseConfig = {
  apiKey: "AIzaSyCgct_-1Jdd7cpjTwUrkzx8OlqYwwOhBAg",
  authDomain: "nova-mobile-b8ffa.firebaseapp.com",
  projectId: "nova-mobile-b8ffa",
  storageBucket: "nova-mobile-b8ffa.firebasestorage.app",
  messagingSenderId: "120064161669",
  appId: "1:120064161669:web:8591208b89a2aa797576ec"
};

// Tant que la config ci-dessus n'a pas été remplacée, le site et l'espace
// gérant fonctionnent en mode démo local (catalogue figé, non modifiable).
export const isFirebaseConfigured = firebaseConfig.apiKey !== "VOTRE_API_KEY";
