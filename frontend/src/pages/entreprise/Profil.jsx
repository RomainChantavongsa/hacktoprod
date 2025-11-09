import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Entreprise.scss';

export default function Profil() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="entreprise-page">
        <h1 className="page-title">👤 Profil</h1>
        <p className="page-description">Gérez les informations de votre entreprise</p>
        
        <div className="content-card">
          <h2>Informations de l'entreprise</h2>
          <p>Mettez à jour les informations de votre profil d'entreprise.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
