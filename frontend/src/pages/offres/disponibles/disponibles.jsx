import React, { useState } from 'react';
import { useOffresDisponibles } from './disponibles.ts';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../../components/DataTable';
import './disponibles.scss';

const OffresDisponibles = () => {
  const { offres, loading, error } = useOffresDisponibles();
  const navigate = useNavigate();
  const [selectedOffre, setSelectedOffre] = useState(null);

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
      key: 'poids',
      label: 'Poids',
      width: '100px',
      render: (offre) => `${offre.poids_marchandise_kg} kg`,
    },
    {
      key: 'route',
      label: 'Trajet',
      width: '300px',
      render: (offre) => (
        <div className="route-cell">
          <div className="route-origin">
            <strong>{offre.ville_chargement}</strong> ({offre.code_postal_chargement})
          </div>
          <div className="route-arrow">→</div>
          <div className="route-destination">
            <strong>{offre.ville_livraison}</strong> ({offre.code_postal_livraison})
          </div>
        </div>
      ),
    },
    {
      key: 'date_chargement_prevue',
      label: 'Date de chargement',
      width: '150px',
      render: (offre) => new Date(offre.date_chargement_prevue).toLocaleDateString('fr-FR'),
    },
    {
      key: 'prix_propose',
      label: 'Prix indicatif',
      width: '120px',
      render: (offre) => (
        <div className="prix-cell">
          {offre.prix_propose ? `${offre.prix_propose} €` : 'À négocier'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
      render: (offre) => (
        <div className="actions-cell">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setSelectedOffre(offre)}
          >
            Voir détails
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="disponibles-page">
        <div className="page-header">
          <h1>Offres disponibles</h1>
          <p className="subtitle">Parcourez les offres de transport disponibles</p>
        </div>
        <div className="loading">
          <p>Chargement des offres...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="disponibles-page">
        <div className="page-header">
          <h1>Offres disponibles</h1>
          <p className="subtitle">Parcourez les offres de transport disponibles</p>
        </div>
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="disponibles-page">
      <div className="page-header">
        <h1>Offres disponibles</h1>
        <p className="subtitle">Parcourez les offres de transport disponibles</p>
      </div>

      {offres.length === 0 ? (
        <div className="empty-state">
          <p>Aucune offre disponible</p>
          <p className="empty-description">
            Les nouvelles offres de transport apparaîtront ici dès qu'elles seront publiées.
          </p>
        </div>
      ) : (
        <DataTable
          data={offres}
          columns={columns}
          className="offres-disponibles-table"
        />
      )}

      {selectedOffre && (
        <OffreDetailsModal
          offre={selectedOffre}
          onClose={() => setSelectedOffre(null)}
        />
      )}
    </div>
  );
};

// Modal pour voir les détails et soumettre une proposition
const OffreDetailsModal = ({ offre, onClose }) => {
  const navigate = useNavigate();

  const handleSoumettreProposition = () => {
    navigate(`/offres/${offre.id}/proposer`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Détails de l'offre #{offre.id}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="detail-section">
            <h3>Marchandise</h3>
            <p><strong>Type:</strong> {offre.type_marchandise}</p>
            <p><strong>Poids:</strong> {offre.poids_marchandise_kg} kg</p>
            {offre.volume_m3 && <p><strong>Volume:</strong> {offre.volume_m3} m³</p>}
            {offre.type_vehicule_souhaite && (
              <p><strong>Véhicule souhaité:</strong> {offre.type_vehicule_souhaite}</p>
            )}
          </div>

          <div className="detail-section">
            <h3>Chargement</h3>
            <p><strong>Adresse:</strong> {offre.adresse_chargement}</p>
            <p><strong>Ville:</strong> {offre.ville_chargement} {offre.code_postal_chargement}</p>
            <p><strong>Date:</strong> {new Date(offre.date_chargement_prevue).toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="detail-section">
            <h3>Livraison</h3>
            <p><strong>Adresse:</strong> {offre.adresse_livraison}</p>
            <p><strong>Ville:</strong> {offre.ville_livraison} {offre.code_postal_livraison}</p>
          </div>

          {offre.conditions_speciales && (
            <div className="detail-section">
              <h3>Conditions spéciales</h3>
              <p>{offre.conditions_speciales}</p>
            </div>
          )}

          {offre.prix_propose && (
            <div className="detail-section">
              <h3>Prix indicatif</h3>
              <p className="prix-indicatif">{offre.prix_propose} €</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>
          <button className="btn btn-primary" onClick={handleSoumettreProposition}>
            Soumettre une proposition
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffresDisponibles;
