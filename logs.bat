@echo off
REM Script pour afficher les logs des services

echo ================================
echo Affichage des logs...
echo Appuyez sur Ctrl+C pour quitter
echo ================================
echo.

if "%1"=="" (
    docker-compose logs -f
) else (
    docker-compose logs -f %1
)
