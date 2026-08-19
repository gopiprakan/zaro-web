import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('client');
  const [companyOrTitle, setCompanyOrTitle] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name, role, {
        company: role === 'client' ? companyOrTitle : undefined,
        title: role === 'freelancer' ? companyOrTitle : undefined,
      });

      if (role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (role === 'freelancer') navigate('/freelancer/dashboard', { replace: true });
      else navigate('/client/dashboard', { replace: true });
    } catch (err) {
      const code = err?.code || '';
      if (code === 'auth/email-already-in-use') {
        setErrorMessage('An account with this email already exists. Please sign in instead.');
      } else if (code === 'auth/weak-password') {
        setErrorMessage('Password is too weak. Please use numbers and characters.');
      } else {
        setErrorMessage(err.message || 'Unable to register account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const user = await loginWithGoogle(role);
      if (user.role === 'admin') navigate('/admin/dashboard', { replace: true });
      else if (user.role === 'freelancer') navigate('/freelancer/dashboard', { replace: true });
      else navigate('/client/dashboard', { replace: true });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMessage('Google Sign-Up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-portal-screen">
      <div className="bg-glow glow-top-right"></div>
      <div className="bg-glow glow-bottom-left"></div>

      <div className="auth-portal-card" style={{ maxWidth: '560px' }}>
        <div className="auth-card-brand">
          <div className="brand-badge-icon">Z</div>
          <span className="brand-name">ZARO</span>
          <span className="brand-tag">JOIN</span>
        </div>

        <div className="auth-header-text">
          <h2>Create Your Account</h2>
          <p>Choose your role and join the high-performance ZARO agency platform</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="role-selection-grid">
          <div
            className={`role-select-box ${role === 'client' ? 'active client' : ''}`}
            onClick={() => setRole('client')}
          >
            <div className="role-select-icon"><i className="ri-user-star-line"></i></div>
            <div className="role-select-info">
              <span className="role-select-title">I am a Client</span>
              <span className="role-select-desc">Hiring web experts & managing shop launches</span>
            </div>
          </div>

          <div
            className={`role-select-box ${role === 'freelancer' ? 'active freelancer' : ''}`}
            onClick={() => setRole('freelancer')}
          >
            <div className="role-select-icon"><i className="ri-code-s-slash-line"></i></div>
            <div className="role-select-info">
              <span className="role-select-title">I am a Freelancer</span>
              <span className="role-select-desc">Delivering code, UI designs & earning payouts</span>
            </div>
          </div>

          <div
            className={`role-select-box ${role === 'admin' ? 'active admin' : ''}`}
            onClick={() => setRole('admin')}
          >
            <div className="role-select-icon"><i className="ri-shield-flash-line"></i></div>
            <div className="role-select-info">
              <span className="role-select-title">Platform Admin</span>
              <span className="role-select-desc">Managing users, escrow funds & global oversight</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="auth-alert error">
            <i className="ri-error-warning-line"></i>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <div className="input-icon-box">
                <i className="ri-user-3-line input-icon"></i>
                <input
                  id="signup-name"
                  type="text"
                  placeholder="Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-role-extra">
                {role === 'client' ? 'Business / Shop Name' : role === 'freelancer' ? 'Professional Title' : 'Department'}
              </label>
              <div className="input-icon-box">
                <i className="ri-building-line input-icon"></i>
                <input
                  id="signup-role-extra"
                  type="text"
                  placeholder={role === 'client' ? 'Luxe Botanica Cafe' : 'Full-Stack Developer'}
                  value={companyOrTitle}
                  onChange={(e) => setCompanyOrTitle(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">Work Email</label>
            <div className="input-icon-box">
              <i className="ri-mail-line input-icon"></i>
              <input
                id="signup-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <div className="input-icon-box">
                <i className="ri-lock-2-line input-icon"></i>
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <div className="input-icon-box">
                <i className="ri-shield-keyhole-line input-icon"></i>
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn primary-glow-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading-content">
                <span className="btn-spinner"></span> Creating Account...
              </span>
            ) : (
              <span>Join as {role.toUpperCase()} <i className="ri-arrow-right-line"></i></span>
            )}
          </button>

          <button
            type="button"
            className="google-signin-btn"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign Up with Google
          </button>
        </form>

        <div className="auth-footer-nav">
          <p>
            Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
          </p>
          <a href="../index.html" className="back-home-link">
            <i className="ri-arrow-left-line"></i> Return to ZARO Landing Page
          </a>
        </div>
      </div>
    </div>
  );
}
