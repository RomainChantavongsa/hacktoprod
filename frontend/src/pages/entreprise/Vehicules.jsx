import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Entreprise.scss';

export default function Vehicules() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="entreprise-page">
        <h1 className="page-title">🚛 Véhicules</h1>
        <p className="page-description">Gérez votre flotte de véhicules</p>
        
        <div className="content-card">
          <h2>Liste des véhicules</h2>
          <p>Ajoutez et gérez tous vos véhicules de transport.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
