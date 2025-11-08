import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Entreprise.scss';

export default function Remorques() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="entreprise-page">
        <h1 className="page-title">🚚 Remorques</h1>
        <p className="page-description">Gérez vos remorques</p>
        
        <div className="content-card">
          <h2>Liste des remorques</h2>
          <p>Ajoutez et gérez toutes vos remorques.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
