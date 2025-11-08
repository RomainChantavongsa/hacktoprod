#!/bin/bash
# Script de démarrage du projet avec Docker Compose

echo "🚀 Démarrage du projet HackToGone3Contrees..."
echo ""

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "❌ Le fichier .env n'existe pas !"
    echo "Exécutez d'abord: ./setup.sh"
    exit 1
fi

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé !"
    echo "Installez Docker depuis: https://docs.docker.com/get-docker/"
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé !"
    echo "Installez Docker Compose depuis: https://docs.docker.com/compose/install/"
    exit 1
fi

# Démarrer les services
echo "📦 Démarrage des conteneurs Docker..."
docker-compose up -d

# Vérifier le statut
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Services démarrés avec succès !"
    echo ""
    echo "📍 Accès aux services :"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend:  http://localhost:3001"
    echo "  - Database: localhost:5432"
    echo ""
    echo "📊 Pour voir les logs: docker-compose logs -f"
    echo "🛑 Pour arrêter:       docker-compose down"
else
    echo ""
    echo "❌ Erreur lors du démarrage des services"
    echo "Consultez les logs: docker-compose logs"
fi
