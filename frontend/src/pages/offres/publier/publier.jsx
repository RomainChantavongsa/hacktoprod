import { usePublierOffre } from './publier.ts'
import './publier.scss'

function PublierOffre() {
  const {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit,
  } = usePublierOffre()

  return (
    <div className="publier-offre-page">
      <div className="page-header">
        <h1>Publier une Offre de Transport</h1>
        <p className="subtitle">Créez une nouvelle offre pour trouver un transporteur</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="offre-form">
        <div className="form-section">
          <h2>Marchandise</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type_marchandise">Type de marchandise *</label>
              <input
                type="text"
                id="type_marchandise"
                name="type_marchandise"
                value={formData.type_marchandise || ''}
                onChange={handleChange}
                required
                placeholder="Ex: Palettes, Colis, Matériaux..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="poids_marchandise_kg">Poids (kg) *</label>
              <input
                type="number"
                id="poids_marchandise_kg"
                name="poids_marchandise_kg"
                value={formData.poids_marchandise_kg || ''}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="1000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="volume_m3">Volume (m³)</label>
              <input
                type="number"
                id="volume_m3"
                name="volume_m3"
                value={formData.volume_m3 || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Chargement</h2>

          <div className="form-group">
            <label htmlFor="adresse_chargement">Adresse de chargement *</label>
            <input
              type="text"
              id="adresse_chargement"
              name="adresse_chargement"
              value={formData.adresse_chargement || ''}
              onChange={handleChange}
              required
              placeholder="123 Rue de la Logistique"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ville_chargement">Ville *</label>
              <input
                type="text"
                id="ville_chargement"
                name="ville_chargement"
                value={formData.ville_chargement || ''}
                onChange={handleChange}
                required
                placeholder="Paris"
              />
            </div>

            <div className="form-group">
              <label htmlFor="code_postal_chargement">Code postal *</label>
              <input
                type="text"
                id="code_postal_chargement"
                name="code_postal_chargement"
                value={formData.code_postal_chargement || ''}
                onChange={handleChange}
                required
                pattern="[0-9]{5}"
                placeholder="75000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date_chargement_prevue">Date de chargement prévue *</label>
            <input
              type="date"
              id="date_chargement_prevue"
              name="date_chargement_prevue"
              value={formData.date_chargement_prevue || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Livraison</h2>

          <div className="form-group">
            <label htmlFor="adresse_livraison">Adresse de livraison *</label>
            <input
              type="text"
              id="adresse_livraison"
              name="adresse_livraison"
              value={formData.adresse_livraison || ''}
              onChange={handleChange}
              required
              placeholder="456 Avenue du Commerce"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ville_livraison">Ville *</label>
              <input
                type="text"
                id="ville_livraison"
                name="ville_livraison"
                value={formData.ville_livraison || ''}
                onChange={handleChange}
                required
                placeholder="Lyon"
              />
            </div>

            <div className="form-group">
              <label htmlFor="code_postal_livraison">Code postal *</label>
              <input
                type="text"
                id="code_postal_livraison"
                name="code_postal_livraison"
                value={formData.code_postal_livraison || ''}
                onChange={handleChange}
                required
                pattern="[0-9]{5}"
                placeholder="69000"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Détails complémentaires</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type_vehicule_souhaite">Type de véhicule souhaité</label>
              <select
                id="type_vehicule_souhaite"
                name="type_vehicule_souhaite"
                value={formData.type_vehicule_souhaite || ''}
                onChange={handleChange}
              >
                <option value="">Sélectionner un type</option>
                <option value="Fourgon">Fourgon</option>
                <option value="Camion">Camion</option>
                <option value="Semi-remorque">Semi-remorque</option>
                <option value="Frigorifique">Frigorifique</option>
                <option value="Benne">Benne</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prix_propose">Prix proposé (€)</label>
              <input
                type="number"
                id="prix_propose"
                name="prix_propose"
                value={formData.prix_propose || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="500"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="conditions_speciales">Conditions spéciales</label>
            <textarea
              id="conditions_speciales"
              name="conditions_speciales"
              value={formData.conditions_speciales || ''}
              onChange={handleChange}
              rows={4}
              placeholder="Précisez toute condition particulière (horaires, équipements spéciaux, etc.)"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Publication...' : 'Publier l\'offre'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PublierOffre
