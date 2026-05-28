import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase using your live credentials
const supabase = createClient(
  "https://kgexjoqvoztxjltybayb.supabase.co",
  "sb_publishable_VvHS33aQ1bxm_cvvPGhpjg_geScNxt2"
);

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Corrected useEffect closure with zero recursion and proper checkData trigger
  useEffect(() => {
    async function checkData() {
      try {
        console.log('testing supabase');
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setUserData(data?.session || null);
      } catch (err) {
        console.error("Auth check error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    
    checkData();

    // Listen for live authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setUserData(currentSession || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      alert("Please fill in both email and password.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Login Error: " + error.message);
    } else {
      alert("Welcome back! Successfully logged in.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      alert("Please fill in both email and password.");
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert("Registration Error: " + error.message);
    } else {
      alert("Account created! Check your email for verification.");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Logout Error: " + error.message);
    } else {
      alert("Logged out successfully.");
    }
  };

  const handleBackToHomepage = (e) => {
    e.preventDefault();
    if (document.referrer && (document.referrer.includes('index.html') || document.referrer.includes('sample%20zaro') || document.referrer.includes('localhost') || document.referrer.includes('127.0.0.1'))) {
      window.location.href = document.referrer;
    } else {
      window.location.href = "../index.html";
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0e1a',
        color: '#6366f1',
        fontFamily: 'sans-serif'
      }}>
        <h3>Connecting to ZARO workspace...</h3>
      </div>
    );
  }

  // Moved parenthesis to the same line as return to prevent Automatic Semicolon Insertion (ASI)
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0e1a',
      color: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {userData != null ? (
        // Session exists: Render active user panel
        <div style={{
          background: 'rgba(17, 22, 38, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '1.8rem', fontWeight: 700 }}>ZARO Portal</h2>
          <p style={{ margin: '0 0 30px', color: '#94a3b8', fontSize: '0.95rem' }}>Active Customer Session</p>

          <div style={{
            background: '#0a0e1a',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            wordBreak: 'break-all'
          }}>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem', marginBottom: '4px', textTransform: 'uppercase' }}>Logged In As</span>
            <strong>{userData.user?.email || userData.email}</strong>
          </div>

          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
              marginBottom: '16px'
            }}
          >
            Sign Out Workspace
          </button>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px', marginTop: '10px' }}>
            <a 
              href="#" 
              onClick={handleBackToHomepage}
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#6366f1'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              <i className="ri-arrow-left-line"></i> Back to Homepage
            </a>
          </div>
        </div>
      ) : (
        // No session: Render secure Login/Signup forms
        <div style={{
          background: 'rgba(17, 22, 38, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '1.8rem', fontWeight: 700 }}>ZARO Client Login</h2>
          <p style={{ margin: '0 0 30px', color: '#94a3b8', fontSize: '0.95rem' }}>Access your custom storefront tracker</p>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.03em', textTransform: 'uppercase' }}>Email Address</label>
              <input 
                type="email" 
                placeholder="name@shop.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: '#0a0e1a',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.95rem'
                }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.03em', textTransform: 'uppercase' }}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  background: '#0a0e1a',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.95rem'
                }} 
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                onClick={handleLogin} 
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  boxShadow: '0 8px 20px -6px rgba(99, 102, 241, 0.4)'
                }}
              >
                Log In
              </button>
              
              <button 
                onClick={handleSignUp} 
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                Sign Up
              </button>
            </div>
          </form>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', marginTop: '20px' }}>
            <a 
              href="#" 
              onClick={handleBackToHomepage}
              style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#6366f1'}
              onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
            >
              <i className="ri-arrow-left-line"></i> Back to Homepage
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;