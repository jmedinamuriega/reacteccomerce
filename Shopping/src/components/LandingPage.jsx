import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from './NavBar';
import '../styles.css';

const LandingPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <div className="landing-container">
        <h1>Welcome to the E-commerce Platform</h1>
        {!user ? (
          <div className="auth-options">
            <p>Please login or register to enjoy our full features.</p>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </div>
        ) : (
          <div className="welcome-message">
            <p>Welcome back, {user.name}!</p>
            <Link to="/products" className="btn">Go to Product Catalog</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
