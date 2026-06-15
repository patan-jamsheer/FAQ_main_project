// frontend/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext'; // Import the Cloud!

const Dashboard = () => {
  const { user } = useAuth(); // Grab user from the cloud (no props!)
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Look how clean this is! No getAuthConfig() needed.
    api.get('/faq/stats')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page page--narrow">
      <header className="dash-header">
        <div>
          <h1>👋 Welcome, {user?.name?.split(' ')[0] || 'Student'}!</h1>
          <p>Here is your support platform overview.</p>
        </div>
      </header>

      {loading ? (
        <div className="loading-grid">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card" style={{ height: '100px' }} />)}
        </div>
      ) : stats && (
        <div className="analytics-grid">
          <div className="analytics-tile">
            <span>📚 Published FAQs</span>
            <strong>{stats.approved || 0}</strong>
          </div>
          <div className="analytics-tile">
            <span>⏳ Pending Reviews</span>
            <strong>{stats.pending || 0}</strong>
          </div>
          <div className="analytics-tile">
            <span>🤖 AI Messages Left</span>
            <strong>{stats.aiRemaining || 0} <small>/ {stats.aiDailyLimit}</small></strong>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/add-faq" className="btn-primary">Submit New FAQ</Link>
        <Link to="/my-submissions" className="btn-ghost">View My Submissions</Link>
        <Link to="/chat" className="btn-ghost">💬 Ask AI Tutor</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="btn-danger">Admin Panel</Link>
        )}
      </div>
    </div>
  );
};

export default Dashboard;