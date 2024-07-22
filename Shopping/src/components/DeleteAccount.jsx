import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/users/${user.id}`); // Correct URL
        logout();
        alert('Account deleted successfully');
        navigate('/register'); // Redirect to register page after successful deletion
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Account deletion failed. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h2>Are you sure you want to delete your account?</h2>
      <button onClick={handleDelete}>Yes, Delete My Account</button>
    </div>
  );
};

export default DeleteAccount;
