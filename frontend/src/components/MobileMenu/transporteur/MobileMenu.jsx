import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import Icon from '../../Icon.jsx'
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
    { to: '/offres/disponibles', icon: 'search', label: 'Offres disponibles' },
    { to: '/offres/mes-propositions', icon: 'edit', label: 'Mes propositions' },
    { to: '/missions/en-cours', icon: 'truck', label: 'Missions en cours' },
    { to: '/missions/terminees', icon: 'check', label: 'Missions terminées' },
  ]

  const entrepriseLinks = [
    { to: '/entreprise/verification', icon: 'smartphone', label: 'Guide de vérification' },
    { to: '/entreprise/profil', icon: 'user', label: 'Profil' },
    { to: '/entreprise/documents', icon: 'document', label: 'Documents' },
    { to: '/entreprise/compte-bancaire', icon: 'creditCard', label: 'Compte bancaire' },
    { to: '/entreprise/vehicules', icon: 'truck', label: 'Véhicules' },
    { to: '/entreprise/remorques', icon: 'trailer', label: 'Remorques' },
    { to: '/entreprise/annuaire', icon: 'book', label: 'Annuaire' },
    { to: '/entreprise/conducteurs', icon: 'users', label: 'Conducteurs' },
  ]

  const parametresLinks = [
    { to: '/parametres', icon: 'settings', label: 'Aperçu des paramètres' },
    { to: '/parametres/compte', icon: 'user', label: 'Mon compte' },
    { to: '/parametres/notifications', icon: 'bell', label: 'Notifications' },
    { to: '/parametres/securite', icon: 'lock', label: 'Sécurité' },
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
            <Icon name="close" size={24} />
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
                  <span className="menu-item-icon"><Icon name={link.icon} size={18} /></span>
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
                  <span className="menu-item-icon"><Icon name={link.icon} size={18} /></span>
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
                  <span className="menu-item-icon"><Icon name={link.icon} size={18} /></span>
                  <span className="menu-item-label">{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="mobile-menu-footer">
          <button className="menu-footer-item">
            <span className="menu-item-icon"><Icon name="globe" size={18} /></span>
            <span className="menu-item-label">Langue</span>
            <span className="menu-arrow">▼</span>
          </button>
          <button className="menu-footer-item" onClick={handleLogout}>
            <span className="menu-item-icon"><Icon name="logout" size={18} /></span>
            <span className="menu-item-label">Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default MobileMenu
