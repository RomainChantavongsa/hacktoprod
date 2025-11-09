import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Transports.scss';

export default function Commandes() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="transport-page">
        <h1 className="page-title">📋 Commandes</h1>
        <p className="page-description">Gérez toutes vos commandes de transport</p>
        
        <div className="content-card">
          <h2>Liste des commandes</h2>
          <p>Ici vous retrouverez toutes vos commandes en cours et à venir.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
