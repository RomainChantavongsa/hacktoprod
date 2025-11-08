import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './pages/template/navBar_transport/navBar.jsx';
import { AuthProvider } from './contexts/AuthContext';
import { NavbarProvider } from './contexts/NavbarContext';

// Pages - Transports
import Commandes from './pages/transports/Commandes';
import VosEncheres from './pages/transports/VosEncheres';
import Recu from './pages/transports/Recu';
import Effectue from './pages/transports/Effectue';
import NonRecu from './pages/transports/NonRecu';

// Pages - Entreprise
import Guide from './pages/entreprise/Guide';
import Profil from './pages/entreprise/Profil';
import Documents from './pages/entreprise/Documents';
import CompteBancaire from './pages/entreprise/CompteBancaire';
import Vehicules from './pages/entreprise/Vehicules';
import Remorques from './pages/entreprise/Remorques';
import Telephones from './pages/entreprise/Telephones';
import Conducteurs from './pages/entreprise/Conducteurs';

// Pages - Paramètres
import Notifications from './pages/parametres/Notifications';
import Account from './pages/parametres/Account';

// Pages - Paiement
import Historique from './pages/paiement/Historique';
import Methodes from './pages/paiement/Methodes';

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Transports */}
        <Route path="/" element={<Navigate to="/commandes" />} />
        <Route path="/commandes" element={<Commandes />} />
        <Route path="/encheres" element={<VosEncheres />} />
        <Route path="/recu" element={<Recu />} />
        <Route path="/effectue" element={<Effectue />} />
        <Route path="/non-recu" element={<NonRecu />} />
        
        {/* Entreprise */}
        <Route path="/entreprise/guide" element={<Guide />} />
        <Route path="/entreprise/profil" element={<Profil />} />
        <Route path="/entreprise/documents" element={<Documents />} />
        <Route path="/entreprise/compte-bancaire" element={<CompteBancaire />} />
        <Route path="/entreprise/vehicules" element={<Vehicules />} />
        <Route path="/entreprise/remorques" element={<Remorques />} />
        <Route path="/entreprise/telephones" element={<Telephones />} />
        <Route path="/entreprise/conducteurs" element={<Conducteurs />} />
        
        {/* Paramètres */}
        <Route path="/parametres/notifications" element={<Notifications />} />
        <Route path="/parametres/account" element={<Account />} />
        
        {/* Paiement */}
        <Route path="/paiement/historique" element={<Historique />} />
        <Route path="/paiement/methodes" element={<Methodes />} />
        
        <Route path="*" element={<Navigate to="/commandes" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavbarProvider>
          <AppRoutes />
        </NavbarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
