import React from 'react';
import Navbar from '../../pages/template/navBar_transport/navBar';
import Sidebar from '../../pages/template/sidebar/Sidebar';
import { useNavbar } from '../../contexts/NavbarContext';
import './homeLayout.scss';

export default function HomeLayout({ children, theme = 'primary', showNavbar = true }) {
  const { getSidebarItems } = useNavbar();
  const items = getSidebarItems();

  return (
    <div className={`home-layout theme-${theme}`}>
      {showNavbar && <Navbar />}

      <div className="home-body">
        <Sidebar items={items} />

        <main className="home-content">
          {children}
        </main>
      </div>
    </div>
  );
}
