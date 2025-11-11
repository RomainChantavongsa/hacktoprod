import { NavLink } from 'react-router-dom'
import Icon from '../../../Icon.jsx'
import './sideBar2.scss'

// Sidebar pour la section "Mon Entreprise"
function SideBar2() {
  return (
    <aside className="sidebar sidebar2">
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li>
            <NavLink
              to="/entreprise/profil"
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="user" size={18} /></span>
              <span className="sidebar-label">Profil</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/entreprise/documents" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="document" size={18} /></span>
              <span className="sidebar-label">Documents</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/entreprise/compte-bancaire" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="creditCard" size={18} /></span>
              <span className="sidebar-label">Compte bancaire</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/entreprise/vehicules" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="truck" size={18} /></span>
              <span className="sidebar-label">Véhicules</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/entreprise/remorques" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="trailer" size={18} /></span>
              <span className="sidebar-label">Remorques</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/entreprise/annuaire"
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="book" size={18} /></span>
              <span className="sidebar-label">Annuaire</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/entreprise/conducteurs" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="users" size={18} /></span>
              <span className="sidebar-label">Conducteurs</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar2
