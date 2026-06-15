// frontend/src/pages/Login.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { API_BASE } from '../api'; // Import the correct backend URL
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isExpired = params.get('expired') === 'true';

  // If the user is already logged in, skip the login page entirely!
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/auth/google`;
  };

  const isDev = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="auth-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
        <h2>Welcome to Support Hub</h2>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          {isExpired ? 'Your session expired. Please log in again.' : 'Log in to ask questions and view your dashboard.'}
        </p>

        <button 
          onClick={handleGoogleLogin} 
          className="btn-primary" 
          style={{ width: '100%', padding: '12px', fontSize: '1.1rem', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" width="20" height="20" style={{ background: '#fff', borderRadius: '50%', padding: '2px' }}/>
          Continue with Google
        </button>

        {/* LOCAL DEVELOPMENT BYPASS BUTTONS */}
        {isDev && (
          <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Local Testing Only</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href={`${API_BASE}/auth/bypass`} className="btn-ghost" style={{ flex: 1, fontSize: '0.9rem' }}>
                Admin Bypass
              </a>
              <a href={`${API_BASE}/auth/bypass-student`} className="btn-ghost" style={{ flex: 1, fontSize: '0.9rem' }}>
                Student Bypass
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;