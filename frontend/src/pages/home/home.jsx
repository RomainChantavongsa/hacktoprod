import { homeLogic } from './home.ts'
import Icon from '../../components/Icon.jsx'
import './home.scss'

function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>Bienvenue sur HackToGone</h1>
        <p>Plateforme de gestion de transport et de fret</p>
      </div>

      <div className="home-features">
        <div className="home-feature-card">
          <div className="home-feature-icon"><Icon name="truck" size={48} /></div>
          <h3>Transport</h3>
          <p>Gestion complète de vos transports et livraisons</p>
        </div>

        <div className="home-feature-card">
          <div className="home-feature-icon"><Icon name="package" size={48} /></div>
          <h3>Fret</h3>
          <p>Optimisez vos opérations de fret</p>
        </div>

        <div className="home-feature-card">
          <div className="home-feature-icon"><Icon name="barChart" size={48} /></div>
          <h3>Suivi</h3>
          <p>Suivez vos commandes en temps réel</p>
        </div>
      </div>
    </div>
  )
}

export default Home
