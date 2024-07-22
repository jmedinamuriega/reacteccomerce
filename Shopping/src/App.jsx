import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OrderProvider } from './contexts/OrderContext'; 
import { Provider } from 'react-redux';
import store from './store';
import Register from './components/Register';
import Login from './components/Login';
import UpdateProfile from './components/UpdateProfile';
import DeleteAccount from './components/DeleteAccount';
import Home from './components/Home';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import OrderHistory from './components/OrderHistory'; 
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavBar'; 

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <OrderProvider> {/* Wrap with OrderProvider */}
          <Router>
            <Navbar /> {/* Add Navbar component */}
            <main style={{ marginTop: '60px' }}> {/* Adjust for the fixed navbar */}
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/update-profile"
                  element={<ProtectedRoute element={<UpdateProfile />} />}
                />
                <Route
                  path="/delete-account"
                  element={<ProtectedRoute element={<DeleteAccount />} />}
                />
                <Route
                  path="/products"
                  element={<ProtectedRoute element={<ProductList />} />}
                />
                <Route
                  path="/cart"
                  element={<ProtectedRoute element={<Cart />} />}
                />
                <Route
                  path="/order-history"
                  element={<ProtectedRoute element={<OrderHistory />} />}
                />
                <Route
                  path="/"
                  element={<ProtectedRoute element={<Home />} />}
                />
              </Routes>
            </main>
          </Router>
        </OrderProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
