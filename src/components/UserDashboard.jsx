import React, { useState, useEffect } from 'react';
import { Store, Star, Search, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import Navbar from './Navbar';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const UserDashboard = ({ user, token, onLogout }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('stores');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? 
        `${API_BASE}/stores?search=${encodeURIComponent(search)}` : 
        `${API_BASE}/stores`;
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      setMessage('Error loading stores');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores(searchTerm);
  };

  const submitRating = async (storeId, rating) => {
    try {
      const response = await fetch(`${API_BASE}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ store_id: storeId, rating })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }

      setMessage('Rating submitted successfully!');
      fetchStores(searchTerm); // Refresh the list
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const RatingStars = ({ storeId, currentRating, onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="star-button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onRate(storeId, star)}
          >
            <Star
              size={20}
              fill={(hoverRating || currentRating) >= star ? '#f57c00' : 'none'}
              color="#f57c00"
            />
          </button>
        ))}
      </div>
    );
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
        title="User Dashboard"
        icon={UserIcon}
      />

      <div className="main-content">
        <div className="card">
          {/* Tabs */}
          <div className="tabs-container">
            {[
              { id: 'stores', label: 'Stores', icon: Store },
              { id: 'profile', label: 'Profile', icon: UserIcon }
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

            {activeTab === 'stores' && (
              <div>
                {/* Search Section */}
                <div className="section-header">
                  <h2 className="section-title">All Stores</h2>
                  <form onSubmit={handleSearch} className="search-form">
                    <div className="search-container">
                      <Search className="search-icon" size={16} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by store name or address..."
                        className="search-input"
                      />
                      <button type="submit" className="search-button">
                        Search
                      </button>
                    </div>
                  </form>
                </div>

                {loading ? (
                  <div className="loading">
                    <div className="spinner"></div>
                  </div>
                ) : stores.length === 0 ? (
                  <div className="empty-state">
                    <p>No stores found. Try a different search term.</p>
                  </div>
                ) : (
                  <div className="stores-grid">
                    {stores.map((store) => (
                      <div key={store.id} className="store-card">
                        <div className="store-header">
                          <div className="store-info">
                            <h3 className="store-name">{store.name}</h3>
                            <p className="store-address">{store.address}</p>
                            <p className="store-email">{store.email}</p>
                          </div>
                          <div className="store-rating-info">
                            <div className="overall-rating">
                              <Star size={16} color="#f57c00" fill="#f57c00" />
                              <span>{store.average_rating}</span>
                              <small>({store.total_ratings} reviews)</small>
                            </div>
                          </div>
                        </div>
                        
                        <div className="rating-section">
                          <div className="user-rating">
                            <span className="rating-label">Your Rating:</span>
                            {store.user_rating ? (
                              <div className="current-rating">
                                <div className="rating-display">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={16}
                                      fill={star <= store.user_rating ? '#f57c00' : 'none'}
                                      color="#f57c00"
                                    />
                                  ))}
                                </div>
                                <span className="rating-text">You rated: {store.user_rating}/5</span>
                              </div>
                            ) : (
                              <span className="no-rating">Not rated</span>
                            )}
                          </div>
                          
                          <div className="rate-store">
                            <span className="rating-label">
                              {store.user_rating ? 'Update Rating:' : 'Rate Store:'}
                            </span>
                            <RatingStars
                              storeId={store.id}
                              currentRating={0}
                              onRate={submitRating}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
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
                    <strong>Role:</strong> Normal User
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
          </div>
        </div>
      </div>

     
      {showPasswordModal && <PasswordUpdateModal />}
    </div>
  );
};

export default UserDashboard;