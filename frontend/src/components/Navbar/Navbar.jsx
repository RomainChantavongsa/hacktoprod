import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'
import TransporteurMobileMenu from '../MobileMenu/transporteur/MobileMenu.jsx'
import DonneurOrdreMobileMenu from '../MobileMenu/donneurOrdre/MobileMenu.jsx'
import './Navbar.scss'

function Navbar() {
  const { user, logout, isAuthenticated, getUserType } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const userType = getUserType()

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
            <img src="/images/GDSLogo.svg" alt="GDS Logo" className="navbar-logo-image" />
          </Link>

          <ul className="navbar-links">
          {!isAuthenticated() && (
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Accueil
              </NavLink>
            </li>
          )}
          
          {isAuthenticated() && (
            <>
              {/* Sections principales - Navigation par sidebar */}
              {userType === 'donneurOrdre' || userType === 'donneur_ordre' ? (
                <>
                  {/* Menu Donneur d'Ordre */}
                  <li>
                    <NavLink 
                      to="/offres/publier" 
                      className={location.pathname.startsWith('/offres') ? 'navbar-link active' : 'navbar-link'}
                    >
                      Mes offres de transport
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/entreprise/profil" 
                      className={location.pathname.startsWith('/entreprise') ? 'navbar-link active' : 'navbar-link'}
                    >
                      Mon Entreprise
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/parametres" 
                      className={location.pathname.startsWith('/parametres') ? 'navbar-link active' : 'navbar-link'}
                    >
                      Paramètres
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  {/* Menu Transporteur */}
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
                      to="/parametres" 
                      className={location.pathname.startsWith('/parametres') ? 'navbar-link active' : 'navbar-link'}
                    >
                      Paramètres
                    </NavLink>
                  </li>
                </>
              )}
            </>
          )}
        </ul>

        <div className="navbar-user">
          {isAuthenticated() ? (
            <>
              <span className="navbar-username">👤 {user?.username}</span>
              <button onClick={handleLogout} className="navbar-logout-btn">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Connexion
              </NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Inscription
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>

    {/* Mobile Menu */}
    {isAuthenticated() && (
      <>
        {userType === 'donneurOrdre' || userType === 'donneur_ordre' ? (
          <DonneurOrdreMobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        ) : (
          <TransporteurMobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </>
    )}
    </>
  )
}

export default Navbar
