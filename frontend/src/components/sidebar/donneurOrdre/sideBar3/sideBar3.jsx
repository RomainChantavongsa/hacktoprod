import { NavLink } from 'react-router-dom'
import './sideBar3.scss'

// Sidebar pour la section "Paramètres" (Donneur d'Ordre)
function SideBar3() {
  return (
    <aside className="sidebar sidebar3">
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
              to="/parametres/notifications" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">🔔</span>
              <span className="sidebar-label">Notifications</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/parametres/compte" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">👥</span>
              <span className="sidebar-label">Account</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar3
