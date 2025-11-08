@echo off
REM Script pour reconstruire et redémarrer les services

echo ================================
echo Reconstruction et redemarrage du projet...
echo ================================
echo.

echo Arret des services...
docker-compose down

echo Reconstruction des images Docker...
docker-compose build --no-cache

echo Redemarrage des services...
docker-compose up -d

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Reconstruction terminee avec succes !
    echo.
    echo Acces aux services :
    echo   - Frontend: http://localhost:3000
    echo   - Backend:  http://localhost:3001
    echo   - Database: localhost:5432
) else (
    echo.
    echo Erreur lors de la reconstruction
    echo Consultez les logs: docker-compose logs
)
