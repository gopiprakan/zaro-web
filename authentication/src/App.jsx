import React, { useState, useEffect } from 'react';
import { auth, checkFirebaseConnection } from './firebaseClient';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

function App() {
  // Auth state
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Inline error messages (shown below the submit button)
  const [authError, setAuthError] = useState('');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign-up fields
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  // Theme state synced with landing page preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('zaro-theme');
    if (saved) return saved;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zaro-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const { isConfigured } = checkFirebaseConnection();

  // ── Watch Firebase auth state ──
  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserData(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isConfigured]);

  // ── Map Firebase error codes to user-friendly messages ──
  const getAuthErrorMessage = (err, mode) => {
    const code = err?.code || '';
    if (mode === 'login') {
      // Wrong email or wrong password
      if (
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/invalid-email'
      ) {
        return 'Email or password is incorrect.';
      }
    }
    if (mode === 'signup') {
      if (code === 'auth/email-already-in-use') {
        return 'User already exists. Please sign in.';
      }
      if (code === 'auth/invalid-email') {
        return 'Please enter a valid email address.';
      }
      if (code === 'auth/weak-password') {
        return 'Password must be at least 6 characters.';
      }
    }
    return err?.message || 'Something went wrong. Please try again.';
  };

  // ── Handle Login ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!isConfigured || !auth) {
      setAuthError('Firebase is not configured. Check your .env file.');
      return;
    }
    setFormLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      setAuthError(getAuthErrorMessage(err, 'login'));
    } finally {
      setFormLoading(false);
    }
  };

  // ── Handle Sign Up ──
  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (signUpPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setAuthError('Passwords do not match. Please re-enter.');
      return;
    }
    if (!isConfigured || !auth) {
      setAuthError('Firebase is not configured. Check your .env file.');
      return;
    }

    setFormLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      // onAuthStateChanged will automatically set userData → show dashboard
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');
    } catch (err) {
      setAuthError(getAuthErrorMessage(err, 'signup'));
    } finally {
      setFormLoading(false);
    }
  };

  // ── Logout ──
  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  // ── Navigate back to main site ──
  const handleBackToHomepage = (e) => {
    e.preventDefault();
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    if (isLocal) {
      window.location.href = 'http://127.0.0.1:8080';
    } else {
      window.location.href = '../index.html';
    }
  };

  // ── Spinner inside button ──
  const ButtonSpinner = () => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <span className="btn-spinner" />
      Processing...
    </span>
  );

  // ── LOADING STATE ──
  if (loading) {
    return (
      <div className="portal-container">
        <div className="auth-page">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div className="loading-spinner" />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Connecting to ZARO workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Glowing Meshes */}
      <div className="bg-glow glow-top-right"></div>
      <div className="bg-glow glow-bottom-left"></div>

      {/* Firebase Not Configured Banner */}
      {!isConfigured && (
        <div className="sandbox-banner">
          <i className="ri-alert-line"></i>
          Firebase not connected — Add your credentials to the .env file
        </div>
      )}

      {userData ? (
        /* ═══════════════════════════════════════════
           LOGGED IN — Dashboard
           ═══════════════════════════════════════════ */
        <div className="auth-page">
          <div className="auth-card dashboard-card" style={{ maxWidth: '520px' }}>

            {/* Top Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: 'var(--primary-gradient)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, color: 'white', fontSize: '1.1rem'
                }}>Z</span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-heading)' }}>
                  ZARO
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={toggleTheme}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s',
                    width: '36px',
                    height: '36px'
                  }}
                  title="Toggle Theme"
                  aria-label="Toggle Theme"
                >
                  <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
                </button>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: 'var(--accent-color)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 600
                }}>
                  ● Authenticated
                </span>
              </div>
            </div>

            {/* Avatar & Welcome */}
            <div className="auth-header" style={{ marginBottom: '24px' }}>
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', color: 'white', fontWeight: 800,
                marginBottom: '16px',
                boxShadow: '0 8px 24px -4px var(--primary-glow)'
              }}>
                {(userData.email || 'U').substring(0, 2).toUpperCase()}
              </div>
              <h2 style={{ marginBottom: '6px' }}>Welcome to Dashboard</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                You are signed in as <strong style={{ color: 'var(--text-primary)' }}>{userData.email}</strong>
              </p>
            </div>

            {/* Info Row */}
            <div className="profile-info-card" style={{ marginBottom: '24px' }}>
              <div className="profile-info-row">
                <i className="ri-mail-line"></i>
                <div>
                  <span className="profile-info-label">Email Address</span>
                  <span className="profile-info-value">{userData.email}</span>
                </div>
              </div>
              <div className="profile-info-row">
                <i className="ri-fingerprint-line"></i>
                <div>
                  <span className="profile-info-label">User ID</span>
                  <span className="profile-info-value" style={{ fontSize: '0.78rem', wordBreak: 'break-all' }}>
                    {userData.uid}
                  </span>
                </div>
              </div>
              <div className="profile-info-row">
                <i className="ri-shield-check-line"></i>
                <div>
                  <span className="profile-info-label">Email Verified</span>
                  <span className="profile-info-value" style={{
                    color: userData.emailVerified ? 'var(--accent-color)' : 'var(--text-muted)'
                  }}>
                    {userData.emailVerified ? '✓ Verified' : 'Not verified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ width: '100%', padding: '14px', marginBottom: '16px' }}
            >
              <i className="ri-logout-box-r-line"></i> Sign Out
            </button>

            <div style={{ textAlign: 'center' }}>
              <a
                href="#"
                onClick={handleBackToHomepage}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <i className="ri-arrow-left-line"></i> Back to Homepage
              </a>
            </div>
          </div>
        </div>

      ) : (
        /* ═══════════════════════════════════════════
           LOGGED OUT — Login / Sign Up Forms
           ═══════════════════════════════════════════ */
        <div className="auth-page">
          <div
            className="auth-card"
            style={{ maxWidth: isSignUp ? '480px' : '440px', transition: 'max-width 0.3s ease', position: 'relative' }}
          >
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                position: 'absolute',
                top: '24px',
                right: '24px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              <i className={theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line'}></i>
            </button>

            {/* Logo */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '10px', marginBottom: '28px'
            }}>
              <span style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: 'var(--primary-gradient)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, color: 'white', fontSize: '1.2rem',
                boxShadow: '0 6px 16px -4px var(--primary-glow)'
              }}>Z</span>
              <span style={{ fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>
                ZARO
              </span>
            </div>

            <div className="auth-header">
              <h2>{isSignUp ? 'Create Your Account' : 'Welcome Back'}</h2>
              <p>{isSignUp
                ? 'Sign up to access your ZARO storefront'
                : 'Log in to your ZARO client dashboard'}
              </p>
            </div>

            {!isSignUp ? (
              /* ── LOGIN FORM ── */
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <i className="ri-mail-line"></i>
                    <input
                      type="email"
                      placeholder="name@shop.com"
                      value={loginEmail}
                      onChange={(e) => { setLoginEmail(e.target.value); setAuthError(''); }}
                      className="form-input"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <i className="ri-lock-line"></i>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => { setLoginPassword(e.target.value); setAuthError(''); }}
                      className="form-input"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {/* Inline error */}
                {authError && (
                  <div className="auth-error-msg">
                    <i className="ri-error-warning-line"></i> {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formLoading}
                  style={{ width: '100%', padding: '14px', marginTop: '16px' }}
                >
                  {formLoading ? <ButtonSpinner /> : (
                    <><i className="ri-login-box-line"></i> Log In</>
                  )}
                </button>
              </form>
            ) : (
              /* ── SIGN UP FORM ── */
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <i className="ri-mail-line"></i>
                    <input
                      type="email"
                      placeholder="name@shop.com"
                      value={signUpEmail}
                      onChange={(e) => { setSignUpEmail(e.target.value); setAuthError(''); }}
                      className="form-input"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="signup-password-row">
                  <div className="form-group">
                    <label>Create Password</label>
                    <div className="input-wrapper">
                      <i className="ri-lock-line"></i>
                      <input
                        type="password"
                        placeholder="Min. 6 chars"
                        value={signUpPassword}
                        onChange={(e) => { setSignUpPassword(e.target.value); setAuthError(''); }}
                        className="form-input"
                        required
                        autoComplete="new-password"
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-wrapper">
                      <i className="ri-lock-check-line"></i>
                      <input
                        type="password"
                        placeholder="Re-enter"
                        value={signUpConfirmPassword}
                        onChange={(e) => { setSignUpConfirmPassword(e.target.value); setAuthError(''); }}
                        className="form-input"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                </div>

                {/* Password match indicator */}
                {signUpConfirmPassword && (
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '-4px',
                    marginBottom: '8px',
                    color: signUpPassword === signUpConfirmPassword
                      ? 'var(--accent-color)'
                      : 'var(--danger-color)'
                  }}>
                    <i className={signUpPassword === signUpConfirmPassword
                      ? 'ri-checkbox-circle-line'
                      : 'ri-close-circle-line'
                    }></i>
                    {signUpPassword === signUpConfirmPassword
                      ? 'Passwords match'
                      : 'Passwords do not match'}
                  </div>
                )}

                {/* Inline error */}
                {authError && (
                  <div className="auth-error-msg">
                    <i className="ri-error-warning-line"></i> {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={formLoading}
                  style={{ width: '100%', padding: '14px', marginTop: '8px' }}
                >
                  {formLoading ? <ButtonSpinner /> : (
                    <><i className="ri-user-add-line"></i> Create Account</>
                  )}
                </button>
              </form>
            )}

            {/* Toggle between Login / Sign Up */}
            <div style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px',
              marginTop: '24px',
              textAlign: 'center'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <a
                onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); }}
                style={{
                  color: 'var(--primary-color)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </a>
            </div>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <a
                href="#"
                onClick={handleBackToHomepage}
                style={{
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <i className="ri-arrow-left-line"></i> Back to Homepage
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;