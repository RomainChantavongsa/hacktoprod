#!/bin/bash
# Script d'installation - Configuration des variables d'environnement
# Exécutez ce script pour configurer votre environnement de développement

echo "========================================"
echo "Configuration de l'environnement"
echo "========================================"
echo ""

# Vérifier si .env existe déjà
if [ -f ".env" ]; then
    echo "⚠️  Le fichier .env existe déjà !"
    read -p "Voulez-vous le remplacer ? (o/n): " response
    if [ "$response" != "o" ]; then
        echo "Installation annulée."
        exit 0
    fi
fi

# Copier .env.example vers .env
echo "📄 Création du fichier .env..."
cp .env.example .env

echo "✅ Fichier .env créé avec succès !"
echo ""
echo "========================================"
echo "⚠️  IMPORTANT - Étapes suivantes :"
echo "========================================"
echo "1. Ouvrez le fichier .env"
echo "2. Remplacez les valeurs par défaut par vos vraies valeurs"
echo "3. Ne commitez JAMAIS le fichier .env sur Git !"
echo ""
echo "Pour démarrer le projet :"
echo "  docker-compose up -d"
echo ""
