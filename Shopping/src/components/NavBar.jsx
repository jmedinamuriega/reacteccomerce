import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './NavBar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">E-commerce</Link>
      </div>
      <div className="navbar-links">
        <Link to="/products">Product Catalog</Link>
        {user ? (
          <>
            <Link to="/update-profile">Update Profile</Link>
            <Link to="/delete-account">Delete Account</Link>
            <Link to="/cart">Shopping Cart</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <Link to="/order-history">Order History</Link> 
      </div>
    </nav>
  );
};

export default Navbar;
