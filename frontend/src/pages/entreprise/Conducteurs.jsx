import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Entreprise.scss';

export default function Conducteurs() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="entreprise-page">
        <h1 className="page-title">👨‍✈️ Conducteurs</h1>
        <p className="page-description">Gérez vos conducteurs</p>
        
        <div className="content-card">
          <h2>Liste des conducteurs</h2>
          <p>Ajoutez et gérez tous vos conducteurs.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
