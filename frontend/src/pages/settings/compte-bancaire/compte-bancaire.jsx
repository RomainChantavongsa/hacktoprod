import { useCompteBancaire } from './compte-bancaire.ts'
import './compte-bancaire.scss'

function CompteBancaire() {
  const {
    comptes,
    formData,
    isLoading,
    error,
    success,
    isEditing,
    editingId,
    handleChange,
    handleSubmit,
    handleEdit,
    handleCancel,
    handleDelete,
    startAddNew,
    handleSetAsPrincipal
  } = useCompteBancaire()

  return (
    <div className="compte-bancaire-page">
      <div className="page-header">
        <h1>Comptes bancaires</h1>
        <p className="subtitle">Gérez les comptes bancaires de votre entreprise</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Liste des comptes existants */}
      <div className="comptes-list">
        <div className="list-header">
          <h2>Vos comptes bancaires</h2>
          <button
            type="button"
            className="btn btn-primary btn-add"
            onClick={startAddNew}
            disabled={isEditing}
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">Ajouter un compte</span>
          </button>
        </div>

        {comptes.length === 0 ? (
          <div className="empty-state">
            <p>Aucun compte bancaire enregistré</p>
            <p className="empty-hint">Utilisez le bouton "Ajouter un compte" ci-dessus pour commencer.</p>
          </div>
        ) : (
          <div className="comptes-grid">
            {comptes.map((compte) => (
              <div key={compte.id} className="compte-card">
                <div className="compte-header">
                  <div className="compte-title">
                    <h3>{compte.nom_banque}</h3>
                    {compte.est_principal && (
                      <span className="badge-principal">Principal</span>
                    )}
                  </div>
                  <div className="compte-actions">
                    {!compte.est_principal && (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleSetAsPrincipal(compte.id)}
                        disabled={isEditing}
                        title="Définir comme compte principal"
                      >
                        ★ Principal
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleEdit(compte)}
                      disabled={isEditing}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(compte.id)}
                      disabled={isEditing}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <div className="compte-details">
                  <div className="detail-row">
                    <span className="label">IBAN:</span>
                    <span className="value iban">{compte.iban}</span>
                  </div>
                  {compte.bic && (
                    <div className="detail-row">
                      <span className="label">BIC:</span>
                      <span className="value">{compte.bic}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Titulaire:</span>
                    <span className="value">{compte.titulaire}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire d'ajout/modification */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="compte-form">
          <div className="form-section">
            <h2>{editingId ? 'Modifier le compte bancaire' : 'Nouveau compte bancaire'}</h2>

            <div className="form-group">
              <label htmlFor="iban">IBAN *</label>
              <input
                type="text"
                id="iban"
                name="iban"
                value={formData.iban || ''}
                onChange={handleChange}
                required
                placeholder="FR76 1234 5678 9012 3456 7890 123"
                maxLength="34"
              />
              <small className="form-hint">Format IBAN international (jusqu'à 34 caractères)</small>
            </div>

            <div className="form-group">
              <label htmlFor="bic">BIC/SWIFT</label>
              <input
                type="text"
                id="bic"
                name="bic"
                value={formData.bic || ''}
                onChange={handleChange}
                placeholder="BNPAFRPP"
                maxLength="11"
              />
              <small className="form-hint">Optionnel - Code d'identification bancaire</small>
            </div>

            <div className="form-group">
              <label htmlFor="nom_banque">Nom de la banque *</label>
              <input
                type="text"
                id="nom_banque"
                name="nom_banque"
                value={formData.nom_banque || ''}
                onChange={handleChange}
                required
                placeholder="Ex: BNP Paribas, Société Générale..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="titulaire">Titulaire du compte *</label>
              <input
                type="text"
                id="titulaire"
                name="titulaire"
                value={formData.titulaire || ''}
                onChange={handleChange}
                required
                placeholder="Nom du titulaire du compte"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="est_principal"
                  name="est_principal"
                  checked={formData.est_principal || false}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    est_principal: e.target.checked
                  }))}
                />
                <span className="checkmark"></span>
                Définir comme compte principal
              </label>
              <small className="form-hint">
                Le compte principal est utilisé par défaut pour les transactions de l'entreprise.
                Il ne peut y avoir qu'un seul compte principal à la fois.
              </small>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : (editingId ? 'Modifier' : 'Ajouter')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CompteBancaire