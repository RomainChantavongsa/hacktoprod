import { Link } from 'react-router-dom'
import Icon from '../../../components/Icon.jsx'
import './index.scss'

function ParametresIndex() {
  const settingsMenu = [
    {
      title: 'Profil Entreprise',
      description: 'Gérez les informations de votre entreprise, flotte et certifications',
      icon: 'building',
      path: '/entreprise/profil',
      color: '#3D9BA6'
    },
    {
      title: 'Compte',
      description: 'Gérez vos informations personnelles',
      icon: 'user',
      path: '/parametres/compte',
      color: '#667eea'
    },
    {
      title: 'Notifications',
      description: 'Configurez vos préférences de notifications',
      icon: 'bell',
      path: '/parametres/notifications',
      color: '#f093fb'
    },
    {
      title: 'Sécurité',
      description: 'Modifiez votre mot de passe et paramètres de sécurité',
      icon: 'lock',
      path: '/parametres/securite',
      color: '#4facfe'
    }
  ]

  return (
    <div className="parametres-index">
      <div className="page-header">
        <h1>Paramètres</h1>
        <p className="subtitle">Gérez vos préférences et paramètres de compte</p>
      </div>

      <div className="settings-grid">
        {settingsMenu.map((item, index) => (
          <Link 
            key={index}
            to={item.path} 
            className="settings-card"
            style={{ '--card-color': item.color }}
          >
            <div className="card-icon"><Icon name={item.icon} size={32} /></div>
            <div className="card-content">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
            <div className="card-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ParametresIndex
