import React from 'react';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1 className="section-title">Experience the Future of Web Design</h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
        A multi-page React application built with precision, performance, and premium aesthetics.
      </p>
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <button className="btn-primary">Get Started</button>
        <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent-primary)' }}>Learn More</button>
      </div>
      
      <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass" style={{ padding: '2rem', textAlign: 'left' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Feature {i}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              High-performance components designed to wow your users from the first glance.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
