import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedRequestId, setSelectedRequestId] = useState('');

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

  const handleAssign = async (volunteerId) => {
    if (!selectedRequestId) {
      alert('⚠️ Please enter Request ID before assigning.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/assign', {
        requestId: selectedRequestId,
        volunteerId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Volunteer assigned successfully!');
      setSelectedRequestId('');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to assign volunteer');
    }
  };

  const filteredVolunteers = volunteers.filter(v =>
    v.location?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="assign-volunteers">
      <h2>Assign Volunteers by Location</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search volunteers by location..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ padding: '0.4rem', marginRight: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Enter Request ID to assign"
          value={selectedRequestId}
          onChange={(e) => setSelectedRequestId(e.target.value)}
          style={{ padding: '0.4rem', marginRight: '0.5rem' }}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Location</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredVolunteers.map(v => (
            <tr key={v._id}>
              <td>{v.name}</td>
              <td>{v.email}</td>
              <td>{v.location}</td>
              <td>
                <button onClick={() => handleAssign(v._id)}>Assign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssignVolunteers;
