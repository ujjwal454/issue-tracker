import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-content">
        <h1>Complaint Tracking System</h1>
        <nav className="nav-links">
          {user.role === 'ADMIN' && (
            <Link to="/admin/users" className="nav-link">
              Manage Resolvers
            </Link>
          )}
          <Link to="/complaints" className="nav-link">
            Complaints
          </Link>
          <span style={{ color: '#ecf0f1', margin: '0 10px' }}>
            {user.role}
          </span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

