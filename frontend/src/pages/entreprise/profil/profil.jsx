import { useAuth } from '../../../contexts/AuthContext'
// On réutilise les pages existantes spécifiques aux rôles
import TransporteurProfil from '../../transporteur/profil/profil.jsx'
import DonneurOrdreProfil from './DonneurOrdreProfil.jsx'

function ProfilEntreprise() {
  const { getUserType } = useAuth()
  const userType = getUserType()

  // Affiche la page adaptée selon le type d'entreprise
  if (userType === 'donneur_ordre' || userType === 'donneurOrdre' || userType === 'donneur') {
    return <DonneurOrdreProfil />
  }

  // Par défaut: transporteur
  return <TransporteurProfil />
}

export default ProfilEntreprise
