import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Paiement.scss';

export default function Historique() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="paiement-page">
        <h1 className="page-title">💰 Historique</h1>
        <p className="page-description">Consultez l'historique de vos paiements</p>
        
        <div className="content-card">
          <h2>Historique des paiements</h2>
          <p>Retrouvez tous vos paiements effectués.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
