import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setOrders(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching order history:', err);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Order History</h2>
      <ul>
        {orders.map(order => (
          <li key={order.order_id}>
            <h3>Order ID: {order.order_id}</h3>
            <p>Date Created: {new Date(order.date_created).toLocaleDateString()}</p>
            <p>Total Price: ${order.total_price.toFixed(2)}</p>
            <button onClick={() => viewOrderDetails(order.order_id)}>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
