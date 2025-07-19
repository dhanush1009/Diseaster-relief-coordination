import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Register from './Components/Register';
import RequestHelp from './Components/Requesthelp';
import ViewRequests from './Components/ViewRequests';
import VolunteerDashboard from './Components/VolunteerDashboard';
import AdminDashboard from './Components/AdminDashboard';
import AssignVolunteers from './Components/AssignVolunteers';
import './App.css';

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request-help" element={<RequestHelp />} />
        <Route path="/view-requests" element={<ViewRequests />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Volunteer Dashboard */}
        <Route path="/volunteer-dashboard" element={<VolunteerDashboard />} />
        <Route path="/assign-volunteers" element={<AssignVolunteers />} />
      </Routes>
    </div>
  );
}

export default App;
