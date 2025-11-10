import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import apiService from '../../../services/apiService';
import Icon from '../../../components/Icon.jsx';
import './terminees.scss';

function MissionsTerminees() {
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterStatut, setFilterStatut] = useState('all'); // all, Completee, Annulee

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
          (offre.statut === 'Completee' || offre.statut === 'Annulee')
        );
      } else {
        filteredMissions = response.data.filter(offre => 
          offre.entreprise_donneur_ordre_id === user.entreprise_id &&
          (offre.statut === 'Completee' || offre.statut === 'Annulee')
        );
      }
      
      setMissions(filteredMissions);
    } catch (err) {
      console.error('Erreur lors du chargement des missions:', err);
      setError('Impossible de charger les missions terminées');
    } finally {
      setLoading(false);
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

  const getFilteredMissions = () => {
    if (filterStatut === 'all') return missions;
    return missions.filter(m => m.statut === filterStatut);
  };

  const filteredMissions = getFilteredMissions();
  const stats = {
    total: missions.length,
    completees: missions.filter(m => m.statut === 'Completee').length,
    annulees: missions.filter(m => m.statut === 'Annulee').length
  };

  if (loading) {
    return (
      <div className="missions-terminees-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des missions terminées...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="missions-terminees-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadMissions} className="btn-retry">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="missions-terminees-page">
      <div className="page-header">
        <h1><Icon name="check" size={28} /> Missions terminées</h1>
        <p className="page-description">
          Historique de vos missions complétées et annulées
        </p>
      </div>

      {/* Statistiques */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon"><Icon name="barChart" size={24} /></div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <div className="stat-card completees">
          <div className="stat-icon"><Icon name="check" size={24} /></div>
          <div className="stat-content">
            <span className="stat-value">{stats.completees}</span>
            <span className="stat-label">Complétées</span>
          </div>
        </div>
        <div className="stat-card annulees">
          <div className="stat-icon"><Icon name="close" size={24} /></div>
          <div className="stat-content">
            <span className="stat-value">{stats.annulees}</span>
            <span className="stat-label">Annulées</span>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters-container">
        <button 
          className={`filter-btn ${filterStatut === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatut('all')}
        >
          Toutes
        </button>
        <button 
          className={`filter-btn ${filterStatut === 'Completee' ? 'active' : ''}`}
          onClick={() => setFilterStatut('Completee')}
        >
          Complétées
        </button>
        <button 
          className={`filter-btn ${filterStatut === 'Annulee' ? 'active' : ''}`}
          onClick={() => setFilterStatut('Annulee')}
        >
          Annulées
        </button>
      </div>

      {filteredMissions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Icon name="clipboard" size={48} /></div>
          <h3>Aucune mission {filterStatut !== 'all' ? (filterStatut === 'Completee' ? 'complétée' : 'annulée') : 'terminée'}</h3>
          <p>Vous n'avez pas encore de mission dans cette catégorie.</p>
        </div>
      ) : (
        <div className="missions-list">
          {filteredMissions.map((mission) => (
            <div key={mission.offre_fret_id} className={`mission-item ${mission.statut.toLowerCase()}`}>
              <div className="mission-main">
                <div className="mission-header-info">
                  <div className="mission-ref">
                    <span className="ref-label">Réf:</span>
                    <span className="ref-value">{mission.reference_interne || 'N/A'}</span>
                  </div>
                  <span className={`mission-badge badge-${mission.statut.toLowerCase()}`}>
                    {mission.statut === 'Completee' ? <><Icon name="check" size={14} /> Complétée</> : <><Icon name="close" size={14} /> Annulée</>}
                  </span>
                </div>

                <div className="mission-details">
                  <div className="detail-col">
                    <span className="detail-icon"><Icon name="package" size={18} /></span>
                    <div className="detail-info">
                      <span className="detail-label">Marchandise</span>
                      <span className="detail-value">{mission.type_marchandise || 'Non spécifié'}</span>
                    </div>
                  </div>

                  <div className="detail-col">
                    <span className="detail-icon"><Icon name="mapPin" size={18} /></span>
                    <div className="detail-info">
                      <span className="detail-label">Trajet</span>
                      <span className="detail-value">
                        {mission.ville_chargement || 'N/A'} → {mission.ville_livraison || 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="detail-col">
                    <span className="detail-icon"><Icon name="clock" size={18} /></span>
                    <div className="detail-info">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">
                        {mission.date_chargement_prevue 
                          ? new Date(mission.date_chargement_prevue).toLocaleDateString('fr-FR')
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {mission.prix_propose && (
                    <div className="detail-col">
                      <span className="detail-icon"><Icon name="creditCard" size={18} /></span>
                      <div className="detail-info">
                        <span className="detail-label">Prix</span>
                        <span className="detail-value">{mission.prix_propose} €</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mission-actions">
                <button 
                  className="btn-details"
                  onClick={() => openMissionDetails(mission)}
                >
                  <Icon name="clipboard" size={16} /> Voir détails
                </button>
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
              <div>
                <h2>Détails de la mission</h2>
                <span className={`modal-badge badge-${selectedMission.statut.toLowerCase()}`}>
                  {selectedMission.statut === 'Completee' ? <><Icon name="check" size={14} /> Complétée</> : <><Icon name="close" size={14} /> Annulée</>}
                </span>
              </div>
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

              {selectedMission.prix_propose && (
                <div className="detail-section">
                  <h3>Informations financières</h3>
                  <div className="price-box">
                    <span className="price-label">Prix total:</span>
                    <span className="price-value">{selectedMission.prix_propose} €</span>
                  </div>
                </div>
              )}

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

export default MissionsTerminees;
