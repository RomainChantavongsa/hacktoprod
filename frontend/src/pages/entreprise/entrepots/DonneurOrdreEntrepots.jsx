import { useEntrepots } from './donneurEntrepots.ts'
import DataTable from '../../../components/DataTable.jsx'
import './donneurEntrepots.scss'

function DonneurOrdreEntrepots() {
  const {
    entrepots,
    isLoading,
    error,
    success,
    showForm,
    editingEntrepot,
    formData,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    toggleForm,
    setError,
    setSuccess
  } = useEntrepots()

  return (
    <div className="entrepots-page">
      <div className="page-header">
        <h1>Mes Entrepôts</h1>
        <p className="subtitle">Gérez vos entrepôts et points de stockage</p>
        <button className="btn btn-primary" onClick={toggleForm}>
          {showForm ? 'Annuler' : 'Ajouter un entrepôt'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <div className="form-section">
          <h2>{editingEntrepot ? "Modifier l'entrepôt" : 'Ajouter un entrepôt'}</h2>
          <form onSubmit={handleSubmit} className="entrepot-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nom_entrepot">Nom de l'entrepôt *</label>
                <input type="text" id="nom_entrepot" name="nom_entrepot" value={formData.nom_entrepot || ''} onChange={handleChange} required placeholder="Entrepôt principal" />
              </div>

              <div className="form-group">
                <label htmlFor="type_entrepot">Type d'entrepôt</label>
                <select id="type_entrepot" name="type_entrepot" value={formData.type_entrepot || ''} onChange={handleChange}>
                  <option value="">Sélectionner un type</option>
                  <option value="Stockage">Stockage</option>
                  <option value="Chargement">Chargement</option>
                  <option value="Livraison">Livraison</option>
                  <option value="Transit">Transit</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="adresse">Adresse *</label>
              <textarea id="adresse" name="adresse" value={formData.adresse || ''} onChange={handleChange} required rows="3" placeholder="Adresse complète de l'entrepôt" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ville">Ville *</label>
                <input type="text" id="ville" name="ville" value={formData.ville || ''} onChange={handleChange} required placeholder="Ville" />
              </div>

              <div className="form-group">
                <label htmlFor="code_postal">Code postal *</label>
                <input type="text" id="code_postal" name="code_postal" value={formData.code_postal || ''} onChange={handleChange} required pattern="[0-9]{5}" placeholder="75000" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pays">Pays</label>
                <input type="text" id="pays" name="pays" value={formData.pays || 'France'} onChange={handleChange} placeholder="France" />
              </div>

              <div className="form-group">
                <label htmlFor="capacite_stockage_m3">Capacité de stockage (m³)</label>
                <input type="number" id="capacite_stockage_m3" name="capacite_stockage_m3" value={formData.capacite_stockage_m3 || ''} onChange={handleChange} min="0" step="0.1" placeholder="1000" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telephone">Téléphone</label>
                <input type="tel" id="telephone" name="telephone" value={formData.telephone || ''} onChange={handleChange} placeholder="+33 1 23 45 67 89" />
              </div>

              <div className="form-group">
                <label htmlFor="email_contact">Email de contact</label>
                <input type="email" id="email_contact" name="email_contact" value={formData.email_contact || ''} onChange={handleChange} placeholder="contact@entrepot.com" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="horaires_ouverture">Horaires d'ouverture</label>
              <textarea id="horaires_ouverture" name="horaires_ouverture" value={formData.horaires_ouverture || ''} onChange={handleChange} rows="2" placeholder="Lundi-Vendredi: 8h-18h, Samedi: 8h-12h" />
            </div>

            <div className="form-group">
              <label htmlFor="equipements_speciaux">Équipements spéciaux</label>
              <textarea id="equipements_speciaux" name="equipements_speciaux" value={formData.equipements_speciaux || ''} onChange={handleChange} rows="2" placeholder="Chariots élévateurs, quais de chargement, stockage frigorifique..." />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" name="est_actif" checked={formData.est_actif || false} onChange={handleChange} />
                <span className="checkmark"></span>
                Entrepôt actif
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : (editingEntrepot ? 'Modifier' : 'Ajouter')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={toggleForm}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="entrepots-list">
        <h2>Liste des entrepôts</h2>
        {isLoading && !showForm ? (
          <div className="loading">Chargement des entrepôts...</div>
        ) : entrepots.length === 0 ? (
          <div className="empty-state">
            <p>Aucun entrepôt enregistré</p>
            <button className="btn btn-primary" onClick={toggleForm}>Ajouter votre premier entrepôt</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <DataTable
                columns={[
                  { key: 'nom_entrepot', header: 'Nom', sortable: true },
                  { key: 'type_entrepot', header: 'Type', sortable: true },
                  { key: 'ville', header: 'Ville', sortable: true },
                  { key: 'code_postal', header: 'CP', sortable: true, width: 100 },
                  { key: 'capacite_stockage_m3', header: 'Capacité (m³)', sortable: true, width: 140 },
                  { key: 'est_actif', header: 'Actif', width: 90, render: (row) => row.est_actif ? 'Oui' : 'Non' },
                  { key: 'actions', header: 'Actions', width: 200, render: (row) => (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-small btn-secondary" onClick={() => handleEdit(row)}>Modifier</button>
                      <button className="btn btn-small btn-danger" onClick={() => handleDelete(row.id)}>Supprimer</button>
                    </div>
                  )}
                ]}
                data={entrepots}
                loading={isLoading}
                emptyMessage="Aucun entrepôt"
                defaultPageSize={10}
              />
            </div>

            <div className="entrepots-grid">
              {entrepots.map((entrepot) => (
                <div key={entrepot.id} className={`entrepot-card ${!entrepot.est_actif ? 'inactive' : ''}`}>
                  <div className="entrepot-header">
                    <h3>{entrepot.nom_entrepot}</h3>
                    <span className={`status-badge ${entrepot.est_actif ? 'active' : 'inactive'}`}>
                      {entrepot.est_actif ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <div className="entrepot-info">
                    <p><strong>Type:</strong> {entrepot.type_entrepot || 'Non spécifié'}</p>
                    <p><strong>Adresse:</strong> {entrepot.adresse}, {entrepot.code_postal} {entrepot.ville}</p>
                    {entrepot.capacite_stockage_m3 && (
                      <p><strong>Capacité:</strong> {entrepot.capacite_stockage_m3} m³</p>
                    )}
                    {entrepot.telephone && (
                      <p><strong>Tél:</strong> {entrepot.telephone}</p>
                    )}
                    {entrepot.email_contact && (
                      <p><strong>Email:</strong> {entrepot.email_contact}</p>
                    )}
                  </div>

                  <div className="entrepot-actions">
                    <button className="btn btn-small btn-secondary" onClick={() => handleEdit(entrepot)}>Modifier</button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(entrepot.id)}>Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DonneurOrdreEntrepots
