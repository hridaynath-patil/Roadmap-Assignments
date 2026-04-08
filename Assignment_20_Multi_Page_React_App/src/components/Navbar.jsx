import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass" style={{ position: 'sticky', top: '1rem', zIndex: 100, margin: '1rem 2rem', padding: '1rem 2rem' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
          <NavLink to="/" style={{ color: 'var(--text-primary)' }}>
            Prism<span style={{ color: 'var(--accent-primary)' }}>App</span>
          </NavLink>
        </h2>
        
        <div style={{ display: 'flex', gap: '2rem' }}>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
          <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Products</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
