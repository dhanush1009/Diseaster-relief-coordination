import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VolunteerDashboard.css';

const VolunteerDashboard = () => {
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    const loadAssigned = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/requests/assigned', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssigned(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadAssigned();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/requests/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // refresh list
      const res = await axios.get('http://localhost:5000/api/requests/assigned', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssigned(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="volunteer-dashboard">
      <h2>My Assigned Requests</h2>
      <div className="cards-grid">
        {assigned.map(req => (
          <div className="request-card" key={req._id}>
            <p><b>{req.description}</b></p>
            <p>Type: {req.type}</p>
            <p>Location: {req.location}</p>
            <p>Status: {req.status}</p>
            <button onClick={() => updateStatus(req._id, 'in progress')}>In Progress</button>
            <button onClick={() => updateStatus(req._id, 'completed')}>Completed</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
