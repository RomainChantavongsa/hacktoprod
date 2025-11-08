# ✅ Checklist de Configuration

Utilisez cette checklist pour vérifier que votre environnement est correctement configuré.

## 📋 Avant de commencer

- [ ] Docker est installé et en cours d'exécution
- [ ] Docker Compose est installé
- [ ] Git est installé et configuré
- [ ] Un éditeur de code (VS Code, etc.) est installé

## 🔧 Configuration des variables d'environnement

### Fichiers créés

- [ ] Le fichier `.env` existe à la racine du projet
- [ ] Le fichier `.env` est listé dans `.gitignore`
- [ ] Le fichier `.env.example` est présent et versionné

### Variables d'environnement configurées

#### Base de données
- [ ] `POSTGRES_USER` est défini
- [ ] `POSTGRES_PASSWORD` est défini (et différent de "mypassword")
- [ ] `POSTGRES_DB` est défini
- [ ] `DATABASE_URL` est correctement formaté

#### Backend
- [ ] `BACKEND_PORT` est défini (3001 par défaut)
- [ ] `JWT_SECRET` est défini avec une clé forte (minimum 32 caractères)
- [ ] `NODE_ENV` est défini (development/production)

#### Frontend
- [ ] `FRONTEND_PORT` est défini (3000 par défaut)
- [ ] `VITE_API_URL` pointe vers le backend (http://localhost:3001)

#### Services externes (si utilisés)
- [ ] `TWILIO_ACCOUNT_SID` et `TWILIO_AUTH_TOKEN` sont définis
- [ ] `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME` sont définis
- [ ] `AWS_REGION` est défini

## 🔒 Sécurité

- [ ] Le fichier `.env` n'est PAS versionné (vérifier avec `git status`)
- [ ] Les secrets par défaut ont été changés
- [ ] Le `JWT_SECRET` est une clé aléatoire forte
- [ ] Les mots de passe sont différents entre dev et production

### Vérification Git

```powershell
# Vérifier que .env est ignoré
git check-ignore .env
# Résultat attendu : .env

# Vérifier qu'aucun fichier sensible n'est tracké
git status
# .env ne doit PAS apparaître dans les fichiers à commiter
```

## 🐳 Docker

### Démarrage

- [ ] Les conteneurs démarrent sans erreur : `docker-compose up -d`
- [ ] Tous les services sont "Up" : `docker-compose ps`

### Services actifs

```powershell
docker-compose ps
```

Vérifier que ces services sont actifs :
- [ ] `my_backend_api` (backend)
- [ ] `my_frontend_app` (frontend)
- [ ] `my_postgres_db` (base de données)

### Logs sans erreurs

```powershell
# Vérifier les logs du backend
docker-compose logs backend
# Rechercher : "Backend server is running" et "Connecté à la base de données"

# Vérifier les logs du frontend
docker-compose logs frontend
# Rechercher : "ready in" (Vite)

# Vérifier les logs de la base de données
docker-compose logs db
# Rechercher : "database system is ready to accept connections"
```

## 🌐 Accès aux services

- [ ] Frontend accessible : http://localhost:3000
- [ ] Backend accessible : http://localhost:3001
- [ ] L'API répond : `curl http://localhost:3001` ou ouvrir dans un navigateur

### Test rapide

```powershell
# Tester le backend
curl http://localhost:3001

# Résultat attendu : "Hello from the Node.js API!"
```

## 🧪 Tests de connexion

### Base de données

```powershell
# Se connecter à la base de données
docker exec -it my_postgres_db psql -U myuser -d mydatabase

# Dans psql, tester :
# \dt (lister les tables)
# \q (quitter)
```

### Variables d'environnement dans les conteneurs

```powershell
# Vérifier les variables d'env du backend
docker exec my_backend_api env | Select-String -Pattern "DATABASE_URL|JWT_SECRET|NODE_ENV"

# Vérifier les variables d'env du frontend
docker exec my_frontend_app env | Select-String -Pattern "VITE_API_URL"
```

## 📝 Documentation

- [ ] J'ai lu le [README.md](./README.md)
- [ ] J'ai consulté le [QUICKSTART.md](./QUICKSTART.md)
- [ ] J'ai lu les recommandations de [SECURITY.md](./SECURITY.md)
- [ ] Je comprends la [structure du projet](./PROJECT_STRUCTURE.md)

## 🆘 En cas de problème

Si quelque chose ne fonctionne pas :

1. **Vérifier les logs détaillés :**
   ```powershell
   docker-compose logs -f
   ```

2. **Redémarrer les services :**
   ```powershell
   docker-compose down
   docker-compose up -d
   ```

3. **Reconstruire les images :**
   ```powershell
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

4. **Réinitialiser complètement (⚠️ supprime les données) :**
   ```powershell
   docker-compose down -v
   docker-compose up -d
   ```

## ✅ Configuration terminée !

Une fois toutes les cases cochées, votre environnement est prêt pour le développement ! 🎉

Pour commencer à développer, consultez :
- La structure du projet dans [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- Les exemples de code dans `backend/config/` et `frontend/src/services/`
