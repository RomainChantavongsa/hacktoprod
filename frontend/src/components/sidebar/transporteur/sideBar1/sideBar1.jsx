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
              to="/offres/disponibles"
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">�</span>
              <span className="sidebar-label">Offres disponibles</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/offres/mes-propositions" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">�</span>
              <span className="sidebar-label">Mes propositions</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/missions/en-cours" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">🚚</span>
              <span className="sidebar-label">Missions en cours</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/missions/terminees" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon">✓</span>
              <span className="sidebar-label">Missions terminées</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar1
