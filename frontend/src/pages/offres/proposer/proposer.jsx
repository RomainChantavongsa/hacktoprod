import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSoumettreProposition } from './proposer.ts';
import './proposer.scss';

const SoumettreProposition = () => {
  const { offreId } = useParams();
  const navigate = useNavigate();
  const {
    offre,
    loading,
    submitting,
    error,
    success,
    formData,
    handleChange,
    handleSubmit,
  } = useSoumettreProposition(offreId);

  if (loading) {
    return (
      <div className="proposer-page">
        <div className="loading">
          <p>Chargement de l'offre...</p>
        </div>
      </div>
    );
  }

  if (!offre) {
    return (
      <div className="proposer-page">
        <div className="alert alert-error">
          <p>Offre introuvable</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/offres/disponibles')}>
          Retour aux offres
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="proposer-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Proposition envoyée avec succès !</h2>
          <p>Le donneur d'ordre a reçu votre proposition et vous contactera si elle est acceptée.</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/offres/disponibles')}>
              Voir d'autres offres
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/offres/mes-propositions')}>
              Mes propositions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="proposer-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/offres/disponibles')}>
          ← Retour
        </button>
        <h1>Soumettre une proposition</h1>
        <p className="subtitle">Offre #{offre.id}</p>
      </div>

      <div className="content-grid">
        {/* Détails de l'offre */}
        <div className="offre-details-card">
          <h2>Détails de l'offre</h2>
          
          <div className="detail-group">
            <h3>Marchandise</h3>
            <p><strong>Type:</strong> {offre.type_marchandise}</p>
            <p><strong>Poids:</strong> {offre.poids_marchandise_kg} kg</p>
            {offre.volume_m3 && <p><strong>Volume:</strong> {offre.volume_m3} m³</p>}
            {offre.type_vehicule_souhaite && (
              <p><strong>Véhicule souhaité:</strong> {offre.type_vehicule_souhaite}</p>
            )}
          </div>

          <div className="detail-group">
            <h3>Trajet</h3>
            <div className="route-display">
              <div className="location">
                <div className="location-label">Chargement</div>
                <div className="location-city">{offre.ville_chargement}</div>
                <div className="location-address">{offre.adresse_chargement}</div>
                <div className="location-date">
                  {new Date(offre.date_chargement_prevue).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div className="route-arrow">→</div>
              <div className="location">
                <div className="location-label">Livraison</div>
                <div className="location-city">{offre.ville_livraison}</div>
                <div className="location-address">{offre.adresse_livraison}</div>
              </div>
            </div>
          </div>

          {offre.conditions_speciales && (
            <div className="detail-group">
              <h3>Conditions spéciales</h3>
              <p className="conditions">{offre.conditions_speciales}</p>
            </div>
          )}

          {offre.prix_propose && (
            <div className="detail-group">
              <h3>Prix indicatif du donneur d'ordre</h3>
              <p className="prix-indicatif">{offre.prix_propose} €</p>
            </div>
          )}
        </div>

        {/* Formulaire de proposition */}
        <div className="proposition-form-card">
          <h2>Votre proposition</h2>

          {error && (
            <div className="alert alert-error">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group required">
              <label htmlFor="prix_propose">Votre prix (€)</label>
              <input
                type="number"
                id="prix_propose"
                name="prix_propose"
                value={formData.prix_propose}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="Ex: 1500.00"
                required
              />
              <small>Proposez un prix compétitif pour cette mission</small>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message (optionnel)</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Ajoutez des informations sur votre disponibilité, vos capacités, ou toute information pertinente..."
              />
              <small>Maximum 500 caractères</small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/offres/disponibles')}
                disabled={submitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Envoi en cours...' : 'Soumettre la proposition'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SoumettreProposition;
