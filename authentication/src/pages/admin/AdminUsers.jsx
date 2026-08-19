import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { usersList, setUsersList } = useAuth();
  const [filterRole, setFilterRole] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('client');

  const filteredUsers = usersList.filter((u) => {
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          u.id.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const toggleVerify = (id) => {
    setUsersList(prev =>
      prev.map(u => u.id === id ? { ...u, verified: !u.verified } : u)
    );
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const newUser = {
      id: `USR-${Math.floor(10 + Math.random() * 90)}`,
      name: newUserName,
      email: newUserEmail.toLowerCase(),
      role: newUserRole,
      status: 'Active',
      verified: true,
      joined: 'Just now'
    };

    setUsersList(prev => [newUser, ...prev]);
    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  return (
    <div className="dashboard-content-flow">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>User Management Directory</h2>
          <p className="text-secondary">Inspect accounts, modify permission roles, and moderate client & developer access.</p>
        </div>
        <button className="action-btn-primary admin-btn" onClick={() => setShowAddUserModal(true)}>
          <i className="ri-user-add-line"></i> Add Platform User
        </button>
      </div>

      {/* Controls */}
      <div className="table-controls-card">
        <div className="search-input-box">
          <i className="ri-search-line"></i>
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-button-group">
          {['all', 'client', 'freelancer', 'admin'].map((r) => (
            <button
              key={r}
              className={`filter-btn ${filterRole === r ? 'active' : ''}`}
              onClick={() => setFilterRole(r)}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="portal-glass-panel">
        <div className="responsive-table-container">
          <table className="portal-data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name / Email</th>
                <th>Platform Role</th>
                <th>Verification</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td><span className="code-text">{u.id}</span></td>
                  <td>
                    <div className="table-item-title">{u.name}</div>
                    <div className="table-item-sub">{u.email}</div>
                  </td>
                  <td>
                    <span className={`role-badge ${u.role}`}>{u.role.toUpperCase()}</span>
                  </td>
                  <td>
                    <span className={`verification-badge ${u.verified ? 'verified' : 'unverified'}`}>
                      <i className={u.verified ? 'ri-shield-check-fill' : 'ri-time-line'}></i>
                      {u.verified ? 'Verified ID' : 'Pending'}
                    </span>
                  </td>
                  <td><span className="status-badge active">{u.status}</span></td>
                  <td>{u.joined}</td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        className="icon-action-btn"
                        onClick={() => toggleVerify(u.id)}
                        title={u.verified ? 'Revoke Verification' : 'Verify Account'}
                      >
                        <i className={u.verified ? 'ri-shield-cross-line' : 'ri-shield-check-line'}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-backdrop" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Platform User</h3>
              <button className="modal-close" onClick={() => setShowAddUserModal(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Hayes"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="jordan@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Assigned Platform Role</label>
                <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                  <option value="client">Client</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="action-btn-primary admin-btn">
                  Create User Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
