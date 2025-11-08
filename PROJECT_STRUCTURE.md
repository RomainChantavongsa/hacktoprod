# 📁 Structure du Projet

```
HackToGone3Contrees/
│
├── 📄 .env                          # Variables d'environnement (NON versionné)
├── 📄 .env.example                  # Template des variables d'environnement
├── 📄 .gitignore                    # Fichiers à ignorer par Git
├── 📄 docker-compose.yml            # Configuration Docker Compose
├── 📄 README.md                     # Documentation principale
├── 📄 QUICKSTART.md                 # Guide de démarrage rapide
├── 📄 SECURITY.md                   # Guide de sécurité
├── 📄 setup.ps1                     # Script d'installation (PowerShell)
│
├── 📁 backend/                      # API Node.js/Express
│   ├── 📄 .env.example              # Variables d'environnement backend
│   ├── 📄 Dockerfile                # Configuration Docker backend
│   ├── 📄 package.json              # Dépendances Node.js
│   ├── 📄 server.js                 # Point d'entrée de l'application
│   │
│   ├── 📁 config/                   # Configuration de l'application
│   │   ├── 📄 index.js              # Configuration centralisée
│   │   └── 📄 database.js           # Configuration de la base de données
│   │
│   ├── 📁 utils/                    # Utilitaires
│   │   └── 📄 jwt.js                # Utilitaires JWT
│   │
│   ├── 📁 routes/                   # Routes de l'API (à créer)
│   ├── 📁 controllers/              # Contrôleurs (à créer)
│   ├── 📁 models/                   # Modèles de données (à créer)
│   └── 📁 middlewares/              # Middlewares Express (à créer)
│
└── 📁 frontend/                     # Application React/Vite
    ├── 📄 .env.example              # Variables d'environnement frontend
    ├── 📄 Dockerfile                # Configuration Docker frontend
    ├── 📄 package.json              # Dépendances Node.js
    ├── 📄 vite.config.js            # Configuration Vite
    ├── 📄 index.html                # Point d'entrée HTML
    │
    ├── 📁 public/                   # Fichiers statiques
    │
    └── 📁 src/                      # Code source React
        ├── 📄 main.jsx              # Point d'entrée React
        ├── 📄 App.jsx               # Composant principal
        ├── 📄 App.css               # Styles du composant principal
        ├── 📄 index.css             # Styles globaux
        │
        ├── 📁 components/           # Composants React (à créer)
        ├── 📁 pages/                # Pages de l'application (à créer)
        ├── 📁 hooks/                # Hooks personnalisés (à créer)
        ├── 📁 services/             # Services API (à créer)
        ├── 📁 utils/                # Utilitaires (à créer)
        └── 📁 assets/               # Images, icônes, etc.
```

## 📝 Description des fichiers importants

### Racine du projet

- **`.env`** : Contient les variables d'environnement réelles (mots de passe, clés API, etc.). ⚠️ **NE JAMAIS COMMITER**
- **`.env.example`** : Template des variables d'environnement, à copier vers `.env`
- **`docker-compose.yml`** : Définit les services Docker (backend, frontend, base de données)
- **`setup.ps1`** : Script d'installation automatique pour Windows PowerShell

### Backend

- **`server.js`** : Point d'entrée du serveur Express
- **`config/index.js`** : Centralise toutes les variables d'environnement
- **`config/database.js`** : Configuration de la connexion PostgreSQL
- **`utils/jwt.js`** : Utilitaires pour la gestion des tokens JWT

### Frontend

- **`main.jsx`** : Point d'entrée de l'application React
- **`App.jsx`** : Composant racine de l'application
- **`vite.config.js`** : Configuration de Vite (bundler)

## 🔐 Fichiers sensibles

Ces fichiers contiennent des informations sensibles et **NE DOIVENT JAMAIS** être versionnés :

- `.env` (racine)
- `backend/.env`
- `frontend/.env`

Utilisez toujours les fichiers `.env.example` comme templates.

## 🚀 Pour commencer

1. Copiez `.env.example` vers `.env`
2. Remplissez vos vraies valeurs dans `.env`
3. Lancez `docker-compose up -d`
4. Accédez à http://localhost:3000 (frontend) et http://localhost:3001 (backend)

## 📚 Documentation

- [README.md](./README.md) - Documentation complète
- [QUICKSTART.md](./QUICKSTART.md) - Guide de démarrage rapide
- [SECURITY.md](./SECURITY.md) - Bonnes pratiques de sécurité
