import React, { useState, useEffect } from 'react';
import { Store, Star, Users, Lock, Eye, EyeOff } from 'lucide-react';
import Navbar from './Navbar';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const StoreOwnerDashboard = ({ user, token, onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/store-owner/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const PasswordUpdateModal = () => {
    const [passwordData, setPasswordData] = useState({
      currentPassword: '',
      newPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
      current: false,
      new: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handlePasswordUpdate = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError('');

      try {
        const response = await fetch(`${API_BASE}/user/password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(passwordData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }

        setMessage('Password updated successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '' });
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="modal">
        <div className="modal-content">
          <h3 className="modal-title">Update Password</h3>
          <form onSubmit={handlePasswordUpdate} className="form">
            <div className="form-group">
              <label className="label">Current Password</label>
              <div className="input-container">
                <Lock className="input-icon" size={16} />
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="input"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                  className="input-icon-right"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="label">New Password</label>
              <div className="input-container">
                <Lock className="input-icon" size={16} />
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="input"
                  placeholder="Enter new password"
                  minLength={8}
                  maxLength={16}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                  className="input-icon-right"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <small className="input-help">
                8-16 characters, must include uppercase letter and special character
              </small>
            </div>

            {error && <p style={{ color: '#f44336', fontSize: '14px' }}>{error}</p>}
            
            <div className="modal-buttons">
              <button
                type="submit"
                disabled={submitting}
                className={`modal-button-primary ${submitting ? 'button-disabled' : ''}`}
              >
                {submitting ? 'Updating...' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '' });
                  setError('');
                }}
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

  return (
    <div className="container">
      <Navbar 
        user={user} 
        onLogout={onLogout} 
        title="Store Owner Dashboard"
        icon={Store}
      />

      <div className="main-content">
        <div className="card">
          {/* Tabs */}
          <div className="tabs-container">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Store },
              { id: 'profile', label: 'Profile', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab ${activeTab === tab.id ? 'active-tab' : ''}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="card-content">
            {message && (
              <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
                {message}
                <button 
                  onClick={() => setMessage('')}
                  style={{ 
                    float: 'right', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <div>
                    {dashboardData ? (
                      <>
                        {/* Store Info Section */}
                        <div className="store-overview">
                          <h2 className="section-title">Store Overview</h2>
                          <div className="dashboard-grid">
                            <div className="stat-card stat-card-blue">
                              <Store className="stat-icon" size={48} style={{color: '#1976d2'}} />
                              <div>
                                <div className="stat-number" style={{color: '#1976d2'}}>{dashboardData.store.name}</div>
                                <div className="stat-label" style={{color: '#1976d2'}}>Your Store</div>
                              </div>
                            </div>
                            <div className="stat-card stat-card-yellow">
                              <Star className="stat-icon" size={48} style={{color: '#f57c00'}} />
                              <div>
                                <div className="stat-number" style={{color: '#f57c00'}}>{dashboardData.average_rating}</div>
                                <div className="stat-label" style={{color: '#f57c00'}}>Average Rating</div>
                              </div>
                            </div>
                            <div className="stat-card stat-card-green">
                              <Users className="stat-icon" size={48} style={{color: '#388e3c'}} />
                              <div>
                                <div className="stat-number" style={{color: '#388e3c'}}>{dashboardData.total_ratings}</div>
                                <div className="stat-label" style={{color: '#388e3c'}}>Total Reviews</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Store Details */}
                        <div className="store-details">
                          <h3 className="section-title">Store Information</h3>
                          <div className="store-info-card">
                            <div className="info-row">
                              <strong>Name:</strong> {dashboardData.store.name}
                            </div>
                            <div className="info-row">
                              <strong>Email:</strong> {dashboardData.store.email}
                            </div>
                            <div className="info-row">
                              <strong>Address:</strong> {dashboardData.store.address}
                            </div>
                          </div>
                        </div>

                        {/* Ratings from Users */}
                        <div className="ratings-section">
                          <h3 className="section-title">Customer Reviews</h3>
                          {dashboardData.ratings.length === 0 ? (
                            <div className="empty-state">
                              <p>No reviews yet. Encourage customers to rate your store!</p>
                            </div>
                          ) : (
                            <div className="ratings-list">
                              {dashboardData.ratings.map((rating, index) => (
                                <div key={index} className="rating-item">
                                  <div className="rating-header">
                                    <div className="customer-info">
                                      <strong>{rating.user_name}</strong>
                                      <span className="customer-email">{rating.user_email}</span>
                                    </div>
                                    <div className="rating-info">
                                      <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            size={16}
                                            fill={star <= rating.rating ? '#f57c00' : 'none'}
                                            color="#f57c00"
                                          />
                                        ))}
                                      </div>
                                      <span className="rating-date">
                                        {new Date(rating.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="empty-state">
                        <p>No store data available. Please contact admin to assign you a store.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div>
                    <h2 className="section-title">Profile Settings</h2>
                    <div className="profile-info">
                      <div className="profile-item">
                        <strong>Name:</strong> {user.name}
                      </div>
                      <div className="profile-item">
                        <strong>Email:</strong> {user.email}
                      </div>
                      <div className="profile-item">
                        <strong>Role:</strong> Store Owner
                      </div>
                      
                      <div className="profile-actions">
                        <button 
                          onClick={() => setShowPasswordModal(true)}
                          className="add-button"
                        >
                          <Lock size={16} />
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && <PasswordUpdateModal />}
    </div>
  );
};

export default StoreOwnerDashboard;
