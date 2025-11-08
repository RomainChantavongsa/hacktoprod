#!/bin/bash
# Script d'arrêt du projet

echo "🛑 Arrêt du projet HackToGone3Contrees..."
echo ""

# Arrêter les services
docker-compose down

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Services arrêtés avec succès !"
else
    echo ""
    echo "❌ Erreur lors de l'arrêt des services"
fi
