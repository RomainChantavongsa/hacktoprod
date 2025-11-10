import { useProfil } from './profil.ts'
import './profil.scss'

function Profil() {
  const {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit
  } = useProfil()

  return (
    <div className="profil-page">
      <div className="page-header">
        <h1>Profil de l'entreprise</h1>
        <p className="subtitle">Gérez les informations de votre entreprise</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="profil-form">
        {/* Informations de l'entreprise */}
        <div className="form-section">
          <h2>Informations de l'entreprise</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom_entreprise">Nom d'entreprise</label>
              <input
                type="text"
                id="nom_entreprise"
                name="nom_entreprise"
                value={formData.nom_entreprise || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="siret">SIRET (TVA)</label>
              <input
                type="text"
                id="siret"
                name="siret"
                value={formData.siret || ''}
                onChange={handleChange}
                required
                pattern="[0-9]{14}"
                placeholder="12345678901234"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email_contact">Email de contact</label>
              <input
                type="email"
                id="email_contact"
                name="email_contact"
                value={formData.email_contact || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone || ''}
                onChange={handleChange}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="adresse_siege">Adresse du siège</label>
            <textarea
              id="adresse_siege"
              name="adresse_siege"
              value={formData.adresse_siege || ''}
              onChange={handleChange}
              rows="3"
              placeholder="Adresse complète de l'entreprise"
            />
          </div>

          <div className="form-group">
            <label htmlFor="complement_adresse">Complément d'adresse</label>
            <input
              type="text"
              id="complement_adresse"
              name="complement_adresse"
              value={formData.complement_adresse || ''}
              onChange={handleChange}
              placeholder="Bâtiment, étage, porte..."
            />
          </div>
        </div>

        {/* Informations complémentaires */}
        <div className="form-section">
          <h2>Informations complémentaires</h2>

          <div className="form-group">
            <label htmlFor="type_structure">Type de structure</label>
            <select
              id="type_structure"
              name="type_structure"
              value={formData.type_structure || ''}
              onChange={handleChange}
            >
              <option value="">Sélectionner un type</option>
              <option value="SARL">SARL</option>
              <option value="SAS">SAS</option>
              <option value="SA">SA</option>
              <option value="EURL">EURL</option>
              <option value="Auto-entrepreneur">Auto-entrepreneur</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ville">Ville</label>
              <input
                type="text"
                id="ville"
                name="ville"
                value={formData.ville || ''}
                onChange={handleChange}
                placeholder="Ville du siège"
              />
            </div>

            <div className="form-group">
              <label htmlFor="code_postal">Code postal</label>
              <input
                type="text"
                id="code_postal"
                name="code_postal"
                value={formData.code_postal || ''}
                onChange={handleChange}
                pattern="[0-9]{5}"
                placeholder="75000"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="secteur_activite">Secteur d'activité</label>
            <select
              id="secteur_activite"
              name="secteur_activite"
              value={formData.secteur_activite || ''}
              onChange={handleChange}
            >
              <option value="">Sélectionner un secteur</option>
              <option value="Industrie">Industrie</option>
              <option value="Commerce">Commerce</option>
              <option value="Services">Services</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Construction">Construction</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="taille_entreprise">Taille de l'entreprise</label>
            <select
              id="taille_entreprise"
              name="taille_entreprise"
              value={formData.taille_entreprise || ''}
              onChange={handleChange}
            >
              <option value="">Sélectionner une taille</option>
              <option value="TPE (1-9 salariés)">TPE (1-9 salariés)</option>
              <option value="PME (10-249 salariés)">PME (10-249 salariés)</option>
              <option value="ETI (250-4999 salariés)">ETI (250-4999 salariés)</option>
              <option value="GE (5000+ salariés)">GE (5000+ salariés)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="frequence_expeditions">Fréquence des expéditions</label>
            <select
              id="frequence_expeditions"
              name="frequence_expeditions"
              value={formData.frequence_expeditions || ''}
              onChange={handleChange}
            >
              <option value="">Sélectionner une fréquence</option>
              <option value="Quotidienne">Quotidienne</option>
              <option value="Hebdomadaire">Hebdomadaire</option>
              <option value="Mensuelle">Mensuelle</option>
              <option value="Occasionnelle">Occasionnelle</option>
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="digitalisation_active"
                checked={formData.digitalisation_active || false}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Digitalisation active
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profil