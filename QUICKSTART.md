# 🚀 Démarrage Rapide

## Installation en 3 étapes

### 1️⃣ Configuration des variables d'environnement

```powershell
# Exécuter le script de setup
.\setup.ps1
```

Ou manuellement :
```powershell
# Copier le fichier d'exemple
Copy-Item .env.example .env

# Éditer le fichier .env avec vos vraies valeurs
notepad .env
```

### 2️⃣ Démarrage avec Docker

```powershell
# Démarrer tous les services
docker-compose up -d

# Vérifier que tout fonctionne
docker-compose ps
```

### 3️⃣ Accéder aux services

- **Frontend (React)** : http://localhost:3000
- **Backend (API)** : http://localhost:3001
- **Base de données (PostgreSQL)** : localhost:5432

## 🔧 Commandes utiles

### Docker Compose

```powershell
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Redémarrer un service
docker-compose restart backend

# Reconstruire les images
docker-compose build

# Tout supprimer (services + volumes)
docker-compose down -v
```

### Développement local (sans Docker)

```powershell
# Backend
cd backend
npm install
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

## 🐛 Dépannage

### Le port est déjà utilisé
```powershell
# Trouver le processus utilisant le port 3000 ou 3001
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Arrêter le processus (remplacer PID par l'ID du processus)
taskkill /PID <PID> /F
```

### Les changements ne sont pas pris en compte
```powershell
# Reconstruire et redémarrer
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problèmes de base de données
```powershell
# Réinitialiser complètement la base de données
docker-compose down -v
docker-compose up -d
```

### Voir les erreurs en détail
```powershell
# Démarrer en mode non-détaché pour voir tous les logs
docker-compose up
```

## 📚 Prochaines étapes

1. Lisez le [README.md](./README.md) pour plus de détails
2. Consultez [SECURITY.md](./SECURITY.md) pour les bonnes pratiques de sécurité
3. Modifiez votre fichier `.env` avec vos vraies clés API
4. Commencez à développer ! 🎉

## ⚠️ Rappel de sécurité

- ❌ Ne commitez **JAMAIS** le fichier `.env`
- ✅ Utilisez `.env.example` comme template
- 🔐 Changez tous les secrets par défaut avant de déployer
