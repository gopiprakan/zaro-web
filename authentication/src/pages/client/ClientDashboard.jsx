import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ClientDashboard() {
  const { currentUser, projects, addProject } = useAuth();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Full-Stack Web');
  const [newBudget, setNewBudget] = useState('4500');
  const [newDescription, setNewDescription] = useState('');

  const clientProjects = projects.filter(
    p => p.clientEmail === currentUser?.email || p.clientName === currentUser?.displayName || currentUser?.role === 'client'
  );

  const activeProjects = clientProjects.filter(p => p.status === 'In Progress');
  const completedProjects = clientProjects.filter(p => p.status === 'Completed');
  const totalInvested = clientProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addProject({
      title: newTitle,
      category: newCategory,
      budget: Number(newBudget),
      clientName: currentUser?.displayName || 'Elena Rostova',
      clientEmail: currentUser?.email || 'client@zaro.dev',
      freelancerName: 'Marcus Sterling (Assigned)',
      freelancerEmail: 'freelancer@zaro.dev',
      deadline: '2026-10-30',
      description: newDescription || 'Modern boutique digital storefront with mobile checkout.',
    });

    setNewTitle('');
    setNewDescription('');
    setShowNewProjectModal(false);
  };

  return (
    <div className="dashboard-content-flow">
      {/* Welcome Banner */}
      <div className="portal-hero-banner">
        <div className="banner-left">
          <span className="banner-badge">CLIENT PORTAL WORKSPACE</span>
          <h1>Welcome back, {currentUser?.displayName || 'Elena'} 👋</h1>
          <p>
            Track your ongoing retail launches, inspect milestone deliverables, and message your development team.
          </p>
        </div>
        <div className="banner-actions">
          <button
            className="action-btn-primary"
            onClick={() => setShowNewProjectModal(true)}
          >
            <i className="ri-add-circle-line"></i> Post New Project
          </button>
          <Link to="/client/messages" className="action-btn-secondary">
            <i className="ri-chat-3-line"></i> Live Chat
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap primary">
            <i className="ri-folder-open-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Active Projects</span>
            <span className="metric-val">{activeProjects.length}</span>
            <span className="metric-sub positive">
              <i className="ri-arrow-up-line"></i> 2 milestones in review
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap success">
            <i className="ri-money-dollar-circle-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Total Project Budget</span>
            <span className="metric-val">${totalInvested.toLocaleString()}</span>
            <span className="metric-sub">
              <i className="ri-shield-check-line"></i> Escrow protected
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap warning">
            <i className="ri-checkbox-circle-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Completed Work</span>
            <span className="metric-val">{completedProjects.length}</span>
            <span className="metric-sub positive">100% On-time delivery</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap info">
            <i className="ri-time-line"></i>
          </div>
          <div className="metric-data">
            <span className="metric-title">Avg. Launch Speed</span>
            <span className="metric-val">12 Days</span>
            <span className="metric-sub positive">
              <i className="ri-flashlight-line"></i> 4x faster than agency avg
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Overview & Activity Feed */}
      <div className="dashboard-double-column">
        {/* Left Column: Active Projects List */}
        <div className="portal-glass-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <h3>Active Retail & Web Projects</h3>
              <span className="panel-count">{clientProjects.length} Total</span>
            </div>
            <Link to="/client/projects" className="panel-link">
              View All <i className="ri-arrow-right-s-line"></i>
            </Link>
          </div>

          <div className="project-items-stack">
            {clientProjects.map((prj) => (
              <div key={prj.id} className="project-compact-card">
                <div className="compact-top">
                  <div>
                    <span className="project-code">{prj.id}</span>
                    <h4 className="project-name">{prj.title}</h4>
                    <span className="project-category-tag">{prj.category}</span>
                  </div>
                  <span className={`status-badge ${prj.status.toLowerCase().replace(' ', '-')}`}>
                    {prj.status}
                  </span>
                </div>

                <div className="compact-progress-wrap">
                  <div className="progress-label-row">
                    <span>Deliverables Progress</span>
                    <span className="progress-pct">{prj.progress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${prj.progress}%` }}></div>
                  </div>
                </div>

                <div className="compact-footer">
                  <div className="assigned-dev">
                    <i className="ri-user-smile-line"></i>
                    <span>{prj.freelancerName}</span>
                  </div>
                  <div className="compact-budget">
                    <span>Budget: </span>
                    <strong>${prj.budget.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Invoices & Team Messages */}
        <div className="portal-sidebar-column">
          {/* Assigned Specialists */}
          <div className="portal-glass-panel">
            <div className="panel-header">
              <h3>Assigned Specialists</h3>
            </div>
            <div className="specialists-list">
              <div className="specialist-row">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                  alt="Marcus Sterling"
                  className="spec-avatar"
                />
                <div className="spec-meta">
                  <strong>Marcus Sterling</strong>
                  <span>Lead Full-Stack Architect</span>
                </div>
                <Link to="/client/messages" className="icon-chat-btn" title="Message">
                  <i className="ri-message-3-line"></i>
                </Link>
              </div>

              <div className="specialist-row">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
                  alt="Sarah Jenkins"
                  className="spec-avatar"
                />
                <div className="spec-meta">
                  <strong>Sarah Jenkins</strong>
                  <span>UI/UX Designer & Animator</span>
                </div>
                <Link to="/client/messages" className="icon-chat-btn" title="Message">
                  <i className="ri-message-3-line"></i>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Payments Summary */}
          <div className="portal-glass-panel">
            <div className="panel-header">
              <h3>Recent Invoices</h3>
              <Link to="/client/payments" className="panel-link">Manage</Link>
            </div>
            <div className="mini-invoice-list">
              <div className="mini-invoice-row">
                <div>
                  <strong>#INV-9021</strong>
                  <p>Frontend React Milestone</p>
                </div>
                <span className="price-tag">$2,400</span>
              </div>
              <div className="mini-invoice-row">
                <div>
                  <strong>#INV-9020</strong>
                  <p>Wireframing & UI Kit</p>
                </div>
                <span className="price-tag">$1,800</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="modal-backdrop" onClick={() => setShowNewProjectModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Launch New Web Project</h3>
              <button className="modal-close" onClick={() => setShowNewProjectModal(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="form-group">
                <label>Project Title / Shop Concept</label>
                <input
                  type="text"
                  placeholder="e.g. Artisanal Bakery Online Ordering"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="Full-Stack Web">Full-Stack Web</option>
                    <option value="UI/UX & Branding">UI/UX & Branding</option>
                    <option value="E-Commerce & Storefront">E-Commerce & Storefront</option>
                    <option value="Local SEO & Growth">Local SEO & Growth</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Budget ($)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Project Scope & Requirements</label>
                <textarea
                  rows="4"
                  placeholder="Describe your design goals, target audience, and required integrations..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowNewProjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="action-btn-primary">
                  <i className="ri-send-plane-line"></i> Submit to ZARO Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
