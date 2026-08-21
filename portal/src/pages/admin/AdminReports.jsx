import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminReports() {
  const { projects, usersList } = useAuth();
  const [downloadMsg, setDownloadMsg] = useState('');

  const triggerExport = (type) => {
    setDownloadMsg(`Generating official ${type.toUpperCase()} analytics report...`);
    setTimeout(() => {
      setDownloadMsg(`✓ Report exported successfully to your downloads!`);
      setTimeout(() => setDownloadMsg(''), 3000);
    }, 1200);
  };

  return (
    <div className="dashboard-content-flow">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>System Intelligence & Executive Reports</h2>
          <p className="text-secondary">Export financial audit trails, user growth trends, and conversion benchmarks.</p>
        </div>
        <div className="button-group-row">
          <button className="action-btn-secondary" onClick={() => triggerExport('csv')}>
            <i className="ri-file-excel-2-line"></i> Export CSV
          </button>
          <button className="action-btn-primary admin-btn" onClick={() => triggerExport('pdf')}>
            <i className="ri-file-pdf-2-line"></i> Download Audit PDF
          </button>
        </div>
      </div>

      {downloadMsg && (
        <div className="auth-alert success">
          <i className="ri-checkbox-circle-line"></i>
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Analytics Cards Grid */}
      <div className="reports-card-grid">
        <div className="report-stat-card">
          <div className="report-top">
            <span className="report-metric-title">Retail Shop Conversion Rate</span>
            <span className="report-growth positive">+34% vs Q1</span>
          </div>
          <h3 className="report-main-val">68.2%</h3>
          <p>Clients seeing digital store orders within 7 days of ZARO site launch.</p>
          <div className="progress-bar-track">
            <div className="progress-bar-fill admin" style={{ width: '68%' }}></div>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-top">
            <span className="report-metric-title">Average Launch Velocity</span>
            <span className="report-growth positive">-5.2 Days</span>
          </div>
          <h3 className="report-main-val">11.8 Days</h3>
          <p>End-to-end turnaround from initial wireframe to live production domain.</p>
          <div className="progress-bar-track">
            <div className="progress-bar-fill success" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="report-top">
            <span className="report-metric-title">Client Retention & Retainers</span>
            <span className="report-growth positive">+19% MoM</span>
          </div>
          <h3 className="report-main-val">94.1%</h3>
          <p>Local businesses opting into monthly maintenance & SEO growth plans.</p>
          <div className="progress-bar-track">
            <div className="progress-bar-fill info" style={{ width: '94%' }}></div>
          </div>
        </div>
      </div>

      {/* Platform Audit Logs */}
      <div className="portal-glass-panel">
        <div className="panel-header">
          <h3>Real-time Platform Audit Stream</h3>
          <span className="panel-count">Live</span>
        </div>

        <div className="audit-log-list">
          <div className="audit-log-row">
            <div className="audit-icon success"><i className="ri-shield-keyhole-line"></i></div>
            <div className="audit-details">
              <strong>Admin Alexander Vance authenticated via 2FA</strong>
              <span>IP 192.168.1.1 • Location: Bangalore, IN</span>
            </div>
            <span className="audit-time">Just now</span>
          </div>

          <div className="audit-log-row">
            <div className="audit-icon primary"><i className="ri-money-dollar-circle-line"></i></div>
            <div className="audit-details">
              <strong>Milestone Escrow settled for PRJ-1082 ($2,400)</strong>
              <span>Automated Stripe webhook clearance</span>
            </div>
            <span className="audit-time">14 mins ago</span>
          </div>

          <div className="audit-log-row">
            <div className="audit-icon warning"><i className="ri-user-add-line"></i></div>
            <div className="audit-details">
              <strong>New Freelancer applicant approved (Marcus Sterling)</strong>
              <span>Verified portfolio + GitHub commit history</span>
            </div>
            <span className="audit-time">1 hour ago</span>
          </div>

          <div className="audit-log-row">
            <div className="audit-icon info"><i className="ri-database-2-line"></i></div>
            <div className="audit-details">
              <strong>Daily automated database snapshot & cold storage backup</strong>
              <span>2.4 GB encrypted snapshot written to AWS S3 Glacier</span>
            </div>
            <span className="audit-time">4 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
