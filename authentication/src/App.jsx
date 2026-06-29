import React, { useState, useEffect } from 'react';
import { auth, checkFirebaseConnection } from './firebaseClient';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
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
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  // Password visibility toggles
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirm, setShowSignUpConfirm] = useState(false);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Google sign-in loading
  const [googleLoading, setGoogleLoading] = useState(false);

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
      setShowLoginPassword(false);
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
      const userCredential = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      
      // Set display name if provided
      if (signUpName.trim()) {
        await updateProfile(userCredential.user, { displayName: signUpName.trim() });
      }
      
      // onAuthStateChanged will automatically set userData → show dashboard
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');
      setShowSignUpPassword(false);
      setShowSignUpConfirm(false);
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

  // ── Handle Google Sign-In ──
  const handleGoogleSignIn = async () => {
    if (!isConfigured || !auth) {
      setAuthError('Firebase is not configured for Google Sign-In.');
      return;
    }
    setGoogleLoading(true);
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError('Google Sign-In failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Handle Forgot Password ──
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotMessage('');
    if (!forgotEmail.trim()) {
      setForgotMessage('Please enter your email address.');
      return;
    }
    if (!isConfigured || !auth) {
      setForgotMessage('Firebase is not configured.');
      return;
    }
    setForgotLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setForgotMessage('✓ Password reset email sent! Check your inbox.');
    } catch (err) {
      // For security, show success even if user doesn't exist
      setForgotMessage('✓ If an account exists, a reset link has been sent.');
    } finally {
      setForgotLoading(false);
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
                {(userData.displayName || userData.email || 'U').substring(0, 2).toUpperCase()}
              </div>
              <h2 style={{ marginBottom: '6px' }}>Welcome{userData.displayName ? `, ${userData.displayName}` : ''}</h2>
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
              <h2>{showForgotPassword ? 'Reset Password' : (isSignUp ? 'Create Your Account' : 'Welcome Back')}</h2>
              <p>{showForgotPassword
                ? 'Enter your email to receive a password reset link'
                : (isSignUp
                  ? 'Sign up to access your ZARO storefront'
                  : 'Log in to your ZARO client dashboard')}
              </p>
            </div>

            {/* Forgot Password Panel */}
            {showForgotPassword ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <i className="ri-mail-line"></i>
                    <input
                      type="email"
                      placeholder="name@shop.com"
                      value={forgotEmail}
                      onChange={(e) => { setForgotEmail(e.target.value); setForgotMessage(''); }}
                      className="form-input"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {forgotMessage && (
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: forgotMessage.startsWith('✓')
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(239, 68, 68, 0.08)',
                    border: `1px solid ${forgotMessage.startsWith('✓')
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)'}`,
                    color: forgotMessage.startsWith('✓')
                      ? 'var(--accent-color)'
                      : '#fca5a5'
                  }}>
                    {forgotMessage}
                  </div>
                )}

                <button
                  onClick={handleForgotPassword}
                  className="btn btn-primary"
                  disabled={forgotLoading}
                  style={{ width: '100%', padding: '14px' }}
                >
                  {forgotLoading ? <ButtonSpinner /> : (
                    <><i className="ri-mail-send-line"></i> Send Reset Link</>
                  )}
                </button>

                <button
                  onClick={() => { setShowForgotPassword(false); setForgotMessage(''); }}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  <i className="ri-arrow-left-line"></i> Back to Login
                </button>
              </div>
            ) : !isSignUp ? (
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
                      type={showLoginPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => { setLoginPassword(e.target.value); setAuthError(''); }}
                      className="form-input"
                      required
                      autoComplete="current-password"
                      style={{ paddingRight: '48px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      style={{
                        position: 'absolute', right: '12px',
                        background: 'none', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer',
                        fontSize: '1.15rem', padding: '4px',
                        display: 'flex', alignItems: 'center'
                      }}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      <i className={showLoginPassword ? 'ri-eye-line' : 'ri-eye-off-line'}></i>
                    </button>
                  </div>
                  <a
                    onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); setAuthError(''); setForgotMessage(''); setForgotEmail(loginEmail); }}
                    style={{
                      fontSize: '0.85rem', fontWeight: 500,
                      color: 'var(--text-muted)', cursor: 'pointer',
                      textAlign: 'right', marginTop: '4px', display: 'block',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    Forgot Password?
                  </a>
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

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 6px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                  <span style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                {/* Google Sign-In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="btn btn-secondary"
                  disabled={googleLoading}
                  style={{
                    width: '100%', padding: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                  }}
                >
                  {googleLoading ? <ButtonSpinner /> : (
                    <>
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                      Sign in with Google
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* ── SIGN UP FORM ── */
              <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-wrapper">
                    <i className="ri-user-line"></i>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={signUpName}
                      onChange={(e) => { setSignUpName(e.target.value); setAuthError(''); }}
                      className="form-input"
                      autoComplete="name"
                    />
                  </div>
                </div>

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
                        type={showSignUpPassword ? 'text' : 'password'}
                        placeholder="Min. 6 chars"
                        value={signUpPassword}
                        onChange={(e) => { setSignUpPassword(e.target.value); setAuthError(''); }}
                        className="form-input"
                        required
                        autoComplete="new-password"
                        minLength={6}
                        style={{ paddingRight: '48px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        style={{
                          position: 'absolute', right: '12px',
                          background: 'none', border: 'none',
                          color: 'var(--text-muted)', cursor: 'pointer',
                          fontSize: '1.15rem', padding: '4px',
                          display: 'flex', alignItems: 'center'
                        }}
                        tabIndex={-1}
                      >
                        <i className={showSignUpPassword ? 'ri-eye-line' : 'ri-eye-off-line'}></i>
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <div className="input-wrapper">
                      <i className="ri-lock-check-line"></i>
                      <input
                        type={showSignUpConfirm ? 'text' : 'password'}
                        placeholder="Re-enter"
                        value={signUpConfirmPassword}
                        onChange={(e) => { setSignUpConfirmPassword(e.target.value); setAuthError(''); }}
                        className="form-input"
                        required
                        autoComplete="new-password"
                        style={{ paddingRight: '48px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpConfirm(!showSignUpConfirm)}
                        style={{
                          position: 'absolute', right: '12px',
                          background: 'none', border: 'none',
                          color: 'var(--text-muted)', cursor: 'pointer',
                          fontSize: '1.15rem', padding: '4px',
                          display: 'flex', alignItems: 'center'
                        }}
                        tabIndex={-1}
                      >
                        <i className={showSignUpConfirm ? 'ri-eye-line' : 'ri-eye-off-line'}></i>
                      </button>
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

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 6px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                  <span style={{ padding: '0 12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                </div>

                {/* Google Sign-In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="btn btn-secondary"
                  disabled={googleLoading}
                  style={{
                    width: '100%', padding: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                  }}
                >
                  {googleLoading ? <ButtonSpinner /> : (
                    <>
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }} />
                      Sign up with Google
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Toggle between Login / Sign Up */}
            {!showForgotPassword && (
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
                onClick={() => { setIsSignUp(!isSignUp); setAuthError(''); setShowForgotPassword(false); }}
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
            )}

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