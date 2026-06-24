import React, { useState, useEffect } from 'react';

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamCountry, setNewTeamCountry] = useState('');
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingCountry, setEditingCountry] = useState('');
  const [teamsError, setTeamsError] = useState('');
  const [teamsSuccess, setTeamsSuccess] = useState('');

  const fetchTeams = async () => {
    setTeamsError('');
    try {
      const res = await fetch('http://localhost:4000/equipes');
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to load teams');
      setTeams(data);
    } catch (err) {
      setTeamsError('Could not fetch teams. Is the Team Server running on port 4000?');
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAddTeam = async (e) => {
    e.preventDefault();
    setTeamsError('');
    setTeamsSuccess('');
    if (!newTeamName || !newTeamCountry) {
      setTeamsError('Please fill out all fields.');
      return;
    }
    
    // Find a unique next ID
    const nextId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;

    try {
      const res = await fetch('http://localhost:4000/equipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: nextId, name: newTeamName, country: newTeamCountry }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to add team');
      
      setTeams(data);
      setNewTeamName('');
      setNewTeamCountry('');
      setTeamsSuccess(`Team "${newTeamName}" added successfully!`);
    } catch (err) {
      setTeamsError(err.message);
    }
  };

  const handleStartEdit = (team) => {
    setEditingTeamId(team.id);
    setEditingCountry(team.country);
  };

  const handleSaveEdit = async (id) => {
    setTeamsError('');
    setTeamsSuccess('');
    try {
      const res = await fetch(`http://localhost:4000/equipes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: editingCountry }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to update team');
      
      setEditingTeamId(null);
      setTeamsSuccess('Team updated successfully!');
      fetchTeams(); // Reload teams list
    } catch (err) {
      setTeamsError(err.message);
    }
  };

  const handleDeleteTeam = async (id) => {
    setTeamsError('');
    setTeamsSuccess('');
    try {
      const res = await fetch(`http://localhost:4000/equipes/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error('Failed to delete team');
      
      setTeams(data);
      setTeamsSuccess('Team deleted successfully.');
    } catch (err) {
      setTeamsError(err.message);
    }
  };

  return (
    <div className="glass-card">
      <h2 className="card-title">Teams Manager (MongoDB)</h2>
      <p className="card-description">Fetch, create, update, and delete football clubs registered in the system database.</p>
      
      {teamsError && <div className="alert alert-danger">{teamsError}</div>}
      {teamsSuccess && <div className="alert alert-success">{teamsSuccess}</div>}

      <div className="grid-sidebar">
        {/* Teams List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem' }}>Registered Football Clubs</h3>
            <button className="btn btn-secondary" onClick={fetchTeams} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Reload Teams</button>
          </div>
          
          <div className="table-container">
            <table className="teams-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Country</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.length > 0 ? (
                  teams.map(team => (
                    <tr key={team.id}>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{team.id}</td>
                      <td style={{ fontWeight: '600' }}>{team.name}</td>
                      <td>
                        {editingTeamId === team.id ? (
                          <input 
                            type="text" 
                            className="form-input" 
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.9rem' }}
                            value={editingCountry} 
                            onChange={(e) => setEditingCountry(e.target.value)}
                          />
                        ) : (
                          team.country
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {editingTeamId === team.id ? (
                            <>
                              <button className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleSaveEdit(team.id)}>Save</button>
                              <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setEditingTeamId(null)}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleStartEdit(team)}>Edit</button>
                              <button className="btn btn-danger" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleDeleteTeam(team.id)}>Delete</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                      No teams found in database. Add a new team on the right.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Team form */}
        <div className="glass-card" style={{ background: 'rgba(10, 11, 16, 0.4)', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Add New Team</h3>
          <form onSubmit={handleAddTeam}>
            <div className="form-group">
              <label className="form-label">Team Name</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={newTeamName} 
                onChange={(e) => setNewTeamName(e.target.value)} 
                placeholder="e.g. Liverpool"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                value={newTeamCountry} 
                onChange={(e) => setNewTeamCountry(e.target.value)} 
                placeholder="e.g. Angleterre"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Add Team
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TeamsPage;
