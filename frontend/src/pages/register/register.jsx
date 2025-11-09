import { Link } from 'react-router-dom'
import { useRegister } from './register.ts'
import './register.css'

function Register() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
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
            <div style={{ color: 'red', textAlign: 'center' }}>
              {errors.general}
            </div>
          )}

          <div className="register-form-group">
            <label htmlFor="name" className="register-form-label">
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              className="register-form-input"
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.name}</span>
            )}
          </div>

          <div className="register-form-group">
            <label htmlFor="email" className="register-form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="register-form-input"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.email}</span>
            )}
          </div>

          <div className="register-form-group">
            <label htmlFor="password" className="register-form-label">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="register-form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.password}</span>
            )}
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword" className="register-form-label">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="register-form-input"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {errors.confirmPassword && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Inscription...' : 'S\'inscrire'}
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
