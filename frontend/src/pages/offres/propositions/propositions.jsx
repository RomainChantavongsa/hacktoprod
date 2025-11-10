import { usePropositions } from './propositions.ts'
import Icon from '../../../components/Icon.jsx'
import './propositions.scss'

function PropositionsRecues() {
  const { offresAvecPropositions, isLoading, error, accepterProposition } = usePropositions()

  return (
    <div className="propositions-page">
      <div className="page-header">
        <h1>Propositions Reçues</h1>
        <p className="subtitle">Examinez et acceptez les propositions des transporteurs</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isLoading ? (
        <div className="loading">Chargement des propositions...</div>
      ) : offresAvecPropositions.length === 0 ? (
        <div className="empty-state">
          <p>Aucune proposition reçue pour le moment</p>
        </div>
      ) : (
        <div className="offres-list">
          {offresAvecPropositions.map(({ offre, propositions }) => (
            <div key={offre.id} className="offre-card">
              <div className="offre-header">
                <div>
                  <h3>Offre #{offre.id} - {offre.type_marchandise}</h3>
                  <p className="offre-route">
                    {offre.ville_chargement} → {offre.ville_livraison}
                  </p>
                  <p className="offre-details">
                    {offre.poids_marchandise_kg} kg | {new Date(offre.date_chargement_prevue).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className="propositions-count">{propositions.length} proposition{propositions.length > 1 ? 's' : ''}</span>
              </div>

              <div className="propositions-list">
                {propositions.map((prop) => (
                  <div key={prop.id} className={`proposition-card ${prop.statut_proposition.toLowerCase()}`}>
                    <div className="proposition-header">
                      <span className="proposition-id">Proposition #{prop.id}</span>
                      <span className={`statut-badge ${prop.statut_proposition.toLowerCase()}`}>
                        {prop.statut_proposition === 'Soumise' ? <><Icon name="clock" size={14} /> En attente</> : 
                         prop.statut_proposition === 'Acceptee' ? <><Icon name="check" size={14} /> Acceptée</> : 
                         <><Icon name="close" size={14} /> Refusée</>}
                      </span>
                    </div>

                    <div className="proposition-body">
                      <div className="proposition-info">
                        <p><strong>Transporteur:</strong> Entreprise #{prop.entreprise_transporteur_id}</p>
                        <p><strong>Prix proposé:</strong> {prop.prix_propose}€</p>
                        {prop.message && (
                          <div className="proposition-message">
                            <strong>Message:</strong>
                            <p>{prop.message}</p>
                          </div>
                        )}
                      </div>

                      {prop.statut_proposition === 'Soumise' && (
                        <div className="proposition-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => accepterProposition(offre.id, prop.id)}
                            disabled={isLoading}
                          >
                            Accepter
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PropositionsRecues
