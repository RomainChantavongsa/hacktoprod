import { useDocuments } from './documents.ts'
import './documents.scss'

function Documents() {
  const {
    documents,
    loading,
    error,
    uploading,
    filter,
    setFilter,
    showUploadModal,
    setShowUploadModal,
    showEditModal,
    setShowEditModal,
    editingDocument,
    uploadForm,
    setUploadForm,
    handleFileSelect,
    handleUploadSubmit,
    handleEditDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    handleDownloadDocument,
    handlePreviewDocument,
    closePreviewModal,
    showPreviewModal,
    previewUrl,
    previewDocument,
    formatFileSize,
    formatDate,
    getDocumentIcon,
    isExpiringSoon,
    isExpired
  } = useDocuments()

  if (loading) {
    return (
      <div className="documents-page">
        <div className="loading">Chargement des documents...</div>
      </div>
    )
  }

  return (
    <div className="documents-page">
      <div className="documents-header">
        <div className="header-content">
          <h1 className="page-title">📄 Documents de l'entreprise</h1>
          <p className="page-description">
            Gérez tous les documents légaux et administratifs de votre entreprise
          </p>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn-upload"
            onClick={() => setShowUploadModal(true)}
            disabled={uploading}
          >
            <span>📤</span>
            Ajouter un document
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Filtres */}
      <div className="documents-filters">
        <div className="filter-group">
          <label htmlFor="type-filter" className="filter-label">Type de document</label>
          <select
            id="type-filter"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="filter-select"
          >
            <option value="">Tous les types</option>
            <option value="Licence de transport">Licence de transport</option>
            <option value="Assurance">Assurance</option>
            <option value="Kbis">Kbis</option>
            <option value="Carte grise">Carte grise</option>
            <option value="Permis">Permis de conduire</option>
            <option value="Facture">Facture</option>
            <option value="CMR">Lettre CMR</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="categorie-filter" className="filter-label">Catégorie</label>
          <select
            id="categorie-filter"
            value={filter.categorie}
            onChange={(e) => setFilter({ ...filter, categorie: e.target.value })}
            className="filter-select"
          >
            <option value="">Toutes les catégories</option>
            <option value="Legal">Légal</option>
            <option value="Assurance">Assurance</option>
            <option value="Vehicule">Véhicule</option>
            <option value="Conducteur">Conducteur</option>
            <option value="Commercial">Commercial</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="statut-filter" className="filter-label">Statut</label>
          <select
            id="statut-filter"
            value={filter.statut}
            onChange={(e) => setFilter({ ...filter, statut: e.target.value })}
            className="filter-select"
          >
            <option value="">Tous les statuts</option>
            <option value="valide">Valides</option>
            <option value="expire_bientot">Expire bientôt</option>
            <option value="expire">Expirés</option>
          </select>
        </div>
      </div>

      {/* Liste des documents */}
      {documents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>Aucun document</h3>
          <p>Commencez par ajouter vos premiers documents</p>
        </div>
      ) : (
        <div className="documents-list">
          {documents.map((doc) => {
            const expiringSoon = isExpiringSoon(doc.date_expiration)
            const expired = isExpired(doc.date_expiration)
            
            return (
              <div 
                key={doc.id} 
                className={`document-card ${expired ? 'expired' : ''} ${expiringSoon ? 'expiring' : ''}`}
              >
                <div className="document-icon">
                  {getDocumentIcon(doc.extension)}
                </div>

                <div className="document-info">
                  <div className="document-header-info">
                    <h3 className="document-name">{doc.nom_fichier_original}</h3>
                    <div className="document-badges">
                      <span className="badge badge-type">{doc.type_document}</span>
                      {doc.categorie && (
                        <span className="badge badge-categorie">{doc.categorie}</span>
                      )}
                      {doc.version > 1 && (
                        <span className="badge badge-version">v{doc.version}</span>
                      )}
                    </div>
                  </div>

                  {doc.description && (
                    <p className="document-description">{doc.description}</p>
                  )}

                  <div className="document-meta">
                    <span className="meta-item">
                      <span className="meta-icon">📦</span>
                      {formatFileSize(doc.taille_octets)}
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">📅</span>
                      Ajouté le {formatDate(doc.created_at)}
                    </span>
                    {doc.date_expiration && (
                      <span className={`meta-item ${expired ? 'text-error' : expiringSoon ? 'text-warning' : ''}`}>
                        <span className="meta-icon">{expired ? '❌' : expiringSoon ? '⚠️' : '✅'}</span>
                        {expired ? 'Expiré le' : 'Expire le'} {formatDate(doc.date_expiration)}
                      </span>
                    )}
                  </div>

                  {doc.tags && doc.tags.length > 0 && (
                    <div className="document-tags">
                      {doc.tags.map((tag, index) => (
                        <span key={index} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="document-actions">
                  <button
                    className="btn-action btn-preview"
                    onClick={() => handlePreviewDocument(doc)}
                    title="Prévisualiser"
                  >
                    <span>👁️</span>
                  </button>
                  <button
                    className="btn-action btn-edit"
                    onClick={() => handleEditDocument(doc)}
                    title="Modifier"
                  >
                    <span>✏️</span>
                  </button>
                  <button
                    className="btn-action btn-download"
                    onClick={() => handleDownloadDocument(doc)}
                    title="Télécharger"
                  >
                    <span>⬇️</span>
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => handleDeleteDocument(doc.id)}
                    title="Supprimer"
                  >
                    <span>🗑️</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Statistiques */}
      <div className="documents-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-value">{documents.length}</span>
            <span className="stat-label">Documents totaux</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">
              {documents.filter(d => d.est_valide && !isExpired(d.date_expiration)).length}
            </span>
            <span className="stat-label">Documents valides</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <span className="stat-value">
              {documents.filter(d => isExpiringSoon(d.date_expiration)).length}
            </span>
            <span className="stat-label">Expirent bientôt</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <span className="stat-value">
              {documents.filter(d => isExpired(d.date_expiration)).length}
            </span>
            <span className="stat-label">Documents expirés</span>
          </div>
        </div>
      </div>

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📤 Ajouter un document</h2>
              <button className="btn-close" onClick={() => setShowUploadModal(false)}>✕</button>
            </div>
            <form onSubmit={handleUploadSubmit} className="modal-form">
              <div className="form-group">
                <label>Fichier *</label>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  required
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                {uploadForm.file && (
                  <div className="file-preview">
                    <span>{getDocumentIcon(uploadForm.file.name)}</span>
                    <span>{uploadForm.file.name}</span>
                    <span>({formatFileSize(uploadForm.file.size)})</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Nom du document</label>
                <input
                  type="text"
                  value={uploadForm.nom_fichier_original}
                  onChange={(e) => setUploadForm({...uploadForm, nom_fichier_original: e.target.value})}
                  placeholder="Laisser vide pour garder le nom original"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type de document *</label>
                  <select
                    value={uploadForm.type_document}
                    onChange={(e) => setUploadForm({...uploadForm, type_document: e.target.value})}
                    required
                  >
                    <option value="Licence de transport">Licence de transport</option>
                    <option value="Assurance">Assurance</option>
                    <option value="Kbis">Kbis</option>
                    <option value="Carte grise">Carte grise</option>
                    <option value="Permis">Permis de conduire</option>
                    <option value="Facture">Facture</option>
                    <option value="CMR">Lettre CMR</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Catégorie *</label>
                  <select
                    value={uploadForm.categorie}
                    onChange={(e) => setUploadForm({...uploadForm, categorie: e.target.value})}
                    required
                  >
                    <option value="Legal">Légal</option>
                    <option value="Assurance">Assurance</option>
                    <option value="Vehicule">Véhicule</option>
                    <option value="Conducteur">Conducteur</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  rows="3"
                  placeholder="Description du document..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date d'émission</label>
                  <input
                    type="date"
                    value={uploadForm.date_emission}
                    onChange={(e) => setUploadForm({...uploadForm, date_emission: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Date d'expiration</label>
                  <input
                    type="date"
                    value={uploadForm.date_expiration}
                    onChange={(e) => setUploadForm({...uploadForm, date_expiration: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  placeholder="Ex: important, 2024, transport"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowUploadModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? '⏳ Upload en cours...' : '📤 Uploader'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && editingDocument && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✏️ Modifier le document</h2>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <form onSubmit={handleUpdateDocument} className="modal-form">
              <div className="form-group">
                <label>Nom du document *</label>
                <input
                  type="text"
                  value={editingDocument.nom_fichier_original}
                  onChange={(e) => setEditingDocument({...editingDocument, nom_fichier_original: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type de document *</label>
                  <select
                    value={editingDocument.type_document}
                    onChange={(e) => setEditingDocument({...editingDocument, type_document: e.target.value})}
                    required
                  >
                    <option value="Licence de transport">Licence de transport</option>
                    <option value="Assurance">Assurance</option>
                    <option value="Kbis">Kbis</option>
                    <option value="Carte grise">Carte grise</option>
                    <option value="Permis">Permis de conduire</option>
                    <option value="Facture">Facture</option>
                    <option value="CMR">Lettre CMR</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Catégorie *</label>
                  <select
                    value={editingDocument.categorie}
                    onChange={(e) => setEditingDocument({...editingDocument, categorie: e.target.value})}
                    required
                  >
                    <option value="Legal">Légal</option>
                    <option value="Assurance">Assurance</option>
                    <option value="Vehicule">Véhicule</option>
                    <option value="Conducteur">Conducteur</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editingDocument.description || ''}
                  onChange={(e) => setEditingDocument({...editingDocument, description: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date d'émission</label>
                  <input
                    type="date"
                    value={editingDocument.date_emission?.split('T')[0] || ''}
                    onChange={(e) => setEditingDocument({...editingDocument, date_emission: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Date d'expiration</label>
                  <input
                    type="date"
                    value={editingDocument.date_expiration?.split('T')[0] || ''}
                    onChange={(e) => setEditingDocument({...editingDocument, date_expiration: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={editingDocument.tags?.join(', ') || ''}
                  onChange={(e) => setEditingDocument({...editingDocument, tags: e.target.value.split(',').map(t => t.trim())})}
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingDocument.est_valide}
                    onChange={(e) => setEditingDocument({...editingDocument, est_valide: e.target.checked})}
                  />
                  Document valide
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? '⏳ Mise à jour...' : '💾 Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de prévisualisation */}
      {showPreviewModal && previewDocument && previewUrl && (
        <div className="modal-overlay" onClick={closePreviewModal}>
          <div className="modal-content modal-preview" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                👁️ Aperçu: {previewDocument.nom_fichier_original}
                <span className="file-extension">{previewDocument.extension}</span>
              </h2>
              <button className="btn-close" onClick={closePreviewModal}>✕</button>
            </div>
            <div className="modal-body preview-container">
              {previewDocument.extension.toLowerCase() === '.pdf' ? (
                <iframe
                  src={previewUrl}
                  className="preview-iframe"
                  title="Aperçu PDF"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt={previewDocument.nom_fichier_original}
                  className="preview-image"
                />
              )}
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => handleDownloadDocument(previewDocument)}
              >
                📥 Télécharger
              </button>
              <button type="button" className="btn-primary" onClick={closePreviewModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Documents
