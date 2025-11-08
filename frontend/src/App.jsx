import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Loading from './components/common/Loading';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardTransporteur from './pages/DashboardTransporteur';
import DashboardDonneur from './pages/DashboardDonneur';

// Componente per proteggere le route che richiedono autenticazione
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return user ? children : <Navigate to="/login" />;
}

// Componente per reindirizzare automaticamente alla dashboard corretta
function DashboardRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.user_type === 'transporteur'
    ? <Navigate to="/dashboard/transporteur" />
    : <Navigate to="/dashboard/donneur" />;
}

function AppRoutes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route
          path="/dashboard/transporteur"
          element={
            <PrivateRoute>
              <DashboardTransporteur />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/donneur"
          element={
            <PrivateRoute>
              <DashboardDonneur />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
