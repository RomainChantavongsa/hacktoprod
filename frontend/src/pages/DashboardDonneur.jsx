import { useState, useEffect } from 'react';
import { offersAPI } from '../services/api';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function DashboardDonneur() {
  const [myOffers, setMyOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pickup_location: '',
    delivery_location: '',
    pickup_date: '',
    weight: '',
    volume: '',
    vehicle_type: 'camion',
  });

  useEffect(() => {
    fetchMyOffers();
  }, []);

  const fetchMyOffers = async () => {
    try {
      const response = await offersAPI.getAll();
      setMyOffers(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await offersAPI.create(formData);
      toast.success('Offre créée avec succès!');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        pickup_location: '',
        delivery_location: '',
        pickup_date: '',
        weight: '',
        volume: '',
        vehicle_type: 'camion',
      });
      fetchMyOffers();
    } catch (error) {
      toast.error('Erreur lors de la création de l\'offre');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Dashboard Donneur d'ordre</h1>
            <p className="text-gray-600">Gérez vos offres de transport</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            + Nouvelle offre
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myOffers.length === 0 ? (
            <Card className="col-span-full">
              <p className="text-gray-500 text-center py-8">
                Aucune offre créée. Cliquez sur "Nouvelle offre" pour commencer.
              </p>
            </Card>
          ) : (
            myOffers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{offer.title}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    offer.status === 'open' ? 'bg-green-100 text-green-800' :
                    offer.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {offer.status === 'open' ? 'Ouvert' :
                     offer.status === 'assigned' ? 'Assigné' : 'Complété'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{offer.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📍</span>
                    <span>{offer.pickup_location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📦</span>
                    <span>{offer.delivery_location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">⚖️</span>
                    <span>{offer.weight} kg</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📅</span>
                    <span>{new Date(offer.pickup_date).toLocaleDateString()}</span>
                  </div>
                </div>

                {offer.bids_count > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium text-primary-600">
                      {offer.bids_count} enchère(s) reçue(s)
                    </p>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold">Créer une offre de transport</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Titre de l'offre"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Transport de marchandises Paris-Lyon"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows="3"
                  placeholder="Détails sur le transport..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Lieu d'enlèvement"
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleChange}
                  placeholder="Paris, France"
                  required
                />

                <Input
                  label="Lieu de livraison"
                  name="delivery_location"
                  value={formData.delivery_location}
                  onChange={handleChange}
                  placeholder="Lyon, France"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Date d'enlèvement"
                  name="pickup_date"
                  type="date"
                  value={formData.pickup_date}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Poids (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="1000"
                  required
                />

                <Input
                  label="Volume (m³)"
                  name="volume"
                  type="number"
                  step="0.1"
                  value={formData.volume}
                  onChange={handleChange}
                  placeholder="5.5"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de véhicule
                </label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="camion">Camion</option>
                  <option value="camionnette">Camionnette</option>
                  <option value="semi-remorque">Semi-remorque</option>
                  <option value="fourgon">Fourgon</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1">
                  Créer l'offre
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
