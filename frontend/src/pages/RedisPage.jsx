import React, { useState } from 'react';

function RedisPage() {
  const [redisSetResponse, setRedisSetResponse] = useState('');
  const [redisGetResponse, setRedisGetResponse] = useState('');
  const [redisError, setRedisError] = useState('');

  const handleRedisSet = async () => {
    setRedisError('');
    setRedisSetResponse('');
    try {
      const res = await fetch('http://localhost:4000/');
      const text = await res.text();
      setRedisSetResponse(text);
    } catch (err) {
      setRedisError('Failed to trigger Redis Cache Set. Check Team Server port 4000 & Redis.');
    }
  };

  const handleRedisGet = async () => {
    setRedisError('');
    setRedisGetResponse('');
    try {
      const res = await fetch('http://localhost:4000/data');
      const text = await res.text();
      setRedisGetResponse(text);
    } catch (err) {
      setRedisError('Failed to retrieve cache from Redis. Check Team Server port 4000 & Redis.');
    }
  };

  return (
    <div className="glass-card">
      <h2 className="card-title">Redis Cache Integration</h2>
      <p className="card-description">Demonstrate setting, caching, and retrieving key-value pairs from the Redis database.</p>
      
      {redisError && <div className="alert alert-danger">{redisError}</div>}

      <div className="redis-grid">
        {/* Set Cache key */}
        <div className="redis-action-card">
          <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>1. Write Key to Redis Cache</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Performs a request to <code>GET /</code> which writes the key <code>"Products"</code> into Redis cache with the value <code>"Products ....."</code>.
          </p>
          <button className="btn btn-primary" onClick={handleRedisSet}>Trigger Cache Write</button>
          {redisSetResponse && (
            <div style={{ marginTop: '0.5rem', textAlign: 'left' }}>
              <span className="form-label">Server Response:</span>
              <pre className="code-block" style={{ color: '#34d399', maxHeight: '100px' }}>{redisSetResponse}</pre>
            </div>
          )}
        </div>

        {/* Get Cache key */}
        <div className="redis-action-card">
          <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>2. Read Key from Redis Cache</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Performs a request to <code>GET /data</code> which reads the cached <code>"Products"</code> value from Redis and returns it formatted in an HTML block.
          </p>
          <button className="btn btn-secondary" onClick={handleRedisGet}>Trigger Cache Read</button>
          {redisGetResponse && (
            <div style={{ marginTop: '0.5rem', textAlign: 'left' }}>
              <span className="form-label">Server HTML Response:</span>
              <pre className="code-block" style={{ color: '#06b6d4', maxHeight: '100px' }}>{redisGetResponse}</pre>
              <div style={{ marginTop: '0.5rem', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '0.5rem', background: '#fff', color: '#000', fontSize: '0.9rem' }}>
                <span className="form-label" style={{ color: '#94a3b8', fontSize: '0.7rem' }}>HTML Render Preview:</span>
                <div dangerouslySetInnerHTML={{ __html: redisGetResponse }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RedisPage;
