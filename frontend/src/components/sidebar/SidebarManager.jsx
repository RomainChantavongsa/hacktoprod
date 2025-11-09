import { useAuth } from '../../contexts/AuthContext.jsx'
import TransporteurSidebarManager from './transporteur/SidebarManager.jsx'
import DonneurOrdreSidebarManager from './donneurOrdre/SidebarManager.jsx'

function SidebarManager() {
  const { getUserType } = useAuth()
  const userType = getUserType()
  
  // Afficher la sidebar selon le type d'utilisateur
  if (userType === 'donneurOrdre' || userType === 'donneur_ordre') {
    return <DonneurOrdreSidebarManager />
  }
  
  // Par défaut, afficher la sidebar transporteur
  return <TransporteurSidebarManager />
}

export default SidebarManager
