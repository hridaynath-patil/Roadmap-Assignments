import React, { useState } from 'react';
import { User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (name, value) => {
    let error = '';
    
    if (name === 'name') {
      if (!value) error = 'Name is required';
      else if (value.length < 3) error = 'Name must be at least 3 characters';
    }

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) error = 'Email is required';
      else if (!emailRegex.test(value)) error = 'Invalid email format';
    }

    if (name === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 8) error = 'Password must be at least 8 characters';
      else if (!/\d/.test(value)) error = 'Password must contain at least one number';
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    const error = validate(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    if (isSubmitted) setIsSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitted(true);
      console.log('Form Submitted successfully:', formData);
    }
  };

  return (
    <div className="form-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-form"
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-dim)' }}>Join our vibrant community today</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <div className="icon-container"><User size={20} /></div>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              className={`input-field ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="error-text"
                >
                  <AlertCircle size={14} /> {errors.name}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Email Field */}
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="icon-container"><Mail size={20} /></div>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              className={`input-field ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="error-text"
                >
                  <AlertCircle size={14} /> {errors.email}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Password Field */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="icon-container"><Lock size={20} /></div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className={`input-field ${errors.password ? 'error' : ''}`}
              value={formData.password}
              onChange={handleChange}
            />
            <AnimatePresence>
              {errors.password && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="error-text"
                >
                  <AlertCircle size={14} /> {errors.password}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button type="submit" className="btn-submit">
            Sign Up
          </button>

          <AnimatePresence>
            {isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  background: 'rgba(34, 197, 94, 0.1)', 
                  border: '1px solid rgba(34, 197, 94, 0.2)', 
                  borderRadius: '12px',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9rem'
                }}
              >
                <CheckCircle2 size={20} />
                Registration successful! Welcome aboard.
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}

export default App;
