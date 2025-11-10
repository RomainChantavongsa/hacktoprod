import React from 'react';
import { useMesPropositions } from './mes-propositions.ts';
import Icon from '../../../components/Icon.jsx';
import './mes-propositions.scss';

const MesPropositions = () => {
  const { propositions, loading, error } = useMesPropositions();

  if (loading) {
    return (
      <div className="mes-propositions-page">
        <div className="page-header">
          <h1>Mes propositions</h1>
          <p className="subtitle">Suivez l'état de vos propositions soumises</p>
        </div>
        <div className="loading">
          <p>Chargement de vos propositions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mes-propositions-page">
        <div className="page-header">
          <h1>Mes propositions</h1>
          <p className="subtitle">Suivez l'état de vos propositions soumises</p>
        </div>
        <div className="alert alert-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mes-propositions-page">
      <div className="page-header">
        <h1>Mes propositions</h1>
        <p className="subtitle">Suivez l'état de vos propositions soumises</p>
      </div>

      {propositions.length === 0 ? (
        <div className="empty-state">
          <p>Aucune proposition soumise</p>
          <p className="empty-description">
            Parcourez les offres disponibles et soumettez vos premières propositions.
          </p>
        </div>
      ) : (
        <div className="propositions-grid">
          {propositions.map((prop) => (
            <PropositionCard key={prop.id} proposition={prop} />
          ))}
        </div>
      )}
    </div>
  );
};

const PropositionCard = ({ proposition }) => {
  const getStatutBadge = (statut) => {
    const badges = {
      Soumise: { label: <><Icon name="clock" size={14} /> En attente</>, className: 'soumise' },
      Acceptee: { label: <><Icon name="check" size={14} /> Acceptée</>, className: 'acceptee' },
      Refusee: { label: <><Icon name="close" size={14} /> Refusée</>, className: 'refusee' },
    };
    
    const badge = badges[statut] || badges.Soumise;
    return <span className={`statut-badge ${badge.className}`}>{badge.label}</span>;
  };

  return (
    <div className={`proposition-card ${proposition.statut_proposition.toLowerCase()}`}>
      <div className="card-header">
        <div className="offre-info">
          <h3>Offre #{proposition.offre.id}</h3>
          <p className="route">
            {proposition.offre.ville_chargement} → {proposition.offre.ville_livraison}
          </p>
        </div>
        {getStatutBadge(proposition.statut_proposition)}
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="label">Marchandise:</span>
          <span className="value">{proposition.offre.type_marchandise}</span>
        </div>
        
        <div className="info-row">
          <span className="label">Poids:</span>
          <span className="value">{proposition.offre.poids_marchandise_kg} kg</span>
        </div>

        <div className="info-row">
          <span className="label">Date de chargement:</span>
          <span className="value">
            {new Date(proposition.offre.date_chargement_prevue).toLocaleDateString('fr-FR')}
          </span>
        </div>

        <div className="info-row highlight">
          <span className="label">Votre prix proposé:</span>
          <span className="value prix">{proposition.prix_propose} €</span>
        </div>

        {proposition.message && (
          <div className="message-section">
            <span className="label">Votre message:</span>
            <p className="message">{proposition.message}</p>
          </div>
        )}

        <div className="dates-footer">
          <span className="date">
            Soumise le {new Date(proposition.created_at).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MesPropositions;
