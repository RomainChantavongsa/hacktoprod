import { useState } from 'react'
import './remorques.scss'

function Remorques() {
  const [remorques, setRemorques] = useState([
    {
      id: 1,
      type: 'Remorque frigorifique',
      plaque: 'XY-789-ZA',
      capacite: '24'
    },
    {
      id: 2,
      type: 'Remorque bâchée',
      plaque: 'BC-456-DE',
      capacite: '33'
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    plaque: '',
    capacite: ''
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
    const newRemorque = {
      id: Date.now(),
      ...formData
    }
    setRemorques(prev => [...prev, newRemorque])
    setFormData({ type: '', plaque: '', capacite: '' })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setRemorques(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="remorques-page">
      <div className="page-header">
        <h1>Gestion des remorques</h1>
        <p className="subtitle">Gérez vos remorques et semi-remorques</p>
      </div>

      <div className="actions-bar">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : '+ Ajouter une remorque'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="remorque-form">
          <h3>Ajouter une remorque</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type de remorque</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un type</option>
                <option value="Remorque frigorifique">Remorque frigorifique</option>
                <option value="Remorque bâchée">Remorque bâchée</option>
                <option value="Remorque plateau">Remorque plateau</option>
                <option value="Remorque citerne">Remorque citerne</option>
                <option value="Semi-remorque">Semi-remorque</option>
                <option value="Remorque porte-conteneurs">Remorque porte-conteneurs</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="plaque">Plaque d'immatriculation</label>
              <input
                type="text"
                id="plaque"
                name="plaque"
                value={formData.plaque}
                onChange={handleInputChange}
                placeholder="XY-789-ZA"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="capacite">Capacité (tonnes)</label>
            <input
              type="number"
              id="capacite"
              name="capacite"
              value={formData.capacite}
              onChange={handleInputChange}
              placeholder="24"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Ajouter la remorque
            </button>
          </div>
        </form>
      )}

      <div className="remorques-table-container">
        <table className="remorques-table">
          <thead>
            <tr>
              <th>Type de remorque</th>
              <th>Plaque d'immatriculation</th>
              <th>Capacité (tonnes)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {remorques.map(remorque => (
              <tr key={remorque.id}>
                <td>{remorque.type}</td>
                <td>{remorque.plaque}</td>
                <td>{remorque.capacite}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(remorque.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {remorques.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-state">
                  Aucune remorque enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Remorques