import React, { useState } from 'react';
import { Store, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import RegistrationForm from './RegistrationForm';
import './LoginForm.css';   

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showRegistration) {
    return (
      <RegistrationForm 
        onBackToLogin={() => setShowRegistration(false)}
        onRegister={() => setShowRegistration(false)}
      />
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="logo-container">
            <Store size={28} color="#4a90e2" />
          </div>
          <h1 className="title">Store Rating Platform</h1>
          <p className="subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-container">
              <Mail className="input-icon" size={16} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-container">
              <Lock className="input-icon" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            className="submit-button"
          >
            {loading ? <div className="spinner"></div> : 'Sign In'}
          </button>
        </form>

        <div className="info-box">
          <div className="info-title">Need an account?</div>
          <div className="info-item">
            <strong>System Admin:</strong> Use admin@platform.com / Admin123!
          </div>
          <div className="info-item">
            <strong>Store Owners:</strong> Contact admin to create your account
          </div>
          <div className="info-item">
            <strong>New User?</strong>{' '}
            <span 
              className="signup-link"
              onClick={() => setShowRegistration(true)}
            >
              Sign up here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
