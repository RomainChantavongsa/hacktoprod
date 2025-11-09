import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Entreprise.scss';

export default function CompteBancaire() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="entreprise-page">
        <h1 className="page-title">💳 Compte bancaire</h1>
        <p className="page-description">Gérez vos informations bancaires</p>
        
        <div className="content-card">
          <h2>Informations bancaires</h2>
          <p>Consultez et modifiez vos coordonnées bancaires.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
