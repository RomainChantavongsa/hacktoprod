import { lazy } from 'react'

// Import automatique de toutes les pages
// Vite scanne src/pages/**/*.jsx et crée un objet avec tous les chemins
const pageModules = import.meta.glob<{ default: React.ComponentType<any> }>('/src/pages/**/*.jsx')

// Configuration des routes
// Format : { path: '/chemin', folder: 'nomDossier', nested: true pour sous-routes }
export const routeConfig = [
  { path: '/', folder: 'home' },
  { path: '/login', folder: 'login' },
  { path: '/register', folder: 'register' },
  { path: '/debug', folder: 'debug' }, // Page de démo du Debug Panel Tracy-like
  { path: '/settings', folder: 'settings' },
  // Routes imbriquées - Paramètres
  { path: '/parametres', folder: 'parametres/index' },
  { path: '/parametres/compte', folder: 'parametres/compte' },
  { path: '/parametres/notifications', folder: 'parametres/notifications' },
  { path: '/parametres/securite', folder: 'parametres/securite' },
  // Routes pour le transporteur
  { path: '/entreprise/profil', folder: 'transporteur/profil' },
  { path: '/entreprise/vehicules', folder: 'transporteur/vehicules' },
  { path: '/entreprise/remorques', folder: 'transporteur/remorques' },
  { path: '/entreprise/conducteurs', folder: 'transporteur/conducteurs' },
]

// Fonction pour charger dynamiquement un composant de page
export const loadPage = (folderName: string) => {
  // Support pour les chemins imbriqués (ex: 'parametres/notifications')
  const folderParts = folderName.split('/')
  const fileName = folderParts[folderParts.length - 1]
  const modulePath = `/src/pages/${folderName}/${fileName}.jsx`
  
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
