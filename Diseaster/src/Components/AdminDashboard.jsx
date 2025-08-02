import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // you can style as you see fit

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, critical: 0, inProgress: 0 });
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const statsRes = await axios.get('http://localhost:5000/api/requests/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({
          total: statsRes.data.total,
          pending: statsRes.data.pending,
          completed: statsRes.data.completed,
          critical: statsRes.data.critical || 0,
          inProgress: statsRes.data.inProgress || 0
        });

        const reqRes = await axios.get('http://localhost:5000/api/requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(reqRes.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load dashboard data');
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <p>Coordinate disaster relief efforts and manage all help requests.</p>

      {stats.critical > 0 && (
        <div className="alert-critical">
          ⚠️ {stats.critical} critical request(s) require immediate attention!
        </div>
      )}

      <div className="stats-cards">
        <div className="card total">Total Requests: {stats.total}</div>
        <div className="card pending">Pending: {stats.pending}</div>
        <div className="card in-progress">In Progress: {stats.inProgress}</div>
        <div className="card completed">Completed: {stats.completed}</div>
        <div className="card critical">Critical: {stats.critical}</div>
      </div>

      <div className="quick-actions">
        <button>Send Alert</button>
        <button>Manage Volunteers</button>
        <button>Generate Report</button>
      </div>

      <div className="request-list">
        <h2>All Requests</h2>
        {requests.map(req => (
          <div key={req._id} className="request-card">
            <h3>{req.type || 'Help Request'}</h3>
            <p>{req.description}</p>
            <p><strong>Location:</strong> {req.location}</p>
            <p>
              {req.assignedVolunteer
                ? <>Assigned to: {req.assignedVolunteer.name}</>
                : <>Unassigned</>}
            </p>
            <div className="status-tags">
              {req.isCritical && <span className="tag critical">Critical</span>}
              <span className={`tag ${req.status.toLowerCase()}`}>{req.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
