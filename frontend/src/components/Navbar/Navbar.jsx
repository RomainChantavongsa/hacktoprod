import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import MobileMenu from '../MobileMenu/MobileMenu.jsx'
import './Navbar.scss'

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Burger Menu Button (Mobile Only) */}
          {isAuthenticated() && (
            <button className="navbar-burger" onClick={toggleMobileMenu}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          )}

          <Link to="/" className="navbar-logo">
            HackToGone
          </Link>
          <ul className="navbar-links">
          {!isAuthenticated() && (
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Accueil
              </NavLink>
            </li>
          )}
          
          {isAuthenticated() ? (
            <>
              {/* Sections principales - Navigation par sidebar */}
              <li>
                <NavLink 
                  to="/transports/commandes" 
                  className={location.pathname.startsWith('/transports') ? 'navbar-link active' : 'navbar-link'}
                >
                  Trouver des transports
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/entreprise/verification" 
                  className={location.pathname.startsWith('/entreprise') ? 'navbar-link active' : 'navbar-link'}
                >
                  Mon Entreprise
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/parametres/notifications" 
                  className={location.pathname.startsWith('/parametres') ? 'navbar-link active' : 'navbar-link'}
                >
                  Paramètres
                </NavLink>
              </li>
              
              <li className="navbar-user">
                <span className="navbar-username">👤 {user?.username}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="navbar-link navbar-logout-btn">
                  Déconnexion
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                  Connexion
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                  Inscription
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>

    {/* Mobile Menu */}
    {isAuthenticated() && (
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    )}
    </>
  )
}

export default Navbar
