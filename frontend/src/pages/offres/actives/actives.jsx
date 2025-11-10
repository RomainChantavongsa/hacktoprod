import { useOffresActives } from './actives.ts'
import DataTable from '../../../components/DataTable.jsx'
import './actives.scss'

function OffresActives() {
  const { offres, isLoading, error, annulerOffre } = useOffresActives()

  return (
    <div className="offres-actives-page">
      <div className="page-header">
        <h1>Mes Offres Actives</h1>
        <p className="subtitle">Offres publiées en attente de propositions</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {isLoading ? (
        <div className="loading">Chargement des offres...</div>
      ) : offres.length === 0 ? (
        <div className="empty-state">
          <p>Aucune offre active pour le moment</p>
          <a href="/offres/publier" className="btn btn-primary">Publier une offre</a>
        </div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <DataTable
            columns={[
              { key: 'id', header: 'ID', sortable: true, width: 80 },
              { key: 'type_marchandise', header: 'Marchandise', sortable: true },
              { key: 'ville_chargement', header: 'Départ', sortable: true },
              { key: 'ville_livraison', header: 'Arrivée', sortable: true },
              {
                key: 'date_chargement_prevue',
                header: 'Date',
                sortable: true,
                width: 120,
                render: (row) => new Date(row.date_chargement_prevue).toLocaleDateString('fr-FR')
              },
              {
                key: 'poids_marchandise_kg',
                header: 'Poids (kg)',
                sortable: true,
                width: 120,
                render: (row) => `${row.poids_marchandise_kg} kg`
              },
              {
                key: 'prix_propose',
                header: 'Prix (€)',
                sortable: true,
                width: 100,
                render: (row) => row.prix_propose ? `${row.prix_propose}€` : '-'
              },
              {
                key: 'actions',
                header: 'Actions',
                width: 250,
                render: (row) => (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={`/offres/propositions?offre=${row.id}`} className="btn btn-small btn-secondary">
                      Voir propositions
                    </a>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => annulerOffre(row.id)}
                    >
                      Annuler
                    </button>
                  </div>
                )
              }
            ]}
            data={offres}
            loading={isLoading}
            emptyMessage="Aucune offre active"
            defaultPageSize={10}
          />
        </div>
      )}
    </div>
  )
}

export default OffresActives
