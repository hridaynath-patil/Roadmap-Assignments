import React from 'react';

const About = () => {
  return (
    <div style={{ padding: '4rem 0' }}>
      <h1 className="section-title">About Our Mission</h1>
      <div className="glass" style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          We believe in creating digital experiences that are not just functional, but also beautiful and inspiring. 
          PrismApp is a demonstration of how modern React patterns can be combined with high-end CSS to create something truly special.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
          Built with Vite, React Router, and Framer Motion, this application showcases seamless navigation and interactive design.
        </p>
      </div>
    </div>
  );
};

export default About;
