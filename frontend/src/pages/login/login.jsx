import { Link } from 'react-router-dom'
import { useLogin } from './login.ts'
import './login.css'

function Login() {
  const { email, setEmail, password, setPassword, errors, loading, handleSubmit } = useLogin()

  return (
    <div className="login">
      <div className="login-container">
        <h1 className="login-title">Connexion</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          {errors.general && (
            <div style={{ color: 'red', textAlign: 'center' }}>
              {errors.general}
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="email" className="login-form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="login-form-input"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.email}</span>
            )}
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-form-label">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="login-form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.password}</span>
            )}
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="login-footer">
          Pas encore de compte ?{' '}
          <Link to="/register" className="login-link">
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
