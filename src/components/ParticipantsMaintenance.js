import React, { useState } from 'react';

function ParticipantsMaintenance() {
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Participant A', role: 'Admin' },
    { id: 2, name: 'Participant B', role: 'User' },
  ]);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');

  const handleAdd = () => {
    if (!newName.trim() || !newRole.trim()) {
      alert('Please enter both Name and Role.');
      return;
    }

    const newParticipant = {
      id: Date.now(),
      name: newName.trim(),
      role: newRole.trim(),
    };

    setParticipants([...participants, newParticipant]);
    setNewName('');
    setNewRole('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this participant?')) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <h5>Participants Maintenance</h5>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Role"
          value={newRole}
          onChange={e => setNewRole(e.target.value)}
          className="form-control mb-2"
        />
        <button className="btn btn-primary" onClick={handleAdd}>Add Participant</button>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {participants.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No participants found.</td>
            </tr>
          ) : (
            participants.map(({ id, name, role }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>{role}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ParticipantsMaintenance;
