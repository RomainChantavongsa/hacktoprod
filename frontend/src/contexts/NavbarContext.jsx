import { createContext, useContext, useState } from 'react';

const NavbarContext = createContext();

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};

// Configuration des sidebars pour chaque section
export const sidebarConfigs = {
  transports: [
    { label: 'Commandes', icon: '📋', to: '/commandes' },
    { label: 'Vos enchères', icon: '🏷️', to: '/encheres' },
    { label: 'Reçu', icon: '📦', to: '/recu' },
    { label: 'Effectué', icon: '✅', to: '/effectue' },
    { label: 'Non reçu', icon: '❌', to: '/non-recu' }
  ],
  entreprise: [
    { label: 'Guide de vérification', icon: '📖', to: '/entreprise/guide' },
    { label: 'Profil', icon: '👤', to: '/entreprise/profil' },
    { label: 'Documents', icon: '📄', to: '/entreprise/documents' },
    { label: 'Compte bancaire', icon: '💳', to: '/entreprise/compte-bancaire' },
    { label: 'Véhicules', icon: '🚛', to: '/entreprise/vehicules' },
    { label: 'Remorques', icon: '🚚', to: '/entreprise/remorques' },
    { label: 'Téléphones', icon: '📱', to: '/entreprise/telephones' },
    { label: 'Conducteurs', icon: '👨‍✈️', to: '/entreprise/conducteurs' }
  ],
  parametres: [
    { label: 'Notifications', icon: '🔔', to: '/parametres/notifications' },
    { label: 'Account', icon: '⚙️', to: '/parametres/account' }
  ],
  paiement: [
    { label: 'Historique', icon: '💰', to: '/paiement/historique' },
    { label: 'Méthodes de paiement', icon: '💳', to: '/paiement/methodes' }
  ]
};

export const NavbarProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('transports');

  const getSidebarItems = () => {
    return sidebarConfigs[activeSection] || sidebarConfigs.transports;
  };

  return (
    <NavbarContext.Provider value={{ activeSection, setActiveSection, getSidebarItems }}>
      {children}
    </NavbarContext.Provider>
  );
};
