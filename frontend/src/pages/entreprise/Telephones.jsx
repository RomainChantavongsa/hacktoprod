import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Entreprise.scss';

export default function Telephones() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="entreprise-page">
        <h1 className="page-title">📱 Téléphones</h1>
        <p className="page-description">Gérez vos numéros de téléphone</p>
        
        <div className="content-card">
          <h2>Numéros de téléphone</h2>
          <p>Ajoutez et gérez vos contacts téléphoniques.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
