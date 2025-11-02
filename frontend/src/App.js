import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeLoginPage from './pages/EmployeeLoginPage';
import EmployeePortalPage from './pages/EmployeePortalPage';
import EmployeeProtectedRoute from './components/EmployeeProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* ✅ Employee Routes */}
        <Route path="/employee/login" element={<EmployeeLoginPage />} />
        <Route 
          path="/employee/portal" 
          element={
            <EmployeeProtectedRoute>
              <EmployeePortalPage />
            </EmployeeProtectedRoute>
          } 
        />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
