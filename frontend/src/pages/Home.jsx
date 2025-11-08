import React from 'react';
import HomeLayout from '../components/common/homeLayout';
import './Home.scss';

const sampleOrders = [
  { date: '10.11. 07:00 - 08:30', pick: 'NL 6301 ZN Valkenburg', drop: 'NL 2241 AL Wassenaar', distance: '232 km', weight: '23 kg' },
  { date: '10.11. 07:00 - 08:30', pick: 'DE 22848 Norderstedt', drop: 'DE 33719 Bielefeld', distance: '263 km', weight: '500 kg' },
  { date: '10.11. 08:10 - 09:30', pick: 'DE 60329 Frankfurt am Main', drop: 'DE 20355 Hamburg', distance: '484 km', weight: '1 kg' },
  { date: '10.11. 08:00 - 10:00', pick: 'DE 57635 Weyerbusch', drop: 'DE 16321 Bernau bei Berlin', distance: '634 km', weight: '750 kg' },
];

export default function Home() {
  return (
    <HomeLayout showNavbar={false}>
      <div className="home-simple">
      <div className="container">
        <header className="home-header">
          <h1 className="brand">TransportConnect</h1>
        </header>

        <section className="cta">
          <div className="cta-media" />
          <div className="cta-body">
            <h2>Complétez votre compte</h2>
            <p className="muted">Documents vérifiés • Compte bancaire vérifié</p>
          </div>
          <div className="cta-action">
            <button className="btn">Compléter maintenant</button>
          </div>
        </section>

        <section className="orders">
          <div className="orders-head">
            <div>Date de chargement</div>
            <div>Enlèvement</div>
            <div>Livraison</div>
            <div>Distance</div>
            <div>Marchandise</div>
          </div>
          <div className="orders-body">
            {sampleOrders.map((o, i) => (
              <div className="orders-row" key={i}>
                <div>{o.date}</div>
                <div className="muted">{o.pick}</div>
                <div className="muted">{o.drop}</div>
                <div>{o.distance}</div>
                <div>{o.weight}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
      </div>
    </HomeLayout>
  );
}
