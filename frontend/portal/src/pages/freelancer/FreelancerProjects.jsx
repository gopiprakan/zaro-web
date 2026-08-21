import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function FreelancerProjects() {
  const { projects } = useAuth();
  const [selectedProject, setSelectedProject] = useState(null);
  const [deliverableNote, setDeliverableNote] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const freelancerProjects = projects;

  const handleSubmitMilestone = (e) => {
    e.preventDefault();
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setSelectedProject(null);
      setDeliverableNote('');
    }, 2000);
  };

  return (
    <div className="dashboard-content-flow">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Active Freelance Contracts & Milestones</h2>
          <p className="text-secondary">Track client requirements, submit code deliverables for review, and claim escrow payouts.</p>
        </div>
      </div>

      <div className="projects-card-grid">
        {freelancerProjects.map((prj) => (
          <div key={prj.id} className="project-detail-card">
            <div className="card-top-row">
              <div>
                <span className="project-id-chip">{prj.id}</span>
                <h3 className="project-card-title">{prj.title}</h3>
                <span className="client-tag">Client: {prj.clientName}</span>
              </div>
              <span className={`status-badge ${prj.status.toLowerCase().replace(' ', '-')}`}>
                {prj.status}
              </span>
            </div>

            <p className="project-card-desc">{prj.description}</p>

            <div className="project-progress-section">
              <div className="progress-label-bar">
                <span>Task Execution</span>
                <strong>{prj.progress}%</strong>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill success" style={{ width: `${prj.progress}%` }}></div>
              </div>
            </div>

            {/* Milestones checklist */}
            <div className="milestones-accordion">
              <span className="milestones-heading">Contract Milestones:</span>
              <div className="milestones-pills">
                {prj.milestones?.map((m, idx) => (
                  <div key={idx} className={`milestone-item-row ${m.status.toLowerCase()}`}>
                    <div className="milestone-name">
                      <i className={m.status === 'Completed' ? 'ri-checkbox-circle-fill' : 'ri-time-line'}></i>
                      <span>{m.name}</span>
                    </div>
                    <span className="milestone-cost text-success">${m.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card-footer-meta">
              <div className="assigned-specialist-info">
                <i className="ri-calendar-check-line"></i>
                <span>Deadline: <strong>{prj.deadline}</strong></span>
              </div>
              <button
                className="action-btn-primary success-btn"
                onClick={() => setSelectedProject(prj)}
              >
                <i className="ri-upload-cloud-2-line"></i> Submit Work
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deliverable Submission Modal */}
      {selectedProject && (
        <div className="modal-backdrop" onClick={() => setSelectedProject(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submit Work: {selectedProject.title}</h3>
              <button className="modal-close" onClick={() => setSelectedProject(null)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            {submitSuccess ? (
              <div className="auth-alert success" style={{ margin: '20px' }}>
                <i className="ri-checkbox-circle-line"></i>
                <span>Deliverables submitted to Client for milestone escrow release!</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitMilestone} className="modal-form">
                <div className="form-group">
                  <label>Deployment Preview Link or GitHub PR URL</label>
                  <input
                    type="url"
                    placeholder="https://staging.zaro.agency/preview/shop-demo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Deliverable Notes & Verification Summary</label>
                  <textarea
                    rows="4"
                    placeholder="Describe what was built, responsive test results, and instructions for the client..."
                    value={deliverableNote}
                    onChange={(e) => setDeliverableNote(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setSelectedProject(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="action-btn-primary success-btn">
                    <i className="ri-send-plane-fill"></i> Submit for Client Approval
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
