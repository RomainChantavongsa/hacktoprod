import { useAuth } from '../../../contexts/AuthContext'
// Page Entrepôts pour le donneur d'ordre (localisée sous entreprise)
import DonneurEntrepots from './DonneurOrdreEntrepots.jsx'

function EntrepotsEntreprise() {
  const { getUserType } = useAuth()
  const userType = getUserType()

  if (userType === 'donneur_ordre' || userType === 'donneurOrdre' || userType === 'donneur') {
    return <DonneurEntrepots />
  }

  // Pour les transporteurs, on affiche une info simple (pas d'entrepôts)
  return (
    <div className="page">
      <div className="page-header">
        <h1>Entrepôts</h1>
        <p className="subtitle">Cette section est destinée aux donneurs d'ordre.</p>
      </div>
      <div className="empty-state">
        <p>Les transporteurs n'ont pas de gestion d'entrepôts dans l'application.</p>
      </div>
    </div>
  )
}

export default EntrepotsEntreprise
