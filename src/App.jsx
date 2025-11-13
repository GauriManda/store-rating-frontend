import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';
import './styles/styles.css';

class AuthService {
  static setAuth(token, user) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  static getAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return {
      token,
      user: user ? JSON.parse(user) : null
    };
  }

  static clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  static isAuthenticated() {
    const { token, user } = this.getAuth();
    if (!token || !user) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }
}

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const auth = AuthService.getAuth();
      setUser(auth.user);
      setToken(auth.token);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    AuthService.setAuth(authToken, userData);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    AuthService.clearAuth();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  switch (user.role) {
    case 'system_admin':
      return <AdminDashboard user={user} token={token} onLogout={handleLogout} />;
    case 'store_owner':
      return <StoreOwnerDashboard user={user} token={token} onLogout={handleLogout} />;
    case 'normal_user':
      return <UserDashboard user={user} token={token} onLogout={handleLogout} />;
    default:
      return (
        <div className="error-container">
          <div className="error-box">
            <h2 className="error-title">Invalid User Role</h2>
            <p className="error-message">
              Your account has an invalid role: {user.role}
            </p>
            <button onClick={handleLogout} className="error-button">
              Return to Login
            </button>
          </div>
        </div>
      );
  }
};

export default App;
