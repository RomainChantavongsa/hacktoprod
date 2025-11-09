import React from 'react';
import { useOffresFret } from './offres';
import './offres.css';

/**
 * Page d'affichage des offres de fret
 * Exemple d'utilisation des types TypeScript
 */
export default function Offres() {
  const { offres, loading, error, fetchOffresPubliees } = useOffresFret();

  // Charger les offres au montage du composant
  React.useEffect(() => {
    fetchOffresPubliees();
  }, []);

  if (loading) {
    return <div>Chargement des offres...</div>;
  }

  if (error) {
    return <div className="error">Erreur : {error}</div>;
  }

  return (
    <div className="offres-container">
      <h1>Offres de Fret Disponibles</h1>

      <div className="offres-list">
        {offres.map((offre) => (
          <div key={offre.id} className="offre-card">
            <h3>{offre.type_marchandise}</h3>
            <p>Poids : {offre.poids_marchandise_kg} kg</p>
            <p>
              De : {offre.ville_chargement} → À : {offre.ville_livraison}
            </p>
            <p>Date : {new Date(offre.date_chargement_prevue).toLocaleDateString()}</p>
            <p className="statut">{offre.statut_offre}</p>
            {offre.prix_propose && <p className="prix">{offre.prix_propose} €</p>}
          </div>
        ))}
      </div>

      {offres.length === 0 && <p>Aucune offre disponible pour le moment.</p>}
    </div>
  );
}
