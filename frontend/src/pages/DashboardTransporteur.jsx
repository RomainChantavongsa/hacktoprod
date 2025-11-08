import { useState, useEffect } from 'react';
import { offersAPI, bidsAPI } from '../services/api';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function DashboardTransporteur() {
  const [offers, setOffers] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [bidPrice, setBidPrice] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [offersRes, bidsRes] = await Promise.all([
        offersAPI.getAll({ status: 'open' }),
        bidsAPI.getMyBids(),
      ]);
      setOffers(offersRes.data);
      setMyBids(bidsRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    try {
      await bidsAPI.create(selectedOffer.id, {
        price: parseFloat(bidPrice),
        message: bidMessage,
      });
      toast.success('Enchère soumise avec succès!');
      setSelectedOffer(null);
      setBidPrice('');
      setBidMessage('');
      fetchData();
    } catch (error) {
      toast.error('Erreur lors de la soumission de l\'enchère');
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🚛 Dashboard Transporteur</h1>
          <p className="text-gray-600">Consultez les offres disponibles et gérez vos enchères</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Offres disponibles</h2>
            <div className="space-y-4">
              {offers.length === 0 ? (
                <Card>
                  <p className="text-gray-500 text-center py-8">Aucune offre disponible</p>
                </Card>
              ) : (
                offers.map((offer) => (
                  <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{offer.title}</h3>
                        <p className="text-gray-600 mt-1">{offer.description}</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Ouvert
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">📍 Enlèvement</p>
                        <p className="font-medium">{offer.pickup_location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">📦 Livraison</p>
                        <p className="font-medium">{offer.delivery_location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">⚖️ Poids</p>
                        <p className="font-medium">{offer.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">📅 Date</p>
                        <p className="font-medium">{new Date(offer.pickup_date).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <Button onClick={() => setSelectedOffer(offer)}>
                      Faire une offre
                    </Button>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Mes enchères</h2>
            <div className="space-y-4">
              {myBids.length === 0 ? (
                <Card>
                  <p className="text-gray-500 text-center py-4">Aucune enchère</p>
                </Card>
              ) : (
                myBids.map((bid) => (
                  <Card key={bid.id}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{bid.offer?.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bid.status === 'accepted' ? 'Accepté' :
                         bid.status === 'rejected' ? 'Refusé' : 'En attente'}
                      </span>
                    </div>
                    <p className="text-lg font-bold text-primary-600">{bid.price} €</p>
                    <p className="text-sm text-gray-600 mt-1">{bid.message}</p>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Faire une offre</h3>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-800">{selectedOffer.title}</h4>
              <p className="text-sm text-gray-600">
                {selectedOffer.pickup_location} → {selectedOffer.delivery_location}
              </p>
            </div>

            <form onSubmit={handleSubmitBid} className="space-y-4">
              <Input
                label="Votre prix (€)"
                type="number"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                placeholder="1500"
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optionnel)
                </label>
                <textarea
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows="3"
                  placeholder="Détails sur votre offre..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setSelectedOffer(null)} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" className="flex-1">
                  Soumettre
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
