import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PortalLayout({ children }) {
  const { currentUser, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Theme Sync
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('zaro-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zaro-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    if (newRole === 'client') navigate('/client/dashboard');
    else if (newRole === 'freelancer') navigate('/freelancer/dashboard');
    else if (newRole === 'admin') navigate('/admin/dashboard');
  };

  // Menu items for each role
  const clientNav = [
    { label: 'Dashboard', path: '/client/dashboard', icon: 'ri-dashboard-3-line' },
    { label: 'My Projects', path: '/client/projects', icon: 'ri-folder-shared-line', badge: '3' },
    { label: 'Messages', path: '/client/messages', icon: 'ri-message-3-line', badge: '2' },
    { label: 'Payments', path: '/client/payments', icon: 'ri-bank-card-line' },
  ];

  const freelancerNav = [
    { label: 'Dashboard', path: '/freelancer/dashboard', icon: 'ri-dashboard-line' },
    { label: 'Find Jobs', path: '/freelancer/jobs', icon: 'ri-briefcase-line', badge: 'Hot' },
    { label: 'My Projects', path: '/freelancer/projects', icon: 'ri-task-line', badge: '4' },
    { label: 'Messages', path: '/freelancer/messages', icon: 'ri-chat-1-line', badge: '1' },
    { label: 'Earnings', path: '/freelancer/earnings', icon: 'ri-wallet-3-line' },
  ];

  const adminNav = [
    { label: 'Overview', path: '/admin/dashboard', icon: 'ri-bar-chart-box-line' },
    { label: 'Users Directory', path: '/admin/users', icon: 'ri-team-line', badge: '6' },
    { label: 'All Projects', path: '/admin/projects', icon: 'ri-folders-line' },
    { label: 'Escrow & Payouts', path: '/admin/payments', icon: 'ri-money-dollar-circle-line' },
    { label: 'System Reports', path: '/admin/reports', icon: 'ri-file-chart-line' },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'freelancer' ? freelancerNav : clientNav;

  const roleColors = {
    client: { badge: 'badge-client', title: 'Client Workspace', gradient: 'var(--primary-gradient)' },
    freelancer: { badge: 'badge-freelancer', title: 'Freelancer Suite', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    admin: { badge: 'badge-admin', title: 'Admin Command', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
  };

  const currentRoleStyle = roleColors[role] || roleColors.client;

  return (
    <div className="portal-wrapper">
      {/* Background glow effects */}
      <div className="bg-glow glow-top-right"></div>
      <div className="bg-glow glow-bottom-left"></div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="portal-mobile-backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`portal-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <a href="../index.html" className="brand-link" title="Return to ZARO Agency">
            <div className="brand-icon-box">Z</div>
            <div className="brand-text">
              <span className="brand-title">ZARO</span>
              <span className="brand-subtitle">{currentRoleStyle.title}</span>
            </div>
          </a>
          <button
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close Sidebar"
          >
            <i className="ri-close-line"></i>
          </button>
        </div>

        {/* Role Quick Selector (For easy testing & switching) */}
        <div className="sidebar-role-selector">
          <span className="role-selector-label">ACTIVE ROLE</span>
          <div className="role-pill-group">
            <button
              className={`role-pill ${role === 'client' ? 'active client' : ''}`}
              onClick={() => handleRoleChange('client')}
            >
              <i className="ri-user-star-line"></i> Client
            </button>
            <button
              className={`role-pill ${role === 'freelancer' ? 'active freelancer' : ''}`}
              onClick={() => handleRoleChange('freelancer')}
            >
              <i className="ri-code-s-slash-line"></i> Freelancer
            </button>
            <button
              className={`role-pill ${role === 'admin' ? 'active admin' : ''}`}
              onClick={() => handleRoleChange('admin')}
            >
              <i className="ri-shield-flash-line"></i> Admin
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          <div className="nav-group-label">NAVIGATION</div>
          <ul className="nav-list">
            {currentNav.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `nav-link-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <i className={item.icon}></i>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-group-label" style={{ marginTop: '24px' }}>QUICK ACTIONS</div>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="../index.html" className="nav-link-btn external-link">
                <i className="ri-home-4-line"></i>
                <span className="nav-label">Main Landing Page</span>
                <i className="ri-arrow-right-up-line" style={{ marginLeft: 'auto', fontSize: '0.85rem' }}></i>
              </a>
            </li>
          </ul>
        </nav>

        {/* User Card at Sidebar Bottom */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-avatar-mini" style={{ background: currentRoleStyle.gradient }}>
              {currentUser?.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'ZR'}
            </div>
            <div className="user-info-text">
              <span className="user-name">{currentUser?.displayName || 'Active User'}</span>
              <span className="user-role-badge">{role.toUpperCase()}</span>
            </div>
            <button
              className="logout-icon-btn"
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <i className="ri-logout-box-r-line"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="portal-main">
        {/* Top Navbar */}
        <header className="portal-topbar">
          <div className="topbar-left">
            <button
              className="mobile-hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Sidebar Menu"
            >
              <i className="ri-menu-2-line"></i>
            </button>
            <div className="breadcrumb-box">
              <span className="breadcrumb-root">Portal</span>
              <i className="ri-arrow-right-s-line"></i>
              <span className="breadcrumb-role">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
              <i className="ri-arrow-right-s-line"></i>
              <span className="breadcrumb-current">
                {location.pathname.split('/').pop().replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Theme Toggle */}
            <button
              className="topbar-action-btn"
              onClick={toggleTheme}
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
            </button>

            {/* Notification Bell */}
            <div className="notification-wrapper" style={{ position: 'relative' }}>
              <button
                className="topbar-action-btn notification-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                title="Notifications"
                aria-label="View Notifications"
              >
                <i className="ri-notification-3-line"></i>
                <span className="notif-pulse-dot"></span>
              </button>

              {notificationsOpen && (
                <div className="notifications-dropdown">
                  <div className="notif-header">
                    <h4>Notifications</h4>
                    <span className="notif-badge">3 New</span>
                  </div>
                  <div className="notif-list">
                    <div className="notif-item unread">
                      <div className="notif-icon primary"><i className="ri-check-double-line"></i></div>
                      <div className="notif-content">
                        <p>Milestone <strong>Frontend React</strong> marked completed.</p>
                        <span>5 mins ago</span>
                      </div>
                    </div>
                    <div className="notif-item unread">
                      <div className="notif-icon success"><i className="ri-money-dollar-circle-line"></i></div>
                      <div className="notif-content">
                        <p>Invoice <strong>#INV-9021</strong> settled successfully ($2,400).</p>
                        <span>1 hour ago</span>
                      </div>
                    </div>
                    <div className="notif-item">
                      <div className="notif-icon info"><i className="ri-chat-smile-2-line"></i></div>
                      <div className="notif-content">
                        <p>New message from <strong>Marcus Sterling</strong>.</p>
                        <span>3 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown */}
            <div className="user-profile-menu-wrapper" style={{ position: 'relative' }}>
              <button
                className="user-profile-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="topbar-avatar" style={{ background: currentRoleStyle.gradient }}>
                  {currentUser?.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'ZR'}
                </div>
                <div className="topbar-user-details">
                  <span className="topbar-username">{currentUser?.displayName || 'Elena Rostova'}</span>
                  <span className="topbar-role">{role}</span>
                </div>
                <i className="ri-arrow-down-s-line dropdown-caret"></i>
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <strong>{currentUser?.displayName || 'Elena Rostova'}</strong>
                    <span>{currentUser?.email || 'user@zaro.dev'}</span>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  <button
                    className="dropdown-link-item"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate(`/${role}/dashboard`);
                    }}
                  >
                    <i className="ri-dashboard-line"></i> My Dashboard
                  </button>
                  <a
                    href="../index.html"
                    className="dropdown-link-item"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <i className="ri-external-link-line"></i> ZARO Homepage
                  </a>
                  <div className="user-dropdown-divider"></div>
                  <button className="dropdown-link-item danger" onClick={handleLogout}>
                    <i className="ri-logout-box-line"></i> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Dynamic Content */}
        <main className="portal-body">
          {children}
        </main>
      </div>
    </div>
  );
}
