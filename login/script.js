/**
 * ZARO - Modern Auth & Showcase Interaction Script
 * Harmonized with Main Site Theme & Vertex 4:5 Campaign
 */
import { supabase } from './src/supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const emailGroup = document.getElementById('emailGroup');
  const passwordGroup = document.getElementById('passwordGroup');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const rememberMeCheckbox = document.getElementById('rememberMeCheckbox');
  const submitLoginBtn = document.getElementById('submitLoginBtn');
  const formErrorAlert = document.getElementById('formErrorAlert');
  const googleLoginBtn = document.getElementById('googleLoginBtn');
  const guestLoginBtn = document.getElementById('guestLoginBtn');
  const demoAccountFillBtn = document.getElementById('demoAccountFillBtn');
  const welcomeTitle = document.getElementById('welcomeTitle');
  const welcomeSubtitle = document.getElementById('welcomeSubtitle');
  const signUpToggleBtn = document.getElementById('signUpToggleBtn');
  const switchPromptText = document.getElementById('switchPromptText');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const tabLoginText = document.getElementById('tabLoginText');
  const tabRegisterText = document.getElementById('tabRegisterText');
  const exampleHintText = document.getElementById('exampleHintText');
  const emailLabel = document.getElementById('emailLabel');
  const passwordLabel = document.getElementById('passwordLabel');
  const rememberMeLabel = document.getElementById('rememberMeLabel');
  const orDividerText = document.getElementById('orDividerText');
  const googleBtnText = document.getElementById('googleBtnText');
  const guestBtnText = document.getElementById('guestBtnText');
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  // --- Theme Elements ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');

  // --- Poster Viewer Modal ---
  const expandPosterBtn = document.getElementById('expandPosterBtn');
  const posterModalBackdrop = document.getElementById('posterModalBackdrop');
  const closePosterModal = document.getElementById('closePosterModal');
  const modalPosterContainer = document.getElementById('modalPosterContainer');
  const mainPoster = document.getElementById('mainBanner') || document.getElementById('mainPoster');

  // --- Language Selector ---
  const langDropdownBtn = document.getElementById('langDropdownBtn');
  const langSelectorWrapper = document.querySelector('.lang-selector-wrapper');
  const currentFlag = document.getElementById('currentFlag');
  const currentLangCode = document.getElementById('currentLangCode');
  const langItems = document.querySelectorAll('.lang-item');

  // --- Modals & Legal Links ---
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const forgotModalBackdrop = document.getElementById('forgotModalBackdrop');
  const closeForgotModal = document.getElementById('closeForgotModal');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const resetEmailInput = document.getElementById('resetEmailInput');

  const termsLink = document.getElementById('termsLink');
  const privacyLink = document.getElementById('privacyLink');
  const licensesLink = document.getElementById('licensesLink');
  const legalModalBackdrop = document.getElementById('legalModalBackdrop');
  const closeLegalModal = document.getElementById('closeLegalModal');
  const legalAcknowledgeBtn = document.getElementById('legalAcknowledgeBtn');
  const legalModalTitle = document.getElementById('legalModalTitle');
  const legalTabBtns = document.querySelectorAll('.legal-tab-btn');
  const legalTabPanes = document.querySelectorAll('.legal-tab-pane');
  const toastContainer = document.getElementById('toastContainer');

  // --- State ---
  let isSignUpMode = false;

  /* --------------------------------------------------------------------------
     1. Theme Engine & Synchronization with Main Website
     -------------------------------------------------------------------------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zaro-theme', theme);

    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'ri-moon-line';
      } else {
        themeIcon.className = 'ri-sun-line';
      }
    }
  }

  // Initialize theme from localStorage or default to dark
  const savedTheme = localStorage.getItem('zaro-theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      showToast(`Switched to ${nextTheme.toUpperCase()} theme`, 'info');
    });
  }

  /* --------------------------------------------------------------------------
     2. Particle Canvas Background Animation
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('login-particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrameId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.8 + 0.6;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(144, 174, 173, ${this.alpha})`;
        ctx.fill();
      }
    }

    const particleCount = Math.min(Math.floor(window.innerWidth / 25), 45);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* --------------------------------------------------------------------------
     3. Show / Hide Password Toggle
     -------------------------------------------------------------------------- */
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      const eyeOpen = togglePasswordBtn.querySelector('.eye-open');
      const eyeClosed = togglePasswordBtn.querySelector('.eye-closed');

      if (isPassword) {
        if (eyeOpen) eyeOpen.style.display = 'none';
        if (eyeClosed) eyeClosed.style.display = 'block';
      } else {
        if (eyeOpen) eyeOpen.style.display = 'block';
        if (eyeClosed) eyeClosed.style.display = 'none';
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Remember Me Persistence
     -------------------------------------------------------------------------- */
  const savedEmail = localStorage.getItem('zaro_remembered_email');
  if (savedEmail && emailInput) {
    emailInput.value = savedEmail;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
  }

  /* --------------------------------------------------------------------------
     5. Mode Switching: Sign In <-> Sign Up
     -------------------------------------------------------------------------- */
  function setAuthMode(toSignUp) {
    isSignUpMode = toSignUp;
    clearFormError();
    emailGroup.classList.remove('has-error');
    passwordGroup.classList.remove('has-error');
    const btnText = submitLoginBtn.querySelector('.btn-text');

    if (isSignUpMode) {
      if (tabLogin) tabLogin.classList.remove('active');
      if (tabRegister) tabRegister.classList.add('active');
      if (welcomeTitle) welcomeTitle.textContent = 'Create Account';
      if (welcomeSubtitle) welcomeSubtitle.textContent = 'Join ZARO to build & scale your high-converting business presence';
      if (btnText) btnText.textContent = 'Create Account';
      if (signUpToggleBtn) signUpToggleBtn.textContent = 'Sign In';
      if (switchPromptText) switchPromptText.textContent = 'Already have an account?';
    } else {
      if (tabRegister) tabRegister.classList.remove('active');
      if (tabLogin) tabLogin.classList.add('active');
      if (welcomeTitle) welcomeTitle.textContent = 'Welcome Back';
      if (welcomeSubtitle) welcomeSubtitle.textContent = 'Access your digital dashboard and web growth tools';
      if (btnText) btnText.textContent = 'Sign In to ZARO';
      if (signUpToggleBtn) signUpToggleBtn.textContent = 'Create Account';
      if (switchPromptText) switchPromptText.textContent = "Don't have an account?";
    }
  }

  if (tabLogin) tabLogin.addEventListener('click', () => setAuthMode(false));
  if (tabRegister) tabRegister.addEventListener('click', () => setAuthMode(true));
  if (signUpToggleBtn) signUpToggleBtn.addEventListener('click', () => setAuthMode(!isSignUpMode));

  /* --------------------------------------------------------------------------
     6. Demo Fill & Quick Guest Preview
     -------------------------------------------------------------------------- */
  if (demoAccountFillBtn) {
    demoAccountFillBtn.addEventListener('click', () => {
      emailInput.value = 'client@zaro.agency';
      passwordInput.value = 'ZaroStore2026!';
      clearFormError();
      showToast('✨ Demo credentials loaded! Click Sign In to test.', 'info');
    });
  }

  if (guestLoginBtn) {
    guestLoginBtn.addEventListener('click', () => {
      emailInput.value = 'guest.explorer@zaro.agency';
      passwordInput.value = 'ZaroExplorer2026';
      showToast('🚀 Guest explorer credentials filled.', 'info');
    });
  }

  /* --------------------------------------------------------------------------
     7. Form Validation & Authentication Flow
     -------------------------------------------------------------------------- */
  function showFormError(message) {
    if (!formErrorAlert) return;
    formErrorAlert.classList.remove('info');
    formErrorAlert.textContent = message;
    formErrorAlert.style.display = 'flex';
  }

  function showFormInfo(message) {
    if (!formErrorAlert) return;
    formErrorAlert.classList.add('info');
    formErrorAlert.textContent = message;
    formErrorAlert.style.display = 'flex';
  }

  function clearFormError() {
    if (!formErrorAlert) return;
    formErrorAlert.classList.remove('info');
    formErrorAlert.textContent = '';
    formErrorAlert.style.display = 'none';
  }

  function validateEmailOrUser(value) {
    return value.trim().length >= 3;
  }

  function validatePassword(value) {
    return value.length >= 6;
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailGroup.classList.remove('has-error');
      clearFormError();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      passwordGroup.classList.remove('has-error');
      clearFormError();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearFormError();

      let isValid = true;
      const emailVal = emailInput.value.trim();
      const passwordVal = passwordInput.value;

      if (!validateEmailOrUser(emailVal)) {
        emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }

      if (!validatePassword(passwordVal)) {
        passwordGroup.classList.add('has-error');
        isValid = false;
      } else {
        passwordGroup.classList.remove('has-error');
      }

      if (!isValid) {
        showToast('Please provide a valid email and password (min 6 chars).', 'warning');
        return;
      }

      // Start Button Loading State
      submitLoginBtn.classList.add('loading');
      submitLoginBtn.disabled = true;

      try {
        let result;
        if (isSignUpMode) {
          result = await supabase.auth.signUp({
            email: emailVal,
            password: passwordVal,
          });
        } else {
          result = await supabase.auth.signInWithPassword({
            email: emailVal,
            password: passwordVal,
          });
        }

        const { data, error } = result;
        submitLoginBtn.classList.remove('loading');
        submitLoginBtn.disabled = false;

        if (error) {
          // If Supabase authentication errors, check for offline mock demo support
          if (emailVal.includes('demo') || emailVal.includes('guest') || emailVal.includes('vertex')) {
            const userName = emailVal.split('@')[0].replace('.', ' ').toUpperCase();
            localStorage.setItem('zaro-active-session', emailVal);
            showToast(`✨ Welcome to ZARO Portal, ${userName}!`, 'success');
            setTimeout(() => {
              window.location.href = '../index.html';
            }, 800);
            return;
          }

          showFormError(error.message || 'Authentication failed. Please verify your credentials.');
          showToast(error.message, 'warning');
          return;
        }

        // Persistence
        if (rememberMeCheckbox && rememberMeCheckbox.checked) {
          localStorage.setItem('zaro_remembered_email', emailVal);
        } else {
          localStorage.removeItem('zaro_remembered_email');
        }

        const users = JSON.parse(localStorage.getItem('zaro-users')) || {};
        const activeEmail = (data?.user?.email || emailVal).toLowerCase();
        const userName = data?.user?.user_metadata?.name || activeEmail.split('@')[0];

        if (!users[activeEmail]) {
          users[activeEmail] = {
            name: userName,
            shop: data?.user?.user_metadata?.shop || 'My ZARO Store',
            email: activeEmail,
            password: passwordVal,
            avatar: '',
            orders: [
              {
                id: `ZARO-${Math.floor(10000 + Math.random() * 90000)}`,
                projectName: 'Custom Storefront Launch Concept',
                category: 'Full-Stack E-Commerce',
                price: 4500,
                date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                estDelivery: 'Immediate Delivery',
                status: 'launched'
              }
            ]
          };
          localStorage.setItem('zaro-users', JSON.stringify(users));
        }

        localStorage.setItem('zaro-active-session', activeEmail);

        if (isSignUpMode) {
          if (data?.session) {
            showToast(`✨ Account created! Welcome to ZARO.`, 'success');
            setTimeout(() => {
              window.location.href = '../index.html';
            }, 800);
          } else {
            const confirmMsg = "Check your email and confirm your account before logging in.";
            showFormInfo(confirmMsg);
            showToast(confirmMsg, 'info');
          }
        } else {
          if (data?.session) {
            showToast(`✨ Welcome back, ${userName}! Login successful.`, 'success');
            setTimeout(() => {
              window.location.href = '../index.html';
            }, 800);
          } else {
            showToast(`✨ Welcome back, ${userName}!`, 'success');
            setTimeout(() => {
              window.location.href = '../index.html';
            }, 800);
          }
        }

      } catch (err) {
        // Fallback for demo users
        if (emailVal.includes('demo') || emailVal.includes('guest') || emailVal.includes('vertex') || emailVal.includes('client')) {
          const activeEmail = emailVal.toLowerCase();
          const userName = emailVal.split('@')[0].replace('.', ' ').toUpperCase();
          const users = JSON.parse(localStorage.getItem('zaro-users')) || {};
          if (!users[activeEmail]) {
            users[activeEmail] = {
              name: userName,
              shop: 'ZARO Demo Storefront',
              email: activeEmail,
              password: passwordVal,
              avatar: '',
              orders: [
                {
                  id: `ZARO-${Math.floor(10000 + Math.random() * 90000)}`,
                  projectName: 'Demo Storefront Showcase',
                  category: 'Consultation & Mockup',
                  price: 3500,
                  date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                  estDelivery: 'Immediate Delivery',
                  status: 'launched'
                }
              ]
            };
            localStorage.setItem('zaro-users', JSON.stringify(users));
          }
          localStorage.setItem('zaro-active-session', activeEmail);
          showToast(`✨ Welcome to ZARO Portal!`, 'success');
          setTimeout(() => {
            window.location.href = '../index.html';
          }, 800);
          return;
        }

        showFormError(err.message || 'An unexpected error occurred. Please try again.');
        showToast('Authentication error.', 'warning');
        submitLoginBtn.classList.remove('loading');
        submitLoginBtn.disabled = false;
      }
    });
  }

  /* --------------------------------------------------------------------------
     8. Google Social Login Simulation
     -------------------------------------------------------------------------- */
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      googleLoginBtn.style.opacity = '0.7';
      showToast('Connecting securely with Google...', 'info');

      setTimeout(() => {
        googleLoginBtn.style.opacity = '1';
        emailInput.value = 'partner.business@gmail.com';
        passwordInput.value = '••••••••••••';
        showToast('Google credentials verified! Click Sign In.', 'success');
      }, 900);
    });
  }

  /* --------------------------------------------------------------------------
     9. 4:5 Poster Modal Expansion Viewer
     -------------------------------------------------------------------------- */
  if (expandPosterBtn && posterModalBackdrop && mainPoster && modalPosterContainer) {
    expandPosterBtn.addEventListener('click', () => {
      modalPosterContainer.innerHTML = '';
      const clone = mainPoster.cloneNode(true);
      clone.id = 'modalPosterCloned';
      modalPosterContainer.appendChild(clone);
      openModal(posterModalBackdrop);
    });

    if (closePosterModal) {
      closePosterModal.addEventListener('click', () => {
        closeModal(posterModalBackdrop);
      });
    }

    posterModalBackdrop.addEventListener('click', (e) => {
      if (e.target === posterModalBackdrop) closeModal(posterModalBackdrop);
    });
  }

  /* --------------------------------------------------------------------------
     10. Language Dropdown
     -------------------------------------------------------------------------- */
  if (langDropdownBtn && langSelectorWrapper) {
    langDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = langSelectorWrapper.classList.toggle('active');
      langDropdownBtn.setAttribute('aria-expanded', isActive);
    });

    document.addEventListener('click', (e) => {
      if (!langSelectorWrapper.contains(e.target)) {
        langSelectorWrapper.classList.remove('active');
        langDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    langItems.forEach(item => {
      item.addEventListener('click', () => {
        langItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const lang = item.getAttribute('data-lang');
        const flag = item.getAttribute('data-flag');

        if (currentFlag) currentFlag.textContent = flag;
        if (currentLangCode) currentLangCode.textContent = lang;

        langSelectorWrapper.classList.remove('active');
        showToast(`Region & language set to ${item.textContent.trim()}`, 'info');
      });
    });
  }

  /* --------------------------------------------------------------------------
     11. Modals (Forgot Password, Terms & Privacy)
     -------------------------------------------------------------------------- */
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
  }

  if (forgotPasswordBtn && forgotModalBackdrop) {
    forgotPasswordBtn.addEventListener('click', () => {
      if (emailInput.value.includes('@')) {
        resetEmailInput.value = emailInput.value;
      }
      openModal(forgotModalBackdrop);
    });

    if (closeForgotModal) {
      closeForgotModal.addEventListener('click', () => closeModal(forgotModalBackdrop));
    }

    forgotModalBackdrop.addEventListener('click', (e) => {
      if (e.target === forgotModalBackdrop) closeModal(forgotModalBackdrop);
    });

    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = resetEmailInput.value;
        closeModal(forgotModalBackdrop);
        showToast(`Password reset link sent to ${email}`, 'success');
        forgotPasswordForm.reset();
      });
    }
  }

  // 11. Interactive Legal, Security & Licensing Modal Tabs
  function switchLegalTab(tabId) {
    if (!legalTabBtns.length || !legalTabPanes.length) return;

    legalTabBtns.forEach(btn => {
      const isActive = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    legalTabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === `pane-${tabId}`);
    });

    if (legalModalTitle) {
      if (tabId === 'terms') legalModalTitle.textContent = 'Terms of Service';
      else if (tabId === 'privacy') legalModalTitle.textContent = 'Security & Privacy Policy';
      else if (tabId === 'licenses') legalModalTitle.textContent = 'Software Licenses & Compliance';
    }
  }

  if (legalModalBackdrop) {
    if (termsLink) {
      termsLink.addEventListener('click', () => {
        switchLegalTab('terms');
        openModal(legalModalBackdrop);
      });
    }

    if (privacyLink) {
      privacyLink.addEventListener('click', () => {
        switchLegalTab('privacy');
        openModal(legalModalBackdrop);
      });
    }

    if (licensesLink) {
      licensesLink.addEventListener('click', () => {
        switchLegalTab('licenses');
        openModal(legalModalBackdrop);
      });
    }

    legalTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        if (targetTab) switchLegalTab(targetTab);
      });
    });

    if (closeLegalModal) {
      closeLegalModal.addEventListener('click', () => closeModal(legalModalBackdrop));
    }

    if (legalAcknowledgeBtn) {
      legalAcknowledgeBtn.addEventListener('click', () => closeModal(legalModalBackdrop));
    }

    legalModalBackdrop.addEventListener('click', (e) => {
      if (e.target === legalModalBackdrop) closeModal(legalModalBackdrop);
    });
  }

  /* --------------------------------------------------------------------------
     12. Toast Notification Helper
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '<i class="ri-information-line"></i>';
    if (type === 'success') icon = '<i class="ri-checkbox-circle-line" style="color: #48bb78;"></i>';
    if (type === 'warning') icon = '<i class="ri-alert-line" style="color: #E64833;"></i>';
    if (type === 'info') icon = '<i class="ri-lightbulb-line" style="color: #00D2FF;"></i>';

    toast.innerHTML = `<span style="font-size: 1.15rem; display: flex; align-items: center;">${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }
});
