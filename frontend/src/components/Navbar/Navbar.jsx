import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          HackToGone
        </Link>
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
              Accueil
            </NavLink>
          </li>
          <li>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
              Connexion
            </NavLink>
          </li>
          <li>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
              Inscription
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
