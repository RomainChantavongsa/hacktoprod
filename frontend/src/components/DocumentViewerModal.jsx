import { useEffect, useState } from 'react'
import './DocumentViewerModal.scss'

export default function DocumentViewerModal({ isOpen, onClose, documents, title }) {
  const [selectedDoc, setSelectedDoc] = useState(null)

  useEffect(() => {
    if (isOpen && documents && documents.length > 0) {
      setSelectedDoc(documents[0])
    }
  }, [isOpen, documents])

  if (!isOpen) return null

  const handleDownload = (doc) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const downloadUrl = `${baseUrl}/api/documents/${doc.id}/download`
    
    // Créer un lien temporaire pour télécharger
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = doc.nom_fichier_original
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreview = (doc) => {
    setSelectedDoc(doc)
  }

  const renderPreview = () => {
    if (!selectedDoc) return null

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const previewUrl = `${baseUrl}/api/documents/${selectedDoc.id}/preview`

    const isImage = selectedDoc.mime_type?.startsWith('image/')
    const isPdf = selectedDoc.mime_type === 'application/pdf'

    if (isImage) {
      return (
        <div className="document-preview">
          <img src={previewUrl} alt={selectedDoc.nom_fichier_original} />
        </div>
      )
    } else if (isPdf) {
      return (
        <div className="document-preview">
          <iframe 
            src={previewUrl} 
            title={selectedDoc.nom_fichier_original}
            width="100%"
            height="600px"
          />
        </div>
      )
    } else {
      return (
        <div className="document-preview no-preview">
          <div className="no-preview-content">
            <span className="icon">📄</span>
            <p>Aperçu non disponible pour ce type de fichier</p>
            <p className="file-info">{selectedDoc.nom_fichier_original}</p>
            <button className="btn btn-primary" onClick={() => handleDownload(selectedDoc)}>
              Télécharger le document
            </button>
          </div>
        </div>
      )
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '-'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR')
  }

  return (
    <div className="document-modal-overlay" onClick={onClose}>
      <div className="document-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title || 'Documents'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {documents && documents.length > 0 ? (
            <div className="documents-layout">
              {/* Liste des documents */}
              <div className="documents-list">
                <h3>Liste des documents ({documents.length})</h3>
                {documents.map((doc) => (
                  <div 
                    key={doc.id} 
                    className={`document-item ${selectedDoc?.id === doc.id ? 'active' : ''}`}
                    onClick={() => handlePreview(doc)}
                  >
                    <div className="doc-icon">
                      {doc.mime_type?.startsWith('image/') ? '🖼️' : 
                       doc.mime_type === 'application/pdf' ? '📄' : '📎'}
                    </div>
                    <div className="doc-info">
                      <div className="doc-name">{doc.nom_fichier_original}</div>
                      <div className="doc-meta">
                        <span className="doc-type">{doc.type_document}</span>
                        <span className="doc-size">{formatFileSize(doc.taille_octets)}</span>
                      </div>
                      {doc.date_expiration && (
                        <div className="doc-expiration">
                          Expire le: {formatDate(doc.date_expiration)}
                        </div>
                      )}
                    </div>
                    <div className="doc-actions">
                      <button 
                        className="btn-icon" 
                        onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                        title="Télécharger"
                      >
                        ⬇️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prévisualisation */}
              <div className="preview-container">
                {selectedDoc ? (
                  <>
                    <div className="preview-header">
                      <h3>{selectedDoc.nom_fichier_original}</h3>
                      <div className="preview-actions">
                        <button 
                          className="btn btn-outline btn-sm" 
                          onClick={() => handleDownload(selectedDoc)}
                        >
                          ⬇️ Télécharger
                        </button>
                      </div>
                    </div>
                    {renderPreview()}
                    <div className="preview-details">
                      <div className="detail-row">
                        <span className="label">Type:</span>
                        <span className="value">{selectedDoc.type_document}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Catégorie:</span>
                        <span className="value">{selectedDoc.categorie}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Taille:</span>
                        <span className="value">{formatFileSize(selectedDoc.taille_octets)}</span>
                      </div>
                      {selectedDoc.date_emission && (
                        <div className="detail-row">
                          <span className="label">Date d'émission:</span>
                          <span className="value">{formatDate(selectedDoc.date_emission)}</span>
                        </div>
                      )}
                      {selectedDoc.date_expiration && (
                        <div className="detail-row">
                          <span className="label">Date d'expiration:</span>
                          <span className="value">{formatDate(selectedDoc.date_expiration)}</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="no-selection">
                    <p>Sélectionnez un document pour le prévisualiser</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-documents">
              <p>Aucun document disponible</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  )
}
