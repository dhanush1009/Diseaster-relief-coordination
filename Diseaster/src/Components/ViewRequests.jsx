import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewRequests.css';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(res.data);
      } catch (err) {
        console.error(err);
        alert('❌ Could not load requests');
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="view-requests-container">
      <h2>All Help Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.user?.name || 'Unknown'}</td>
              <td>{req.type}</td>
              <td>{req.location}</td>
              <td>{req.description}</td>
              <td>{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRequests;
