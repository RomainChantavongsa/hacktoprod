import { Link } from 'react-router-dom'
import { useLogin } from './login.ts'
import './login.css'

function Login() {
  const { username, setUsername, password, setPassword, errors, loading, handleSubmit } = useLogin()

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
            <label htmlFor="username" className="login-form-label">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              className="login-form-input"
              placeholder="votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && (
              <span style={{ color: 'red', fontSize: '0.875rem' }}>{errors.username}</span>
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
