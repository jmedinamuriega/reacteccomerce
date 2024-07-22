import React, { useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../slices/cartSlice';
import OrderHistory from './OrderHistory';
import { OrderContext } from '../contexts/OrderContext'; // Import the OrderContext
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const { addOrder } = useContext(OrderContext); // Use the OrderContext

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart({ id }));
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      return;
    }
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      setCheckoutError(null);

      const order = { cartItems, totalPrice, date_created: new Date() };
      addOrder(order); // Add the order to the context
      dispatch(clearCart());
      sessionStorage.removeItem('cart');
      setCheckoutComplete(true);
    } catch (error) {
      console.error('Error during checkout:', error);
      setCheckoutError(error.message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (checkoutComplete) {
    return <OrderHistory />;
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>
                <h3>{item.title}</h3>
                <p>Quantity: {item.quantity}</p>
                <button onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>Increase Quantity</button>
                <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>Decrease Quantity</button>
              </li>
            ))}
          </ul>
          <div>
            <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
            <button onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? 'Checking Out...' : 'Checkout'}
            </button>
            {checkoutError && <p className="error">{checkoutError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
