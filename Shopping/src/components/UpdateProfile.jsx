import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const UpdateProfile = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  
  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, email: user.email, password: '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/users/${user.id}`, formData, {
        headers: { 'Content-Type': 'application/json' }
      });
      // Update user context with new data and token (if necessary)
      login(response.data.user, sessionStorage.getItem('token'));
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
      alert('Profile update failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password (Leave empty to keep current)"
        onChange={handleChange}
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UpdateProfile;
