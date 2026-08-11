import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import useAuthStore from './store/useAuthstore';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth & Public Pages
import LoginPage from './pages/auth/LoginPage';
import PatientRegister from './Patient/Register';
import DoctorRegister from './Doctor/Register';
import ResetPassword from './pages/auth/ResetPassword';
import NotFoundPage from './pages/auth/NotFoundPage';

// Layouts
import AdminLayout from './pages/admin/AdminLayout';
import DoctorLayout from './pages/doctor/DoctorLayout';
import PatientLayout from './pages/patient/PatientLayout';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import DoctorManagement from './pages/admin/DoctorManagement';
import UserManagement from './pages/admin/UserManagement';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';

// Doctor Pages
import DoctorOverview from './pages/doctor/DoctorOverview';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorMedicalRecords from './pages/doctor/DoctorMedicalRecords';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Patient Pages
import PatientOverview from './pages/patient/PatientOverview';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientDoctors from './pages/patient/PatientDoctors';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import PatientMedicalHistory from './pages/patient/PatientMedicalHistory';
import PatientProfile from './pages/patient/PatientProfile';

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    useAuthStore.getState().hydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route path="/doctor/register" element={<DoctorRegister />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="doctors" element={<DoctorManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Protected Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRole="DOCTOR">
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DoctorOverview />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="medical-records" element={<DoctorMedicalRecords />} />
            <Route path="profile" element={<DoctorProfile />} />
          </Route>

          {/* Protected Patient Routes */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRole="PATIENT">
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PatientOverview />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="doctors" element={<PatientDoctors />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
            <Route path="medical-records" element={<PatientMedicalHistory />} />
            <Route path="profile" element={<PatientProfile />} />
          </Route>

          {/* 404 Catch All */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}