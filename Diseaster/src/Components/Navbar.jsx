import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src="/logo.png" alt="Logo" className="logo" />
        Disaster Relief
      </div>
      <div className="navbar-links">
        {!token && (
          <>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/login">Login</NavLink>
          </>
        )}
        {token && role === 'victim' && (
          <>
            <NavLink to="/request-help">Request Help</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {token && role === 'admin' && (
          <>
            <NavLink to="/admin">Admin Dashboard</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
        {token && role === 'volunteer' && (
          <>
            <NavLink to="/volunteer-dashboard">My Dashboard</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
