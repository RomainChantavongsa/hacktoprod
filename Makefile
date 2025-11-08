# Makefile multi-plateforme pour HackToGone3Contrees
# Fonctionne sur Linux, macOS et Windows (avec make installé)

.PHONY: help setup start stop restart logs clean rebuild dev backend frontend db-shell

# Couleurs pour l'affichage (fonctionne sur Linux/macOS)
BLUE=\033[0;34m
GREEN=\033[0;32m
RED=\033[0;31m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Affiche cette aide
	@echo "$(BLUE)========================================$(NC)"
	@echo "$(BLUE)HackToGone3Contrees - Commandes disponibles$(NC)"
	@echo "$(BLUE)========================================$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

setup: ## Configure l'environnement (copie .env.example vers .env)
	@echo "$(BLUE)Configuration de l'environnement...$(NC)"
	@if [ -f .env ]; then \
		echo "$(YELLOW)Le fichier .env existe déjà !$(NC)"; \
		read -p "Voulez-vous le remplacer ? (o/n): " confirm; \
		if [ "$$confirm" = "o" ]; then \
			cp .env.example .env; \
			echo "$(GREEN)Fichier .env créé avec succès !$(NC)"; \
		else \
			echo "$(RED)Opération annulée.$(NC)"; \
		fi \
	else \
		cp .env.example .env; \
		echo "$(GREEN)Fichier .env créé avec succès !$(NC)"; \
	fi
	@echo ""
	@echo "$(YELLOW)N'oubliez pas de modifier le fichier .env avec vos vraies valeurs !$(NC)"

start: ## Démarre tous les services Docker
	@echo "$(BLUE)Démarrage des services...$(NC)"
	@docker-compose up -d
	@echo ""
	@echo "$(GREEN)Services démarrés !$(NC)"
	@echo "  - Frontend: http://localhost:3000"
	@echo "  - Backend:  http://localhost:3001"
	@echo "  - Database: localhost:5432"

stop: ## Arrête tous les services Docker
	@echo "$(BLUE)Arrêt des services...$(NC)"
	@docker-compose down
	@echo "$(GREEN)Services arrêtés !$(NC)"

restart: stop start ## Redémarre tous les services

logs: ## Affiche les logs de tous les services (Ctrl+C pour quitter)
	@echo "$(BLUE)Affichage des logs...$(NC)"
	@docker-compose logs -f

logs-backend: ## Affiche les logs du backend uniquement
	@docker-compose logs -f backend

logs-frontend: ## Affiche les logs du frontend uniquement
	@docker-compose logs -f frontend

logs-db: ## Affiche les logs de la base de données
	@docker-compose logs -f db

status: ## Affiche le statut des services
	@echo "$(BLUE)Statut des services :$(NC)"
	@docker-compose ps

rebuild: ## Reconstruit et redémarre tous les services
	@echo "$(BLUE)Reconstruction des services...$(NC)"
	@docker-compose down
	@docker-compose build --no-cache
	@docker-compose up -d
	@echo "$(GREEN)Reconstruction terminée !$(NC)"

clean: ## Nettoie tout (⚠️ supprime les données !)
	@echo "$(RED)ATTENTION : Cette commande va supprimer toutes les données !$(NC)"
	@read -p "Êtes-vous sûr ? (tapez 'oui' pour confirmer): " confirm; \
	if [ "$$confirm" = "oui" ]; then \
		docker-compose down -v --rmi all; \
		echo "$(GREEN)Nettoyage terminé !$(NC)"; \
	else \
		echo "$(YELLOW)Opération annulée.$(NC)"; \
	fi

dev-backend: ## Démarre le backend en mode développement (sans Docker)
	@echo "$(BLUE)Démarrage du backend en mode développement...$(NC)"
	@cd backend && npm install && npm run dev

dev-frontend: ## Démarre le frontend en mode développement (sans Docker)
	@echo "$(BLUE)Démarrage du frontend en mode développement...$(NC)"
	@cd frontend && npm install && npm run dev

db-shell: ## Se connecte à la base de données PostgreSQL
	@echo "$(BLUE)Connexion à la base de données...$(NC)"
	@docker exec -it my_postgres_db psql -U myuser -d mydatabase

db-backup: ## Sauvegarde la base de données
	@echo "$(BLUE)Sauvegarde de la base de données...$(NC)"
	@mkdir -p backups
	@docker exec my_postgres_db pg_dump -U myuser mydatabase > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Sauvegarde créée dans le dossier backups/$(NC)"

db-restore: ## Restaure la base de données (spécifier FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)Erreur : Spécifiez le fichier avec FILE=backup.sql$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)Restauration de la base de données...$(NC)"
	@docker exec -i my_postgres_db psql -U myuser mydatabase < $(FILE)
	@echo "$(GREEN)Restauration terminée !$(NC)"

install: ## Installe les dépendances (backend + frontend)
	@echo "$(BLUE)Installation des dépendances...$(NC)"
	@cd backend && npm install
	@cd frontend && npm install
	@echo "$(GREEN)Installation terminée !$(NC)"

test: ## Lance les tests (si configurés)
	@echo "$(BLUE)Lancement des tests...$(NC)"
	@cd backend && npm test
	@cd frontend && npm test

check: ## Vérifie la configuration
	@echo "$(BLUE)Vérification de la configuration...$(NC)"
	@echo -n "Docker: "
	@docker --version > /dev/null 2>&1 && echo "$(GREEN)✓$(NC)" || echo "$(RED)✗$(NC)"
	@echo -n "Docker Compose: "
	@docker-compose --version > /dev/null 2>&1 && echo "$(GREEN)✓$(NC)" || echo "$(RED)✗$(NC)"
	@echo -n "Node.js: "
	@node --version > /dev/null 2>&1 && echo "$(GREEN)✓$(NC)" || echo "$(RED)✗$(NC)"
	@echo -n "Fichier .env: "
	@[ -f .env ] && echo "$(GREEN)✓$(NC)" || echo "$(RED)✗ (exécutez 'make setup')$(NC)"

# Commande par défaut
.DEFAULT_GOAL := help
