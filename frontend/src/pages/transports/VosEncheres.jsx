import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Transports.scss';

export default function VosEncheres() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="transport-page">
        <h1 className="page-title">🏷️ Vos enchères</h1>
        <p className="page-description">Consultez et gérez vos enchères de transport</p>
        
        <div className="content-card">
          <h2>Enchères en cours</h2>
          <p>Vos enchères actives apparaîtront ici.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
