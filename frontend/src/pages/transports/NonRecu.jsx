import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Transports.scss';

export default function NonRecu() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="transport-page">
        <h1 className="page-title">❌ Non reçu</h1>
        <p className="page-description">Transports non encore reçus</p>
        
        <div className="content-card">
          <h2>En attente de réception</h2>
          <p>Liste des transports en attente de réception.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
