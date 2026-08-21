import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PortalLayout from './components/PortalLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjects from './pages/client/ClientProjects';
import ClientMessages from './pages/client/ClientMessages';
import ClientPayments from './pages/client/ClientPayments';

// Freelancer Pages
import FreelancerDashboard from './pages/freelancer/FreelancerDashboard';
import FreelancerJobs from './pages/freelancer/FreelancerJobs';
import FreelancerProjects from './pages/freelancer/FreelancerProjects';
import FreelancerMessages from './pages/freelancer/FreelancerMessages';
import FreelancerEarnings from './pages/freelancer/FreelancerEarnings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProjects from './pages/admin/AdminProjects';
import AdminPayments from './pages/admin/AdminPayments';
import AdminReports from './pages/admin/AdminReports';

import './App.css';

function HomeRedirect() {
  const { currentUser, role } = useAuth();
  if (currentUser) {
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'freelancer') return <Navigate to="/freelancer/dashboard" replace />;
    return <Navigate to="/client/dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Home / Root Route */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Client Routes */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <PortalLayout>
                  <ClientDashboard />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/projects"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <PortalLayout>
                  <ClientProjects />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/messages"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <PortalLayout>
                  <ClientMessages />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/payments"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <PortalLayout>
                  <ClientPayments />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* Freelancer Routes */}
          <Route
            path="/freelancer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['freelancer', 'admin']}>
                <PortalLayout>
                  <FreelancerDashboard />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/jobs"
            element={
              <ProtectedRoute allowedRoles={['freelancer', 'admin']}>
                <PortalLayout>
                  <FreelancerJobs />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/projects"
            element={
              <ProtectedRoute allowedRoles={['freelancer', 'admin']}>
                <PortalLayout>
                  <FreelancerProjects />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/messages"
            element={
              <ProtectedRoute allowedRoles={['freelancer', 'admin']}>
                <PortalLayout>
                  <FreelancerMessages />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/freelancer/earnings"
            element={
              <ProtectedRoute allowedRoles={['freelancer', 'admin']}>
                <PortalLayout>
                  <FreelancerEarnings />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PortalLayout>
                  <AdminDashboard />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PortalLayout>
                  <AdminUsers />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PortalLayout>
                  <AdminProjects />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PortalLayout>
                  <AdminPayments />
                </PortalLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PortalLayout>
                  <AdminReports />
                </PortalLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}