import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Paiement.scss';

export default function Methodes() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="paiement-page">
        <h1 className="page-title">💳 Méthodes de paiement</h1>
        <p className="page-description">Gérez vos moyens de paiement</p>
        
        <div className="content-card">
          <h2>Vos méthodes de paiement</h2>
          <p>Ajoutez ou supprimez des méthodes de paiement.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
