import React from 'react';

const Contact = () => {
  return (
    <div style={{ padding: '4rem 0' }}>
      <h1 className="section-title">Get in Touch</h1>
      <div className="glass" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name"
              style={{ 
                padding: '1rem', 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '8px', 
                color: 'white',
                outline: 'none'
              }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="email@example.com"
              style={{ 
                padding: '1rem', 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '8px', 
                color: 'white',
                outline: 'none'
              }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>Message</label>
            <textarea 
              rows="4" 
              placeholder="How can we help?"
              style={{ 
                padding: '1rem', 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid var(--glass-border)', 
                borderRadius: '8px', 
                color: 'white',
                outline: 'none',
                resize: 'none'
              }} 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
