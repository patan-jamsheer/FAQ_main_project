// frontend/src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the hook

const PrivateRoute = ({ children }) => {
  // Grab the user directly from the context instead of props!
  const { user } = useAuth(); 

  // If no user is found, redirect to login. Otherwise, show the requested page.
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;