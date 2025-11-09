import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.scss';

export default function Sidebar({ items = [] }) {
  const location = useLocation();

  return (
    <aside className="app-sidebar" aria-label="Navigation principale">
      <ul className="sidebar-list">
        {items.length > 0 ? (
          items.map((it, idx) => {
            const isActive = location.pathname === it.to;
            return (
              <li key={idx} className={`sidebar-item ${isActive ? 'active' : ''}`}>
                {it.to ? (
                  <Link to={it.to} className="sidebar-link">
                    {it.icon && <span className="item-icon">{it.icon}</span>}
                    <span className="item-label">{it.label}</span>
                  </Link>
                ) : (
                  <div className="sidebar-link">
                    {it.icon && <span className="item-icon">{it.icon}</span>}
                    <span className="item-label">{it.label}</span>
                  </div>
                )}
              </li>
            );
          })
        ) : (
          <li className="sidebar-item empty">Aucune section</li>
        )}
      </ul>
    </aside>
  );
}
