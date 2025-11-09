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
            <label htmlFor="capacite_max_tonnes">Capacité maximale (tonnes)</label>
            <input
              type="number"
              id="capacite_max_tonnes"
              name="capacite_max_tonnes"
              value={formData.capacite_max_tonnes ?? ''}
              onChange={handleChange}
              min="0"
              step="0.1"
              placeholder="Ex: 20.5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre_vehicules">Nombre de véhicules</label>
            <input
              type="number"
              id="nombre_vehicules"
              name="nombre_vehicules"
              value={formData.nombre_vehicules ?? ''}
              onChange={handleChange}
              min="0"
              placeholder="Ex: 5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rayon_action_km">Rayon d'action (km)</label>
            <input
              type="number"
              id="rayon_action_km"
              name="rayon_action_km"
              value={formData.rayon_action_km ?? ''}
              onChange={handleChange}
              min="0"
              placeholder="Ex: 500"
            />
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

          {/* Certifications et assurances */}
          <div className="form-section">
            <h3>Certifications et assurances</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licence_transport">Licence de transport</label>
                <input
                  type="text"
                  id="licence_transport"
                  name="licence_transport"
                  value={formData.licence_transport || ''}
                  onChange={handleChange}
                  placeholder="Numéro de licence"
                />
              </div>

              <div className="form-group">
                <label htmlFor="numero_assurance">Numéro d'assurance</label>
                <input
                  type="text"
                  id="numero_assurance"
                  name="numero_assurance"
                  value={formData.numero_assurance || ''}
                  onChange={handleChange}
                  placeholder="Numéro de police"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="assurance_marchandises">Assurance marchandises</label>
              <input
                type="text"
                id="assurance_marchandises"
                name="assurance_marchandises"
                value={formData.assurance_marchandises || ''}
                onChange={handleChange}
                placeholder="Nom de l'assurance"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date_expiration_assurance">Date d'expiration assurance</label>
              <input
                type="date"
                id="date_expiration_assurance"
                name="date_expiration_assurance"
                value={formData.date_expiration_assurance || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Spécialités transport */}
          <div className="form-section">
            <h3>Spécialités transport</h3>

            <div className="checkbox-grid">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="transport_frigorifique"
                  checked={formData.transport_frigorifique || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Transport frigorifique
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="transport_express"
                  checked={formData.transport_express || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Transport express
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="transport_volumineux"
                  checked={formData.transport_volumineux || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Transport volumineux
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="transport_dangereuses"
                  checked={formData.transport_dangereuses || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Matières dangereuses (ADR)
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="transport_international"
                  checked={formData.transport_international || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Transport international
              </label>
            </div>
          </div>

          {/* Équipements */}
          <div className="form-section">
            <h3>Équipements disponibles</h3>

            <div className="checkbox-grid">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="hayon_elevateur"
                  checked={formData.hayon_elevateur || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Hayon élévateur
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="gerbeur"
                  checked={formData.gerbeur || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Gerbeur
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="transpalette"
                  checked={formData.transpalette || false}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                Transpalette
              </label>
            </div>
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