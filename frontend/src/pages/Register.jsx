import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    user_type: 'transporteur',
    company_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      toast.success('Inscription réussie!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-slate-600 opacity-3 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="w-full max-w-3xl relative z-10 animate-fade-in-up">
        <Card className="backdrop-blur-sm bg-white bg-opacity-95">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <span className="text-6xl inline-block">🚚</span>
            </div>
            <h1 className="text-4xl font-black text-slate-800 mb-3">
              TransportConnect
            </h1>
            <p className="text-gray-600 text-lg font-medium">Créez votre compte gratuitement</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Type de compte</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex flex-col items-center p-6 border-3 rounded-2xl cursor-pointer transition-all duration-300 ${formData.user_type === 'transporteur' ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="user_type"
                    value="transporteur"
                    checked={formData.user_type === 'transporteur'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-5xl mb-3">🚛</div>
                  <div className="font-bold text-lg">Transporteur</div>
                  <div className="text-xs text-gray-600 mt-1 text-center">Accédez aux offres de transport</div>
                </label>

                <label className={`flex flex-col items-center p-6 border-3 rounded-2xl cursor-pointer transition-all duration-300 ${formData.user_type === 'donneur' ? 'border-green-600 bg-gradient-to-br from-green-50 to-green-100 shadow-lg' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="user_type"
                    value="donneur"
                    checked={formData.user_type === 'donneur'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div className="text-5xl mb-3">📦</div>
                  <div className="font-bold text-lg">Donneur d'ordre</div>
                  <div className="text-xs text-gray-600 mt-1 text-center">Publiez vos offres</div>
                </label>
              </div>
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Mot de passe"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <Input
                label="Confirmer mot de passe"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <Input
              label="Nom de l'entreprise"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Transport SARL"
              required
            />

            <Input
              label="Téléphone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+33 6 12 34 56 78"
              required
            />

            <Button type="submit" className="w-full mt-8" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création du compte...
                </span>
              ) : (
                'Créer mon compte →'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Vous avez déjà un compte?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline">
                Connectez-vous
              </Link>
            </p>
            <Link to="/" className="block mt-4 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm">
              ← Retour à l'accueil
            </Link>
          </div>
        </Card>

        {/* Trust indicators */}
        <div className="mt-8 text-center text-white text-sm opacity-90">
          <p className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Connexion sécurisée SSL
          </p>
        </div>
      </div>
    </div>
  );
}
