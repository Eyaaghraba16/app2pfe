# Système de Gestion des Demandes

Ce projet est un système complet de gestion des demandes développé avec Angular pour le frontend et Node.js/Express pour le backend, utilisant une base de données MySQL.

## Fonctionnalités

- Gestion des demandes de formation
- Gestion des congés
- Gestion des prêts
- Gestion des documents administratifs
- Interface utilisateur moderne et responsive
- Système d'authentification sécurisé

## Structure du Projet

```
project/
├── frontend/          # Application Angular
├── backend/           # Serveur Node.js/Express
│   ├── database/     # Scripts SQL et migrations
│   ├── routes/       # Routes API
│   └── models/       # Modèles de données
└── docs/             # Documentation
```

## Prérequis

- Node.js (v14 ou supérieur)
- MySQL (v5.7 ou supérieur)
- Angular CLI

## Installation

1. Cloner le projet :
```bash
git clone https://github.com/ayarouissi/ayouta-fatfouta.git
cd ayouta-fatfouta
```

2. Installer les dépendances du frontend :
```bash
cd frontend
npm install
```

3. Installer les dépendances du backend :
```bash
cd ../backend
npm install
```

4. Configurer la base de données :
- Créer une base de données MySQL
- Importer le fichier `backend/database/setup_complete_database.sql`
- Créer un fichier `.env` dans le dossier backend avec les informations suivantes :
```
DB_HOST=localhost
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=nom_de_votre_base
JWT_SECRET=votre_secret_jwt
```

## Démarrage

1. Démarrer le backend :
```bash
cd backend
node server.js
```

2. Démarrer le frontend :
```bash
cd frontend
ng serve
```

L'application sera accessible à l'adresse : http://localhost:4200

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT.
