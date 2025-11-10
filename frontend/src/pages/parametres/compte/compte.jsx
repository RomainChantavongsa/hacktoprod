import { useCompte } from './compte.ts'
import './compte.scss'
import Icon from '../../../components/Icon.jsx'

function Compte() {
  const {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit
  } = useCompte()

  return (
    <div className="compte-page">
      <div className="page-header">
        <h1>Informations du compte</h1>
        <p className="subtitle">Gérez vos informations personnelles</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="compte-form">
        {/* Informations de connexion */}
        <div className="form-section">
          <h2>Identifiants de connexion</h2>
          
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Informations personnelles */}
        <div className="form-section">
          <h2>Informations personnelles</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prenom">Prénom</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="telephone">Téléphone</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={formData.telephone || ''}
              onChange={handleChange}
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </div>

        {/* Rôle (lecture seule) */}
        <div className="form-section">
          <h2>Type de compte</h2>
          <div className="info-readonly">
            <label>Rôle</label>
            <div className="role-badge">
              {formData.role === 'transporteur' ? <><Icon name="truck" size={16} /> Transporteur</> : <><Icon name="package" size={16} /> Donneur d'ordre</>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Compte
