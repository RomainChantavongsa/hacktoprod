#!/bin/bash
# Script pour afficher les logs des services

echo "📊 Affichage des logs..."
echo "Appuyez sur Ctrl+C pour quitter"
echo ""

# Si un argument est fourni, afficher les logs de ce service
if [ -n "$1" ]; then
    docker-compose logs -f "$1"
else
    docker-compose logs -f
fi
