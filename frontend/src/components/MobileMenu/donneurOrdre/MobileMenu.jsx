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

  const offresLinks = [
    { to: '/offres/publier', icon: '➕', label: 'Publier une offre' },
    { to: '/offres/actives', icon: '📋', label: 'Offres actives' },
    { to: '/offres/propositions', icon: '👁️', label: 'Propositions reçues' },
    { to: '/offres/en-cours', icon: '🚚', label: 'En cours' },
    { to: '/offres/terminees', icon: '✓', label: 'Terminées' },
  ]

  const entrepriseLinks = [
    { to: '/entreprise/profil', icon: '👤', label: 'Profil' },
    { to: '/entreprise/documents', icon: '📄', label: 'Documents' },
    { to: '/entreprise/compte-bancaire', icon: '💳', label: 'Compte bancaire' },
    { to: '/entreprise/entrepots', icon: '🏭', label: 'Entrepôts' },
    { to: '/entreprise/contacts', icon: '📞', label: 'Contacts' },
  ]

  const parametresLinks = [
    { to: '/parametres/notifications', icon: '🔔', label: 'Notifications' },
    { to: '/parametres/compte', icon: '👥', label: 'Account' },
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
            <span className="logo-icon">📦</span>
            <span className="logo-text">zipmend</span>
            <span className="logo-subtitle">Express</span>
          </div>
          <button className="mobile-menu-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <nav className="mobile-menu-nav">
          {/* Section Mes offres */}
          <div className="menu-section">
            <button 
              className={`menu-section-header ${expandedSection === 'offres' ? 'expanded' : ''}`}
              onClick={() => toggleSection('offres')}
            >
              <span>Mes offres de transport</span>
              <span className="menu-arrow">{expandedSection === 'offres' ? '▲' : '▼'}</span>
            </button>
            <div className={`menu-section-content ${expandedSection === 'offres' ? 'expanded' : ''}`}>
              {offresLinks.map((link) => (
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
