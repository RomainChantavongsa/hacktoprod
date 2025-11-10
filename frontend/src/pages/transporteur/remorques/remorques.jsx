import { useRemorques } from './remorques.ts'
import DataTable from '@components/DataTable.jsx'
import apiService from '../../../services/apiService'
import './remorques.scss'

export default function RemorquesPage() {
  const {
    remorques,
    loading,
    error,
    form,
    handleChange,
    create,
    remove,
    submitting,
    resetForm,
    uploadedFile,
    handleFileChange
  } = useRemorques()

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    handleFileChange(file)
  }

  const viewDocuments = async (remorqueId) => {
    try {
      const response = await apiService.getDocumentsRemorque(remorqueId)
      if (response.success && response.data) {
        const documents = response.data
        const message = documents.length > 0
          ? `Documents pour la remorque ${documents[0]?.type_remorque}:\n${documents.map(d => `- ${d.nom_fichier_original} (${d.type_document})`).join('\n')}`
          : `Aucun document trouvé pour cette remorque`
        alert(message)
      } else {
        alert('Erreur lors de la récupération des documents')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la récupération des documents')
    }
  }

  return (
    <div className="remorques-page">
      <div className="page-header">
        <h1>Gestion des remorques</h1>
        <p className="subtitle">Connecté à la base de données</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="add-form-container">
        <form onSubmit={create} className="remorque-add-bar" aria-label="Ajouter une remorque">
          <div className="add-bar">
            <div className="field">
              <select name="type_remorque" value={form.type_remorque} onChange={handleChange} required>
                <option value="">Type de remorque</option>
                <option value="Semi-remorque">Semi-remorque</option>
                <option value="Remorque">Remorque</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="field">
              <input name="plaque_immatriculation" value={form.plaque_immatriculation} onChange={handleChange} placeholder="Plaque" required />
            </div>
            <div className="field">
              <input type="number" step="0.1" name="capacite_tonnes" value={form.capacite_tonnes} onChange={handleChange} placeholder="Capacité (t)" />
            </div>
            <div className="field">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                placeholder="Document remorque"
              />
            </div>
            <div className="actions">
              <button className="btn btn-primary" type="submit" disabled={submitting}>Ajouter</button>
              <button className="btn btn-sm" type="button" onClick={() => { resetForm(); }} disabled={submitting}>Annuler</button>
            </div>
          </div>
        </form>
      </div>

      <DataTable
        columns={[
          { key: 'type_remorque', header: 'Type', sortable: true },
          { key: 'plaque_immatriculation', header: 'Plaque', sortable: true },
          { key: 'capacite_tonnes', header: 'Capacité (t)', sortable: true, render: (r) => r.capacite_tonnes ?? '-' },
          { key: 'documents', header: 'Documents', render: (r) => (
            <span className={`doc-status ${r.document_id ? 'present' : 'missing'}`}>
              📄 Doc
            </span>
          )},
          { key: 'actions', header: 'Actions', render: (r) => (
            <div className="actions-group">
              <button className="btn btn-outline btn-sm" onClick={() => viewDocuments(r.id)}>📄 Docs</button>
              <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>Supprimer</button>
            </div>
          )}
        ]}
        data={remorques}
        loading={loading}
        emptyMessage="Aucune remorque"
        defaultPageSize={10}
      />
    </div>
  )
}