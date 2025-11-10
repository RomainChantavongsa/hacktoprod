import { useConducteurs } from './conducteurs.ts'
import DataTable from '@components/DataTable.jsx'
import apiService from '../../../services/apiService'
import Icon from '../../../components/Icon.jsx'
import './conducteurs.scss'

export default function ConducteursPage() {
  const {
    conducteurs,
    loading,
    error,
    form,
    handleChange,
    create,
    remove,
    submitting,
    resetForm,
    uploadedFiles,
    handleFileChange
  } = useConducteurs()

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileChange(file)
  }

  const viewDocuments = async (conducteurId) => {
    try {
      const response = await apiService.getDocumentsConducteur(conducteurId)
      if (response.success && response.data) {
        const documents = response.data
        const message = documents.length > 0
          ? `Documents pour ${documents[0]?.nom} ${documents[0]?.prenom}:\n${documents.map(d => `- ${d.nom_fichier_original} (${d.type_document})`).join('\n')}`
          : `Aucun document trouvé pour ce conducteur`
        alert(message)
      } else {
        alert('Erreur lors de la récupération des documents')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la récupération des documents')
    }
  }

  const getStatutBadge = (statut) => {
    const badges = {
      actif: 'badge-success',
      inactif: 'badge-secondary',
      conge: 'badge-warning',
      suspendu: 'badge-danger'
    }
    return badges[statut] || 'badge-secondary'
  }

  return (
    <div className="conducteurs-page">
      <div className="page-header">
        <h1>Gestion des conducteurs</h1>
        <p className="subtitle">Gérez les conducteurs de votre entreprise</p>
      </div>
      
      {error && <div className="alert alert-error">{error}</div>}

      <div className="add-form-container">
        <form onSubmit={create} className="conducteur-add-form" aria-label="Ajouter un conducteur">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="nom">Nom *</label>
              <input 
                id="nom"
                name="nom" 
                value={form.nom} 
                onChange={handleChange} 
                placeholder="Nom du conducteur" 
                required 
              />
            </div>
            
            <div className="field">
              <label htmlFor="prenom">Prénom *</label>
              <input 
                id="prenom"
                name="prenom" 
                value={form.prenom} 
                onChange={handleChange} 
                placeholder="Prénom du conducteur" 
                required 
              />
            </div>
            
            <div className="field">
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                type="email"
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder="email@exemple.com" 
              />
            </div>
            
            <div className="field">
              <label htmlFor="telephone">Téléphone</label>
              <input 
                id="telephone"
                name="telephone" 
                value={form.telephone} 
                onChange={handleChange} 
                placeholder="0612345678" 
              />
            </div>
            
            <div className="field">
              <label htmlFor="numero_permis">N° Permis *</label>
              <input 
                id="numero_permis"
                name="numero_permis" 
                value={form.numero_permis} 
                onChange={handleChange} 
                placeholder="Numéro de permis" 
                required 
              />
            </div>
            
            <div className="field">
              <label htmlFor="date_naissance">Date de naissance</label>
              <input 
                id="date_naissance"
                type="date"
                name="date_naissance" 
                value={form.date_naissance} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="field">
              <label htmlFor="date_embauche">Date d'embauche</label>
              <input 
                id="date_embauche"
                type="date"
                name="date_embauche" 
                value={form.date_embauche} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="field">
              <label htmlFor="statut">Statut</label>
              <select
                id="statut"
                name="statut"
                value={form.statut}
                onChange={handleChange}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="conge">En congé</option>
                <option value="suspendu">Suspendu</option>
              </select>
            </div>

            <div className="field">
              <label>Permis de conduire *</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? 'Ajout en cours...' : 'Ajouter le conducteur'}
            </button>
            <button className="btn btn-secondary" type="button" onClick={resetForm} disabled={submitting}>
              Réinitialiser
            </button>
          </div>
        </form>
      </div>

      <DataTable
        columns={[
          { key: 'nom', header: 'Nom', sortable: true },
          { key: 'prenom', header: 'Prénom', sortable: true },
          { key: 'email', header: 'Email', sortable: true, render: (r) => r.email || '-' },
          { key: 'telephone', header: 'Téléphone', sortable: true, render: (r) => r.telephone || '-' },
          { key: 'numero_permis', header: 'N° Permis', sortable: true },
          { key: 'statut', header: 'Statut', sortable: true, render: (r) => (
            <span className={`badge ${getStatutBadge(r.statut)}`}>
              {r.statut.charAt(0).toUpperCase() + r.statut.slice(1)}
            </span>
          )},
          { key: 'documents', header: 'Documents', render: (r) => (
            <span className={`doc-status ${r.permis_document_id ? 'present' : 'missing'}`}>
              <Icon name="document" size={14} /> Permis
            </span>
          )},
          { key: 'actions', header: 'Actions', render: (r) => (
            <div className="actions-group">
              <button className="btn btn-outline btn-sm" onClick={() => viewDocuments(r.id)}><Icon name="document" size={14} /> Docs</button>
              <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>
                Supprimer
              </button>
            </div>
          )}
        ]}
        data={conducteurs}
        loading={loading}
        emptyMessage="Aucun conducteur enregistré"
        defaultPageSize={10}
      />
    </div>
  )
}