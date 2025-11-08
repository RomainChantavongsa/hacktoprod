# Script d'installation - Configuration des variables d'environnement
# Exécutez ce script pour configurer votre environnement de développement

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Configuration de l'environnement" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si .env existe déjà
if (Test-Path ".env") {
    Write-Host "⚠️  Le fichier .env existe déjà !" -ForegroundColor Yellow
    $response = Read-Host "Voulez-vous le remplacer ? (o/n)"
    if ($response -ne "o") {
        Write-Host "Installation annulée." -ForegroundColor Red
        exit
    }
}

# Copier .env.example vers .env
Write-Host "📄 Création du fichier .env..." -ForegroundColor Green
Copy-Item ".env.example" ".env"

Write-Host "✅ Fichier .env créé avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "⚠️  IMPORTANT - Étapes suivantes :" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Ouvrez le fichier .env" -ForegroundColor White
Write-Host "2. Remplacez les valeurs par défaut par vos vraies valeurs" -ForegroundColor White
Write-Host "3. Ne commitez JAMAIS le fichier .env sur Git !" -ForegroundColor Red
Write-Host ""
Write-Host "Pour démarrer le projet :" -ForegroundColor Cyan
Write-Host "  docker-compose up -d" -ForegroundColor White
Write-Host ""
