import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Transports.scss';

export default function Recu() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="transport-page">
        <h1 className="page-title">📦 Reçu</h1>
        <p className="page-description">Transports que vous avez reçus</p>
        
        <div className="content-card">
          <h2>Colis reçus</h2>
          <p>Liste de tous les transports que vous avez reçus.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
