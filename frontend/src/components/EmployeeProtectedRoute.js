import React from 'react';
import { Navigate } from 'react-router-dom';

const EmployeeProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('employeeToken');
  
  if (!token) {
    // Redirect to employee login if no token
    return <Navigate to="/employee/login" replace />;
  }
  
  return children;
};

export default EmployeeProtectedRoute;