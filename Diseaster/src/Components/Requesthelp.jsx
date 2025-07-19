import React, { useState } from 'react';
import axios from 'axios';
import './RequestHelp.css';

const RequestHelp = () => {
  const [form, setForm] = useState({ type: '', location: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ type: '', location: '', description: '' });
      setSuccess('✅ Request submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Request Help</h2>
      <form onSubmit={handleSubmit}>
        <label>Type of Help</label>
        <input name="type" value={form.type} onChange={handleChange} required />

        <label>Location</label>
        <input name="location" value={form.location} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
      {success && <p className="success-msg">{success}</p>}
    </div>
  );
};

export default RequestHelp;
