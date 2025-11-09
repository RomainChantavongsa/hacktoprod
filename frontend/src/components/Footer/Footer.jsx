import { Link } from 'react-router-dom'
import './Footer.scss'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-copyright">
            © {new Date().getFullYear()} HackToGone. Tous droits réservés.
          </div>
          <ul className="footer-links">
            <li>
              <Link to="/about" className="footer-link">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="footer-link">
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
