import { NavLink } from 'react-router-dom'
import './sideBar1.scss'

// Sidebar pour la section "Trouver des transports" (Transporteur)
function SideBar1() {
  return (
    <aside className="sidebar sidebar1">
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li>
            <NavLink 
              to="/transports/commandes" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">📋</span>
              <span className="sidebar-label">Commandes</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/transports/encheres" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">👁️</span>
              <span className="sidebar-label">Vos enchères</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/transports/recu" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">🚚</span>
              <span className="sidebar-label">Reçu</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/transports/effectue" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">✓</span>
              <span className="sidebar-label">Effectué</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/transports/non-recu" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">⏱️</span>
              <span className="sidebar-label">Non reçu</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar1
