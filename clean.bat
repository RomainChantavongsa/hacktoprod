@echo off
REM Script pour nettoyer complètement le projet

echo ================================
echo ATTENTION : Nettoyage complet
echo ================================
echo.
echo Ce script va supprimer TOUTES les donnees Docker !
echo Cela inclut :
echo   - Tous les conteneurs
echo   - Tous les volumes (base de donnees)
echo   - Toutes les images
echo.
set /p confirm="Etes-vous sur de vouloir continuer ? (tapez 'oui' pour confirmer): "

if not "%confirm%"=="oui" (
    echo Nettoyage annule.
    exit /b 0
)

echo.
echo Nettoyage en cours...

REM Arrêter et supprimer les conteneurs et volumes
docker-compose down -v

REM Supprimer les images
docker-compose down --rmi all

echo.
echo Nettoyage termine !
echo.
echo Pour redemarrer le projet : start.bat
