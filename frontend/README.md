# Frontend HackToGone

Application React avec routing pour la gestion de transport et de fret.

## 🏗️ Structure du projet

```
frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   └── Footer/
│   │       ├── Footer.jsx
│   │       └── Footer.css
│   │
│   ├── pages/               # Pages de l'application
│   │   ├── home/
│   │   │   ├── home.jsx
│   │   │   └── home.css
│   │   ├── login/
│   │   │   ├── login.jsx
│   │   │   └── login.css
│   │   └── register/
│   │       ├── register.jsx
│   │       └── register.css
│   │
│   ├── App.jsx              # Composant principal avec routes
│   ├── App.css
│   ├── main.jsx             # Point d'entrée
│   └── index.css            # Styles globaux
│
├── index.html
├── package.json
└── vite.config.js
```

## 📋 Convention de structure des pages

Chaque page suit cette structure à **3 fichiers** :
- Un dossier portant le nom de la page (ex: `login/`)
- **Un fichier JSX** avec le même nom (ex: `login.jsx`) - Contient le composant React
- **Un fichier CSS** avec le même nom (ex: `login.css`) - Contient les styles
- **Un fichier TS** avec le même nom (ex: `login.ts`) - Contient la logique métier avec TypeScript

## 🚀 Système d'import automatique des pages

Les pages sont automatiquement importées depuis `src/pages/` grâce à `import.meta.glob` de Vite.

### Exemple pour ajouter une nouvelle page :

1. **Créer le dossier** : `src/pages/mapage/`

2. **Créer le fichier de logique TypeScript** : `src/pages/mapage/mapage.ts`
```typescript
// Types pour la page
export interface MaPageData {
  id: number
  title: string
}

export interface MaPageErrors {
  title?: string
  general?: string
}

export interface MaPageResult {
  success: boolean
  data?: MaPageData
  error?: string
}

// Logique avec typage fort
export const mapageLogic = {
  // Gestion des formulaires
  handleSubmit: async (data: MaPageData): Promise<MaPageResult> => {
    try {
      const response = await fetch('/api/mapage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const result: MaPageData = await response.json()
      return { success: true, data: result }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      }
    }
  },
  
  // Validation avec types
  validateForm: (data: Partial<MaPageData>): MaPageErrors => {
    const errors: MaPageErrors = {}
    if (!data.title) {
      errors.title = 'Le titre est requis'
    }
    return errors
  },
  
  // Récupération de données typées
  fetchData: async (): Promise<MaPageData[]> => {
    const response = await fetch('/api/mapage')
    return await response.json()
  }
}
```

3. **Créer le fichier JSX** : `src/pages/mapage/mapage.jsx`
```jsx
import { useState } from 'react'
import { mapageLogic } from './mapage.ts'
import './mapage.css'

function MaPage() {
  const [data, setData] = useState({})
  const [errors, setErrors] = useState({})
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation avec TypeScript
    const validationErrors = mapageLogic.validateForm(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    // Soumission typée
    const result = await mapageLogic.handleSubmit(data)
    if (result.success) {
      console.log('Succès!', result.data)
    } else {
      setErrors({ general: result.error })
    }
  }
  
  return (
    <div className="mapage">
      {/* Votre JSX */}
    </div>
  )
}

export default MaPage
```

4. **Créer le fichier CSS** : `src/pages/mapage/mapage.css`
```css
.mapage {
  /* Vos styles */
}
```

5. **Ajouter la route dans `src/routes.ts`** :
```typescript
export const routeConfig = [
  { path: '/', folder: 'home' },
  { path: '/login', folder: 'login' },
  { path: '/register', folder: 'register' },
  { path: '/mapage', folder: 'mapage' },  // ← Ajouter cette ligne
]
```

**C'est tout !** Le composant est automatiquement importé et la route est créée. ✨

### Comment ça marche ?

1. **`routes.ts`** utilise `import.meta.glob('/src/pages/**/*.jsx')` pour scanner tous les fichiers
2. La fonction `loadPage()` charge dynamiquement le bon composant avec `lazy()`
3. Les routes sont générées automatiquement à partir de `routeConfig`
4. **Pas besoin d'importer manuellement** chaque page dans `App.jsx` !

### Avantages

- ✅ **Moins de code** : Plus besoin d'importer chaque page
- ✅ **Lazy loading** : Les pages sont chargées uniquement quand nécessaire
- ✅ **Convention claire** : `src/pages/nompage/nompage.jsx` = route automatique
- ✅ **Évolutif** : Ajouter une page = créer le dossier + 1 ligne dans `routeConfig`

## 🎯 Séparation des responsabilités

- **`.jsx`** : Composant React, UI, état local (useState, useEffect)
- **`.css`** : Styles spécifiques à la page
- **`.ts`** : Logique métier avec TypeScript (types, validation, appels API, transformations)

## ✨ Avantages du TypeScript

- ✅ **Typage fort** : Détection d'erreurs à la compilation
- ✅ **Autocomplétion** : Meilleure expérience de développement
- ✅ **Documentation** : Les types servent de documentation
- ✅ **Refactoring** : Plus sûr et plus rapide
- ✅ **Interfaces claires** : Contrats explicites entre composants et logique

## 🚀 Démarrage

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build
```

## 🛠️ Technologies

- **React** 19.1.1 - Framework UI
- **React Router DOM** 7.9.5 - Routing
- **Vite** 7.1.7 - Build tool
- **TailwindCSS** 4.1.17 - Styles utilitaires

## 📄 Pages disponibles

- `/` - Page d'accueil
- `/login` - Page de connexion
- `/register` - Page d'inscription
