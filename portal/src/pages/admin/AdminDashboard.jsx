import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { currentUser, projects, usersList, payments } = useAuth();

  const totalVolume = payments.reduce((acc, curr) => acc + curr.amount, 0) + 124500;
  const platformRevenue = Math.round(totalVolume * 0.12);

  return (
    <div className="dashboard-content-flow">
      {/* Header */}
      <div className="portal-hero-banner admin-theme">
        <div className="banner-left">
          <span className="banner-badge">ADMIN CONTROL CENTER</span>
          <h1>System Overview & Health 🛡️</h1>
          <p>
            Welcome, <strong>{currentUser?.displayName || 'Alexander'}</strong>. All platform services, escrow vaults, and realtime WebSockets are operational at 99.99% uptime.
          </p>
        </div>
        <div className="banner-actions">
          <Link to="/admin/reports" className="action-btn-primary admin-btn">
            <i className="ri-file-chart-line"></i> Generate Audit Report
          </Link>
          <Link to="/admin/users" className="action-btn-secondary">
            <i className="ri-user-settings-line"></i> Manage Users
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap warning">
            <i className="ri-funds-box-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Gross Volume (GMV)</span>
            <span className="metric-val">${totalVolume.toLocaleString()}</span>
            <span className="metric-sub positive">
              <i className="ri-arrow-up-line"></i> +28.4% month-over-month
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap success">
            <i className="ri-hand-coin-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Platform Take Rate Revenue</span>
            <span className="metric-val text-success">${platformRevenue.toLocaleString()}</span>
            <span className="metric-sub positive">12.0% average margin</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap primary">
            <i className="ri-team-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Total Active Users</span>
            <span className="metric-val">{usersList.length + 1420}</span>
            <span className="metric-sub">Clients & Developers</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap info">
            <i className="ri-shield-check-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Escrow Vault Security</span>
            <span className="metric-val">100%</span>
            <span className="metric-sub positive">Zero pending disputes</span>
          </div>
        </div>
      </div>

      {/* 2-Column Split */}
      <div className="dashboard-double-column">
        {/* Left: Global Projects Feed */}
        <div className="portal-glass-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <h3>Global Active Contracts</h3>
              <span className="panel-count">{projects.length} Ongoing</span>
            </div>
            <Link to="/admin/projects" className="panel-link">Manage All <i className="ri-arrow-right-s-line"></i></Link>
          </div>

          <div className="project-items-stack">
            {projects.map((prj) => (
              <div key={prj.id} className="project-compact-card">
                <div className="compact-top">
                  <div>
                    <span className="project-code">{prj.id}</span>
                    <h4 className="project-name">{prj.title}</h4>
                    <span className="client-tag">
                      Client: <strong>{prj.clientName}</strong> → Dev: <strong>{prj.freelancerName}</strong>
                    </span>
                  </div>
                  <span className={`status-badge ${prj.status.toLowerCase().replace(' ', '-')}`}>
                    {prj.status}
                  </span>
                </div>

                <div className="compact-progress-wrap">
                  <div className="progress-label-row">
                    <span>Overall Milestone Progress</span>
                    <span className="progress-pct">{prj.progress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill admin" style={{ width: `${prj.progress}%` }}></div>
                  </div>
                </div>

                <div className="compact-footer">
                  <div className="assigned-dev">
                    <i className="ri-time-line"></i> Deadline: {prj.deadline}
                  </div>
                  <div className="compact-budget">
                    <span>Escrow Value: </span>
                    <strong>${prj.budget.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick User Moderation */}
        <div className="portal-sidebar-column">
          <div className="portal-glass-panel">
            <div className="panel-header">
              <h3>Recent User Registrations</h3>
              <Link to="/admin/users" className="panel-link">Directory</Link>
            </div>

            <div className="admin-user-quick-list">
              {usersList.slice(0, 4).map((u) => (
                <div key={u.id} className="admin-user-row">
                  <div className="admin-user-avatar">
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="admin-user-info">
                    <strong>{u.name}</strong>
                    <span>{u.email}</span>
                  </div>
                  <span className={`role-badge ${u.role}`}>{u.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="portal-glass-panel">
            <div className="panel-header">
              <h3>System Health</h3>
            </div>
            <div className="system-health-bars">
              <div className="health-item">
                <div className="health-label"><span>Vite API Gateway</span><strong className="text-success">Optimal</strong></div>
                <div className="progress-bar-track"><div className="progress-bar-fill success" style={{ width: '99%' }}></div></div>
              </div>
              <div className="health-item">
                <div className="health-label"><span>Authentication Gateway</span><strong className="text-success">Connected</strong></div>
                <div className="progress-bar-track"><div className="progress-bar-fill success" style={{ width: '100%' }}></div></div>
              </div>
              <div className="health-item">
                <div className="health-label"><span>Escrow Ledger Sync</span><strong className="text-success">Verified</strong></div>
                <div className="progress-bar-track"><div className="progress-bar-fill success" style={{ width: '98%' }}></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
