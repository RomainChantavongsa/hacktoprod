import { useSettings } from './settings.ts'
import './settings.scss'

function Settings() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    nom,
    setNom,
    prenom,
    setPrenom,
    telephone,
    setTelephone,
    errors,
    loading,
    handleSubmit
  } = useSettings()

  return (
    <div className="settings">
      <div className="settings-container">
        <h1 className="settings-title">Paramètres</h1>

        <form className="settings-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="settings-form-group">
            <label htmlFor="username" className="settings-form-label">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              className="settings-form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          <div className="settings-form-group">
            <label htmlFor="email" className="settings-form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="settings-form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="settings-form-group">
            <label htmlFor="nom" className="settings-form-label">
              Nom
            </label>
            <input
              type="text"
              id="nom"
              className="settings-form-input"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
            {errors.nom && (
              <span className="error-text">{errors.nom}</span>
            )}
          </div>

          <div className="settings-form-group">
            <label htmlFor="prenom" className="settings-form-label">
              Prénom
            </label>
            <input
              type="text"
              id="prenom"
              className="settings-form-input"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
            {errors.prenom && (
              <span className="error-text">{errors.prenom}</span>
            )}
          </div>

          <div className="settings-form-group">
            <label htmlFor="telephone" className="settings-form-label">
              Téléphone
            </label>
            <input
              type="tel"
              id="telephone"
              className="settings-form-input"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
            {errors.telephone && (
              <span className="error-text">{errors.telephone}</span>
            )}
          </div>

          <button type="submit" className="settings-button" disabled={loading}>
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Settings