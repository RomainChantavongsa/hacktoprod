import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavbar } from '../../../contexts/NavbarContext';
import Button from '../Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { activeSection, setActiveSection } = useNavbar();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Trouver des transports', section: 'transports', path: '/commandes' },
    { label: 'Mon Entreprise', section: 'entreprise', path: '/entreprise/profil' },
    { label: 'Paramètres', section: 'parametres', path: '/parametres/notifications' },
    { label: 'Paiement', section: 'paiement', path: '/paiement/historique' }
  ];

  const handleNavClick = (section, path) => {
    setActiveSection(section);
    navigate(path);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-3xl font-black bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent hover:scale-110 transition-transform duration-300 flex items-center gap-2">
              <span className="text-4xl animate-bounce">🚚</span>
              <span>TransportConnect</span>
            </Link>
            
            {user && (
              <div className="flex items-center gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.section}
                    onClick={() => handleNavClick(item.section, item.path)}
                    className={`text-sm font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg ${
                      activeSection === item.section
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-600 transition-all duration-300 ${
                      activeSection === item.section ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <>
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
