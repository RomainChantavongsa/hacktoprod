import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'
import './commandes.scss'

function Commandes() {
  const { user } = useAuth()
  const [offres, setOffres] = useState([])
  const [filteredOffres, setFilteredOffres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filters, setFilters] = useState({
    ville: '',
    typeMarchandise: '',
    poidsMin: '',
    poidsMax: '',
    dateDebut: '',
    dateFin: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // Charger les offres publiées depuis l'API
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        setLoading(true)
        const response = await apiService.getOffresPubliees()
        if (response.success && response.data) {
          setOffres(response.data)
          setFilteredOffres(response.data)
        } else {
          setError('Erreur lors du chargement des offres')
        }
      } catch (err) {
        console.error('Erreur lors du chargement des offres:', err)
        setError('Erreur lors du chargement des offres')
      } finally {
        setLoading(false)
      }
    }

    fetchOffres()
  }, [])

  // Filtrage des offres
  useEffect(() => {
    let filtered = [...offres]

    if (filters.ville) {
      filtered = filtered.filter(offre =>
        offre.ville_chargement.toLowerCase().includes(filters.ville.toLowerCase()) ||
        offre.ville_livraison.toLowerCase().includes(filters.ville.toLowerCase())
      )
    }

    if (filters.typeMarchandise) {
      filtered = filtered.filter(offre =>
        offre.type_marchandise.toLowerCase().includes(filters.typeMarchandise.toLowerCase())
      )
    }

    if (filters.poidsMin) {
      filtered = filtered.filter(offre => offre.poids_marchandise_kg >= parseInt(filters.poidsMin))
    }

    if (filters.poidsMax) {
      filtered = filtered.filter(offre => offre.poids_marchandise_kg <= parseInt(filters.poidsMax))
    }

    if (filters.dateDebut) {
      filtered = filtered.filter(offre => offre.date_chargement_prevue >= filters.dateDebut)
    }

    if (filters.dateFin) {
      filtered = filtered.filter(offre => offre.date_chargement_prevue <= filters.dateFin)
    }

    setFilteredOffres(filtered)
  }, [offres, filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      ville: '',
      typeMarchandise: '',
      poidsMin: '',
      poidsMax: '',
      dateDebut: '',
      dateFin: ''
    })
  }

  const handlePostuler = async (offreId) => {
    try {
      // Pour l'instant, on simule une postulation
      // Plus tard, on appellera l'API pour attribuer le transporteur
      alert(`Postulation à l'offre ${offreId} envoyée !`)
    } catch (err) {
      console.error('Erreur lors de la postulation:', err)
      alert('Erreur lors de la postulation')
    }
  }

  if (loading) {
    return (
      <div className="commandes-page">
        <div className="loading">Chargement des offres...</div>
      </div>
    )
  }

  return (
    <div className="commandes-page">
      <div className="page-header">
        <h1>Commandes disponibles</h1>
        <p className="subtitle">Découvrez les offres de transport qui correspondent à vos critères</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="actions-bar">
        <button
          className="btn btn-secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <h3>Filtres intelligents</h3>

          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="ville">Ville (chargement ou livraison)</label>
              <input
                type="text"
                id="ville"
                name="ville"
                value={filters.ville}
                onChange={handleFilterChange}
                placeholder="Ex: Paris, Lyon..."
              />
            </div>

            <div className="filter-group">
              <label htmlFor="typeMarchandise">Type de marchandise</label>
              <input
                type="text"
                id="typeMarchandise"
                name="typeMarchandise"
                value={filters.typeMarchandise}
                onChange={handleFilterChange}
                placeholder="Ex: Électronique, Alimentaire..."
              />
            </div>

            <div className="filter-group">
              <label htmlFor="poidsMin">Poids minimum (kg)</label>
              <input
                type="number"
                id="poidsMin"
                name="poidsMin"
                value={filters.poidsMin}
                onChange={handleFilterChange}
                min="0"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="poidsMax">Poids maximum (kg)</label>
              <input
                type="number"
                id="poidsMax"
                name="poidsMax"
                value={filters.poidsMax}
                onChange={handleFilterChange}
                min="0"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="dateDebut">Date de chargement (à partir du)</label>
              <input
                type="date"
                id="dateDebut"
                name="dateDebut"
                value={filters.dateDebut}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="dateFin">Date de chargement (jusqu'au)</label>
              <input
                type="date"
                id="dateFin"
                name="dateFin"
                value={filters.dateFin}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-outline" onClick={clearFilters}>
              Effacer les filtres
            </button>
          </div>
        </div>
      )}

      <div className="offres-count">
        {filteredOffres.length} offre{filteredOffres.length > 1 ? 's' : ''} trouvée{filteredOffres.length > 1 ? 's' : ''}
      </div>

      <div className="offres-list">
        {filteredOffres.map(offre => (
          <div key={offre.id} className="offre-card">
            <div className="offre-header">
              <div className="offre-title">
                <h3>Offre #{offre.id}</h3>
                <span className="offre-client">Client #{offre.donneur_ordre_id}</span>
              </div>
              <div className="offre-price">
                <span className="price">{offre.prix_propose}€</span>
              </div>
            </div>

            <div className="offre-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="label">Marchandise:</span>
                  <span className="value">{offre.type_marchandise}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Poids:</span>
                  <span className="value">{offre.poids_marchandise_kg} kg</span>
                </div>
                <div className="detail-item">
                  <span className="label">Volume:</span>
                  <span className="value">{offre.volume_m3} m³</span>
                </div>
              </div>

              <div className="locations">
                <div className="location">
                  <div className="location-type">Chargement</div>
                  <div className="location-address">
                    {offre.adresse_chargement}<br />
                    {offre.code_postal_chargement} {offre.ville_chargement}
                  </div>
                  <div className="location-date">
                    📅 {new Date(offre.date_chargement_prevue).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <div className="location-arrow">→</div>

                <div className="location">
                  <div className="location-type">Livraison</div>
                  <div className="location-address">
                    {offre.adresse_livraison}<br />
                    {offre.code_postal_livraison} {offre.ville_livraison}
                  </div>
                </div>
              </div>

              {offre.conditions_speciales && (
                <div className="special-conditions">
                  <span className="label">Conditions spéciales:</span>
                  <span className="value">{offre.conditions_speciales}</span>
                </div>
              )}

              <div className="offre-footer">
                <div className="vehicule-type">
                  Véhicule souhaité: {offre.type_vehicule_souhaite}
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handlePostuler(offre.id)}
                >
                  Postuler
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredOffres.length === 0 && offres.length === 0 && !loading && (
          <div className="no-offres">
            <div className="empty-icon">📦</div>
            <h3>Aucune commande disponible</h3>
            <p>Il n'y a actuellement aucune offre de transport publiée.</p>
            <p className="empty-subtitle">Revenez plus tard pour découvrir de nouvelles opportunités !</p>
          </div>
        )}

        {filteredOffres.length === 0 && offres.length > 0 && (
          <div className="no-offres">
            <div className="empty-icon">🔍</div>
            <h3>Aucune offre trouvée</h3>
            <p>Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Commandes