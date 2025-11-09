import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Transports.scss';

export default function Effectue() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="transport-page">
        <h1 className="page-title">✅ Effectué</h1>
        <p className="page-description">Transports effectués avec succès</p>
        
        <div className="content-card">
          <h2>Transports terminés</h2>
          <p>Historique de tous vos transports effectués.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
