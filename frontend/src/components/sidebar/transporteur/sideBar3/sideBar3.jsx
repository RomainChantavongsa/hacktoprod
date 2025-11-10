import { NavLink } from 'react-router-dom'
import Icon from '../../../Icon.jsx'
import './sideBar3.scss'

// Sidebar pour la section "Paramètres"
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
              <span className="sidebar-icon"><Icon name="settings" size={18} /></span>
              <span className="sidebar-label">Aperçu</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/parametres/compte"
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="user" size={18} /></span>
              <span className="sidebar-label">Mon compte</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/parametres/notifications" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="bell" size={18} /></span>
              <span className="sidebar-label">Notifications</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/parametres/securite" 
              className={({ isActive }) => isActive ? 'sidebar-item active' : 'sidebar-item'}
            >
              <span className="sidebar-icon"><Icon name="lock" size={18} /></span>
              <span className="sidebar-label">Sécurité</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default SideBar3
