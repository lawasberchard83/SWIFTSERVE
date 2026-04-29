import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './features/landing/LandingPage';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Dashboard from './features/dashboard/Dashboard';
import AboutUs from './features/about/AboutUs';
import AddToCart from './features/cart/AddToCart';
import PaymentPage from './features/payment/PaymentPage';
import AdminDashboard from './features/admin/AdminDashboard';
import Profile from './features/auth/Profile';
import SaveForLater from './features/cart/SaveForLater';
import UserOrders from './features/dashboard/UserOrders';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected routes — must be logged in */}
        <Route path="/orders" element={<PrivateRoute><UserOrders /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><AddToCart /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/saved" element={<PrivateRoute><SaveForLater /></PrivateRoute>} />

        {/* Admin-only route */}
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
