import { useAnnuaire } from './annuaire.ts'
import { useRef, useEffect } from 'react'
import './annuaire.scss'

function Annuaire() {
  const formRef = useRef(null)

  const {
    annuaire,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    editingEntry,
    createForm,
    setCreateForm,
    editForm,
    setEditForm,
    handleCreateSubmit,
    handleEditSubmit,
    handleDeleteEntry,
    formatTelephone
  } = useAnnuaire()

  useEffect(() => {
    if (showCreateModal && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [showCreateModal])

  if (loading) {
    return (
      <div className="annuaire-page">
        <div className="loading">Chargement de l'annuaire...</div>
      </div>
    )
  }

  return (
    <div className="annuaire-page">
      {/* En-tête de la page */}
      <div className="page-header">
        <h1>📇 Annuaire de l'entreprise</h1>
        <p className="subtitle">
          Consultez et gérez les coordonnées de tous les membres de votre entreprise
        </p>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}


      {/* Section principale des contacts */}
      <div className="contacts-section">
        <div className="section-header">
          <h2>Vos contacts</h2>
          <button
            type="button"
            className="btn btn-primary btn-add"
            onClick={() => setShowCreateModal(true)}
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">Ajouter un contact</span>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, email, téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Effacer la recherche"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Liste des contacts */}
        {annuaire && annuaire.length > 0 ? (
          <div className="contacts-grid">
            {annuaire.map((contact) => (
              <div key={contact.id} className="contact-card">
                <div className="contact-header">
                  <div className="contact-identity">
                    <div className="contact-avatar">
                      {contact.prenom?.charAt(0)}{contact.nom?.charAt(0)}
                    </div>
                    <div className="contact-name-section">
                      <h3 className="contact-name">{contact.prenom} {contact.nom}</h3>
                      {contact.fonction && (
                        <span className="contact-fonction">{contact.fonction}</span>
                      )}
                      {contact.service && (
                        <span className="badge badge-service">{contact.service}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="contact-details">
                  {contact.email && (
                    <div className="detail-row">
                      <span className="detail-icon">📧</span>
                      <a href={`mailto:${contact.email}`} className="detail-value email-link">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  
                  {contact.telephone_professionnel && (
                    <div className="detail-row">
                      <span className="detail-icon">📞</span>
                      <div className="phone-info">
                        <span className="phone-type">Professionnel</span>
                        <a href={`tel:${contact.telephone_professionnel}`} className="detail-value phone-link">
                          {formatTelephone(contact.telephone_professionnel)}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.telephone_mobile && (
                    <div className="detail-row">
                      <span className="detail-icon">📱</span>
                      <div className="phone-info">
                        <span className="phone-type">Mobile</span>
                        <a href={`tel:${contact.telephone_mobile}`} className="detail-value phone-link">
                          {formatTelephone(contact.telephone_mobile)}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.telephone_fixe && (
                    <div className="detail-row">
                      <span className="detail-icon">☎️</span>
                      <div className="phone-info">
                        <span className="phone-type">Fixe</span>
                        <a href={`tel:${contact.telephone_fixe}`} className="detail-value phone-link">
                          {formatTelephone(contact.telephone_fixe)}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.notes && (
                    <div className="detail-row notes-row">
                      <span className="detail-icon">📝</span>
                      <span className="detail-value notes">{contact.notes}</span>
                    </div>
                  )}
                </div>

                <div className="contact-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingEntry(contact)
                      setEditForm(contact)
                      setShowEditModal(true)
                    }}
                    title="Modifier"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${contact.prenom} ${contact.nom} ?`)) {
                        handleDeleteEntry(contact.id)
                      }
                    }}
                    title="Supprimer"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">�</div>
            <h3>Aucun contact dans l'annuaire</h3>
            <p>Commencez par ajouter vos premiers contacts professionnels</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="btn-icon">+</span>
              Ajouter un contact
            </button>
          </div>
        )}
      </div>

      {/* Formulaire de création (inline) */}
      {showCreateModal && (
        <div ref={formRef} className="contact-form-section">
          <div className="form-header">
            <h2>➕ Ajouter un nouveau contact</h2>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Annuler
            </button>
          </div>
          <form onSubmit={handleCreateSubmit} className="contact-form">
            <div className="form-section">
              <h3 className="form-section-title">Identité</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="create-prenom">Prénom *</label>
                  <input
                    type="text"
                    id="create-prenom"
                    value={createForm.prenom}
                    onChange={(e) => setCreateForm({...createForm, prenom: e.target.value})}
                    required
                    placeholder="Jean"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="create-nom">Nom *</label>
                  <input
                    type="text"
                    id="create-nom"
                    value={createForm.nom}
                    onChange={(e) => setCreateForm({...createForm, nom: e.target.value})}
                    required
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="create-fonction">Fonction</label>
                  <input
                    type="text"
                    id="create-fonction"
                    value={createForm.fonction}
                    onChange={(e) => setCreateForm({...createForm, fonction: e.target.value})}
                    placeholder="Ex: Directeur commercial"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="create-service">Service</label>
                  <input
                    type="text"
                    id="create-service"
                    value={createForm.service}
                    onChange={(e) => setCreateForm({...createForm, service: e.target.value})}
                    placeholder="Ex: Commercial"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Coordonnées</h3>
              <div className="form-group">
                <label htmlFor="create-email">Email</label>
                <input
                  type="email"
                  id="create-email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({...createForm, email: e.target.value})}
                  placeholder="jean.dupont@entreprise.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="create-tel-pro">Téléphone professionnel</label>
                  <input
                    type="tel"
                    id="create-tel-pro"
                    value={createForm.telephone_professionnel}
                    onChange={(e) => setCreateForm({...createForm, telephone_professionnel: e.target.value})}
                    placeholder="01 23 45 67 89"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="create-tel-mobile">Téléphone mobile</label>
                  <input
                    type="tel"
                    id="create-tel-mobile"
                    value={createForm.telephone_mobile}
                    onChange={(e) => setCreateForm({...createForm, telephone_mobile: e.target.value})}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="create-tel-fixe">Téléphone fixe</label>
                <input
                  type="tel"
                  id="create-tel-fixe"
                  value={createForm.telephone_fixe}
                  onChange={(e) => setCreateForm({...createForm, telephone_fixe: e.target.value})}
                  placeholder="01 98 76 54 32"
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Informations complémentaires</h3>
              <div className="form-group">
                <label htmlFor="create-notes">Notes</label>
                <textarea
                  id="create-notes"
                  value={createForm.notes}
                  onChange={(e) => setCreateForm({...createForm, notes: e.target.value})}
                  rows="3"
                  placeholder="Informations complémentaires sur ce contact..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowCreateModal(false)}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                ➕ Ajouter le contact
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulaire d'édition (inline) */}
      {showEditModal && editingEntry && (
        <div className="contact-form-section">
          <div className="form-header">
            <h2>✏️ Modifier le contact</h2>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => setShowEditModal(false)}
            >
              Annuler
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="contact-form">
            <div className="form-section">
              <h3 className="form-section-title">Identité</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-prenom">Prénom *</label>
                  <input
                    type="text"
                    id="edit-prenom"
                    value={editForm.prenom}
                    onChange={(e) => setEditForm({...editForm, prenom: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-nom">Nom *</label>
                  <input
                    type="text"
                    id="edit-nom"
                    value={editForm.nom}
                    onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-fonction">Fonction</label>
                  <input
                    type="text"
                    id="edit-fonction"
                    value={editForm.fonction}
                    onChange={(e) => setEditForm({...editForm, fonction: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-service">Service</label>
                  <input
                    type="text"
                    id="edit-service"
                    value={editForm.service}
                    onChange={(e) => setEditForm({...editForm, service: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Coordonnées</h3>
              <div className="form-group">
                <label htmlFor="edit-email">Email</label>
                <input
                  type="email"
                  id="edit-email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edit-tel-pro">Téléphone professionnel</label>
                  <input
                    type="tel"
                    id="edit-tel-pro"
                    value={editForm.telephone_professionnel}
                    onChange={(e) => setEditForm({...editForm, telephone_professionnel: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-tel-mobile">Téléphone mobile</label>
                  <input
                    type="tel"
                    id="edit-tel-mobile"
                    value={editForm.telephone_mobile}
                    onChange={(e) => setEditForm({...editForm, telephone_mobile: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-tel-fixe">Téléphone fixe</label>
                <input
                  type="tel"
                  id="edit-tel-fixe"
                  value={editForm.telephone_fixe}
                  onChange={(e) => setEditForm({...editForm, telephone_fixe: e.target.value})}
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Informations complémentaires</h3>
              <div className="form-group">
                <label htmlFor="edit-notes">Notes</label>
                <textarea
                  id="edit-notes"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  rows="3"
                />
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowEditModal(false)}
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                💾 Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Annuaire