import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VolunteerDashboard.css';

const VolunteerDashboard = () => {
  const [stats, setStats] = useState({ available: 0, active: 0, completed: 0 });
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Get assigned tasks (active)
        const assignedRes = await axios.get('http://localhost:5000/api/requests/assigned', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Get all available requests
        const allRes = await axios.get('http://localhost:5000/api/requests', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setRequests(allRes.data);
        setStats({
          available: allRes.data.length,
          active: assignedRes.data.length,
          completed: assignedRes.data.filter(r => r.status === 'completed').length
        });
      } catch (err) {
        console.error(err);
        alert('Failed to load volunteer dashboard');
      }
    };
    fetchData();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/requests/${requestId}/assign`, {
        volunteerId: 'me' // backend should replace with logged-in user
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert('✅ Request accepted!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to accept request');
    }
  };

  return (
    <div className="volunteer-dashboard">
      <h1>Volunteer Dashboard</h1>
      <p>Find help requests in your area and make a difference in your community.</p>

      <div className="stats-cards">
        <div className="card available">Available Requests: {stats.available}</div>
        <div className="card active">My Active Tasks: {stats.active}</div>
        <div className="card completed">Tasks Completed: {stats.completed}</div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search requests..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select>
          <option>All Categories</option>
        </select>
        <select>
          <option>All Urgency Levels</option>
        </select>
        <button>Clear Filters</button>
      </div>

      <h2>Available Requests</h2>
      {requests
        .filter(r => r.status === 'pending' && r.description.toLowerCase().includes(search.toLowerCase()))
        .map(req => (
        <div key={req._id} className="request-card">
          <h3>{req.type || 'Help Request'}</h3>
          <p>{req.description}</p>
          <p><strong>Location:</strong> {req.location}</p>
          <p><strong>Date:</strong> {(new Date(req.createdAt)).toLocaleDateString()}</p>
          <div className="status-tags">
            {req.isCritical && <span className="tag critical">Critical</span>}
            <span className={`tag ${req.status.toLowerCase()}`}>{req.status}</span>
          </div>
          <button className="accept-btn" onClick={() => handleAccept(req._id)}>Accept Request</button>
        </div>
      ))}
    </div>
  );
};

export default VolunteerDashboard;
