import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProjects() {
  const { projects, setProjects } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesStatus = filterStatus === 'all' || p.status.toLowerCase().replace(' ', '-') === filterStatus;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.clientName.toLowerCase().includes(search.toLowerCase()) ||
                          p.freelancerName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (id, newStatus) => {
    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, status: newStatus } : p)
    );
  };

  return (
    <div className="dashboard-content-flow">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Global Platform Projects Oversight</h2>
          <p className="text-secondary">Monitor contract milestones, escrow allocations, and resolve deliverables.</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="table-controls-card">
        <div className="search-input-box">
          <i className="ri-search-line"></i>
          <input
            type="text"
            placeholder="Search by project name, client, or developer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-button-group">
          {['all', 'in-progress', 'under-review', 'completed'].map((s) => (
            <button
              key={s}
              className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s.replace('-', ' ').toUpperCase()}
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
                <th>Project ID</th>
                <th>Project Title & Scope</th>
                <th>Client</th>
                <th>Assigned Freelancer</th>
                <th>Escrow Budget</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Moderation</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => (
                <tr key={p.id}>
                  <td><span className="code-text">{p.id}</span></td>
                  <td>
                    <div className="table-item-title">{p.title}</div>
                    <div className="table-item-sub">{p.category}</div>
                  </td>
                  <td>{p.clientName}</td>
                  <td>{p.freelancerName}</td>
                  <td><strong>${p.budget.toLocaleString()}</strong></td>
                  <td>
                    <div className="mini-progress-box">
                      <span>{p.progress}%</span>
                      <div className="progress-bar-track mini">
                        <div className="progress-bar-fill admin" style={{ width: `${p.progress}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${p.status.toLowerCase().replace(' ', '-')}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="table-status-select"
                      value={p.status}
                      onChange={(e) => handleStatusChange(p.id, e.target.value)}
                    >
                      <option value="In Progress">In Progress</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
