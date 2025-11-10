import React from 'react';
import { useOffresTerminees } from './terminees.ts';
import DataTable from '../../../components/DataTable';
import './terminees.scss';

const OffresTerminees = () => {
  const { offres, loading, error } = useOffresTerminees();

  const columns = [
    {
      key: 'id',
      label: 'ID',
      width: '80px',
    },
    {
      key: 'type_marchandise',
      label: 'Marchandise',
      width: '150px',
    },
    {
      key: 'route',
      label: 'Trajet',
      width: '250px',
      render: (offre) => (
        <div className="route-cell">
          <div className="route-origin">{offre.adresse_chargement}</div>
          <div className="route-arrow">→</div>
          <div className="route-destination">{offre.adresse_livraison}</div>
        </div>
      ),
    },
    {
      key: 'dates',
      label: 'Dates',
      width: '200px',
      render: (offre) => (
        <div className="dates-cell">
          <div>Chargement: {new Date(offre.date_chargement_prevue).toLocaleDateString('fr-FR')}</div>
          <div>Publication: {new Date(offre.date_publication).toLocaleDateString('fr-FR')}</div>
        </div>
      ),
    },
    {
      key: 'transporteur_attribue_id',
      label: 'Transporteur',
      width: '130px',
      render: (offre) => (
        <div className="transporteur-cell">
          {offre.transporteur_attribue_id ? (
            <span className="transporteur-id">#{offre.transporteur_attribue_id}</span>
          ) : (
            <span className="no-transporteur">Non attribué</span>
          )}
        </div>
      ),
    },
    {
      key: 'statut_offre',
      label: 'Statut',
      width: '120px',
      render: (offre) => (
        <span className={`statut-badge ${offre.statut_offre.toLowerCase()}`}>
          {offre.statut_offre === 'Completee' ? (
            <>✓ Complétée</>
          ) : (
            <>✗ Annulée</>
          )}
        </span>
      ),
    },
    {
      key: 'prix',
      label: 'Prix',
      width: '120px',
      render: (offre) => (
        <div className="prix-cell">
          {offre.prix_propose ? `${offre.prix_propose} €` : 'N/A'}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="terminees-page">
        <div className="page-header">
          <h1>Offres terminées</h1>
          <p className="subtitle">Historique de vos offres complétées et annulées</p>
        </div>
        <div className="loading">
          <p>Chargement des offres terminées...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="terminees-page">
        <div className="page-header">
          <h1>Offres terminées</h1>
          <p className="subtitle">Historique de vos offres complétées et annulées</p>
        </div>
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="terminees-page">
      <div className="page-header">
        <h1>Offres terminées</h1>
        <p className="subtitle">Historique de vos offres complétées et annulées</p>
      </div>

      {offres.length === 0 ? (
        <div className="empty-state">
          <p>Aucune offre terminée</p>
          <p className="empty-description">
            Les offres que vous avez complétées ou annulées apparaîtront ici.
          </p>
        </div>
      ) : (
        <DataTable
          data={offres}
          columns={columns}
          className="offres-terminees-table"
        />
      )}
    </div>
  );
};

export default OffresTerminees;
