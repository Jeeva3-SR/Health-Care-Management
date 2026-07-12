import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./AuthPage";
import PatientRegister from "./Patient/Register";
import DoctorRegister from "./Doctor/Register";

import PatientDashboard from "./Patient/Dashboard";
import DoctorDashboard from "./Doctor/Dashboard";
import AdminDashboard from "./adminDashboard";

import ProtectedRoute from "./ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />

        {/* Protected Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRole="PATIENT">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRole="DOCTOR">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;