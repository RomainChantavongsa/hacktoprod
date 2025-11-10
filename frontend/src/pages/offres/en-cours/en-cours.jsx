import React from 'react';
import { useOffresEnCours } from './en-cours.ts';
import DataTable from '../../../components/DataTable';
import './en-cours.scss';

const OffresEnCours = () => {
  const { offres, loading, error } = useOffresEnCours();

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
      label: 'Date de chargement',
      width: '150px',
      render: (offre) => (
        <div className="dates-cell">
          {new Date(offre.date_chargement_prevue).toLocaleDateString('fr-FR')}
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
          {offre.statut_offre === 'Attribuee' ? 'Attribuée' : 'En cours'}
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
      <div className="en-cours-page">
        <div className="page-header">
          <h1>Offres en cours</h1>
          <p className="subtitle">Suivez l'avancement de vos offres attribuées et en cours</p>
        </div>
        <div className="loading">
          <p>Chargement des offres en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="en-cours-page">
        <div className="page-header">
          <h1>Offres en cours</h1>
          <p className="subtitle">Suivez l'avancement de vos offres attribuées et en cours</p>
        </div>
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="en-cours-page">
      <div className="page-header">
        <h1>Offres en cours</h1>
        <p className="subtitle">Suivez l'avancement de vos offres attribuées et en cours</p>
      </div>

      {offres.length === 0 ? (
        <div className="empty-state">
          <p>Aucune offre en cours</p>
          <p className="empty-description">
            Les offres que vous avez attribuées à un transporteur apparaîtront ici.
          </p>
        </div>
      ) : (
        <DataTable
          data={offres}
          columns={columns}
          className="offres-en-cours-table"
        />
      )}
    </div>
  );
};

export default OffresEnCours;
