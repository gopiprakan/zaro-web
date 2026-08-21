/**
 * ZARO - Modern Auth & Showcase Interaction Script
 */
import { supabase } from './src/supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
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
  const welcomeTitle = document.getElementById('welcomeTitle');
  const welcomeSubtitle = document.getElementById('welcomeSubtitle');
  const signUpToggleBtn = document.getElementById('signUpToggleBtn');
  const showcaseSignUpBtn = document.getElementById('showcaseSignUpBtn');
  const showcaseJoinBtn = document.getElementById('showcaseJoinBtn');

  // Slider Elements
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const slides = document.querySelectorAll('.showcase-slides .slide');
  const authorName = document.getElementById('authorName');
  const authorRole = document.getElementById('authorRole');
  const authorAvatar = document.getElementById('authorAvatar');

  // Language Dropdown Elements
  const langDropdownBtn = document.getElementById('langDropdownBtn');
  const langSelectorWrapper = document.querySelector('.lang-selector-wrapper');
  const langMenu = document.getElementById('langMenu');
  const currentFlag = document.getElementById('currentFlag');
  const currentLangCode = document.getElementById('currentLangCode');
  const langItems = document.querySelectorAll('.lang-item');

  // Modals & Links
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const forgotModalBackdrop = document.getElementById('forgotModalBackdrop');
  const closeForgotModal = document.getElementById('closeForgotModal');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const resetEmailInput = document.getElementById('resetEmailInput');

  const termsLink = document.getElementById('termsLink');
  const privacyLink = document.getElementById('privacyLink');
  const legalModalBackdrop = document.getElementById('legalModalBackdrop');
  const closeLegalModal = document.getElementById('closeLegalModal');
  const legalAcknowledgeBtn = document.getElementById('legalAcknowledgeBtn');
  const legalModalTitle = document.getElementById('legalModalTitle');
  const toastContainer = document.getElementById('toastContainer');

  // State
  let currentSlideIndex = 0;
  let isSignUpMode = false;

  // Showcase Creators Data
  const showcaseData = [
    {
      name: "Andrew.ui",
      role: "UI & Illustration",
      avatar: "assets/avatar.jpg"
    },
    {
      name: "Elena.art",
      role: "3D & Cyberpunk World",
      avatar: "assets/avatar.jpg"
    }
  ];

  /* --------------------------------------------------------------------------
     1. Showcase Carousel Functionality
     -------------------------------------------------------------------------- */
  function updateSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    // Animate and update author details
    if (authorName && authorRole) {
      authorName.style.opacity = '0';
      authorRole.style.opacity = '0';
      
      setTimeout(() => {
        const item = showcaseData[index % showcaseData.length];
        authorName.textContent = item.name;
        authorRole.textContent = item.role;
        authorName.style.opacity = '1';
        authorRole.style.opacity = '1';
      }, 150);
    }
  }

  if (prevSlideBtn && nextSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSlide(currentSlideIndex);
    });

    nextSlideBtn.addEventListener('click', () => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlide(currentSlideIndex);
    });

    // Auto-advance showcase slide every 7 seconds
    setInterval(() => {
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlide(currentSlideIndex);
    }, 7000);
  }

  /* --------------------------------------------------------------------------
     2. Show / Hide Password Toggle
     -------------------------------------------------------------------------- */
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';

      const eyeOpen = togglePasswordBtn.querySelector('.eye-open');
      const eyeClosed = togglePasswordBtn.querySelector('.eye-closed');

      if (isPassword) {
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
      } else {
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Remember Me Checkbox Persistence
     -------------------------------------------------------------------------- */
  const savedEmail = localStorage.getItem('zaro_remembered_email');
  if (savedEmail && emailInput) {
    emailInput.value = savedEmail;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
  }

  /* --------------------------------------------------------------------------
     4. Form Validation, Error/Info Alerts & Supabase Auth Submission
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

  // Clear errors on input
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
        showToast('Please check the required fields.', 'warning');
        return;
      }

      // Start Loading state
      submitLoginBtn.classList.add('loading');
      submitLoginBtn.disabled = true;

      try {
        let result;
        if (isSignUpMode) {
          // 1) For Sign Up:
          result = await supabase.auth.signUp({
            email: emailVal,
            password: passwordVal,
          });
        } else {
          // 2) For Sign In:
          result = await supabase.auth.signInWithPassword({
            email: emailVal,
            password: passwordVal,
          });
        }

        const { data, error } = result;

        submitLoginBtn.classList.remove('loading');
        submitLoginBtn.disabled = false;

        if (error) {
          // Show error message under the form
          showFormError(error.message || 'Authentication failed. Please verify your credentials.');
          showToast(error.message, 'warning');
          return;
        }

        // Remember Me persistence
        if (rememberMeCheckbox && rememberMeCheckbox.checked) {
          localStorage.setItem('zaro_remembered_email', emailVal);
        } else {
          localStorage.removeItem('zaro_remembered_email');
        }

        if (isSignUpMode) {
          // If session returned immediately (e.g. email confirmations disabled)
          if (data?.session) {
            const activeEmail = data.user?.email || emailVal;
            const userName = data.user?.user_metadata?.name || activeEmail.split('@')[0];
            localStorage.setItem('zaro-active-session', activeEmail);
            const users = JSON.parse(localStorage.getItem('zaro-users')) || {};
            if (!users[activeEmail]) {
              users[activeEmail] = {
                name: userName,
                email: activeEmail,
                shop: 'My Zaro Storefront',
                avatar: '',
                orders: []
              };
              localStorage.setItem('zaro-users', JSON.stringify(users));
            }
            showToast(`✨ Account ready! Welcome to ZARO.`, 'success');
            setTimeout(() => {
              window.location.href = '../index.html';
            }, 700);
          } else {
            // Sign Up requirement: Just show: "Check your email and confirm your account before logging in."
            const confirmMsg = "Check your email and confirm your account before logging in.";
            showFormInfo(confirmMsg);
            showToast(confirmMsg, 'info');
          }
        } else {
          // For Sign In: Only redirect when a real session exists after login
          if (data?.session) {
            const activeEmail = data.user?.email || emailVal;
            const userName = data.user?.user_metadata?.name || activeEmail.split('@')[0];
            localStorage.setItem('zaro-active-session', activeEmail);
            const users = JSON.parse(localStorage.getItem('zaro-users')) || {};
            if (!users[activeEmail]) {
              users[activeEmail] = {
                name: userName,
                email: activeEmail,
                shop: 'My Zaro Storefront',
                avatar: '',
                orders: []
              };
              localStorage.setItem('zaro-users', JSON.stringify(users));
            }
            showToast(`✨ Welcome back, ${userName}! Login successful.`, 'success');
            setTimeout(() => {
              window.location.href = '../index.html';
            }, 700);
          } else {
            showFormError('No active session could be created. Please check your credentials or verify your email.');
          }
        }

      } catch (err) {
        showFormError(err.message || 'An unexpected error occurred. Please try again.');
        showToast('An error occurred during authentication.', 'warning');
        submitLoginBtn.classList.remove('loading');
        submitLoginBtn.disabled = false;
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Google Social Login Simulation
     -------------------------------------------------------------------------- */
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
      googleLoginBtn.style.opacity = '0.7';
      showToast('Connecting securely with Google...', 'info');

      setTimeout(() => {
        googleLoginBtn.style.opacity = '1';
        emailInput.value = 'alex.designer@gmail.com';
        passwordInput.value = '••••••••••••';
        showToast('Google authentication verified!', 'success');
      }, 1000);
    });
  }

  /* --------------------------------------------------------------------------
     6. Mode Toggle: Login <-> Sign Up
     -------------------------------------------------------------------------- */
  function toggleAuthMode(toSignUp) {
    isSignUpMode = toSignUp;
    clearFormError();
    emailGroup.classList.remove('has-error');
    passwordGroup.classList.remove('has-error');
    const btnText = submitLoginBtn.querySelector('.btn-text');

    if (isSignUpMode) {
      welcomeTitle.textContent = 'Create Account';
      welcomeSubtitle.textContent = 'Join the creative design community on ZARO';
      btnText.textContent = 'Create Account';
      signUpToggleBtn.textContent = 'Log in';
      signUpToggleBtn.previousElementSibling.textContent = 'Already have an account?';
    } else {
      welcomeTitle.textContent = 'Welcome Back';
      welcomeSubtitle.textContent = 'Login to access your account';
      btnText.textContent = 'Login';
      signUpToggleBtn.textContent = 'Sign up';
      signUpToggleBtn.previousElementSibling.textContent = "Don't have an account?";
    }
  }

  if (signUpToggleBtn) {
    signUpToggleBtn.addEventListener('click', () => {
      toggleAuthMode(!isSignUpMode);
    });
  }

  if (showcaseSignUpBtn) {
    showcaseSignUpBtn.addEventListener('click', () => {
      toggleAuthMode(true);
    });
  }

  if (showcaseJoinBtn) {
    showcaseJoinBtn.addEventListener('click', () => {
      toggleAuthMode(true);
      showToast('Welcome! Fill in your credentials to join ZARO.', 'info');
    });
  }

  /* --------------------------------------------------------------------------
     7. Language Dropdown
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

        currentFlag.textContent = flag;
        currentLangCode.textContent = lang;

        langSelectorWrapper.classList.remove('active');
        showToast(`Language switched to ${item.textContent.trim()}`, 'info');
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. Modals (Forgot Password, Terms & Privacy)
     -------------------------------------------------------------------------- */
  function openModal(modal) {
    modal.classList.add('open');
  }

  function closeModal(modal) {
    modal.classList.remove('open');
  }

  // Forgot Password Modal
  if (forgotPasswordBtn && forgotModalBackdrop) {
    forgotPasswordBtn.addEventListener('click', () => {
      if (emailInput.value.includes('@')) {
        resetEmailInput.value = emailInput.value;
      }
      openModal(forgotModalBackdrop);
    });

    closeForgotModal.addEventListener('click', () => {
      closeModal(forgotModalBackdrop);
    });

    forgotModalBackdrop.addEventListener('click', (e) => {
      if (e.target === forgotModalBackdrop) closeModal(forgotModalBackdrop);
    });

    forgotPasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = resetEmailInput.value;
      closeModal(forgotModalBackdrop);
      showToast(`Password recovery link sent to ${email}`, 'success');
      forgotPasswordForm.reset();
    });
  }

  // Legal Modals (Terms / Privacy)
  if (termsLink && privacyLink && legalModalBackdrop) {
    termsLink.addEventListener('click', () => {
      legalModalTitle.textContent = 'Terms of Service';
      openModal(legalModalBackdrop);
    });

    privacyLink.addEventListener('click', () => {
      legalModalTitle.textContent = 'Privacy Policy';
      openModal(legalModalBackdrop);
    });

    closeLegalModal.addEventListener('click', () => {
      closeModal(legalModalBackdrop);
    });

    legalAcknowledgeBtn.addEventListener('click', () => {
      closeModal(legalModalBackdrop);
    });

    legalModalBackdrop.addEventListener('click', (e) => {
      if (e.target === legalModalBackdrop) closeModal(legalModalBackdrop);
    });
  }

  /* --------------------------------------------------------------------------
     9. Toast Notification System
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3500);
  }
});
