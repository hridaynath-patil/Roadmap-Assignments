import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        style={{ padding: '2rem 0' }}
      >
        <div className="container">
          {children}
        </div>
      </motion.main>
      
      <footer style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>&copy; 2026 PrismApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
