# 🖥️ Guide Multi-Plateforme

Ce guide vous montre comment utiliser le projet sur **Windows**, **Linux** et **macOS**.

## 📋 Table des matières

1. [Installation initiale](#installation-initiale)
2. [Commandes Windows](#commandes-windows)
3. [Commandes Linux/macOS](#commandes-linuxmacos)
4. [Makefile (universel)](#makefile-universel)
5. [Dépannage](#dépannage)

---

## 🚀 Installation initiale

### Windows

```powershell
# PowerShell
.\setup.ps1

# Ou CMD
setup.bat
```

### Linux/macOS

```bash
# Rendre les scripts exécutables
chmod +x *.sh

# Exécuter le setup
./setup.sh

# Ou avec Make
make setup
```

---

## 🪟 Commandes Windows

### PowerShell

| Commande | Description |
|----------|-------------|
| `.\setup.ps1` | Configure l'environnement (crée le fichier .env) |
| `.\start.bat` | Démarre tous les services Docker |
| `.\stop.bat` | Arrête tous les services |
| `.\logs.bat` | Affiche les logs de tous les services |
| `.\logs.bat backend` | Affiche les logs du backend uniquement |
| `.\rebuild.bat` | Reconstruit et redémarre les services |
| `.\clean.bat` | Nettoie complètement le projet (⚠️ supprime les données) |

### CMD (Batch)

Même commandes que PowerShell, mais sans le `.\` :

```cmd
start.bat
stop.bat
logs.bat
```

### Exemples Windows

```powershell
# Configuration initiale
.\setup.ps1

# Modifier le fichier .env
notepad .env

# Démarrer le projet
.\start.bat

# Voir les logs en temps réel
.\logs.bat

# Arrêter le projet
.\stop.bat
```

---

## 🐧 Commandes Linux/macOS

### Scripts Bash

| Commande | Description |
|----------|-------------|
| `./setup.sh` | Configure l'environnement (crée le fichier .env) |
| `./start.sh` | Démarre tous les services Docker |
| `./stop.sh` | Arrête tous les services |
| `./logs.sh` | Affiche les logs de tous les services |
| `./logs.sh backend` | Affiche les logs du backend uniquement |
| `./rebuild.sh` | Reconstruit et redémarre les services |
| `./clean.sh` | Nettoie complètement le projet (⚠️ supprime les données) |
| `./dev.sh` | Mode développement local (sans Docker) |

### Exemples Linux/macOS

```bash
# Rendre les scripts exécutables (une seule fois)
chmod +x *.sh

# Configuration initiale
./setup.sh

# Modifier le fichier .env
nano .env
# ou
vim .env
# ou
code .env  # VS Code

# Démarrer le projet
./start.sh

# Voir les logs en temps réel
./logs.sh

# Arrêter le projet
./stop.sh
```

---

## 🛠️ Makefile (universel)

Le **Makefile** fonctionne sur toutes les plateformes (si `make` est installé).

### Installation de Make

**Windows :**
```powershell
# Avec Chocolatey
choco install make

# Ou télécharger GnuWin32
```

**Linux :**
```bash
# Ubuntu/Debian
sudo apt install make

# Fedora
sudo dnf install make

# Arch
sudo pacman -S make
```

**macOS :**
```bash
# Make est généralement préinstallé
# Sinon, installer Xcode Command Line Tools
xcode-select --install
```

### Commandes Make

| Commande | Description |
|----------|-------------|
| `make help` | Affiche toutes les commandes disponibles |
| `make setup` | Configure l'environnement |
| `make start` | Démarre tous les services |
| `make stop` | Arrête tous les services |
| `make restart` | Redémarre tous les services |
| `make logs` | Affiche les logs de tous les services |
| `make logs-backend` | Affiche les logs du backend |
| `make logs-frontend` | Affiche les logs du frontend |
| `make logs-db` | Affiche les logs de la base de données |
| `make status` | Affiche le statut des services |
| `make rebuild` | Reconstruit tous les services |
| `make clean` | Nettoie complètement le projet |
| `make dev-backend` | Démarre le backend en mode dev (sans Docker) |
| `make dev-frontend` | Démarre le frontend en mode dev (sans Docker) |
| `make db-shell` | Se connecte à la base de données |
| `make db-backup` | Sauvegarde la base de données |
| `make db-restore FILE=backup.sql` | Restaure la base de données |
| `make install` | Installe les dépendances |
| `make check` | Vérifie la configuration |

### Exemples Make (toutes plateformes)

```bash
# Voir toutes les commandes
make help

# Configuration initiale
make setup

# Démarrer le projet
make start

# Voir les logs
make logs

# Vérifier le statut
make status

# Arrêter le projet
make stop

# Sauvegarder la base de données
make db-backup

# Se connecter à la base de données
make db-shell
```

---

## 🔧 Tableau comparatif

| Action | Windows (PowerShell) | Linux/macOS (Bash) | Make (Universel) |
|--------|---------------------|-------------------|------------------|
| **Configuration** | `.\setup.ps1` | `./setup.sh` | `make setup` |
| **Démarrer** | `.\start.bat` | `./start.sh` | `make start` |
| **Arrêter** | `.\stop.bat` | `./stop.sh` | `make stop` |
| **Logs** | `.\logs.bat` | `./logs.sh` | `make logs` |
| **Reconstruire** | `.\rebuild.bat` | `./rebuild.sh` | `make rebuild` |
| **Nettoyer** | `.\clean.bat` | `./clean.sh` | `make clean` |

---

## 📊 Workflow recommandé

### Première utilisation

```bash
# 1. Configuration
make setup  # ou ./setup.sh ou .\setup.ps1

# 2. Modifier le .env avec vos vraies valeurs
# Windows: notepad .env
# Linux/macOS: nano .env

# 3. Vérifier la configuration
make check

# 4. Démarrer le projet
make start

# 5. Vérifier que tout fonctionne
make status
```

### Développement quotidien

```bash
# Démarrer
make start

# Voir les logs pendant le développement
make logs

# Arrêter à la fin
make stop
```

### En cas de problème

```bash
# Voir les logs détaillés
make logs

# Reconstruire complètement
make rebuild

# En dernier recours : nettoyage complet
make clean
make start
```

---

## 🐛 Dépannage

### Problème : Scripts non exécutables (Linux/macOS)

```bash
# Solution : Rendre tous les scripts exécutables
chmod +x *.sh
```

### Problème : Make non trouvé (Windows)

```powershell
# Solution 1 : Installer avec Chocolatey
choco install make

# Solution 2 : Utiliser les scripts .bat à la place
.\start.bat
```

### Problème : Docker non démarré

```bash
# Windows
# Démarrer Docker Desktop

# Linux
sudo systemctl start docker

# macOS
# Démarrer Docker Desktop
```

### Problème : Ports déjà utilisés

```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/macOS
sudo lsof -i :3000
sudo lsof -i :3001
kill -9 <PID>
```

### Problème : Permissions refusées (Linux)

```bash
# Ajouter l'utilisateur au groupe docker
sudo usermod -aG docker $USER

# Se déconnecter et reconnecter
# Ou redémarrer la session
newgrp docker
```

---

## 📚 Ressources

- **Documentation complète** : [README.md](./README.md)
- **Guide de démarrage** : [QUICKSTART.md](./QUICKSTART.md)
- **Sécurité** : [SECURITY.md](./SECURITY.md)
- **Checklist** : [CHECKLIST.md](./CHECKLIST.md)

---

## 💡 Astuce

Pour un workflow optimal, nous recommandons d'utiliser le **Makefile** car il fonctionne sur toutes les plateformes et offre plus de commandes :

```bash
make help
```

Cela affiche toutes les commandes disponibles avec leur description !
