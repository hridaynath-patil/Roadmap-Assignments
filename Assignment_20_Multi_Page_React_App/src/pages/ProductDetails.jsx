import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data';

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h1 className="section-title">Product Not Found</h1>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="glass" style={{ padding: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div style={{ 
          height: '400px', 
          background: 'var(--gradient-main)', 
          borderRadius: '24px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '8rem'
        }}>
          💎
        </div>
        
        <div>
          <Link to="/products" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block', fontWeight: '600' }}>&larr; Back to Catalog</Link>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '2rem' }}>{product.price}</p>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '2rem' }}>{product.description}</p>
          
          <div style={{ marginBottom: '3rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Key Features</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {product.features.map((feature, index) => (
                <li key={index} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent-secondary)' }}>✦</span> {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <button className="btn-primary" style={{ width: '100%', padding: '1.2rem' }}>Add to Collection</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
