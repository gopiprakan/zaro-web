import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';

export default function Login() {
  const { login, loginAsDemo, loginWithGoogle, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('client');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectAfterLogin = (role) => {
    const origin = location.state?.from?.pathname;
    if (origin && !origin.includes('/login') && !origin.includes('/signup')) {
      navigate(origin, { replace: true });
      return;
    }
    if (role === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (role === 'freelancer') navigate('/freelancer/dashboard', { replace: true });
    else navigate('/client/dashboard', { replace: true });
  };

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password, selectedRole);
      redirectAfterLogin(user.role || selectedRole);
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/user-not-found' || code === 'auth/invalid-credential') {
        setErrorMessage('Invalid email or password. Please verify your credentials.');
      } else {
        setErrorMessage(err.message || 'Unable to sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demoRole) => {
    const demoUser = loginAsDemo(demoRole);
    redirectAfterLogin(demoUser.role);
  };

  const handleGoogleClick = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const user = await loginWithGoogle(selectedRole);
      redirectAfterLogin(user.role || selectedRole);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage('Google Sign-In failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-portal-screen">
      {/* Background glow meshes */}
      <div className="bg-glow glow-top-right"></div>
      <div className="bg-glow glow-bottom-left"></div>

      <div className="auth-portal-card">
        {/* Brand Header */}
        <div className="auth-card-brand">
          <div className="brand-badge-icon">Z</div>
          <span className="brand-name">ZARO</span>
          <span className="brand-tag">PORTAL</span>
        </div>

        <div className="auth-header-text">
          <h2>Welcome Back</h2>
          <p>Sign in to access your customized role dashboard & projects</p>
        </div>

        {/* Demo 1-Click Access Pill Bar */}
        <div className="demo-accounts-box">
          <div className="demo-header-label">
            <i className="ri-flashlight-line"></i> QUICK TEST LOGINS (1-CLICK)
          </div>
          <div className="demo-btn-row">
            <button
              type="button"
              className="demo-pill-btn client"
              onClick={() => handleDemoClick('client')}
              title="Sign in as Client (Elena Rostova)"
            >
              <i className="ri-user-star-line"></i> Client Demo
            </button>
            <button
              type="button"
              className="demo-pill-btn freelancer"
              onClick={() => handleDemoClick('freelancer')}
              title="Sign in as Freelancer (Marcus Sterling)"
            >
              <i className="ri-code-s-slash-line"></i> Freelancer
            </button>
            <button
              type="button"
              className="demo-pill-btn admin"
              onClick={() => handleDemoClick('admin')}
              title="Sign in as Admin (Alexander Vance)"
            >
              <i className="ri-shield-flash-line"></i> Admin Demo
            </button>
          </div>
        </div>

        <div className="auth-divider">
          <span>OR SIGN IN WITH CREDENTIALS</span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-alert error">
            <i className="ri-error-warning-line"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleStandardLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-icon-box">
              <i className="ri-mail-line input-icon"></i>
              <input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="login-password">Password</label>
            </div>
            <div className="input-icon-box">
              <i className="ri-lock-2-line input-icon"></i>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                <i className={showPassword ? 'ri-eye-line' : 'ri-eye-off-line'}></i>
              </button>
            </div>
          </div>

          {/* Role Intent Selector for New Login */}
          <div className="form-group">
            <label>Login Target Workspace</label>
            <div className="role-radio-group">
              <label className={`role-radio-card ${selectedRole === 'client' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={selectedRole === 'client'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <i className="ri-user-star-line"></i>
                <span>Client</span>
              </label>
              <label className={`role-radio-card ${selectedRole === 'freelancer' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="freelancer"
                  checked={selectedRole === 'freelancer'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <i className="ri-code-s-slash-line"></i>
                <span>Freelancer</span>
              </label>
              <label className={`role-radio-card ${selectedRole === 'admin' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={selectedRole === 'admin'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <i className="ri-shield-flash-line"></i>
                <span>Admin</span>
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn primary-glow-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading-content">
                <span className="btn-spinner"></span> Authenticating...
              </span>
            ) : (
              <span>Sign In to {selectedRole.toUpperCase()} Portal <i className="ri-arrow-right-line"></i></span>
            )}
          </button>

          {/* Google Sign-In */}
          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleClick}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="auth-footer-nav">
          <p>
            Don't have an account? <Link to="/signup" className="auth-link">Create Account</Link>
          </p>
          <a href="../index.html" className="back-home-link">
            <i className="ri-arrow-left-line"></i> Return to ZARO Landing Page
          </a>
        </div>
      </div>
    </div>
  );
}
