import React, { useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from './supabaseClient';

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const { isConfigured } = checkSupabaseConnection();

  // Show toast notification instead of alert()
  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!isConfigured || !supabase) {
      setLoading(false);
      return;
    }

    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUserData(data?.session || null);
      } catch (err) {
        console.error("Auth check error:", err.message);
      } finally {
        setLoading(false);
      }
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setUserData(currentSession || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [isConfigured]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('Missing Fields', 'Please fill in both email and password.', 'error');
      return;
    }

    if (!isConfigured || !supabase) {
      showToast('Not Connected', 'Supabase is not configured. Please add your credentials to .env', 'error');
      return;
    }

    setFormLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showToast('Account Created', 'Check your email for a verification link.', 'success');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast('Welcome Back', 'Successfully logged in.', 'success');
      }
    } catch (err) {
      showToast(isSignUp ? 'Sign Up Failed' : 'Login Failed', err.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showToast('Signed Out', 'You have been logged out successfully.', 'success');
    } catch (err) {
      showToast('Logout Error', err.message, 'error');
    }
  };

  const handleBackToHomepage = (e) => {
    e.preventDefault();
    window.location.href = "../index.html";
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="portal-container">
        <div className="auth-page">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(99, 102, 241, 0.2)',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Connecting to ZARO workspace...
            </p>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
        /* ── LOGGED IN: Client Workspace ── */
        <div className="auth-page">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div className="auth-header">
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                color: 'white',
                fontWeight: 800,
                marginBottom: '16px',
                boxShadow: '0 8px 16px -4px var(--primary-glow)'
              }}>
                {userData.user?.email
                  ? userData.user.email.substring(0, 2).toUpperCase()
                  : 'U'}
              </div>
              <h2>ZARO Client Space</h2>
              <p>Your secure storefront tracker workspace</p>
            </div>

            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '18px 24px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '24px',
              wordBreak: 'break-all',
              textAlign: 'left'
            }}>
              <span style={{
                color: 'var(--text-muted)',
                display: 'block',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '6px'
              }}>
                Active Session
              </span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {userData.user?.email || 'Authenticated User'}
              </strong>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ width: '100%', marginBottom: '16px', padding: '14px' }}
            >
              <i className="ri-logout-box-r-line"></i> Sign Out
            </button>

            <div style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '16px',
              marginTop: '10px'
            }}>
              <a
                href="#"
                onClick={handleBackToHomepage}
                className="back-link"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary-color)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <i className="ri-arrow-left-line"></i> Back to Homepage
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* ── LOGGED OUT: Auth Card ── */
        <div className="auth-page">
          <div className="auth-card">
            <div className="auth-header">
              <h2>{isSignUp ? 'Create Account' : 'ZARO Client Login'}</h2>
              <p>{isSignUp
                ? 'Sign up to track your custom storefront'
                : 'Access your custom storefront tracker'}
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-wrapper">
                  <i className="ri-mail-line"></i>
                  <input
                    type="email"
                    placeholder="name@shop.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    required
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={formLoading}
                style={{ width: '100%', padding: '14px', marginTop: '16px' }}
              >
                {formLoading ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                      display: 'inline-block'
                    }} />
                    Processing...
                  </span>
                ) : isSignUp ? (
                  <><i className="ri-user-add-line"></i> Create Account</>
                ) : (
                  <><i className="ri-login-box-line"></i> Log In</>
                )}
              </button>
            </form>

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