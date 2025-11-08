import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-black bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 flex items-center gap-2">
              <span className="text-4xl animate-bounce">🚚</span>
              <span>TransportConnect</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 font-semibold transition-all duration-300 hover:scale-110 relative group"
                >
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <div className="flex items-center gap-3 bg-gradient-to-r from-primary-50 to-primary-100 px-4 py-2 rounded-full border border-primary-200 shadow-sm">
                  <span className="text-2xl">
                    {user.user_type === 'transporteur' ? '🚛' : '📦'}
                  </span>
                  <span className="text-sm font-semibold text-primary-800">
                    {user.user_type === 'transporteur' ? 'Transporteur' : 'Donneur d\'ordre'}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium px-3 py-1.5 bg-gray-100 rounded-full">{user.email}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Connexion</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Inscription</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
