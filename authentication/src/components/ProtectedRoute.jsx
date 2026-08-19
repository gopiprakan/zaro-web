import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="portal-loading-screen">
        <div className="loading-spinner"></div>
        <p>Verifying secure session credentials...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If role doesn't match, redirect to the user's appropriate home dashboard
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === 'freelancer') return <Navigate to="/freelancer/dashboard" replace />;
    return <Navigate to="/client/dashboard" replace />;
  }

  return children;
}
