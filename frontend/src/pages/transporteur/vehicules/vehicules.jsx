import { useState } from 'react'
import './vehicules.scss'

function Vehicules() {
  const [vehicules, setVehicules] = useState([
    {
      id: 1,
      type: 'Camion frigorifique',
      plaque: 'AB-123-CD',
      conducteur: 'Jean Dupont'
    },
    {
      id: 2,
      type: 'Fourgnette',
      plaque: 'EF-456-GH',
      conducteur: ''
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    plaque: '',
    conducteur: ''
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
    const newVehicule = {
      id: Date.now(),
      ...formData
    }
    setVehicules(prev => [...prev, newVehicule])
    setFormData({ type: '', plaque: '', conducteur: '' })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setVehicules(prev => prev.filter(v => v.id !== id))
  }

  return (
    <div className="vehicules-page">
      <div className="page-header">
        <h1>Gestion des véhicules</h1>
        <p className="subtitle">Gérez votre flotte de véhicules</p>
      </div>

      <div className="actions-bar">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Annuler' : '+ Ajouter un véhicule'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="vehicule-form">
          <h3>Ajouter un véhicule</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type de véhicule</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="">Sélectionner un type</option>
                <option value="Camion frigorifique">Camion frigorifique</option>
                <option value="Camion bâché">Camion bâché</option>
                <option value="Camion plateau">Camion plateau</option>
                <option value="Fourgnette">Fourgnette</option>
                <option value="Semi-remorque">Semi-remorque</option>
                <option value="Porte-conteneurs">Porte-conteneurs</option>
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
                placeholder="AB-123-CD"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="conducteur">Conducteur attitré (optionnel)</label>
            <input
              type="text"
              id="conducteur"
              name="conducteur"
              value={formData.conducteur}
              onChange={handleInputChange}
              placeholder="Nom du conducteur"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Ajouter le véhicule
            </button>
          </div>
        </form>
      )}

      <div className="vehicules-table-container">
        <table className="vehicules-table">
          <thead>
            <tr>
              <th>Type de véhicule</th>
              <th>Plaque d'immatriculation</th>
              <th>Conducteur attitré</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicules.map(vehicule => (
              <tr key={vehicule.id}>
                <td>{vehicule.type}</td>
                <td>{vehicule.plaque}</td>
                <td>{vehicule.conducteur || '-'}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(vehicule.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {vehicules.length === 0 && (
              <tr>
                <td colSpan="4" className="empty-state">
                  Aucun véhicule enregistré
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Vehicules