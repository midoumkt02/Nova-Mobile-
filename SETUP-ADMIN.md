# Activer l'espace gérant (5-10 minutes, gratuit)

Ce site utilise **Firebase** (service gratuit de Google) comme base de données pour le catalogue de téléphones. Tant que vous n'avez pas suivi les étapes ci-dessous, `admin.html` affiche un message "non configuré" et le site public affiche un catalogue de démonstration figé.

Cette configuration se fait **une seule fois**, par vous (le développeur). Une fois faite, le gérant de la boutique utilise `admin.html` sans jamais toucher au code.

## 1. Créer un projet Firebase

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com) et connectez-vous avec un compte Google.
2. Cliquez sur **Ajouter un projet**, donnez-lui un nom (ex : `nova-mobile`).
3. Vous pouvez désactiver Google Analytics (pas nécessaire ici).
4. Cliquez sur **Créer le projet**.

## 2. Activer la base de données (Firestore)

1. Dans le menu de gauche : **Build > Firestore Database**.
2. Cliquez sur **Créer une base de données**.
3. Choisissez une région proche de vos utilisateurs (ex : `eur3` / `europe-west`).
4. Démarrez en **mode production**.
5. Une fois créée, allez dans l'onglet **Règles** et remplacez le contenu par :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Cela permet à tout le monde de **voir** le catalogue, mais seul un utilisateur connecté (le gérant) peut **modifier**. Cliquez sur **Publier**.

## 3. Activer la connexion du gérant (Authentication)

1. Menu de gauche : **Build > Authentication > Get started**.
2. Onglet **Sign-in method** > activez **Email/Password**.
3. Onglet **Users** > **Add user** : entrez l'email et le mot de passe que le gérant utilisera pour se connecter sur `admin.html`.
   - Notez bien cet email/mot de passe, c'est ce que vous donnerez au gérant.

## 4. Récupérer la configuration du site

1. Cliquez sur l'icône ⚙️ (Paramètres) en haut à gauche > **Paramètres du projet**.
2. Descendez jusqu'à **Vos applications**, cliquez sur l'icône Web `</>`.
3. Donnez un surnom (ex : `nova-mobile-web`), pas besoin de cocher "Hébergement".
4. Firebase affiche un bloc `firebaseConfig = { ... }`. Copiez ces valeurs.

## 5. Coller la configuration dans le site

Ouvrez [js/firebase-config.js](js/firebase-config.js) et remplacez les valeurs par celles copiées à l'étape 4 :

```js
export const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Enregistrez le fichier. C'est terminé !

## 6. Vérifier que tout fonctionne

1. Ouvrez `admin.html` dans un navigateur.
2. Connectez-vous avec l'email/mot de passe créés à l'étape 3.
3. Cliquez sur **Importer le catalogue de démonstration** pour remplir la base avec les 6 téléphones d'exemple (à faire une seule fois).
4. Essayez d'ajouter un téléphone puis d'en supprimer un : le site public (`index.html`) doit se mettre à jour automatiquement.

## Bon à savoir

- **Gratuit** : le forfait gratuit de Firebase (Spark) permet largement de faire tourner un catalogue de quelques dizaines/centaines de téléphones sans jamais payer.
- **Photos** : les photos sont automatiquement compressées dans le navigateur avant d'être enregistrées, pas besoin de les redimensionner à la main.
- **Sécurité** : ne partagez le mot de passe de l'espace gérant qu'avec les personnes de confiance de la boutique.
- **Plusieurs boutiques** : pour réutiliser ce système chez un autre client, créez simplement un nouveau projet Firebase et recommencez ces étapes.
