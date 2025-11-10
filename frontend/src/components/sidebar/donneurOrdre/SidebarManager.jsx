import { useLocation } from 'react-router-dom'
import SideBar1 from './sideBar1/sideBar1.jsx'
import SideBar2 from './sideBar2/sideBar2.jsx'
import SideBar3 from './sideBar3/sideBar3.jsx'

function SidebarManager() {
  const location = useLocation()
  
  // Détermine quelle sidebar afficher selon le chemin actuel
  const getSidebar = () => {
    const path = location.pathname

    // Section Offres (Mes offres de transport)
    if (path.startsWith('/offres')) {
      return <SideBar1 />
    }

    // Section Entreprise (Mon Entreprise)
    if (path.startsWith('/entreprise') || path.startsWith('/donneurOrdre')) {
      return <SideBar2 />
    }

    // Section Paramètres
    if (path.startsWith('/parametres')) {
      return <SideBar3 />
    }

    // Pas de sidebar pour les autres pages (login, register, home, etc.)
    return null
  }
  
  return getSidebar()
}

export default SidebarManager
