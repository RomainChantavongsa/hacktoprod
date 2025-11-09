import { useState } from 'react'
import './conducteurs.scss'

function Conducteurs() {
  const [conducteurs, setConducteurs] = useState([
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      note_conduite: '4.5',
      telephone: '+33 6 12 34 56 78'
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Pierre',
      note_conduite: '4.8',
      telephone: '+33 6 98 76 54 32'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    note_conduite: '',
    telephone: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newConducteur = {
      id: Date.now(),
      ...formData
    }
    setConducteurs(prev => [...prev, newConducteur])
    setFormData({ nom: '', prenom: '', note_conduite: '', telephone: '' })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setConducteurs(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="conducteurs-page">
      <div className="page-header">
        <h1>Gestion des conducteurs</h1>
        <p className="subtitle">Gérez vos conducteurs et leur évaluation</p>
      </div>

      <div className="actions-bar">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : '+ Ajouter un conducteur'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="conducteur-form">
          <h3>Ajouter un conducteur</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Dupont"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                placeholder="Jean"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="note_conduite">Note de conduite (/5)</label>
              <input
                type="number"
                id="note_conduite"
                name="note_conduite"
                value={formData.note_conduite}
                onChange={handleInputChange}
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Téléphone</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                placeholder="+33 6 12 34 56 78"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Ajouter le conducteur
            </button>
          </div>
        </form>
      )}

      <div className="conducteurs-table-container">
        <table className="conducteurs-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Note de conduite</th>
              <th>Téléphone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {conducteurs.map(conducteur => (
              <tr key={conducteur.id}>
                <td>{conducteur.nom}</td>
                <td>{conducteur.prenom}</td>
                <td>{conducteur.note_conduite}/5</td>
                <td>{conducteur.telephone}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(conducteur.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {conducteurs.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-state">
                  Aucun conducteur enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Conducteurs