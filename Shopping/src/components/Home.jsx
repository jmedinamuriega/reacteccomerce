import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from './NavBar';
import ProductList from './ProductList';
import '../styles.css';

const featuredItems = [
  {
    id: 1,
    title: 'Premium Headphones',
    description: 'Experience the best sound quality.',
    price: '299.99',
    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    promotion: '20% off'
  },
  {
    id: 2,
    title: 'Elegant Watch',
    description: 'Luxury watch for every occasion.',
    price: '199.99',
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    promotion: '15% off'
  },
  {
    id: 3,
    title: 'Stylish Sunglasses',
    description: 'Protect your eyes with style.',
    price: '99.99',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_UL1500_.jpg',
    promotion: '10% off'
  }
];

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <div className="home-container">
        <h1>Welcome to the E-commerce Platform</h1>
        {user ? (
          <div className="welcome-message">
            <p>Welcome back, {user.name}!</p>
            <div className="featured-items">
              {featuredItems.map(item => (
                <div key={item.id} className="featured-item">
                  <img src={item.image} alt={item.title} />
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <p className="price">${item.price}</p>
                  <p className="promotion">{item.promotion}</p>
                </div>
              ))}
            </div>
            <ProductList />
          </div>
        ) : (
          <div className="info-message">
            <p>Please login or register to enjoy our full features.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
