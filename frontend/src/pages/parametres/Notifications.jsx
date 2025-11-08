import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Parametres.scss';

export default function Notifications() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="parametres-page">
        <h1 className="page-title">🔔 Notifications</h1>
        <p className="page-description">Gérez vos préférences de notifications</p>
        
        <div className="content-card">
          <h2>Paramètres de notifications</h2>
          <p>Choisissez comment vous souhaitez être notifié.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
