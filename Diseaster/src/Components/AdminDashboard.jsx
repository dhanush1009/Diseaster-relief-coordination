import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

useEffect(() => {
  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/requests/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  loadStats();
}, []);

return (
  <div className="admin-dashboard">
    <h2>Admin Dashboard</h2>
    <div className="stats-cards">
      <div className="card">Total Requests<br /><b>{stats?.total ?? 0}</b></div>
      <div className="card">Pending<br /><b>{stats?.pending ?? 0}</b></div>
      <div className="card">Completed<br /><b>{stats?.completed ?? 0}</b></div>
    </div>
    <div className="admin-actions">
      <a href="/view-requests">View Requests</a>
      <a href="/assign-volunteers">Assign Volunteers</a>
      <a href="/volunteer-dashboard">Volunteer Dashboard</a>
    </div>
  </div>
);

};

export default AdminDashboard;
