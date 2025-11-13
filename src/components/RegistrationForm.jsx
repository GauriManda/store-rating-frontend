import React, { useState } from 'react';
import { Store, Eye, EyeOff, Lock, Mail, User, MapPin, ArrowLeft } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const RegistrationForm = ({ onBackToLogin, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess('Registration successful! You can now login.');
      setTimeout(() => {
        onRegister();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <button
            onClick={onBackToLogin}
            className="back-button"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>
          
          <div className="logo-container">
            <Store size={24} color="#667eea" />
          </div>
          <h1 className="title">Create Account</h1>
          <p className="subtitle">Sign up for Store Rating Platform</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Full Name *</label>
            <div className="input-container">
              <User className="input-icon" size={16} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                placeholder="Enter your full name (20-60 characters)"
                minLength={20}
                maxLength={60}
              />
            </div>
            <small className="input-help">Name must be between 20-60 characters</small>
          </div>

          <div className="form-group">
            <label className="label">Email Address *</label>
            <div className="input-container">
              <Mail className="input-icon" size={16} />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Password *</label>
            <div className="input-container">
              <Lock className="input-icon" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input"
                placeholder="Enter your password"
                minLength={8}
                maxLength={16}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon-right"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <small className="input-help">
              8-16 characters, must include uppercase letter and special character
            </small>
          </div>

          <div className="form-group">
            <label className="label">Address</label>
            <div className="input-container">
              <MapPin className="input-icon" size={16} />
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="textarea-input"
                placeholder="Enter your address (optional, max 400 characters)"
                maxLength={400}
              />
            </div>
            <small className="input-help">Maximum 400 characters</small>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            className={`button ${loading ? 'button-disabled' : ''}`}
          >
            {loading ? <div className="spinner"></div> : 'Create Account'}
          </button>
        </form>

        <div className="info-box">
          <div className="info-title">Password Requirements:</div>
          <div className="info-item">• 8-16 characters long</div>
          <div className="info-item">• At least one uppercase letter (A-Z)</div>
          <div className="info-item">• At least one special character (!@#$%^&*)</div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;