@echo off
REM Script d'installation - Configuration des variables d'environnement
REM Execute ce script pour configurer votre environnement de developpement

echo ========================================
echo Configuration de l'environnement
echo ========================================
echo.

REM Verifier si .env existe deja
if exist ".env" (
    echo [AVERTISSEMENT] Le fichier .env existe deja !
    set /p response="Voulez-vous le remplacer ? (o/n): "
    if /i not "%response%"=="o" (
        echo Installation annulee.
        pause
        exit /b
    )
)

REM Copier .env.example vers .env
echo [INFO] Creation du fichier .env...
copy ".env.example" ".env" >nul
echo [OK] Fichier .env cree avec succes !
echo.

echo ========================================
echo [IMPORTANT] Etapes suivantes :
echo ========================================
echo 1. Ouvrez le fichier .env
echo 2. Remplacez les valeurs par defaut par vos vraies valeurs
echo 3. Ne commitez JAMAIS le fichier .env sur Git !
echo.
echo Pour demarrer le projet :
echo   docker-compose up -d
echo.

pause
