// frontend/src/pages/AuthSuccess.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext'; // 1. Import the Cloud Hook

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 2. Grab setUser directly from the context instead of expecting a prop!
  const { setUser } = useAuth(); 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      
      // We don't need to pass headers manually anymore thanks to our smart api.js!
      api.get('/auth/current-user')
        .then(res => {
          setUser(res.data); // Save user to the global cloud
          navigate('/dashboard'); // Send them to the app
        })
        .catch(err => {
          console.error('Failed to fetch user:', err);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [location, navigate, setUser]);

  return (
    <div className="app-loading">
      <div className="spinner" />
      <p>Authenticating...</p>
    </div>
  );
};

export default AuthSuccess;