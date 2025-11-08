#!/bin/bash
# Script pour nettoyer complètement le projet (⚠️ supprime les données)

echo "⚠️  ATTENTION : Ce script va supprimer TOUTES les données Docker !"
echo "Cela inclut :"
echo "  - Tous les conteneurs"
echo "  - Tous les volumes (base de données)"
echo "  - Toutes les images"
echo ""
read -p "Êtes-vous sûr de vouloir continuer ? (tapez 'oui' pour confirmer): " confirm

if [ "$confirm" != "oui" ]; then
    echo "Nettoyage annulé."
    exit 0
fi

echo ""
echo "🧹 Nettoyage en cours..."

# Arrêter et supprimer les conteneurs et volumes
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

echo ""
echo "✅ Nettoyage terminé !"
echo ""
echo "Pour redémarrer le projet :"
echo "  ./start.sh"
