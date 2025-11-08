import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-600 opacity-3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block mb-6">
            <span className="text-8xl inline-block">🚚</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black mb-8 text-white">
            TransportConnect
          </h1>
          <p className="text-3xl md:text-4xl mb-6 font-semibold animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            La plateforme de mise en relation
          </p>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Connectez transporteurs et donneurs d'ordre pour simplifier vos opérations de transport avec notre solution SaaS innovante
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-10 hover:bg-opacity-15 transition-all duration-300 transform hover:scale-102 hover:-translate-y-1 shadow-xl border border-white border-opacity-10 animate-fade-in-left">
            <div className="text-6xl mb-6">🚛</div>
            <h3 className="text-3xl font-bold mb-6 text-white">Pour les Transporteurs</h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                <span className="text-2xl">✓</span>
                <span>Accédez à des milliers d'offres de transport</span>
              </li>
              <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                <span className="text-2xl">✓</span>
                <span>Soumettez vos enchères en temps réel</span>
              </li>
              <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                <span className="text-2xl">✓</span>
                <span>Gérez votre activité efficacement</span>
              </li>
              <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                <span className="text-2xl">✓</span>
                <span>Recevez des notifications instantanées</span>
              </li>
            </ul>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-10 hover:bg-opacity-15 transition-all duration-300 transform hover:scale-102 hover:-translate-y-1 shadow-xl border border-white border-opacity-10 animate-fade-in-right">
            <div className="text-6xl mb-6">📦</div>
            <h3 className="text-3xl font-bold mb-6 text-white">Pour les Donneurs d'ordre</h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                <span className="text-2xl">✓</span>
                <span>Publiez vos offres en quelques clics</span>
              </li>
              <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                <span className="text-2xl">✓</span>
                <span>Recevez des enchères compétitives</span>
              </li>
              <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                <span className="text-2xl">✓</span>
                <span>Choisissez le meilleur transporteur</span>
              </li>
              <li className="flex items-start gap-3 hover:translate-x-2 transition-transform duration-300">
                <span className="text-2xl">✓</span>
                <span>Suivez vos expéditions en direct</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" className="text-2xl px-12 py-6 shadow-2xl hover:shadow-3xl">
                Accéder au Dashboard →
              </Button>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register">
                <Button size="lg" className="text-2xl px-12 py-6 bg-white text-primary-600 hover:bg-gray-100 shadow-2xl">
                  Commencer gratuitement →
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-2xl px-12 py-6 border-2 border-white text-white hover:bg-white hover:text-primary-600 shadow-2xl">
                  Se connecter
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl font-black mb-2 text-blue-400">500+</div>
            <div className="text-lg opacity-90">Transporteurs actifs</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl font-black mb-2 text-blue-400">1000+</div>
            <div className="text-lg opacity-90">Offres publiées</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-5xl font-black mb-2 text-blue-400">98%</div>
            <div className="text-lg opacity-90">Satisfaction client</div>
          </div>
        </div>

        <div className="mt-20 text-center opacity-90 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <p className="text-xl font-medium">
            Rejoignez des centaines de transporteurs et donneurs d'ordre qui font confiance à TransportConnect
          </p>
        </div>
      </div>
    </div>
  );
}
