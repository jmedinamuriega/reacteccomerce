import React, { useContext, useState } from 'react';
import { OrderContext } from '../contexts/OrderContext'; 
import './OrderHistory.css';

const OrderHistory = () => {
  const { orders } = useContext(OrderContext); 
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewDetails = (orderId) => {
    setSelectedOrder(orderId); 
  };

  return (
    <div className="order-history">
      <h2>Order History</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            <h3>Order ID: {index + 1}</h3>
            <p>Date: {new Date(order.date_created).toLocaleDateString()}</p>
            <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
            <button onClick={() => handleViewDetails(index)}>View Details</button>
            
            {selectedOrder === index && (
              <div className="order-details">
                
                <p>Additional Details: {order.additionalDetails}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
