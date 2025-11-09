import './notifications.scss'

function Notifications() {
  return (
    <div className="notifications-page">
      <div className="page-header">
        <h1>Paramètres des Notifications</h1>
        <p className="subtitle">Gérez vos préférences de notifications</p>
      </div>

      <div className="settings-section">
        <h2>Notifications par Email</h2>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked />
            <span>Recevoir des emails pour les nouvelles offres</span>
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked />
            <span>Recevoir des emails pour les messages</span>
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" />
            <span>Newsletter hebdomadaire</span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Notifications Push</h2>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked />
            <span>Notifications en temps réel</span>
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" />
            <span>Notifications de rappel</span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Notifications SMS</h2>
        <div className="setting-item">
          <label>
            <input type="checkbox" />
            <span>Recevoir des SMS pour les offres urgentes</span>
          </label>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-primary">Enregistrer les modifications</button>
        <button className="btn btn-secondary">Réinitialiser</button>
      </div>
    </div>
  )
}

export default Notifications
