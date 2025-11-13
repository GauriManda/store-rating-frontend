import React from 'react';
import { LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout, title, icon: Icon }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Icon className="navbar-icon" size={24} />
          {title}
        </div>
        <div className="navbar-right">
          <span className="welcome-text">Welcome, {user.name}</span>
          <button onClick={onLogout} className="logout-button">
            <LogOut size={16} style={{ marginRight: '8px' }} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;