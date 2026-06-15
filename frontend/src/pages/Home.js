// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth(); // Context aware!
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      // Public route, no authentication needed, but smart API handles it fine!
      api.get('/faq', { params: { search, limit: 20 } })
        .then(res => setFaqs(res.data.faqs))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 300); // 300ms debounce on typing

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="page page--narrow">
      <header style={{ textAlign: 'center', margin: '3rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>How can we help?</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Search our community-driven knowledge base.</p>
        
        <input
          type="search"
          className="input-field"
          style={{ maxWidth: '600px', margin: '2rem auto 0', padding: '1rem', fontSize: '1.1rem', borderRadius: '30px' }}
          placeholder="🔍 Search for questions, errors, or topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {loading ? (
          <div className="loading-grid">
            <div className="skeleton-card" />
            <div className="skeleton-card" />
          </div>
        ) : faqs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map(faq => (
              <article key={faq._id} className="admin-card hover-lift">
                <h3>{faq.question}</h3>
                <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>{faq.answer}</p>
                <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--primary)' }}>
                  ▲ {faq.upvotes?.length || 0} Upvotes
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state-card" style={{ textAlign: 'center' }}>
            <h2>No answers found</h2>
            <p>We couldn't find an exact match for your search.</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {user ? (
                <>
                  <Link to="/chat" className="btn-primary">Ask the AI Tutor</Link>
                  <Link to="/add-faq" className="btn-ghost">Submit a Question</Link>
                </>
              ) : (
                <Link to="/login" className="btn-primary">Log in to ask AI</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;