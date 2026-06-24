import React, { useState, useEffect } from 'react';

function AuthPage() {
  // Authentication State
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('auth_user') || 'null'));
  const [profileData, setProfileData] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  
  // Auth Form Inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Auth Alerts
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Fetch profile when token is active
  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setProfileData(null);
      setAdminUsers([]);
    }
  }, [token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setAuthSuccess('Account created successfully! You can now log in.');
      setRegName('');
      setRegEmail('');
      setRegPassword('');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      setAuthSuccess('Logged in successfully!');
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setProfileData(null);
    setAdminUsers([]);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('auth_user');
    setAuthSuccess('Logged out successfully.');
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setProfileData(data.user);
        // If admin, fetch admin users list
        if (data.user.email === 'admin@exemple.com') {
          fetchAdminUsers();
        }
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAdminUsers(data.users || []);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  const handleRefreshToken = async () => {
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await fetch('http://localhost:3000/api/refresh-token', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Token refresh failed');
      
      setToken(data.token);
      localStorage.setItem('jwt_token', data.token);
      setAuthSuccess('Token refreshed successfully!');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  return (
    <div className="grid-sidebar">
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 className="card-title">Authentication Center</h2>
        <p className="card-description">Register new accounts, sign in to acquire a JSON Web Token, and verify token-gated routes.</p>
        
        {authError && <div className="alert alert-danger">{authError}</div>}
        {authSuccess && <div className="alert alert-success">{authSuccess}</div>}

        {!token ? (
          <div className="grid-2">
            {/* Login Section */}
            <div style={{ borderRight: '1px solid var(--border-color)', paddingRight: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Sign In</h3>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    required 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)} 
                    placeholder="e.g. john@exemple.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    required 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    placeholder="••••••••"
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Login
                </button>
              </form>
            </div>

            {/* Register Section */}
            <div style={{ paddingLeft: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Create Account</h3>
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={regName} 
                    onChange={(e) => setRegName(e.target.value)} 
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    required 
                    value={regEmail} 
                    onChange={(e) => setRegEmail(e.target.value)} 
                    placeholder="e.g. john@exemple.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    required 
                    value={regPassword} 
                    onChange={(e) => setRegPassword(e.target.value)} 
                    placeholder="Min 6 characters"
                  />
                </div>
                <button type="submit" className="btn btn-secondary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Register
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated User Panel */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem' }}>Welcome, {user?.name || 'User'}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Logged in as: {user?.email}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary" onClick={handleRefreshToken}>Refresh Token</button>
                <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
              </div>
            </div>

            <div>
              <h4 className="form-label" style={{ marginBottom: '0.5rem' }}>Active JSON Web Token (JWT)</h4>
              <div className="token-badge">{token}</div>
            </div>

            {profileData && (
              <div style={{ background: 'rgba(168, 85, 247, 0.03)', border: '1px solid rgba(168, 85, 247, 0.1)', padding: '1rem', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Token Verified Profile Response:
                </h4>
                <pre className="code-block" style={{ maxHeight: '120px' }}>
                  {JSON.stringify(profileData, null, 2)}
                </pre>
              </div>
            )}

            {/* Admin Panel Section */}
            {user?.email === 'admin@exemple.com' && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>👑 Admin Dashboard Panel</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  Retrieving users database list directly from <code>GET /api/admin/users</code> using admin rights.
                </p>
                {adminUsers.length > 0 ? (
                  <div className="admin-users-list">
                    {adminUsers.map(u => (
                      <div key={u.id} className="admin-user-card">
                        <div className="admin-user-info">
                          <span className="admin-user-name">{u.name}</span>
                          <span className="admin-user-email">{u.email}</span>
                        </div>
                        <span className="admin-user-id">ID: {u.id}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>Loading users registry...</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Info panel */}
      <div className="glass-card" style={{ height: 'fit-content' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', fontWeight: '600' }}>Security Architecture</h3>
        <ul style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.7', paddingLeft: '1.2rem', textAlign: 'left' }}>
          <li style={{ marginBottom: '0.5rem' }}>Passwords are hashed using <strong>bcryptjs</strong> (10 salt rounds) before storing in the database.</li>
          <li style={{ marginBottom: '0.5rem' }}>Authentications sign a JWT token containing userID, email, and name.</li>
          <li style={{ marginBottom: '0.5rem' }}>Authorized route requests require a <code>Authorization: Bearer &lt;token&gt;</code> header.</li>
          <li>Admin operations require specific matching email rules on the decrypted payload.</li>
        </ul>
      </div>
    </div>
  );
}

export default AuthPage;
