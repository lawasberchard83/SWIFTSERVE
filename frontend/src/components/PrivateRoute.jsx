import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute - redirects unauthenticated users to /login.
 * Optionally pass requiredRole="admin" to restrict admin-only pages.
 */
const PrivateRoute = ({ children, requiredRole }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && userRole !== requiredRole) {
        // Non-admins trying to hit /admin get sent to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PrivateRoute;
