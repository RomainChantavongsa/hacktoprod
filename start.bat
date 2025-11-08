@echo off
REM Script de démarrage du projet avec Docker Compose

echo ================================
echo Demarrage du projet HackToGone3Contrees...
echo ================================
echo.

REM Vérifier si .env existe
if not exist ".env" (
    echo Erreur : Le fichier .env n'existe pas !
    echo Executez d'abord: setup.bat
    exit /b 1
)

REM Démarrer les services
echo Demarrage des conteneurs Docker...
docker-compose up -d

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Services demarres avec succes !
    echo.
    echo Acces aux services :
    echo   - Frontend: http://localhost:3000
    echo   - Backend:  http://localhost:3001
    echo   - Database: localhost:5432
    echo.
    echo Pour voir les logs: docker-compose logs -f
    echo Pour arreter:       docker-compose down
) else (
    echo.
    echo Erreur lors du demarrage des services
    echo Consultez les logs: docker-compose logs
)
