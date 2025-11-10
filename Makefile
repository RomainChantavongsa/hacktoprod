# ============================================================================
# Makefile - HackToGone3Contrees
# ============================================================================
# Projet de gestion de transport et logistique
# 
# Pre-requis:
#   - Docker et Docker Compose installes
#   - Node.js et Yarn installes
#   - Fichier .env configure avec les variables d'environnement
#
# Usage:
#   make        - Affiche l'aide
#   make build  - Construit les images Docker
#   make start  - Demarre l'application complete
#   make stop   - Arrete l'application
# ============================================================================

.PHONY: help install build start stop restart clean delete-db logs status

# Commande par defaut - Affiche l'aide
.DEFAULT_GOAL := help

# ============================================================================
# COMMANDES PRINCIPALES
# ============================================================================

help: ## Affiche ce message d'aide
	@echo "============================================================================"
	@echo "  HackToGone3Contrees - Commandes Disponibles"
	@echo "============================================================================"
	@echo ""
	@echo "  Installation & Configuration:"
	@echo "    make install     - Installe toutes les dependances (backend + frontend)"
	@echo ""
	@echo "  Gestion Docker:"
	@echo "    make build       - Construit les images Docker"
	@echo "    make start       - Demarre l'application (avec installation des packages)"
	@echo "    make stop        - Arrete tous les services"
	@echo "    make restart     - Redémarre tous les services"
	@echo ""
	@echo "  Base de donnees:"
	@echo "    make delete-db   - Supprime completement la base de donnees et volumes"
	@echo ""
	@echo "  Maintenance:"
	@echo "    make logs        - Affiche les logs en temps reel"
	@echo "    make status      - Affiche l'etat des services"
	@echo "    make clean       - Nettoie les ressources Docker (images, volumes)"
	@echo ""
	@echo "============================================================================"
	@echo ""

install: ## Installe toutes les dependances npm/yarn
	@echo "============================================================================"
	@echo "  Installation des dependances..."
	@echo "============================================================================"
	@echo ""
	@echo "[1/2] Installation backend (npm)..."
	@cd backend && npm install
	@echo ""
	@echo "[2/2] Installation frontend (yarn)..."
	@cd frontend && yarn install
	@echo ""
	@echo "✓ Installation terminee avec succes!"
	@echo ""

build: ## Construit les images Docker
	@echo "============================================================================"
	@echo "  Construction des images Docker..."
	@echo "============================================================================"
	@echo ""
	@docker-compose build --no-cache
	@echo ""
	@echo "✓ Build termine avec succes!"
	@echo ""

start: install ## Demarre l'application complete
	@echo "============================================================================"
	@echo "  Demarrage de l'application..."
	@echo "============================================================================"
	@echo ""
	@docker-compose up -d
	@echo ""
	@echo "✓ Application demarree avec succes!"
	@echo ""
	@echo "  Services disponibles:"
	@echo "    Frontend:  http://$${HOST:-localhost}:$${FRONTEND_PORT:-5173}"
	@echo "    Backend:   http://$${HOST:-localhost}:$${BACKEND_PORT:-3001}"
	@echo "    Adminer:   http://$${HOST:-localhost}:8080"
	@echo "    Database:  $${HOST:-localhost}:5432"
	@echo ""
	@echo "  Commandes utiles:"
	@echo "    make logs    - Voir les logs en temps reel"
	@echo "    make status  - Verifier l'etat des services"
	@echo "    make stop    - Arreter l'application"
	@echo ""

stop: ## Arrete tous les services
	@echo "============================================================================"
	@echo "  Arret de l'application..."
	@echo "============================================================================"
	@echo ""
	@docker-compose down
	@echo ""
	@echo "✓ Application arretee avec succes!"
	@echo ""

restart: stop start ## Redémarre l'application

# ============================================================================
# GESTION BASE DE DONNEES
# ============================================================================

delete-db: ## Supprime completement la base de donnees et ses volumes
	@echo "============================================================================"
	@echo "  Suppression de la base de donnees..."
	@echo "============================================================================"
	@echo ""
	@echo "⚠️  ATTENTION: Cette action supprimera toutes les donnees!"
	@echo ""
	@docker-compose down -v
	@echo ""
	@echo "✓ Base de donnees supprimee avec succes!"
	@echo ""

# ============================================================================
# MAINTENANCE & MONITORING
# ============================================================================

logs: ## Affiche les logs en temps reel (Ctrl+C pour quitter)
	@echo "Affichage des logs (Ctrl+C pour quitter)..."
	@echo ""
	@docker-compose logs -f

status: ## Affiche l'etat des services Docker
	@echo "============================================================================"
	@echo "  Etat des services"
	@echo "============================================================================"
	@echo ""
	@docker-compose ps
	@echo ""

clean: ## Nettoie les ressources Docker (images, conteneurs, volumes)
	@echo "============================================================================"
	@echo "  Nettoyage des ressources Docker..."
	@echo "============================================================================"
	@echo ""
	@echo "⚠️  ATTENTION: Cette action supprimera toutes les images et volumes!"
	@echo ""
	@docker-compose down -v --rmi all --remove-orphans
	@echo ""
	@echo "✓ Nettoyage termine avec succes!"
	@echo ""
