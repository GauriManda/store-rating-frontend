import React, { useState, useEffect } from 'react';
import { Store, BarChart3, Users, Star, LogOut, UserPlus } from 'lucide-react';
import Navbar from './Navbar';
import AddUserForm from './modals/AddUserForm';
import AddStoreForm from './modals/AddStoreForm';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = ({ user, token, onLogout }) => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    handleTabChange('dashboard');
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage('');
    if (tab === 'dashboard') {
      fetchDashboardData();
    } else if (tab === 'stores') {
      fetchStores();
    } else if (tab === 'users') {
      fetchUsers();
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/stores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setShowAddUser(false);
    setMessage('User added successfully!');
    fetchUsers();
    fetchDashboardData();
  };

  const handleAddStore = () => {
    setShowAddStore(false);
    setMessage('Store added successfully!');
    fetchStores();
    fetchDashboardData();
  };
    const handleCloseUserModal = () => {
    setShowAddUser(false);
    fetchUsers();            // always refresh
    fetchDashboardData();    // update totals
  };

  const handleCloseStoreModal = () => {
    setShowAddStore(false);
    fetchStores();           // always refresh
    fetchDashboardData();
  };


  return (
    <div className="container">
      <Navbar 
        user={user} 
        onLogout={onLogout} 
        title="Admin Dashboard"
        icon={Store}
      />

      <div className="main-content">
        <div className="card">
          {/* Tabs */}
          <div className="tabs-container">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'stores', label: 'Stores', icon: Store },
              { id: 'users', label: 'Users', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`tab ${activeTab === tab.id ? 'active-tab' : ''}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="card-content">
            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : (
              <>
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 className="section-title">System Overview</h2>
                    <div className="dashboard-grid">
                      <div className="stat-card stat-card-blue">
                        <Users className="stat-icon" size={48} style={{color: '#1976d2'}} />
                        <div>
                          <div className="stat-number" style={{color: '#1976d2'}}>{dashboardData.totalUsers}</div>
                          <div className="stat-label" style={{color: '#1976d2'}}>Total Users</div>
                        </div>
                      </div>
                      <div className="stat-card stat-card-green">
                        <Store className="stat-icon" size={48} style={{color: '#388e3c'}} />
                        <div>
                          <div className="stat-number" style={{color: '#388e3c'}}>{dashboardData.totalStores}</div>
                          <div className="stat-label" style={{color: '#388e3c'}}>Total Stores</div>
                        </div>
                      </div>
                      <div className="stat-card stat-card-yellow">
                        <Star className="stat-icon" size={48} style={{color: '#f57c00'}} />
                        <div>
                          <div className="stat-number" style={{color: '#f57c00'}}>{dashboardData.totalRatings}</div>
                          <div className="stat-label" style={{color: '#f57c00'}}>Total Ratings</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stores Tab */}
                {activeTab === 'stores' && (
                  <div>
                    <div className="section-header">
                      <h2 className="section-title">Stores Management</h2>
                      <button onClick={() => setShowAddStore(true)} className="add-button">
                        <UserPlus size={16} />
                        Add Store
                      </button>
                    </div>
                    {stores.length === 0 ? (
                      <div className="empty-state">
                        <p>No stores found. Add some stores first.</p>
                      </div>
                    ) : (
                      <table className="table">
                        <thead className="table-header">
                          <tr>
                            <th className="table-header-cell">Name</th>
                            <th className="table-header-cell">Email</th>
                            <th className="table-header-cell">Address</th>
                            <th className="table-header-cell">Rating</th>
                            <th className="table-header-cell">Total Ratings</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stores.map((store) => (
                            <tr key={store.id} className="table-row">
                              <td className="table-cell">{store.name}</td>
                              <td className="table-cell">{store.email}</td>
                              <td className="table-cell">{store.address}</td>
                              <td className="table-cell">
                                <div className="rating-container">
                                  <Star size={16} color="#f57c00" />
                                  {store.average_rating}
                                </div>
                              </td>
                              <td className="table-cell">{store.total_ratings}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <div className="section-header">
                      <h2 className="section-title">Users Management</h2>
                      <button onClick={() => setShowAddUser(true)} className="add-button">
                        <UserPlus size={16} />
                        Add User
                      </button>
                    </div>
                    {users.length === 0 ? (
                      <div className="empty-state">
                        <p>No users found.</p>
                      </div>
                    ) : (
                      <table className="table">
                        <thead className="table-header">
                          <tr>
                            <th className="table-header-cell">Name</th>
                            <th className="table-header-cell">Email</th>
                            <th className="table-header-cell">Role</th>
                            <th className="table-header-cell">Address</th>
                            <th className="table-header-cell">Store Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user.id} className="table-row">
                              <td className="table-cell">{user.name}</td>
                              <td className="table-cell">{user.email}</td>
                              <td className="table-cell">
                                <span className={`role-badge ${
                                  user.role === 'system_admin' ? 'role-badge-admin' :
                                  user.role === 'store_owner' ? 'role-badge-owner' :
                                  'role-badge-user'
                                }`}>
                                  {user.role.replace('_', ' ').toUpperCase()}
                                </span>
                              </td>
                              <td className="table-cell">{user.address}</td>
                              <td className="table-cell">
                                {user.store_rating ? (
                                  <div className="rating-container">
                                    <Star size={16} color="#f57c00" />
                                    {user.store_rating}
                                  </div>
                                ) : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddUser && (
  <AddUserForm 
    token={token}
    onClose={handleCloseUserModal}   
    onSuccess={handleAddUser}
  />
)}
{showAddStore && (
  <AddStoreForm 
    token={token}
    onClose={handleCloseStoreModal}  
    onSuccess={handleAddStore}
  />
)}

    </div>
  );
};

export default AdminDashboard;