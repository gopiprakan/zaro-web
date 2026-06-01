import React, { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection, createProfile, getProfile } from './supabaseClient';

function App() {
  // Auth state
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [toast, setToast] = useState(null);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign-up fields
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  const { isConfigured } = checkSupabaseConnection();

  // ── Toast Notification ──
  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4500);
  };

  // ── Load session & profile on mount ──
  useEffect(() => {
    if (!isConfigured || !supabase) {
      setLoading(false);
      return;
    }

    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        const session = data?.session || null;
        setUserData(session);

        // Load profile if logged in
        if (session?.user?.id) {
          const { data: profile } = await getProfile(session.user.id);
          if (profile) setUserProfile(profile);
        }
      } catch (err) {
        console.error("Auth check error:", err.message);
      } finally {
        setLoading(false);
      }
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setUserData(currentSession || null);
      if (currentSession?.user?.id) {
        const { data: profile } = await getProfile(currentSession.user.id);
        if (profile) setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [isConfigured]);

  // ── Handle Login ──
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      showToast('Missing Fields', 'Please fill in both email and password.', 'error');
      return;
    }
    if (!isConfigured || !supabase) {
      showToast('Not Connected', 'Supabase is not configured. Add credentials to .env', 'error');
      return;
    }

    setFormLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      });
      if (error) throw error;
      showToast('Welcome Back', 'Successfully logged in.', 'success');
      setLoginEmail("");
      setLoginPassword("");
    } catch (err) {
      showToast('Login Failed', err.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ── Handle Sign Up ──
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!signUpUsername.trim()) {
      showToast('Missing Username', 'Please enter a username.', 'error');
      return;
    }
    if (!signUpEmail.trim()) {
      showToast('Missing Email', 'Please enter your email address.', 'error');
      return;
    }
    if (!signUpPhone.trim()) {
      showToast('Missing Phone', 'Please enter your phone number.', 'error');
      return;
    }
    if (!signUpPassword) {
      showToast('Missing Password', 'Please create a password.', 'error');
      return;
    }
    if (signUpPassword.length < 6) {
      showToast('Weak Password', 'Password must be at least 6 characters.', 'error');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      showToast('Password Mismatch', 'Passwords do not match. Please re-enter.', 'error');
      return;
    }
    if (!isConfigured || !supabase) {
      showToast('Not Connected', 'Supabase is not configured. Add credentials to .env', 'error');
      return;
    }

    setFormLoading(true);
    try {
      // 1. Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPassword,
        options: {
          data: {
            username: signUpUsername,
            phone: signUpPhone,
          }
        }
      });
      if (authError) throw authError;

      // 2. Save profile to the profiles table
      if (authData?.user?.id) {
        const { error: profileError } = await createProfile(authData.user.id, {
          username: signUpUsername,
          phone: signUpPhone,
          email: signUpEmail,
        });
        if (profileError) {
          console.warn("Profile save warning:", profileError.message);
          // Don't block sign-up if profile save fails — the user is still registered
        }
      }

      showToast('Account Created!', 'Check your email for a verification link.', 'success');

      // Clear sign-up fields
      setSignUpUsername("");
      setSignUpPhone("");
      setSignUpEmail("");
      setSignUpPassword("");
      setSignUpConfirmPassword("");

      // Switch to login view
      setTimeout(() => setIsSignUp(false), 2000);
    } catch (err) {
      showToast('Sign Up Failed', err.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // ── Logout ──
  const handleLogout = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserProfile(null);
      showToast('Signed Out', 'You have been logged out successfully.', 'success');
    } catch (err) {
      showToast('Logout Error', err.message, 'error');
    }
  };

  // ── Navigate back to main site ──
  const handleBackToHomepage = (e) => {
    e.preventDefault();
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    if (isLocal && window.location.port === '5173') {
      // Dev mode: landing page is served separately — go to the parent origin
      // Try common dev ports; fallback to just the hostname root
      window.location.href = window.location.protocol + '//' + hostname + ':62236';
    } else if (isLocal) {
      // Same server, go to root
      window.location.href = '/';
    } else {
      // Production / deployed — relative path
      window.location.href = '../index.html';
    }
  };

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

  // ── Shared Back Link Component ──
  const BackLink = ({ muted }) => (
    <a
      href="#"
      onClick={handleBackToHomepage}
      style={{
        color: muted ? 'var(--text-muted)' : 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '0.85rem',
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'color 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
      onMouseLeave={(e) => e.currentTarget.style.color = muted ? 'var(--text-muted)' : 'var(--text-secondary)'}
    >
      <i className="ri-arrow-left-line"></i> Back to Homepage
    </a>
  );

  // ── Spinner inside button ──
  const ButtonSpinner = () => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <span className="btn-spinner" />
      Processing...
    </span>
  );

  return (
    <div className="portal-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Glowing Meshes */}
      <div className="bg-glow glow-top-right"></div>
      <div className="bg-glow glow-bottom-left"></div>

      {/* Toast Notification */}
      {toast && (
        <div className={`notification-toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' ? '✓' : '✕'}
          </span>
          <div>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
        </div>
      )}

      {/* Supabase Not Configured Banner */}
      {!isConfigured && (
        <div className="sandbox-banner">
          <i className="ri-alert-line"></i>
          Supabase not connected — Add your credentials to the .env file
        </div>
      )}

      {userData ? (
        /* ═══════════════════════════════════════════
           LOGGED IN — Client Workspace Dashboard
           ═══════════════════════════════════════════ */
        <div className="auth-page">
          <div className="auth-card" style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div className="auth-header">
              {/* Avatar */}
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                color: 'white',
                fontWeight: 800,
                marginBottom: '16px',
                boxShadow: '0 8px 24px -4px var(--primary-glow)'
              }}>
                {(userProfile?.username || userData.user?.email || 'U').substring(0, 2).toUpperCase()}
              </div>
              <h2>Welcome, {userProfile?.username || 'User'}</h2>
              <p>Your secure ZARO client workspace</p>
            </div>

            {/* Profile Info Card */}
            <div className="profile-info-card">
              <div className="profile-info-row">
                <i className="ri-user-line"></i>
                <div>
                  <span className="profile-info-label">Username</span>
                  <span className="profile-info-value">{userProfile?.username || '—'}</span>
                </div>
              </div>
              <div className="profile-info-row">
                <i className="ri-mail-line"></i>
                <div>
                  <span className="profile-info-label">Email</span>
                  <span className="profile-info-value">{userData.user?.email || userProfile?.email || '—'}</span>
                </div>
              </div>
              <div className="profile-info-row">
                <i className="ri-phone-line"></i>
                <div>
                  <span className="profile-info-label">Phone</span>
                  <span className="profile-info-value">{userProfile?.phone || '—'}</span>
                </div>
              </div>
              <div className="profile-info-row">
                <i className="ri-calendar-line"></i>
                <div>
                  <span className="profile-info-label">Member Since</span>
                  <span className="profile-info-value">
                    {userProfile?.created_at
                      ? new Date(userProfile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ width: '100%', marginBottom: '16px', padding: '14px' }}
            >
              <i className="ri-logout-box-r-line"></i> Sign Out
            </button>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '10px' }}>
              <BackLink />
            </div>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════
           LOGGED OUT — Login / Sign Up Forms
           ═══════════════════════════════════════════ */
        <div className="auth-page">
          <div className="auth-card" style={{ maxWidth: isSignUp ? '500px' : '440px', transition: 'max-width 0.3s ease' }}>
            <div className="auth-header">
              <h2>{isSignUp ? 'Create Your Account' : 'ZARO Client Login'}</h2>
              <p>{isSignUp
                ? 'Fill in your details to get started'
                : 'Access your custom storefront tracker'}
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
                      onChange={(e) => setLoginEmail(e.target.value)}
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
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="form-input"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>

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
                  <label>Username</label>
                  <div className="input-wrapper">
                    <i className="ri-user-line"></i>
                    <input
                      type="text"
                      placeholder="johndoe"
                      value={signUpUsername}
                      onChange={(e) => setSignUpUsername(e.target.value)}
                      className="form-input"
                      required
                      autoComplete="username"
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
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      className="form-input"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-wrapper">
                    <i className="ri-phone-line"></i>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value)}
                      className="form-input"
                      required
                      autoComplete="tel"
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
                        onChange={(e) => setSignUpPassword(e.target.value)}
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
                        onChange={(e) => setSignUpConfirmPassword(e.target.value)}
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
                    color: signUpPassword === signUpConfirmPassword ? 'var(--accent-color)' : 'var(--danger-color)'
                  }}>
                    <i className={signUpPassword === signUpConfirmPassword ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'}></i>
                    {signUpPassword === signUpConfirmPassword ? 'Passwords match' : 'Passwords do not match'}
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
            <div className="auth-toggle" style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px',
              marginTop: '24px',
              textAlign: 'center'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <a
                onClick={() => setIsSignUp(!isSignUp)}
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
              <BackLink muted />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;