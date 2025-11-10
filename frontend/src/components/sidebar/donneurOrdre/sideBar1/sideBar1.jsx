import { NavLink } from 'react-router-dom'
import Icon from '../../../Icon.jsx'
import './sideBar1.scss'

// Sidebar pour la section "Mes offres" (Donneur d'Ordre)
function SideBar1() {
  return (
    <aside className="sidebar sidebar1">
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li>
            <NavLink 
              to="/offres/publier" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="plus" size={18} /></span>
              <span className="sidebar-label">Publier une offre</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/offres/actives" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="clipboard" size={18} /></span>
              <span className="sidebar-label">Offres actives</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/offres/propositions" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="eye" size={18} /></span>
              <span className="sidebar-label">Propositions reçues</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/missions/en-cours" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="truck" size={18} /></span>
              <span className="sidebar-label">Missions en cours</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/missions/terminees" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="check" size={18} /></span>
              <span className="sidebar-label">Missions terminées</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar1
