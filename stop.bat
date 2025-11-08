@echo off
REM Script d'arrêt du projet

echo ================================
echo Arret du projet HackToGone3Contrees...
echo ================================
echo.

docker-compose down

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Services arretes avec succes !
) else (
    echo.
    echo Erreur lors de l'arret des services
)
