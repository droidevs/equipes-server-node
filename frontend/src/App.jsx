import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import StatusIndicator from './components/StatusIndicator';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import TeamsPage from './pages/TeamsPage';
import RedisPage from './pages/RedisPage';
import './App.css';

function App() {
  // Service Status state
  const [teamServerOnline, setTeamServerOnline] = useState(null);
  const [authServerOnline, setAuthServerOnline] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Auto check statuses on load
  useEffect(() => {
    checkStatuses();
  }, []);

  const checkStatuses = async () => {
    setIsCheckingStatus(true);
    
    // Check Team Server (4000)
    try {
      const res = await fetch('http://localhost:4000/equipes');
      setTeamServerOnline(res.status === 200);
    } catch (err) {
      setTeamServerOnline(false);
    }

    // Check Auth Server (3000)
    try {
      const res = await fetch('http://localhost:3000/api/profile');
      setAuthServerOnline(res.status === 401 || res.status === 200 || res.ok);
    } catch (err) {
      setAuthServerOnline(false);
    }
    
    setIsCheckingStatus(false);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-title-area">
          <div>
            <h1 className="dashboard-title">Project Control Panel</h1>
            <p className="dashboard-subtitle">A high-fidelity dashboard built with React for API and service integration</p>
          </div>
          
          <StatusIndicator 
            teamServerOnline={teamServerOnline}
            authServerOnline={authServerOnline}
            isCheckingStatus={isCheckingStatus}
            checkStatuses={checkStatuses}
          />
        </div>

        {/* Navigation Navbar */}
        <Navbar />
      </header>

      {/* Main Pages Switcher */}
      <main className="tab-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/redis" element={<RedisPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
