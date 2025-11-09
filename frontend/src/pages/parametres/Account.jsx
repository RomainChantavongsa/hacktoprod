import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Parametres.scss';

export default function Account() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="parametres-page">
        <h1 className="page-title">⚙️ Account</h1>
        <p className="page-description">Gérez les paramètres de votre compte</p>
        
        <div className="content-card">
          <h2>Paramètres du compte</h2>
          <p>Modifiez les informations de votre compte utilisateur.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
