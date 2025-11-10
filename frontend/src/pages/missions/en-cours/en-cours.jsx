import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/apiService';
import Icon from '../../../components/Icon.jsx';
import './en-cours.scss';

function MissionsEnCours() {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getOffresFret();
      
      if (!response.success || !response.data) {
        setError(response.message || 'Erreur lors du chargement');
        return;
      }
      
      // Filtrer selon le type d'entreprise
      let filteredMissions;
      if (user.type_entreprise === 'transporteur') {
        filteredMissions = response.data.filter(offre => 
          offre.entreprise_transporteur_id === user.entreprise_id &&
          (offre.statut === 'Attribuee' || offre.statut === 'En_Cours')
        );
      } else {
        filteredMissions = response.data.filter(offre => 
          offre.entreprise_donneur_ordre_id === user.entreprise_id &&
          (offre.statut === 'Attribuee' || offre.statut === 'En_Cours')
        );
      }
      
      setMissions(filteredMissions);
    } catch (err) {
      console.error('Erreur lors du chargement des missions:', err);
      setError('Impossible de charger les missions en cours');
    } finally {
      setLoading(false);
    }
  };

  const handleMarquerEnCours = async (missionId) => {
    try {
      // TODO: Créer endpoint pour mettre à jour le statut
      // await apiService.updateOffreStatut(missionId, 'En_Cours');
      console.log('Marquer mission en cours:', missionId);
      loadMissions();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible de mettre à jour le statut');
    }
  };

  const handleMarquerComplete = async (missionId) => {
    if (!confirm('Confirmer que cette mission est complétée ?')) return;
    
    try {
      // TODO: Créer endpoint pour marquer comme complétée
      // await apiService.updateOffreStatut(missionId, 'Completee');
      console.log('Marquer mission complétée:', missionId);
      loadMissions();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Impossible de compléter la mission');
    }
  };

  const openMissionDetails = (mission) => {
    setSelectedMission(mission);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMission(null);
  };

  if (loading) {
    return (
      <div className="missions-encours-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des missions en cours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="missions-encours-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadMissions} className="btn-retry">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="missions-encours-page">
      <div className="page-header">
        <h1><Icon name="truck" size={28} /> Missions en cours</h1>
        <p className="page-description">
          {user.type_entreprise === 'transporteur' 
            ? 'Suivez vos missions acceptées et en cours d\'exécution'
            : 'Suivez vos offres attribuées et en cours de transport'}
        </p>
      </div>

      {missions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Icon name="package" size={48} /></div>
          <h3>Aucune mission en cours</h3>
          <p>Vous n'avez pas de mission acceptée actuellement.</p>
        </div>
      ) : (
        <div className="missions-grid">
          {missions.map((mission) => (
            <div key={mission.offre_fret_id} className="mission-card">
              <div className="mission-header">
                <div className="mission-ref">
                  <span className="ref-label">Réf:</span>
                  <span className="ref-value">{mission.reference_interne || 'N/A'}</span>
                </div>
                <span className={`mission-status status-${mission.statut.toLowerCase()}`}>
                  {mission.statut === 'Attribuee' ? 'Attribuée' : 'En cours'}
                </span>
              </div>

              <div className="mission-body">
                <div className="mission-info">
                  <div className="info-row">
                    <span className="info-icon"><Icon name="package" size={20} /></span>
                    <div className="info-content">
                      <span className="info-label">Marchandise</span>
                      <span className="info-value">{mission.type_marchandise || 'Non spécifié'}</span>
                    </div>
                  </div>

                  <div className="info-row">
                    <span className="info-icon"><Icon name="package" size={20} /></span>
                    <div className="info-content">
                      <span className="info-label">Poids</span>
                      <span className="info-value">{mission.poids_kg ? `${mission.poids_kg} kg` : 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="mission-route">
                  <div className="route-point departure">
                    <div className="route-icon"><Icon name="mapPin" size={24} /></div>
                    <div className="route-details">
                      <span className="route-label">Départ</span>
                      <span className="route-location">{mission.ville_chargement || 'Non spécifié'}</span>
                      <span className="route-address">{mission.adresse_chargement || ''}</span>
                      <span className="route-date">
                        <Icon name="clock" size={14} /> {mission.date_chargement_prevue 
                          ? new Date(mission.date_chargement_prevue).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })
                          : 'Non définie'}
                      </span>
                    </div>
                  </div>

                  <div className="route-line"></div>

                  <div className="route-point arrival">
                    <div className="route-icon"><Icon name="mapPin" size={24} /></div>
                    <div className="route-details">
                      <span className="route-label">Arrivée</span>
                      <span className="route-location">{mission.ville_livraison || 'Non spécifié'}</span>
                      <span className="route-address">{mission.adresse_livraison || ''}</span>
                    </div>
                  </div>
                </div>

                {mission.prix_propose && (
                  <div className="mission-price">
                    <span className="price-label">Prix:</span>
                    <span className="price-value">{mission.prix_propose} €</span>
                  </div>
                )}
              </div>

              <div className="mission-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => openMissionDetails(mission)}
                >
                  <Icon name="clipboard" size={16} /> Détails
                </button>
                
                {user.type_entreprise === 'transporteur' && (
                  <>
                    {mission.statut === 'Attribuee' && (
                      <button 
                        className="btn-primary"
                        onClick={() => handleMarquerEnCours(mission.offre_fret_id)}
                      >
                        <Icon name="truck" size={16} /> Démarrer transport
                      </button>
                    )}
                    {mission.statut === 'En_Cours' && (
                      <button 
                        className="btn-success"
                        onClick={() => handleMarquerComplete(mission.offre_fret_id)}
                      >
                        <Icon name="check" size={16} /> Marquer complétée
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détails */}
      {showModal && selectedMission && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails de la mission</h2>
              <button className="modal-close" onClick={closeModal}><Icon name="close" size={20} /></button>
            </div>
            
            <div className="modal-body">
              <div className="detail-section">
                <h3>Informations générales</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Référence:</span>
                    <span className="detail-value">{selectedMission.reference_interne || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type de marchandise:</span>
                    <span className="detail-value">{selectedMission.type_marchandise || 'Non spécifié'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Poids:</span>
                    <span className="detail-value">{selectedMission.poids_kg ? `${selectedMission.poids_kg} kg` : 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Volume:</span>
                    <span className="detail-value">{selectedMission.volume_m3 ? `${selectedMission.volume_m3} m³` : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Chargement</h3>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <span className="detail-label">Adresse:</span>
                    <span className="detail-value">{selectedMission.adresse_chargement || 'Non spécifiée'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ville:</span>
                    <span className="detail-value">{selectedMission.ville_chargement || 'Non spécifiée'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Code postal:</span>
                    <span className="detail-value">{selectedMission.code_postal_chargement || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date prévue:</span>
                    <span className="detail-value">
                      {selectedMission.date_chargement_prevue 
                        ? new Date(selectedMission.date_chargement_prevue).toLocaleDateString('fr-FR')
                        : 'Non définie'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Livraison</h3>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <span className="detail-label">Adresse:</span>
                    <span className="detail-value">{selectedMission.adresse_livraison || 'Non spécifiée'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ville:</span>
                    <span className="detail-value">{selectedMission.ville_livraison || 'Non spécifiée'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Code postal:</span>
                    <span className="detail-value">{selectedMission.code_postal_livraison || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {selectedMission.description && (
                <div className="detail-section">
                  <h3>Description / Instructions</h3>
                  <p className="detail-description">{selectedMission.description}</p>
                </div>
              )}

              {selectedMission.conditions_speciales && (
                <div className="detail-section">
                  <h3>Conditions spéciales</h3>
                  <p className="detail-description">{selectedMission.conditions_speciales}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MissionsEnCours;
