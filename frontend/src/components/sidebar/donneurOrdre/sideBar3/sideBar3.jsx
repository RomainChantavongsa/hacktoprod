import { NavLink } from 'react-router-dom'
import './sideBar3.scss'

// Sidebar pour la section "Paramètres" (Donneur d'Ordre)
function SideBar3() {
  return (
    <aside className="sidebar sidebar3">
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li>
            <NavLink 
              to="/parametres" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
              end
            >
              <span className="sidebar-icon">⚙️</span>
              <span className="sidebar-label">Aperçu</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/parametres/compte"
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">👤</span>
              <span className="sidebar-label">Mon compte</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/parametres/notifications" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">🔔</span>
              <span className="sidebar-label">Notifications</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/parametres/securite" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">🔒</span>
              <span className="sidebar-label">Sécurité</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar3
