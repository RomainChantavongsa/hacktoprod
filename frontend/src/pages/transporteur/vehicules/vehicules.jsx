import { useState } from 'react'
import { useVehicules } from './vehicules.ts'
import DataTable from '@components/DataTable.jsx'
import DocumentViewerModal from '@components/DocumentViewerModal.jsx'
import apiService from '../../../services/apiService'
import './vehicules.scss'

export default function VehiculesPage() {
  const {
    vehicules,
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
  } = useVehicules()

  const [documentModalOpen, setDocumentModalOpen] = useState(false)
  const [currentDocuments, setCurrentDocuments] = useState([])
  const [currentVehiculeInfo, setCurrentVehiculeInfo] = useState('')

  const handleFileInputChange = (e, type) => {
    const file = e.target.files[0]
    handleFileChange(file, type)
  }

  const viewDocuments = async (vehicule) => {
    try {
      const response = await apiService.getDocumentsVehicule(vehicule.id)
      if (response.success && response.data) {
        setCurrentDocuments(response.data)
        setCurrentVehiculeInfo(`Véhicule ${vehicule.type_vehicule} - ${vehicule.plaque_immatriculation}`)
        setDocumentModalOpen(true)
      } else {
        alert('Erreur lors de la récupération des documents')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la récupération des documents')
    }
  }

  return (
    <div className="vehicules-page">
      <div className="page-header">
        <h1>Gestion des véhicules</h1>
        <p className="subtitle">Flotte connectée à la base de données</p>
      </div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="add-form-container">
        <form onSubmit={(e) => { create(e); }} className="vehicule-add-bar" aria-label="Ajouter un véhicule">
          <div className="add-bar">
            <div className="field">
              <select name="type_vehicule" value={form.type_vehicule} onChange={handleChange} required>
                <option value="">Type de véhicule</option>
                <option value="Fourgon">Fourgon</option>
                <option value="Voitures">Voitures</option>
                <option value="Camion 12T">Camion 12T</option>
                <option value="Camion 18T">Camion 18T</option>
                <option value="Camion 24T">Camion 24T</option>
                <option value="Semi-remorque">Semi-remorque</option>
                <option value="Remorque">Remorque</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="field">
              <input name="plaque_immatriculation" value={form.plaque_immatriculation} onChange={handleChange} placeholder="Plaque" required />
            </div>
            <div className="field">
              <select name="conducteur_attitre" value={form.conducteur_attitre} onChange={handleChange}>
                <option value="">Aucun conducteur</option>
                {conducteurs.map(c => (
                  <option key={c.id} value={`${c.prenom} ${c.nom}`}>
                    {c.prenom} {c.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <input type="number" step="0.1" name="capacite_tonnes" value={form.capacite_tonnes} onChange={handleChange} placeholder="Capacité (t)" />
            </div>
            <div className="field">
              <div className="file-upload-group">
                <label>Carte grise *</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  name="carte_grise"
                  onChange={(e) => handleFileInputChange(e, 'carte_grise')}
                  required
                />
              </div>
            </div>
            <div className="field">
              <div className="file-upload-group">
                <label>Assurance *</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  name="assurance"
                  onChange={(e) => handleFileInputChange(e, 'assurance')}
                  required
                />
              </div>
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
          { key: 'type_vehicule', header: 'Type', sortable: true },
          { key: 'plaque_immatriculation', header: 'Plaque', sortable: true },
          { key: 'conducteur_attitre', header: 'Conducteur', sortable: true },
          { key: 'capacite_tonnes', header: 'Capacité (t)', sortable: true, render: (r) => r.capacite_tonnes ?? '-' },
          { key: 'documents', header: 'Documents', render: (r) => (
              <div className="documents-status">
                <span className={`doc-status ${r.carte_grise_document_id ? 'present' : 'missing'}`}>
                  🗂️ CG
                </span>
                <span className={`doc-status ${r.assurance_document_id ? 'present' : 'missing'}`}>
                  🛡️ Ass
                </span>
              </div>
            ) },
          { key: 'actions', header: 'Actions', render: (r) => (
              <div className="actions-group">
                <button className="btn btn-outline btn-sm" onClick={() => viewDocuments(r)}>📄 Docs</button>
                <button className="btn btn-danger btn-sm" onClick={() => remove(r.id)}>Supprimer</button>
              </div>
            ) }
        ]}
        data={vehicules}
        loading={loading}
        emptyMessage="Aucun véhicule"
        defaultPageSize={10}
      />

      <DocumentViewerModal
        isOpen={documentModalOpen}
        onClose={() => setDocumentModalOpen(false)}
        documents={currentDocuments}
        title={currentVehiculeInfo}
      />
    </div>
  )
}