import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'victim',
    location: '' // ✅ add location field
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Registered successfully! ✅ Please log in.');
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="victim">Victim</option>
          <option value="volunteer">Volunteer</option>
          <option value="admin">Admin</option>
        </select>
        {form.role === 'volunteer' && (
          <input name="location" placeholder="Your location" onChange={handleChange} required />
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
