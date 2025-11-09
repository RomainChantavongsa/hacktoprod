import { lazy } from 'react'

// Import automatique de toutes les pages
// Vite scanne src/pages/**/*.jsx et crée un objet avec tous les chemins
const pageModules = import.meta.glob<{ default: React.ComponentType<any> }>('/src/pages/**/*.jsx')

// Configuration des routes
// Format : { path: '/chemin', folder: 'nomDossier' }
export const routeConfig = [
  { path: '/', folder: 'home' },
  { path: '/login', folder: 'login' },
  { path: '/register', folder: 'register' },
]

// Fonction pour charger dynamiquement un composant de page
export const loadPage = (folderName: string) => {
  const modulePath = `/src/pages/${folderName}/${folderName}.jsx`
  
  if (pageModules[modulePath]) {
    return lazy(pageModules[modulePath] as () => Promise<{ default: React.ComponentType<any> }>)
  }
  
  console.error(`Page non trouvée: ${modulePath}`)
  return null
}

// Générer automatiquement toutes les routes
export const routes = routeConfig.map(route => ({
  path: route.path,
  Component: loadPage(route.folder)
}))
