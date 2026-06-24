import React from 'react';

function StatusIndicator({ teamServerOnline, authServerOnline, isCheckingStatus, checkStatuses }) {
  return (
    <div className="status-bar">
      <div className="status-badge">
        <span className={`status-dot ${teamServerOnline === null ? 'checking' : teamServerOnline ? 'online' : 'offline'}`}></span>
        <span>Team Server (Port 4000)</span>
      </div>
      <div className="status-badge">
        <span className={`status-dot ${authServerOnline === null ? 'checking' : authServerOnline ? 'online' : 'offline'}`}></span>
        <span>Auth Server (Port 3000)</span>
      </div>
      <button 
        className="btn btn-secondary" 
        onClick={checkStatuses}
        disabled={isCheckingStatus}
        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
      >
        {isCheckingStatus ? 'Checking...' : 'Refresh Status'}
      </button>
    </div>
  );
}

export default StatusIndicator;
