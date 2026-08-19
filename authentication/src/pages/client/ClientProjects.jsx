import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function ClientProjects() {
  const { currentUser, projects } = useAuth();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const clientProjects = projects.filter(
    p => p.clientEmail === currentUser?.email || p.clientName === currentUser?.displayName || currentUser?.role === 'client'
  );

  const filteredProjects = clientProjects.filter(p => {
    const matchesFilter = filter === 'all' || p.status.toLowerCase().replace(' ', '-') === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.freelancerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="dashboard-content-flow">
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h2>Client Projects & Milestones</h2>
          <p className="text-secondary">Inspect real-time progress, code deliverables, and project scopes.</p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="table-controls-card">
        <div className="search-input-box">
          <i className="ri-search-line"></i>
          <input
            type="text"
            placeholder="Search by project name, ID, or developer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-button-group">
          {['all', 'in-progress', 'under-review', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.replace('-', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-card-grid">
        {filteredProjects.length === 0 ? (
          <div className="empty-state-box">
            <i className="ri-folder-info-line"></i>
            <h3>No projects found</h3>
            <p>No projects match your active filter criteria.</p>
          </div>
        ) : (
          filteredProjects.map((prj) => (
            <div key={prj.id} className="project-detail-card">
              <div className="card-top-row">
                <div>
                  <span className="project-id-chip">{prj.id}</span>
                  <h3 className="project-card-title">{prj.title}</h3>
                </div>
                <span className={`status-badge ${prj.status.toLowerCase().replace(' ', '-')}`}>
                  {prj.status}
                </span>
              </div>

              <p className="project-card-desc">{prj.description}</p>

              {/* Progress */}
              <div className="project-progress-section">
                <div className="progress-label-bar">
                  <span>Development Completion</span>
                  <strong>{prj.progress}%</strong>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${prj.progress}%` }}></div>
                </div>
              </div>

              {/* Milestones Preview */}
              <div className="milestones-accordion">
                <span className="milestones-heading">Milestone Deliverables:</span>
                <div className="milestones-pills">
                  {prj.milestones?.map((m, idx) => (
                    <div key={idx} className={`milestone-item-row ${m.status.toLowerCase()}`}>
                      <div className="milestone-name">
                        <i className={m.status === 'Completed' ? 'ri-checkbox-circle-fill' : 'ri-time-line'}></i>
                        <span>{m.name}</span>
                      </div>
                      <span className="milestone-cost">${m.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Meta */}
              <div className="card-footer-meta">
                <div className="assigned-specialist-info">
                  <i className="ri-user-star-line"></i>
                  <span>Developer: <strong>{prj.freelancerName}</strong></span>
                </div>
                <div className="project-budget-summary">
                  <span>Total Budget: </span>
                  <strong>${prj.budget.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
