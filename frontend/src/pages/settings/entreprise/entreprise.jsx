import { useEntrepriseProfile } from './entreprise.ts'
import './entreprise.scss'
import Icon from '../../../components/Icon.jsx'

function EntrepriseProfile() {
  const { entreprise, loading, error, isEditing, toggleEdit } = useEntrepriseProfile()

  if (loading) {
    return (
      <div className="entreprise-profile">
        <div className="loading">Chargement du profil entreprise...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="entreprise-profile">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (!entreprise) {
    return (
      <div className="entreprise-profile">
        <div className="info-message">Aucune entreprise associée</div>
      </div>
    )
  }

  const isTransporteur = entreprise.type_entreprise === 'transporteur'

  return (
    <div className="entreprise-profile">
      <div className="entreprise-header">
        <div className="entreprise-header-content">
          <h1 className="entreprise-title">{entreprise.nom_entreprise}</h1>
          <div className="entreprise-badges">
            <span className={`badge badge-${entreprise.type_entreprise}`}>
              {entreprise.type_entreprise === 'transporteur' ? <><Icon name="truck" size={16} /> Transporteur</> : <><Icon name="package" size={16} /> Donneur d'ordre</>}
            </span>
            {entreprise.est_particulier && (
              <span className="badge badge-particulier"><Icon name="user" size={16} /> Particulier</span>
            )}
            {isTransporteur && entreprise.digitalisation_active && (
              <span className="badge badge-digital"><Icon name="laptop" size={16} /> Digital</span>
            )}
          </div>
        </div>
        <button className="btn-edit" onClick={toggleEdit}>
          {isEditing ? <><Icon name="close" size={16} /> Annuler</> : <><Icon name="edit" size={16} /> Modifier</>}
        </button>
      </div>

      {/* Informations générales */}
      <section className="profile-section">
        <h2 className="section-title"><Icon name="clipboard" size={20} /> Informations générales</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Structure juridique</span>
            <span className="info-value">{entreprise.type_structure || 'Non renseigné'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">SIRET</span>
            <span className="info-value">{entreprise.siret || 'Non renseigné'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">TVA Intracommunautaire</span>
            <span className="info-value">{entreprise.tva || 'Non renseigné'}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Registre du Commerce</span>
            <span className="info-value">{entreprise.registre_commerce || 'Non renseigné'}</span>
          </div>
        </div>
      </section>

      {/* Coordonnées */}
      <section className="profile-section">
        <h2 className="section-title"><Icon name="mapPin" size={20} /> Coordonnées</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Email de contact</span>
            <span className="info-value">{entreprise.email_contact}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Téléphone</span>
            <span className="info-value">{entreprise.telephone || 'Non renseigné'}</span>
          </div>
          <div className="info-item full-width">
            <span className="info-label">Adresse du siège</span>
            <span className="info-value">
              {entreprise.adresse_siege && (
                <>
                  {entreprise.adresse_siege}
                  {entreprise.complement_adresse && <><br />{entreprise.complement_adresse}</>}
                  <br />
                  {entreprise.code_postal} {entreprise.ville}
                  <br />
                  {entreprise.pays || 'France'}
                </>
              ) || 'Non renseigné'}
            </span>
          </div>
        </div>
      </section>

      {/* Section spécifique TRANSPORTEUR */}
      {isTransporteur && (
        <>
          {/* Flotte et capacités */}
          <section className="profile-section">
            <h2 className="section-title"><Icon name="truck" size={20} /> Flotte et capacités</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nombre de véhicules</span>
                <span className="info-value highlight">{entreprise.nombre_vehicules || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Capacité maximale</span>
                <span className="info-value highlight">{entreprise.capacite_max_tonnes || 0} tonnes</span>
              </div>
              <div className="info-item">
                <span className="info-label">Rayon d'action</span>
                <span className="info-value highlight">{entreprise.rayon_action_km || 0} km</span>
              </div>
              {entreprise.types_vehicules && entreprise.types_vehicules.length > 0 && (
                <div className="info-item full-width">
                  <span className="info-label">Types de véhicules</span>
                  <div className="tags-container">
                    {entreprise.types_vehicules.map((type, index) => (
                      <span key={index} className="tag tag-vehicle">{type}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Zones d'intervention */}
          {entreprise.zones_intervention && entreprise.zones_intervention.length > 0 && (
            <section className="profile-section">
              <h2 className="section-title"><Icon name="globe" size={20} /> Zones d'intervention</h2>
              <div className="tags-container">
                {entreprise.zones_intervention.map((zone, index) => (
                  <span key={index} className="tag tag-zone">{zone}</span>
                ))}
              </div>
            </section>
          )}

          {/* Certifications et assurances */}
          <section className="profile-section">
            <h2 className="section-title"><Icon name="shield" size={20} /> Certifications et assurances</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Licence de transport</span>
                <span className="info-value">{entreprise.licence_transport || 'Non renseigné'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Assurance marchandises</span>
                <span className="info-value">{entreprise.assurance_marchandises || 'Non renseigné'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Numéro de police</span>
                <span className="info-value">{entreprise.numero_assurance || 'Non renseigné'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date d'expiration</span>
                <span className="info-value">
                  {entreprise.date_expiration_assurance 
                    ? new Date(entreprise.date_expiration_assurance).toLocaleDateString('fr-FR')
                    : 'Non renseigné'}
                </span>
              </div>
              {entreprise.certifications && entreprise.certifications.length > 0 && (
                <div className="info-item full-width">
                  <span className="info-label">Certifications</span>
                  <div className="tags-container">
                    {entreprise.certifications.map((cert, index) => (
                      <span key={index} className="tag tag-certification"><Icon name="check" size={14} /> {cert}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Spécialités transport */}
          <section className="profile-section">
            <h2 className="section-title"><Icon name="star" size={20} /> Spécialités transport</h2>
            <div className="specialties-grid">
              <div className={`specialty-card ${entreprise.transport_frigorifique ? 'active' : ''}`}>
                <span className="specialty-icon"><Icon name="snowflake" size={24} /></span>
                <span className="specialty-name">Transport frigorifique</span>
              </div>
              <div className={`specialty-card ${entreprise.transport_express ? 'active' : ''}`}>
                <span className="specialty-icon"><Icon name="zap" size={24} /></span>
                <span className="specialty-name">Transport express</span>
              </div>
              <div className={`specialty-card ${entreprise.transport_volumineux ? 'active' : ''}`}>
                <span className="specialty-icon"><Icon name="package" size={24} /></span>
                <span className="specialty-name">Transport volumineux</span>
              </div>
              <div className={`specialty-card ${entreprise.transport_dangereuses ? 'active' : ''}`}>
                <span className="specialty-icon"><Icon name="alertTriangle" size={24} /></span>
                <span className="specialty-name">Matières dangereuses (ADR)</span>
              </div>
              <div className={`specialty-card ${entreprise.transport_international ? 'active' : ''}`}>
                <span className="specialty-icon"><Icon name="globe" size={24} /></span>
                <span className="specialty-name">Transport international</span>
              </div>
            </div>
          </section>

          {/* Équipements */}
          <section className="profile-section">
            <h2 className="section-title"><Icon name="tool" size={20} /> Équipements disponibles</h2>
            <div className="equipment-grid">
              <div className={`equipment-item ${entreprise.hayon_elevateur ? 'available' : 'unavailable'}`}>
                <span className="equipment-icon">{entreprise.hayon_elevateur ? <Icon name="checkCircle" size={20} /> : <Icon name="xCircle" size={20} />}</span>
                <span className="equipment-name">Hayon élévateur</span>
              </div>
              <div className={`equipment-item ${entreprise.gerbeur ? 'available' : 'unavailable'}`}>
                <span className="equipment-icon">{entreprise.gerbeur ? <Icon name="checkCircle" size={20} /> : <Icon name="xCircle" size={20} />}</span>
                <span className="equipment-name">Gerbeur</span>
              </div>
              <div className={`equipment-item ${entreprise.transpalette ? 'available' : 'unavailable'}`}>
                <span className="equipment-icon">{entreprise.transpalette ? <Icon name="checkCircle" size={20} /> : <Icon name="xCircle" size={20} />}</span>
                <span className="equipment-name">Transpalette</span>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Section spécifique DONNEUR D'ORDRE */}
      {!isTransporteur && (
        <section className="profile-section">
          <h2 className="section-title"><Icon name="package" size={20} /> Informations donneur d'ordre</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Type d'acteur</span>
              <span className="info-value">{entreprise.type_acteur || 'Non renseigné'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Fréquence de besoin</span>
              <span className="info-value">{entreprise.frequence_besoin || 'Non renseigné'}</span>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default EntrepriseProfile
