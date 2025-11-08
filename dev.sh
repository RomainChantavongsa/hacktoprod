#!/bin/bash
# Script pour développement local (sans Docker)

echo "🔧 Mode développement local"
echo ""

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "❌ Le fichier .env n'existe pas !"
    echo "Exécutez d'abord: ./setup.sh"
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé !"
    echo "Installez Node.js depuis: https://nodejs.org/"
    exit 1
fi

# Menu de sélection
echo "Que voulez-vous démarrer ?"
echo "1) Backend uniquement"
echo "2) Frontend uniquement"
echo "3) Backend + Frontend"
echo ""
read -p "Votre choix (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Démarrage du backend..."
        cd backend
        if [ ! -d "node_modules" ]; then
            echo "📦 Installation des dépendances..."
            npm install
        fi
        npm run dev
        ;;
    2)
        echo ""
        echo "🚀 Démarrage du frontend..."
        cd frontend
        if [ ! -d "node_modules" ]; then
            echo "📦 Installation des dépendances..."
            npm install
        fi
        npm run dev
        ;;
    3)
        echo ""
        echo "🚀 Démarrage du backend et frontend..."
        
        # Backend en arrière-plan
        cd backend
        if [ ! -d "node_modules" ]; then
            echo "📦 Installation des dépendances backend..."
            npm install
        fi
        npm run dev &
        BACKEND_PID=$!
        
        cd ..
        
        # Frontend en premier plan
        cd frontend
        if [ ! -d "node_modules" ]; then
            echo "📦 Installation des dépendances frontend..."
            npm install
        fi
        npm run dev
        
        # Arrêter le backend à la fin
        kill $BACKEND_PID
        ;;
    *)
        echo "❌ Choix invalide"
        exit 1
        ;;
esac
