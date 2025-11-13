import React, { useState } from 'react';
import { Store, User, Mail, MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import './AddStoreForm.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AddStoreForm = ({ token, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerName: '',
    ownerPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Store validations
    if (!formData.name.trim()) newErrors.name = 'Store name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    else if (formData.address.length > 400) {
      newErrors.address = 'Address must be maximum 400 characters';
    }

    // Owner validations
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    else if (formData.ownerName.length < 20 || formData.ownerName.length > 60) {
      newErrors.ownerName = 'Owner name must be between 20-60 characters';
    }

    if (!formData.ownerPassword) newErrors.ownerPassword = 'Owner password is required';
    else {
      if (formData.ownerPassword.length < 8 || formData.ownerPassword.length > 16) {
        newErrors.ownerPassword = 'Password must be between 8-16 characters';
      } else {
        if (!/(?=.*[A-Z])/.test(formData.ownerPassword)) {
          newErrors.ownerPassword = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*[!@#$%^&*])/.test(formData.ownerPassword)) {
          newErrors.ownerPassword = 'Password must contain at least one special character';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/admin/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add store');
      }

      onSuccess();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3 className="modal-title">Add New Store & Owner</h3>

        <form onSubmit={handleSubmit} className="form">
          {/* Store Information */}
          <div className="section">
            <h4 className="section-title store-section">Store Information</h4>

            <div className="form-group">
              <label className="label">Store Name</label>
              <div className="input-container">
                <Store className="input-icon" size={16} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter store name"
                  required
                />
              </div>
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="label">Store Email</label>
              <div className="input-container">
                <Mail className="input-icon" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter store email"
                  required
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
              <small className="input-help">This email will also be used for store owner login</small>
            </div>

            <div className="form-group">
              <label className="label">Store Address</label>
              <div className="input-container">
                <MapPin className="input-icon" size={16} />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`input ${errors.address ? 'input-error' : ''}`}
                  placeholder="Enter store address"
                  rows={3}
                  maxLength={400}
                  required
                />
              </div>
              {errors.address && <span className="error-text">{errors.address}</span>}
              <small className="input-help">Maximum 400 characters</small>
            </div>
          </div>

          {/* Owner Information */}
          <div className="section">
            <h4 className="section-title owner-section">Store Owner Information</h4>

            <div className="form-group">
              <label className="label">Owner Full Name</label>
              <div className="input-container">
                <User className="input-icon" size={16} />
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className={`input ${errors.ownerName ? 'input-error' : ''}`}
                  placeholder="Enter owner full name"
                  minLength={20}
                  maxLength={60}
                  required
                />
              </div>
              {errors.ownerName && <span className="error-text">{errors.ownerName}</span>}
              <small className="input-help">20-60 characters required</small>
            </div>

            <div className="form-group">
              <label className="label">Owner Login Password</label>
              <div className="input-container">
                <Lock className="input-icon" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="ownerPassword"
                  value={formData.ownerPassword}
                  onChange={handleChange}
                  className={`input ${errors.ownerPassword ? 'input-error' : ''}`}
                  placeholder="Enter owner password"
                  minLength={8}
                  maxLength={16}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon-right"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.ownerPassword && <span className="error-text">{errors.ownerPassword}</span>}
              <small className="input-help">
                8-16 characters, must include uppercase letter and special character
              </small>
            </div>
          </div>

          {/* Error */}
          {errors.submit && (
            <div className="submit-error">
              {errors.submit}
            </div>
          )}

          {/* Buttons */}
          <div className="modal-buttons">
            <button
              type="submit"
              disabled={submitting}
              className={`modal-button-primary ${submitting ? 'button-disabled' : ''}`}
            >
              {submitting ? 'Creating Store...' : 'Create Store & Owner'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="modal-button-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStoreForm;
