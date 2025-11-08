import React from 'react';
import HomeLayout from '../../components/common/homeLayout';
import './Entreprise.scss';

export default function Guide() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="entreprise-page">
        <h1 className="page-title">📖 Guide de vérification</h1>
        <p className="page-description">Consultez le guide pour vérifier votre entreprise</p>
        
        <div className="content-card">
          <h2>Étapes de vérification</h2>
          <p>Suivez ces étapes pour compléter la vérification de votre entreprise.</p>
        </div>
      </div>
    </HomeLayout>
  );
}
