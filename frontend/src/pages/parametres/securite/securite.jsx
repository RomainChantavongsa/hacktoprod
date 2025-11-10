import { useSecurite } from './securite.ts'
import Icon from '../../../components/Icon.jsx'
import './securite.scss'

function Securite() {
  const {
    formData,
    isLoading,
    error,
    success,
    handleChange,
    handleSubmit
  } = useSecurite()

  return (
    <div className="securite-page">
      <div className="page-header">
        <h1>Sécurité</h1>
        <p className="subtitle">Modifiez votre mot de passe et gérez la sécurité de votre compte</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="securite-form">
        <div className="form-section">
          <h2>Changement de mot de passe</h2>
          
          <div className="form-group">
            <label htmlFor="currentPassword">Mot de passe actuel</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <small className="form-text">Minimum 8 caractères</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Conseils de sécurité</h2>
          <ul className="security-tips">
            <li><Icon name="check" size={14} /> Utilisez au moins 8 caractères</li>
            <li><Icon name="check" size={14} /> Mélangez lettres majuscules et minuscules</li>
            <li><Icon name="check" size={14} /> Incluez des chiffres et des symboles</li>
            <li><Icon name="check" size={14} /> Ne réutilisez pas un ancien mot de passe</li>
            <li><Icon name="check" size={14} /> Évitez les informations personnelles évidentes</li>
          </ul>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Modification en cours...' : 'Changer le mot de passe'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Securite
