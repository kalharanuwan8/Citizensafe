import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// User Pages
import LoginPage from '../pages/LoginPage';
import RegistrationPage from '../pages/RegistrationPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import HomePage from '../pages/HomePage';
import DisasterDetailsPage from '../pages/DisasterDetailsPage';
import ReportDisasterPage from '../pages/ReportDisasterPage';
import AlertsPage from '../pages/AlertsPage';
import ProfilePage from '../pages/ProfilePage';
import CompleteProfilePage from '../pages/CompleteProfilePage';

// Admin Pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminDisastersPage from '../pages/admin/AdminDisastersPage';
import AdminCreateAlertPage from '../pages/admin/AdminCreateAlertPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';

// ── Route Guards ───────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // wait for localStorage bootstrap
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/home" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public / Generic Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* User Flow Routes — protected */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/disaster/:id" element={<ProtectedRoute><DisasterDetailsPage /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><ReportDisasterPage /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfilePage /></ProtectedRoute>} />

      {/* Admin Flow Routes — admin only */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="disasters" element={<AdminDisastersPage />} />
        <Route path="alerts" element={<AdminCreateAlertPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
