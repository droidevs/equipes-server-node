import React from 'react';

function Dashboard() {
  return (
    <div className="glass-card">
      <h2 className="card-title">Project Overview & Architecture</h2>
      <p className="card-description">Welcome to your application's control center. Here is the layout of your microservices structure.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>🚀 Express API - Team Server (Port 4000)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            This backend runs inside your Docker compose environment. It communicates with <strong>MongoDB</strong> to store and edit football clubs (Teams) and interfaces with a <strong>Redis</strong> container to cache key values. 
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <div><strong>Database:</strong> MongoDB (Port 27017)</div>
            <div><strong>Cache Store:</strong> Redis (Port 6379)</div>
            <div><strong>Nginx Gateway:</strong> Proxy port 8080</div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '0.75rem', color: 'var(--secondary)', fontWeight: '600' }}>🔒 Express API - Auth Server (Port 3000)</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            A standalone authentication system running on port 3000. It secures endpoints using <strong>JSON Web Tokens (JWT)</strong>, manages an in-memory user registry, and supports user registration, login, profile queries, and token refresh.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <div><strong>Auth Type:</strong> JWT (HS256)</div>
            <div><strong>Access Rights:</strong> User Profile & Admin panel gates</div>
            <div><strong>Test Credentials:</strong> admin@exemple.com (for admin view)</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
          <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>MongoDB State</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Connects via Mongoose URI inside container</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Redis State</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Client listens to standard Redis connection</div>
          </div>
          <div style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem' }}>Client CORS</h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configured directly in Express middleware</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
