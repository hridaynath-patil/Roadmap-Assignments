import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data';

const Products = () => {
  return (
    <div style={{ padding: '4rem 0' }}>
      <h1 className="section-title">Exclusive Collection</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {products.map((product) => (
          <div key={product.id} className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              height: '200px', 
              background: 'var(--gradient-main)', 
              borderRadius: '12px', 
              opacity: 0.8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              💎
            </div>
            <h3 style={{ fontSize: '1.5rem' }}>{product.name}</h3>
            <p style={{ color: 'var(--text-secondary)', flexGrow: 1 }}>{product.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{product.price}</span>
              <Link to={`/products/${product.id}`} className="btn-primary" style={{ padding: '0.6rem 1.2rem' }}>View Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
