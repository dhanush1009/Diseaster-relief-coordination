import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);

  useEffect(() => {
    const loadVolunteers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/admin/volunteers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVolunteers(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to load volunteers');
      }
    };
    loadVolunteers();
  }, []);

  return (
    <div className="assign-volunteers">
      <h2>All Volunteers</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Location</th><th>Work Assign</th>
          </tr>
        </thead>
        <tbody>
       {volunteers.map(v => (
  <tr key={v._id}>
    <td>{v.name}</td>
    <td>{v.email}</td>
    <td>{v.location}</td>
    <td>{v.workAssign}</td>
  </tr>
))}

        </tbody>
      </table>
    </div>
  );
};

export default AssignVolunteers;
