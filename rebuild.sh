#!/bin/bash
# Script pour reconstruire et redémarrer les services

echo "🔄 Reconstruction et redémarrage du projet..."
echo ""

# Arrêter les services
echo "🛑 Arrêt des services..."
docker-compose down

# Reconstruire les images
echo "🔨 Reconstruction des images Docker..."
docker-compose build --no-cache

# Redémarrer les services
echo "🚀 Redémarrage des services..."
docker-compose up -d

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Reconstruction terminée avec succès !"
    echo ""
    echo "📍 Accès aux services :"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend:  http://localhost:3001"
    echo "  - Database: localhost:5432"
else
    echo ""
    echo "❌ Erreur lors de la reconstruction"
    echo "Consultez les logs: docker-compose logs"
fi
