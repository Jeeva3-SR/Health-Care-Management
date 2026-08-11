import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/useAuthstore';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { token: storeToken, role: storeRole, loading } = useAuthStore();
  const location = useLocation();

  // Also fallback directly to localStorage for instant synchronous check
  const token = storeToken || localStorage.getItem('token');
  const role = storeRole || localStorage.getItem('userRole');

  if (loading && !token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-blue-600">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Authenticating session...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  const reqPassStr = localStorage.getItem('requiresPasswordChange');
  if (reqPassStr === 'true') {
    return <Navigate to="/reset-password" replace />;
  }

  if (allowedRole) {
    const normAllowed = allowedRole.replace(/^ROLE_/, '').toUpperCase();
    const normUserRole = (role || '').replace(/^ROLE_/, '').toUpperCase();

    if (normUserRole !== normAllowed) {
      console.warn(`Access denied: Required ${normAllowed}, but user has ${normUserRole}`);
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
