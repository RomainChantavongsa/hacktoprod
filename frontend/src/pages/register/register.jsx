import { Link } from 'react-router-dom'
import { useRegister } from './register.ts'
import './register.scss'

function Register() {
  const {
    formData,
    handleChange,
    errors,
    loading,
    handleSubmit
  } = useRegister()

  return (
    <div className="register">
      <div className="register-container">
        <h1 className="register-title">Inscription</h1>
        
        <form className="register-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          <div className="register-form-group">
            <label htmlFor="username" className="register-form-label">
              Nom d'utilisateur *
            </label>
            <input
              type="text"
              id="username"
              className="register-form-input"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              required
            />
            {errors.username && (
              <span className="error-text">{errors.username}</span>
            )}
          </div>

          <div className="register-form-group">
            <label htmlFor="email" className="register-form-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              className="register-form-input"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="register-form-row">
            <div className="register-form-group">
              <label htmlFor="nom" className="register-form-label">
                Nom *
              </label>
              <input
                type="text"
                id="nom"
                className="register-form-input"
                placeholder="Dupont"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
                required
              />
              {errors.nom && (
                <span className="error-text">{errors.nom}</span>
              )}
            </div>

            <div className="register-form-group">
              <label htmlFor="prenom" className="register-form-label">
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                className="register-form-input"
                placeholder="Jean"
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
              />
            </div>
          </div>

          <div className="register-form-group">
            <label htmlFor="type_entreprise" className="register-form-label">
              Je suis *
            </label>
            <select
              id="type_entreprise"
              className="register-form-input"
              value={formData.type_entreprise}
              onChange={(e) => handleChange('type_entreprise', e.target.value)}
              required
            >
              <option value="">-- Sélectionnez votre profil --</option>
              <option value="transporteur">Transporteur professionnel</option>
              <option value="donneur_ordre">Donneur d'ordre</option>
            </select>
            {errors.type_entreprise && (
              <span className="error-text">{errors.type_entreprise}</span>
            )}
          </div>

          {/* Si donneur d'ordre, demander si particulier ou entreprise */}
          {formData.type_entreprise === 'donneur_ordre' && (
            <div className="register-form-group">
              <label className="register-form-label">
                Type de compte *
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="est_particulier"
                    value="true"
                    checked={formData.est_particulier === true}
                    onChange={() => handleChange('est_particulier', true)}
                    required
                  />
                  <span>Particulier</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="est_particulier"
                    value="false"
                    checked={formData.est_particulier === false}
                    onChange={() => handleChange('est_particulier', false)}
                    required
                  />
                  <span>Entreprise</span>
                </label>
              </div>
              {errors.est_particulier && (
                <span className="error-text">{errors.est_particulier}</span>
              )}
            </div>
          )}

          {/* Si entreprise (transporteur ou donneur d'ordre entreprise), demander le nom */}
          {(formData.type_entreprise === 'transporteur' || 
            (formData.type_entreprise === 'donneur_ordre' && formData.est_particulier === false)) && (
            <>
              <div className="register-form-group">
                <label htmlFor="nom_entreprise" className="register-form-label">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  id="nom_entreprise"
                  className="register-form-input"
                  placeholder="GDS - Global Distribution Services"
                  value={formData.nom_entreprise}
                  onChange={(e) => handleChange('nom_entreprise', e.target.value)}
                  required
                />
                {errors.nom_entreprise && (
                  <span className="error-text">{errors.nom_entreprise}</span>
                )}
              </div>

              <div className="register-form-group">
                <label htmlFor="siret" className="register-form-label">
                  SIRET
                </label>
                <input
                  type="text"
                  id="siret"
                  className="register-form-input"
                  placeholder="123 456 789 00010"
                  value={formData.siret}
                  onChange={(e) => handleChange('siret', e.target.value)}
                  maxLength={14}
                />
                {errors.siret && (
                  <span className="error-text">{errors.siret}</span>
                )}
                <small className="help-text">
                  Si votre entreprise existe déjà, vous serez automatiquement rattaché
                </small>
              </div>
            </>
          )}

          <div className="register-form-group">
            <label htmlFor="password" className="register-form-label">
              Mot de passe *
            </label>
            <input
              type="password"
              id="password"
              className="register-form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
            <small className="help-text">
              Minimum 8 caractères
            </small>
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword" className="register-form-label">
              Confirmer le mot de passe *
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="register-form-input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>
        </form>

        <div className="register-footer">
          Déjà un compte ?{' '}
          <Link to="/login" className="register-link">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
