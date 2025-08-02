import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewRequests.css';

const ViewRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Request deleted successfully');
      fetchRequests(); // refresh list
    } catch (err) {
      console.error(err);
      alert('❌ Failed to delete request');
    }
  };

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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id}>
              <td>{req.user?.name || 'Unknown'}</td>
              <td>{req.type || '-'}</td>
              <td>{req.location}</td>
              <td>{req.description}</td>
              <td>{req.status}</td>
              <td>
                <button onClick={() => handleDelete(req._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRequests;
