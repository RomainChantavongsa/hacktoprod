import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Entreprise.scss';

export default function Documents() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="entreprise-page">
        <h1 className="page-title">📄 Documents</h1>
        <p className="page-description">Gérez vos documents administratifs</p>
        
        <div className="content-card">
          <h2>Documents de l'entreprise</h2>
          <p>Téléchargez et consultez tous vos documents importants.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
