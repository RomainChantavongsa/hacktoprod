import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import './MobileMenu.scss'

function MobileMenu({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [expandedSection, setExpandedSection] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose()
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleNavClick = () => {
    onClose()
  }

  const transportLinks = [
    { to: '/transports/commandes', icon: '📋', label: 'Commandes' },
    { to: '/transports/encheres', icon: '👁️', label: 'Vos enchères' },
    { to: '/transports/recu', icon: '🚚', label: 'Reçu' },
    { to: '/transports/effectue', icon: '✓', label: 'Effectué' },
    { to: '/transports/non-recu', icon: '⏱️', label: 'Non reçu' },
  ]

  const entrepriseLinks = [
    { to: '/entreprise/verification', icon: '📱', label: 'Guide de vérification' },
    { to: '/entreprise/profil', icon: '👤', label: 'Profil' },
    { to: '/entreprise/documents', icon: '📄', label: 'Documents' },
    { to: '/entreprise/compte-bancaire', icon: '💳', label: 'Compte bancaire' },
    { to: '/entreprise/vehicules', icon: '🚛', label: 'Véhicules' },
    { to: '/entreprise/remorques', icon: '🚐', label: 'Remorques' },
    { to: '/entreprise/telephones', icon: '📞', label: 'Téléphones' },
    { to: '/entreprise/conducteurs', icon: '👨‍✈️', label: 'Conducteurs' },
  ]

  const parametresLinks = [
    { to: '/parametres', icon: '⚙️', label: 'Aperçu des paramètres' },
    { to: '/parametres/compte', icon: '👤', label: 'Mon compte' },
    { to: '/parametres/notifications', icon: '🔔', label: 'Notifications' },
    { to: '/parametres/securite', icon: '�', label: 'Sécurité' },
  ]

  return (
    <>
      {/* Overlay */}
      <div 
        className={`mobile-menu-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">
            <img src="/images/GDSLogo.svg" alt="GDS Logo" className="logo-image" />
          </div>
          <button className="mobile-menu-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="mobile-menu-nav">
          {/* Section Trouver des transports */}
          <div className="menu-section">
            <button 
              className={`menu-section-header ${expandedSection === 'transports' ? 'expanded' : ''}`}
              onClick={() => toggleSection('transports')}
            >
              <span>Trouver des transports</span>
              <span className="menu-arrow">{expandedSection === 'transports' ? '▲' : '▼'}</span>
            </button>
            <div className={`menu-section-content ${expandedSection === 'transports' ? 'expanded' : ''}`}>
              {transportLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="menu-item-icon">{link.icon}</span>
                  <span className="menu-item-label">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Section Mon Entreprise */}
          <div className="menu-section">
            <button 
              className={`menu-section-header ${expandedSection === 'entreprise' ? 'expanded' : ''}`}
              onClick={() => toggleSection('entreprise')}
            >
              <span>Mon Entreprise</span>
              <span className="menu-arrow">{expandedSection === 'entreprise' ? '▲' : '▼'}</span>
            </button>
            <div className={`menu-section-content ${expandedSection === 'entreprise' ? 'expanded' : ''}`}>
              {entrepriseLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="menu-item-icon">{link.icon}</span>
                  <span className="menu-item-label">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Section Paramètres */}
          <div className="menu-section">
            <button 
              className={`menu-section-header ${expandedSection === 'parametres' ? 'expanded' : ''}`}
              onClick={() => toggleSection('parametres')}
            >
              <span>Paramètres</span>
              <span className="menu-arrow">{expandedSection === 'parametres' ? '▲' : '▼'}</span>
            </button>
            <div className={`menu-section-content ${expandedSection === 'parametres' ? 'expanded' : ''}`}>
              {parametresLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="menu-item-icon">{link.icon}</span>
                  <span className="menu-item-label">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="mobile-menu-footer">
          <button className="menu-footer-item">
            <span className="menu-item-icon">🌍</span>
            <span className="menu-item-label">Langue</span>
            <span className="menu-arrow">▼</span>
          </button>
          <button className="menu-footer-item" onClick={handleLogout}>
            <span className="menu-item-icon">🚪</span>
            <span className="menu-item-label">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default MobileMenu
