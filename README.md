# HackToGone3Contrees

Un projet full-stack avec React (frontend), Node.js/Express (backend) et PostgreSQL (base de données).

## �️ Multi-plateforme

Ce projet fonctionne sur **Windows**, **Linux** et **macOS**. Consultez le [guide multi-plateforme](./CROSS_PLATFORM.md) pour les instructions spécifiques à votre système.

## �🚀 Installation

### Prérequis
- Docker & Docker Compose
- Node.js (pour le développement local)
- Make (optionnel, mais recommandé)

### Configuration des variables d'environnement

#### Méthode rapide (avec scripts)

**Windows :**
```powershell
.\setup.ps1
```

**Linux/macOS :**
```bash
chmod +x *.sh
./setup.sh
```

**Avec Make (toutes plateformes) :**
```bash
make setup
```

#### Méthode manuelle

1. **Copiez le fichier `.env.example` vers `.env` :**
   ```bash
   # Linux/macOS
   cp .env.example .env
   
   # Windows PowerShell
   Copy-Item .env.example .env
   ```

2. **Modifiez le fichier `.env` avec vos valeurs réelles :**
   - Remplacez les valeurs par défaut par vos propres clés et secrets
   - **⚠️ Ne jamais commiter le fichier `.env` sur Git !**

### Variables d'environnement importantes :

#### Base de données
- `POSTGRES_USER` : Nom d'utilisateur PostgreSQL
- `POSTGRES_PASSWORD` : Mot de passe PostgreSQL (⚠️ À changer en production)
- `POSTGRES_DB` : Nom de la base de données
- `DATABASE_URL` : URL complète de connexion à la base

#### Backend
- `BACKEND_PORT` : Port du serveur backend (par défaut: 3001)
- `JWT_SECRET` : Clé secrète pour les tokens JWT (⚠️ Utilisez une clé forte et aléatoire)
- `NODE_ENV` : Environnement (development/production)

#### Frontend
- `FRONTEND_PORT` : Port du serveur frontend (par défaut: 3000)
- `VITE_API_URL` : URL de l'API backend

#### Services externes
- **Twilio** : `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`
- **AWS S3** : `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`

## 🐳 Démarrage avec Docker

### Avec Make (recommandé - toutes plateformes)

```bash
# Démarrer tous les services
make start

# Voir les logs
make logs

# Arrêter les services
make stop

# Voir toutes les commandes disponibles
make help
```

### Avec les scripts

**Windows :**
```powershell
.\start.bat    # Démarrer
.\logs.bat     # Voir les logs
.\stop.bat     # Arrêter
```

**Linux/macOS :**
```bash
./start.sh     # Démarrer
./logs.sh      # Voir les logs
./stop.sh      # Arrêter
```

### Avec Docker Compose directement

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

## 📝 Structure du projet

```
.
├── backend/          # API Node.js/Express
├── frontend/         # Application React/Vite
├── docker-compose.yml
├── .env              # Variables d'environnement (NON versionné)
└── .env.example      # Template des variables d'environnement
```

## � Documentation

- **[CROSS_PLATFORM.md](./CROSS_PLATFORM.md)** - Guide multi-plateforme (Windows/Linux/macOS)
- **[QUICKSTART.md](./QUICKSTART.md)** - Guide de démarrage rapide
- **[SECURITY.md](./SECURITY.md)** - Bonnes pratiques de sécurité
- **[CHECKLIST.md](./CHECKLIST.md)** - Liste de vérification de la configuration
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Structure détaillée du projet
- **[SETUP_SUMMARY.md](./SETUP_SUMMARY.md)** - Résumé de la configuration

## �🔒 Sécurité

- Le fichier `.env` contient des informations sensibles et **NE DOIT JAMAIS** être versionné
- Utilisez `.env.example` comme template pour les nouveaux contributeurs
- En production, utilisez Docker Secrets ou un gestionnaire de secrets comme HashiCorp Vault