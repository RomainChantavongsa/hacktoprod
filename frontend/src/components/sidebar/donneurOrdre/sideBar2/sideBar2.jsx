import { NavLink } from 'react-router-dom'
import './sideBar2.scss'

// Sidebar pour la section "Mon Entreprise" (Donneur d'Ordre)
function SideBar2() {
  return (
    <aside className="sidebar sidebar2">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Navigation</h3>
        <button className="sidebar-toggle">
          ‹
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li>
            <NavLink 
              to="/entreprise/profil" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">👤</span>
              <span className="sidebar-label">Profil</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/entreprise/documents" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">📄</span>
              <span className="sidebar-label">Documents</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/entreprise/compte-bancaire" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">💳</span>
              <span className="sidebar-label">Compte bancaire</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/entreprise/entrepots" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">🏭</span>
              <span className="sidebar-label">Entrepôts</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/entreprise/contacts" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">📞</span>
              <span className="sidebar-label">Contacts</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar2
