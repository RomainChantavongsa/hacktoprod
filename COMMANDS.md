# ⚡ Référence Rapide des Commandes

## 🚀 Démarrage rapide

### Windows
```powershell
.\setup.ps1        # Configuration initiale
.\start.bat        # Démarrer
```

### Linux/macOS
```bash
chmod +x *.sh      # Rendre exécutable (une fois)
./setup.sh         # Configuration initiale
./start.sh         # Démarrer
```

### Make (universel)
```bash
make setup         # Configuration initiale
make start         # Démarrer
make help          # Voir toutes les commandes
```

---

## 📋 Commandes principales

| Action | Windows | Linux/macOS | Make |
|--------|---------|-------------|------|
| **🔧 Configuration** | `.\setup.ps1` | `./setup.sh` | `make setup` |
| **▶️ Démarrer** | `.\start.bat` | `./start.sh` | `make start` |
| **⏹️ Arrêter** | `.\stop.bat` | `./stop.sh` | `make stop` |
| **🔄 Redémarrer** | `.\stop.bat` puis `.\start.bat` | `./stop.sh` puis `./start.sh` | `make restart` |
| **📊 Logs (tous)** | `.\logs.bat` | `./logs.sh` | `make logs` |
| **📊 Logs backend** | `.\logs.bat backend` | `./logs.sh backend` | `make logs-backend` |
| **📊 Logs frontend** | `.\logs.bat frontend` | `./logs.sh frontend` | `make logs-frontend` |
| **📊 Logs DB** | `.\logs.bat db` | `./logs.sh db` | `make logs-db` |
| **🔨 Reconstruire** | `.\rebuild.bat` | `./rebuild.sh` | `make rebuild` |
| **🧹 Nettoyer** | `.\clean.bat` | `./clean.sh` | `make clean` |
| **✅ Vérifier** | - | - | `make check` |
| **📊 Statut** | `docker-compose ps` | `docker-compose ps` | `make status` |

---

## 🗄️ Base de données

| Action | Commande Make | Commande Docker |
|--------|---------------|-----------------|
| **Se connecter** | `make db-shell` | `docker exec -it my_postgres_db psql -U myuser -d mydatabase` |
| **Sauvegarder** | `make db-backup` | `docker exec my_postgres_db pg_dump -U myuser mydatabase > backup.sql` |
| **Restaurer** | `make db-restore FILE=backup.sql` | `docker exec -i my_postgres_db psql -U myuser mydatabase < backup.sql` |

---

## 🔧 Développement local (sans Docker)

### Windows
```powershell
# Backend
cd backend
npm install
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

### Linux/macOS
```bash
# Avec le script
./dev.sh

# Ou manuellement (backend)
cd backend
npm install
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm install
npm run dev
```

### Make
```bash
# Backend
make dev-backend

# Frontend (nouveau terminal)
make dev-frontend

# Installer les dépendances
make install
```

---

## 🌐 URLs d'accès

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Application React |
| **Backend** | http://localhost:3001 | API Express |
| **Database** | localhost:5432 | PostgreSQL |

---

## 🐛 Dépannage

### Problème : Port déjà utilisé

**Windows :**
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

**Linux/macOS :**
```bash
sudo lsof -i :3000
sudo lsof -i :3001
kill -9 <PID>
```

### Problème : Docker ne démarre pas

```bash
# Vérifier le statut
docker ps

# Redémarrer Docker Desktop (Windows/macOS)
# Ou sur Linux :
sudo systemctl restart docker
```

### Problème : Changements non pris en compte

```bash
# Reconstruire complètement
make rebuild

# Ou avec scripts
.\rebuild.bat    # Windows
./rebuild.sh     # Linux/macOS
```

### Problème : Erreur de base de données

```bash
# Réinitialiser complètement
make clean
make start

# Ou avec scripts
.\clean.bat      # Windows
./clean.sh       # Linux/macOS
```

---

## 📁 Fichiers importants

| Fichier | Description |
|---------|-------------|
| `.env` | Variables d'environnement (⚠️ NE PAS COMMITER) |
| `.env.example` | Template des variables d'environnement |
| `docker-compose.yml` | Configuration Docker |
| `Makefile` | Commandes Make (universel) |

---

## 🔐 Sécurité - Checklist rapide

- [ ] Le fichier `.env` existe
- [ ] Les valeurs par défaut ont été changées
- [ ] `JWT_SECRET` est une clé forte (64 caractères)
- [ ] `.env` n'est PAS versionné (vérifier avec `git status`)

### Vérifier que .env est ignoré

```bash
# Toutes plateformes
git check-ignore .env
# Résultat attendu : .env

git status
# .env ne doit PAS apparaître dans les fichiers à commiter
```

---

## 📚 Documentation complète

- **[README.md](./README.md)** - Documentation principale
- **[CROSS_PLATFORM.md](./CROSS_PLATFORM.md)** - Guide multi-plateforme détaillé
- **[QUICKSTART.md](./QUICKSTART.md)** - Guide de démarrage
- **[SECURITY.md](./SECURITY.md)** - Bonnes pratiques de sécurité
- **[CHECKLIST.md](./CHECKLIST.md)** - Liste de vérification complète

---

## 💡 Commande la plus utile

```bash
make help
```

Affiche toutes les commandes disponibles avec leur description ! 🎉
