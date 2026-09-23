# 📱 NOVA Mobile — Site vitrine pour boutique de téléphonie

Site vitrine moderne pour une boutique de vente et de réparation de smartphones, avec un **espace gérant** permettant au commerçant d'ajouter ou de retirer lui-même les téléphones affichés sur le site, sans toucher au code.

> Projet de démonstration réalisé dans le cadre de mes services de création de sites web pour commerces et boutiques.

## Aperçu

Le site se compose de deux parties :

- **`index.html`** : la vitrine publique (catalogue, services, avis clients, contact)
- **`admin.html`** : l'espace gérant, protégé par identifiant et mot de passe

Les modifications faites depuis l'espace gérant apparaissent **en temps réel** sur le site, pour tous les visiteurs.

## Fonctionnalités

### Site vitrine
- Section hero avec visuel animé
- Catalogue de smartphones chargé dynamiquement (nom, prix en DA, stockage, étiquettes « Nouveau », « Populaire », « Promo »)
- Présentation des services : vente neuf et reconditionné, réparation, reprise, accessoires
- Carrousel d'avis clients
- Formulaire de contact et inscription newsletter
- Animations au scroll, barre de progression, preloader, bouton retour en haut
- Menu burger et mise en page responsive (mobile, tablette, desktop)

### Espace gérant
- Connexion sécurisée par email et mot de passe (Firebase Authentication)
- Ajout d'un téléphone via un formulaire simple : photo, nom, prix, étiquette, stockage, description
- Photo prise directement depuis le téléphone du gérant, **compressée automatiquement dans le navigateur** avant l'envoi
- Suppression d'un téléphone vendu ou indisponible en un clic
- Import du catalogue de démonstration pour démarrer rapidement

### Mode démo
Tant que Firebase n'est pas configuré, le site fonctionne avec un **catalogue de démonstration local** : il reste donc entièrement consultable sans backend.

## Stack technique

- **HTML5, CSS3, JavaScript** (vanilla, modules ES)
- **Firebase Authentication** : connexion de l'espace gérant
- **Cloud Firestore** : stockage du catalogue et synchronisation en temps réel
- Google Fonts (Space Grotesk, Inter)

Aucun framework ni étape de build : le site est 100 % statique et peut être hébergé sur n'importe quel hébergeur de fichiers statiques (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

## Structure du projet

```
index.html               # site vitrine
admin.html               # espace gérant
css/
  style.css              # styles du site vitrine
  admin.css              # styles de l'espace gérant
js/
  script.js              # interactions (menu, scroll, carrousel, formulaires)
  catalog.js             # affichage du catalogue (démo ou Firestore)
  admin.js               # logique de l'espace gérant (auth, ajout, suppression)
  firebase-config.js     # configuration Firebase
  demo-products.js       # catalogue de démonstration
assets/products/         # photos des produits de démonstration
```

## Lancer le projet

Les fichiers JavaScript sont chargés en tant que modules ES : il faut donc passer par un serveur local plutôt que d'ouvrir `index.html` directement.

```bash
# avec Python
python -m http.server 8000

# ou avec Node.js
npx serve .
```

Puis ouvrir `http://localhost:8000`.

## Configurer Firebase (espace gérant)

1. Créer un projet sur la [console Firebase](https://console.firebase.google.com)
2. Activer **Authentication** avec la méthode « Adresse e-mail / Mot de passe », puis créer le compte du gérant
3. Activer **Cloud Firestore**
4. Copier la configuration web du projet dans `js/firebase-config.js`
5. Définir des règles Firestore qui autorisent la lecture publique du catalogue mais réservent l'écriture aux utilisateurs connectés :

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

## Remarques

- Le formulaire de contact et la newsletter sont des démonstrations : aucun message n'est réellement envoyé.
- Les noms de boutique, avis clients et statistiques sont fictifs et servent uniquement à la démonstration.

## Auteur

**Mehdi Meklat** — [GitHub](https://github.com/midoumkt02) · [LinkedIn](https://www.linkedin.com/in/mehdi-meklat-23478b18a/)
