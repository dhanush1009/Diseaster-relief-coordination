import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RequestHelp.css';
import { FaMapMarkerAlt, FaHeart, FaClock, FaCheckCircle, FaPlus } from 'react-icons/fa';

const RequestHelp = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    type: '',
    urgency: '',
    location: '',
    description: '',
    contact: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch stats
        const statsRes = await axios.get('http://localhost:5000/api/requests/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({
          total: statsRes.data.total || 0,
          pending: statsRes.data.pending || 0,
          completed: statsRes.data.completed || 0
        });

        // Fetch user's requests
        const reqRes = await axios.get('http://localhost:5000/api/requests/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(reqRes.data);
      } catch (err) {
        console.error(err);
        alert('❌ Failed to load data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.type || !form.urgency || !form.location || !form.description || !form.contact) {
      alert('Please fill in all fields!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Request submitted!');
      setForm({ type: '', urgency: '', location: '', description: '', contact: '' });
    } catch (err) {
      console.error(err);
      alert('❌ Failed to submit request');
    }
  };

  return (
    <div className="request-assistance">
      <h2>Request Assistance</h2>

      <div className="stats">
        <div className="stat-card">
          <FaPlus /> Total Requests <span>{stats.total}</span>
        </div>
        <div className="stat-card">
          <FaClock /> Pending <span>{stats.pending}</span>
        </div>
        <div className="stat-card">
          <FaCheckCircle /> Completed <span>{stats.completed}</span>
        </div>
      </div>

      <div className="main-content">
        <div className="form-section">
          <h3>Submit New Request</h3>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="">Select help type...</option>
            <option>Medical Aid</option>
            <option>Food & Water</option>
            <option>Shelter</option>
            <option>Rescue</option>
          </select>
          <select name="urgency" value={form.urgency} onChange={handleChange}>
            <option value="">Select urgency...</option>
            <option>low</option>
            <option>medium</option>
            <option>high</option>
            <option>critical</option>
          </select>
          <input
            name="location"
            placeholder="Location (e.g., Downtown, Zone A)"
            value={form.location}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Please describe your situation and what help you need..."
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="contact"
            placeholder="Contact Information"
            value={form.contact}
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>Submit Request</button>
        </div>

        <div className="requests-section">
          <h3>My Requests</h3>
          {requests.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            requests.map((req) => (
              <div key={req._id} className="request-card">
                <h4><FaHeart color="red" /> {req.type}</h4>
                <p>{req.description}</p>
                <p><FaMapMarkerAlt /> {req.location}</p>
                <p>Posted: {new Date(req.createdAt).toLocaleString()}</p>
                <p>
                  Status: <span className={`status ${req.status}`}>{req.status}</span>
                </p>
                {req.assignedVolunteer && (
                  <p>Assigned to: {req.assignedVolunteer.name}</p>
                )}
                <span className={`urgency ${req.urgency}`}>{req.urgency}</span>
                <button>View Details</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestHelp;
