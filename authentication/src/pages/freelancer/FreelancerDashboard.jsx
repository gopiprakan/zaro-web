import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function FreelancerDashboard() {
  const { currentUser, projects, jobs } = useAuth();

  const activeContracts = projects.filter(p => p.freelancerEmail === currentUser?.email || currentUser?.role === 'freelancer');
  const monthEarnings = 8940;

  return (
    <div className="dashboard-content-flow">
      {/* Hero Welcome */}
      <div className="portal-hero-banner freelancer-theme">
        <div className="banner-left">
          <span className="banner-badge">FREELANCER DEVELOPER SUITE</span>
          <h1>Welcome, {currentUser?.displayName || 'Marcus'} 💻</h1>
          <p>
            You have <strong>{activeContracts.length} active client contracts</strong> and <strong>{jobs.length} new client inquiries</strong> available today.
          </p>
        </div>
        <div className="banner-actions">
          <Link to="/freelancer/jobs" className="action-btn-primary success-btn">
            <i className="ri-search-eye-line"></i> Browse New Gigs
          </Link>
          <Link to="/freelancer/earnings" className="action-btn-secondary">
            <i className="ri-wallet-3-line"></i> Payout Vault
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap success">
            <i className="ri-wallet-3-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Available Payout Balance</span>
            <span className="metric-val">${monthEarnings.toLocaleString()}</span>
            <span className="metric-sub positive">
              <i className="ri-arrow-up-line"></i> Ready for instant transfer
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap primary">
            <i className="ri-briefcase-4-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Active Client Contracts</span>
            <span className="metric-val">{activeContracts.length}</span>
            <span className="metric-sub">2 deliverables due this week</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap warning">
            <i className="ri-star-smile-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Job Success Score</span>
            <span className="metric-val">99.4%</span>
            <span className="metric-sub positive">Top Rated Developer</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap info">
            <i className="ri-send-plane-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Active Proposals</span>
            <span className="metric-val">3</span>
            <span className="metric-sub">1 client interview scheduled</span>
          </div>
        </div>
      </div>

      {/* Main Column */}
      <div className="dashboard-double-column">
        {/* Left: Active Contracts */}
        <div className="portal-glass-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <h3>Active Development Contracts</h3>
              <span className="panel-count">{activeContracts.length} Assigned</span>
            </div>
            <Link to="/freelancer/projects" className="panel-link">Manage All <i className="ri-arrow-right-s-line"></i></Link>
          </div>

          <div className="project-items-stack">
            {activeContracts.map((prj) => (
              <div key={prj.id} className="project-compact-card">
                <div className="compact-top">
                  <div>
                    <span className="project-code">{prj.id}</span>
                    <h4 className="project-name">{prj.title}</h4>
                    <span className="client-tag">Client: {prj.clientName}</span>
                  </div>
                  <span className={`status-badge ${prj.status.toLowerCase().replace(' ', '-')}`}>
                    {prj.status}
                  </span>
                </div>

                <div className="compact-progress-wrap">
                  <div className="progress-label-row">
                    <span>Task Progress</span>
                    <span className="progress-pct">{prj.progress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill success" style={{ width: `${prj.progress}%` }}></div>
                  </div>
                </div>

                <div className="compact-footer">
                  <div className="assigned-dev">
                    <i className="ri-calendar-line"></i> Due: {prj.deadline}
                  </div>
                  <div className="compact-budget">
                    <span>Contract Value: </span>
                    <strong className="text-success">${prj.budget.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recommended Gigs */}
        <div className="portal-sidebar-column">
          <div className="portal-glass-panel">
            <div className="panel-header">
              <h3>Hot Jobs Matching Your Skills</h3>
              <Link to="/freelancer/jobs" className="panel-link">All Gigs</Link>
            </div>

            <div className="recommended-jobs-list">
              {jobs.slice(0, 3).map((j) => (
                <div key={j.id} className="mini-job-card">
                  <div className="mini-job-header">
                    <h4>{j.title}</h4>
                    <span className="mini-job-budget">{j.budget}</span>
                  </div>
                  <p className="mini-job-client">Posted by {j.client} • {j.posted}</p>
                  <div className="mini-job-tags">
                    {j.tags.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="tag-pill">{t}</span>
                    ))}
                  </div>
                  <Link to="/freelancer/jobs" className="apply-btn-pill">
                    View & Apply <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
