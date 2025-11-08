# Guide de Sécurité - Variables d'Environnement

## 🔐 Génération de Secrets Sécurisés

### JWT Secret

Pour générer une clé JWT sécurisée, utilisez l'une de ces méthodes :

**PowerShell :**
```powershell
# Générer une clé aléatoire de 64 caractères
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})
```

**Node.js :**
```javascript
// Dans un terminal Node.js
require('crypto').randomBytes(64).toString('hex')
```

**En ligne :**
- [RandomKeygen](https://randomkeygen.com/)
- Utilisez la section "CodeIgniter Encryption Keys"

### Mots de passe de base de données

**PowerShell :**
```powershell
# Générer un mot de passe sécurisé de 32 caractères
Add-Type -AssemblyName System.Web
[System.Web.Security.Membership]::GeneratePassword(32, 10)
```

## 🛡️ Bonnes Pratiques

### ✅ À FAIRE :
- Utilisez des clés différentes pour chaque environnement (dev, staging, production)
- Changez tous les secrets par défaut avant de déployer
- Utilisez des clés d'au moins 32 caractères pour JWT_SECRET
- Activez l'authentification à deux facteurs (2FA) pour vos comptes AWS, Twilio, etc.
- Utilisez Docker Secrets ou un gestionnaire de secrets en production
- Faites une rotation régulière de vos secrets (tous les 90 jours)

### ❌ À NE PAS FAIRE :
- ❌ Ne commitez JAMAIS le fichier .env sur Git
- ❌ N'envoyez pas vos secrets par email ou chat
- ❌ Ne partagez pas vos secrets dans des captures d'écran
- ❌ N'utilisez pas les mêmes secrets pour dev et production
- ❌ Ne hardcodez pas les secrets dans le code source

## 🔍 Vérification de sécurité

Avant de commiter, vérifiez toujours :

```powershell
# Vérifier que .env est bien dans .gitignore
git check-ignore .env

# Résultat attendu : .env (si le fichier est ignoré)
```

## 📝 Checklist de déploiement

- [ ] Tous les secrets par défaut ont été changés
- [ ] Le fichier .env n'est pas versionné
- [ ] Les clés JWT sont suffisamment longues (>32 caractères)
- [ ] Les mots de passe de base de données sont forts
- [ ] Les clés AWS ont les permissions minimales nécessaires
- [ ] Les secrets Twilio sont sécurisés
- [ ] La variable NODE_ENV est configurée correctement

## 🆘 En cas de fuite de secrets

Si vous avez accidentellement commité des secrets :

1. **Changez IMMÉDIATEMENT tous les secrets compromis**
2. Supprimez le fichier de l'historique Git :
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Forcez le push (⚠️ Attention, coordonnez avec votre équipe) :
   ```bash
   git push origin --force --all
   ```
4. Informez votre équipe de changer leurs secrets

## 📚 Ressources

- [OWASP Cheat Sheet - Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [12 Factor App - Config](https://12factor.net/config)
- [Docker Secrets](https://docs.docker.com/engine/swarm/secrets/)
