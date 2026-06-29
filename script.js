/* 
================================================================
   ZARO PREMIUM WEB DEVELOPMENT AGENCY - DYNAMIC INTERACTIONS
   Smooth theme transitions, ROI calculator, responsive menus,
   custom visual previews, category filters, and form actions.
================================================================
*/

import { auth } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. DARK & LIGHT THEME ENGINE --- */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon-element');
  
  // Set theme color system helper
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('zaro-theme', theme);
    
    // Update Toggle Icon class
    if (theme === 'light') {
      themeIcon.className = 'ri-moon-line';
    } else {
      themeIcon.className = 'ri-sun-line';
    }
  };

  // Detect local storage or system preference
  const savedTheme = localStorage.getItem('zaro-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (systemPrefersDark) {
    setTheme('dark');
  } else {
    setTheme('light'); // default
  }

  // Handle click on theme switcher
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  });


  /* --- 2. MOBILE HAMBURGER MENU TOGGLE --- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinksList = document.querySelectorAll('.nav-link');
  const navOverlay = document.getElementById('nav-overlay');

  const toggleMobileMenu = (forceClose = false) => {
    const isOpen = forceClose ? false : !navMenu.classList.contains('active');
    
    navMenu.classList.toggle('active', isOpen);
    navOverlay.classList.toggle('active', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    
    if (isOpen) {
      mobileToggle.className = 'ri-close-line mobile-menu-btn';
    } else {
      mobileToggle.className = 'ri-menu-line mobile-menu-btn';
    }
  };

  mobileToggle.addEventListener('click', () => toggleMobileMenu());

  // Close mobile menu when nav link is clicked
  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Close mobile menu when clicking the backdrop overlay
  navOverlay.addEventListener('click', () => {
    toggleMobileMenu(true);
  });


  /* --- 3. DYNAMIC ROI & GROWTH CALCULATOR --- */
  const selectBusinessType = document.getElementById('calc-business-type');
  const sliderFootfall = document.getElementById('slider-footfall');
  const sliderSpend = document.getElementById('slider-spend');
  
  const labelFootfall = document.getElementById('label-footfall');
  const labelSpend = document.getElementById('label-spend');
  
  const resultAnnualRevenue = document.getElementById('result-annual-revenue');
  const resultWebVisitors = document.getElementById('result-web-visitors');
  const resultNewOrders = document.getElementById('result-new-orders');

  let currentRevValue = 0;
  let currentVisitorsValue = 0;
  let currentOrdersValue = 0;
  
  const revRef = { id: null };
  const visitorsRef = { id: null };
  const ordersRef = { id: null };

  // Optimized smooth cubic interpolation counter
  const animateCounter = (element, start, end, duration, formatFn, animIdRef, setRef) => {
    if (animIdRef.id) cancelAnimationFrame(animIdRef.id);
    
    const startTime = performance.now();
    
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Ease out cubic curves for realistic weight and deceleration
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(start + (end - start) * easeProgress);
      
      element.textContent = formatFn(currentValue);
      setRef(currentValue);
      
      if (progress < 1) {
        animIdRef.id = requestAnimationFrame(step);
      }
    };
    
    animIdRef.id = requestAnimationFrame(step);
  };

  const calculateROI = (isInitial = false) => {
    const businessType = selectBusinessType.value;
    const footfall = parseInt(sliderFootfall.value);
    const spend = parseInt(sliderSpend.value);

    // Update Slider Labels in UI
    labelFootfall.textContent = footfall;
    labelSpend.textContent = `₹${spend.toLocaleString('en-IN')}`;

    // Calculation Models
    let searchMultiplier = 1.5;
    let conversionRate = 0.045;

    if (businessType === 'retail') {
      searchMultiplier = 1.8;
      conversionRate = 0.04;
    } else if (businessType === 'cafe') {
      searchMultiplier = 1.6;
      conversionRate = 0.06;
    } else if (businessType === 'salon') {
      searchMultiplier = 1.3;
      conversionRate = 0.05;
    } else if (businessType === 'grocery') {
      searchMultiplier = 2.0;
      conversionRate = 0.035;
    }

    const projectedMonthlyVisitors = Math.round(footfall * 30 * searchMultiplier);
    const newMonthlyOrders = Math.round(projectedMonthlyVisitors * conversionRate);
    const monthlyRevenueGain = newMonthlyOrders * spend;
    const annualRevenueGain = monthlyRevenueGain * 12;

    if (isInitial === true) {
      resultAnnualRevenue.textContent = `₹${annualRevenueGain.toLocaleString('en-IN')}`;
      resultWebVisitors.textContent = `${projectedMonthlyVisitors.toLocaleString()}+`;
      resultNewOrders.textContent = `${newMonthlyOrders} New Orders`;
      currentRevValue = annualRevenueGain;
      currentVisitorsValue = projectedMonthlyVisitors;
      currentOrdersValue = newMonthlyOrders;
    } else {
      // Animate with micro-deceleration curve
      animateCounter(
        resultAnnualRevenue, 
        currentRevValue, 
        annualRevenueGain, 
        400, 
        v => `₹${v.toLocaleString('en-IN')}`, 
        revRef, 
        v => { currentRevValue = v; }
      );

      animateCounter(
        resultWebVisitors, 
        currentVisitorsValue, 
        projectedMonthlyVisitors, 
        400, 
        v => `${v.toLocaleString()}+`, 
        visitorsRef, 
        v => { currentVisitorsValue = v; }
      );

      animateCounter(
        resultNewOrders, 
        currentOrdersValue, 
        newMonthlyOrders, 
        400, 
        v => `${v.toLocaleString()} New Orders`, 
        ordersRef, 
        v => { currentOrdersValue = v; }
      );
    }
  };

  // Add event listeners to calculator inputs
  selectBusinessType.addEventListener('change', () => calculateROI(false));
  sliderFootfall.addEventListener('input', () => calculateROI(false));
  sliderSpend.addEventListener('input', () => calculateROI(false));

  // Initial Calculation Run
  calculateROI(true);


  /* --- 4. INTERACTIVE PORTFOLIO GALLERY (CSS DEVICES) --- */
  const portfolioTabs = document.querySelectorAll('.portfolio-tab');
  const btnDeviceDesktop = document.getElementById('btn-device-desktop');
  const btnDeviceMobile = document.getElementById('btn-device-mobile');
  
  const showcaseDesktop = document.getElementById('showcase-desktop');
  const showcaseMobile = document.getElementById('showcase-mobile');
  
  const desktopBgFrame = document.getElementById('desktop-bg-frame');
  const mobileBgFrame = document.getElementById('mobile-bg-frame');
  
  const metaCategory = document.getElementById('meta-category');
  const portfolioTitle = document.getElementById('portfolio-title');
  const portfolioDesc = document.getElementById('portfolio-desc');
  
  const innerDesktopLogo = document.getElementById('inner-desktop-logo');
  const innerDesktopTitle = document.getElementById('inner-desktop-title');
  const innerDesktopDesc = document.getElementById('inner-desktop-desc');
  const innerMobileLogo = document.getElementById('inner-mobile-logo');
  const innerMobileTitle = document.getElementById('inner-mobile-title');

  // Portfolio items data bank
  const portfolioData = {
    boutique: {
      category: 'Boutique',
      title: 'Bella Chic Boutique',
      desc: 'A gorgeous, image-heavy digital store setup tailored for upscale designer clothing labels. Features smooth item preview shifts, sizes drawers, fast loading tags, and integrated direct WhatsApp order triggers.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'BELLA CHIC',
      innerTitle: 'Exclusive Premium Dress Collections',
      innerDesc: 'Explore elegant, custom-tailored summer styles ready for home delivery.'
    },
    cafe: {
      category: 'Gourmet Cafe',
      title: 'The Aroma Cup',
      desc: 'A super-fast, clean digital QR Menu layout designed for cafes and food joints. Table-scanned codes let patrons load the menu in 0.5s, view interactive plates, toggle vegetarian choices, and place orders directly to the kitchen counter.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'AROMA CUP',
      innerTitle: 'Fresh Brewed Coffee & Warm Bakery',
      innerDesc: 'Skip the counter lines. Scan, pick, tap, and enjoy your fresh orders.'
    },
    services: {
      category: 'Spa & Salon',
      title: 'Nirvana Salon & Spa',
      desc: 'A high-end service showcase & calendar system built for beauty clinics. Includes aesthetic service galleries, live time-slot selectors, automated calendar booking syncing, and prefilled staff coordinator triggers.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'NIRVANA SPA',
      innerTitle: 'Revitalize Your Hair, Mind & Soul',
      innerDesc: 'Pre-book online today and unlock a flat 15% discount on skincare consultations.'
    },
    grocery: {
      category: 'Grocery Store',
      title: 'FreshMart Digital',
      desc: 'A smart grocery ordering platform with categorized aisles, live stock indicators, and scheduled delivery windows. Customers browse daily essentials, add to cart, and place bulk orders delivered to their doorstep within hours.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'FRESHMART',
      innerTitle: 'Farm Fresh Groceries at Your Door',
      innerDesc: 'Browse 500+ daily essentials and get same-day home delivery.'
    },
    fitness: {
      category: 'Fitness & Gym',
      title: 'IronCore Fitness Hub',
      desc: 'A dynamic fitness studio website with class scheduling, trainer profiles, membership plans, and progress tracking dashboards. Features immersive hero visuals, workout timers, and seamless trial-class booking via WhatsApp.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'IRONCORE',
      innerTitle: 'Transform Your Body & Mind',
      innerDesc: 'Book free trial sessions and explore membership plans today.'
    },
    realestate: {
      category: 'Real Estate',
      title: 'PrimeNest Properties',
      desc: 'An elegant property listing platform with virtual tour integration, interactive floor plans, neighbourhood maps, and instant enquiry forms. Designed for brokers and developers to showcase apartments, villas, and commercial spaces with high-impact visuals.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'PRIMENEST',
      innerTitle: 'Find Your Dream Home Today',
      innerDesc: 'Browse premium apartments, villas, and plots with virtual tours.'
    }
  };

  let activeFilter = 'boutique';

  // Update layout when category changes
  const updateShowcaseContent = (filter) => {
    activeFilter = filter;
    const data = portfolioData[filter];
    
    // Update textual contents with animations
    portfolioTitle.style.opacity = 0;
    portfolioDesc.style.opacity = 0;
    
    setTimeout(() => {
      metaCategory.textContent = data.category;
      portfolioTitle.textContent = data.title;
      portfolioDesc.textContent = data.desc;
      
      innerDesktopLogo.textContent = data.innerLogo;
      innerDesktopTitle.textContent = data.innerTitle;
      innerDesktopDesc.textContent = data.innerDesc;
      
      innerMobileLogo.textContent = data.innerLogo;
      innerMobileTitle.textContent = data.innerTitle;
      
      desktopBgFrame.style.backgroundImage = data.bgImage;
      mobileBgFrame.style.backgroundImage = data.mobileBgImage;
      
      portfolioTitle.style.opacity = 1;
      portfolioDesc.style.opacity = 1;
    }, 200);
  };

  // Listen to portfolio tabs click
  portfolioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active states
      portfolioTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const filter = tab.getAttribute('data-filter');
      updateShowcaseContent(filter);
    });
  });

  // Toggle Screen Device Modes (Desktop vs Mobile)
  btnDeviceDesktop.addEventListener('click', () => {
    btnDeviceDesktop.classList.add('active');
    btnDeviceMobile.classList.remove('active');
    
    showcaseDesktop.style.display = 'block';
    showcaseMobile.style.display = 'none';
  });

  btnDeviceMobile.addEventListener('click', () => {
    btnDeviceMobile.classList.add('active');
    btnDeviceDesktop.classList.remove('active');
    
    showcaseMobile.style.display = 'block';
    showcaseDesktop.style.display = 'none';
  });


  /* --- 5. TESTIMONIALS & REVIEWS FILTER SYSTEM --- */
  const reviewTabs = document.querySelectorAll('.reviews-tab');
  const reviewCards = document.querySelectorAll('.review-card');

  reviewTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active classes on tab buttons
      reviewTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-review-filter');

      reviewCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (filterVal === 'all' || cardCategory === filterVal) {
          // Fade in
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          // Fade out
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });


  /* --- 6. CONSULTATION & ESTIMATE FORM HANDLER --- */
  const consultationForm = document.getElementById('consultation-form');

  consultationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fetch form inputs
    const name = document.getElementById('form-name').value;
    const phone = document.getElementById('form-phone').value;
    const shopName = document.getElementById('form-shop-name').value;
    const sector = document.getElementById('form-business-type').value;
    const message = document.getElementById('form-message').value;

    // Build elegant, structured text for WhatsApp message
    const formattedMessage = `Hello ZARO! 🚀
I want to take my offline shop online. Here are my details:

• *My Name:* ${name}
• *My Phone:* ${phone}
• *Business Name:* ${shopName}
• *Business Type:* ${sector}
• *My Requirements:* ${message}

Looking forward to discussing the design concept and pricing outline with ZARO!`;

    // Encode message for URL
    const urlEncodedMessage = encodeURIComponent(formattedMessage);
    
    // ZARO official WhatsApp endpoint (+91 9043379569)
    const whatsappURL = `https://wa.me/919043379569?text=${urlEncodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');

    // Display inline elegant confirmation and reset
    const submitBtn = consultationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.style.background = 'var(--accent-color)';
    submitBtn.innerHTML = '<i class="ri-checkbox-circle-line"></i> Redirecting to WhatsApp...';

    setTimeout(() => {
      consultationForm.reset();
      submitBtn.disabled = false;
      submitBtn.style.background = 'var(--primary-gradient)';
      submitBtn.innerHTML = originalText;
    }, 4000);
  });


  /* --- 7. NEWSLETTER FORM ACTION --- */
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');
    
    button.disabled = true;
    button.innerHTML = '<i class="ri-check-line"></i>';
    input.value = 'Thanks for subscribing!';
    input.disabled = true;
    
    setTimeout(() => {
      input.value = '';
      input.disabled = false;
      button.disabled = false;
      button.innerHTML = '<i class="ri-send-plane-fill"></i>';
    }, 4000);
  });


  /* --- 8. SCROLL & ACTIVE HEADER OBSERVER --- */
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header class trigger on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll active indicator logic
    let currentActiveSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // accounting for header height offset
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentActiveSectionId = section.getAttribute('id');
      }
    });

    if (currentActiveSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  /* --- 9. TOAST NOTIFICATIONS ENGINE --- */
  const toastContainer = document.getElementById('toast-container');

  const showToast = (title, message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `toast-card toast-${type}`;
    
    let iconClass = 'ri-checkbox-circle-fill';
    if (type === 'warning') iconClass = 'ri-error-warning-fill';
    if (type === 'danger') iconClass = 'ri-close-circle-fill';
    
    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
      <div class="toast-progress"></div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Automatically remove after animation completes (4 seconds)
    setTimeout(() => {
      toast.remove();
    }, 4000);
  };

  /* --- 10. AUTH & PROFILE DOM ELEMENTS --- */
  const authModal = document.getElementById('auth-modal');
  const authModalClose = document.getElementById('auth-modal-close');
  const headerLoginBtn = document.getElementById('header-login-btn');
  const headerProfileBtn = document.getElementById('header-profile-btn');
  const profileDrawer = document.getElementById('profile-drawer');
  const profileDrawerClose = document.getElementById('profile-drawer-close');
  
  const authLoginView = document.getElementById('auth-login-view');
  const authSignupView = document.getElementById('auth-signup-view');
  const goToSignupLink = document.getElementById('go-to-signup');
  const goToLoginLink = document.getElementById('go-to-login');
  
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  const profileNameInput = document.getElementById('profile-name-input');
  const profileShopDisplay = document.getElementById('profile-shop-display');
  const profileEmailDisplay = document.getElementById('profile-email-display');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  const avatarUploadTrigger = document.getElementById('avatar-upload-trigger');
  const avatarFileInput = document.getElementById('avatar-file-input');
  const drawerAvatarImg = document.getElementById('drawer-avatar-img');
  const drawerAvatarInitials = document.getElementById('drawer-avatar-initials');
  
  const headerProfileImg = document.getElementById('header-profile-img');
  const headerProfileInitials = document.getElementById('header-profile-initials');
  
  const ordersListContainer = document.getElementById('orders-list-container');

  /* --- 11. FIREBASE INITIALIZATION & SESSION MANAGEMENT --- */
  
  const firebaseConfigured = auth && auth.app && auth.app.options && auth.app.options.apiKey && !auth.app.options.apiKey.includes('your_');

  let activeUser = null;

  // Retrieve databases from localStorage (for mock fallback)
  const getUsers = () => JSON.parse(localStorage.getItem('zaro-users')) || {};
  const saveUsers = (users) => localStorage.setItem('zaro-users', JSON.stringify(users));
  
  const getActiveUserEmail = () => localStorage.getItem('zaro-active-session') || null;
  const setActiveUserEmail = (email) => {
    if (email) {
      localStorage.setItem('zaro-active-session', email);
    } else {
      localStorage.removeItem('zaro-active-session');
    }
  };

  // Get active user data object (compatible with original code)
  const getActiveUser = () => {
    return activeUser;
  };

  // Update specific active user properties (for mock fallback)
  const updateActiveUserData = (updatedFields) => {
    const email = getActiveUserEmail();
    if (!email) return;
    const users = getUsers();
    if (users[email]) {
      users[email] = { ...users[email], ...updatedFields };
      saveUsers(users);
    }
  };

  // Render initials helper
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Update all header & drawer profile displays based on active session
  const checkActiveSession = async () => {
    if (!firebaseConfigured || !auth) {
      // Fallback: Local Storage Mock Auth
      const email = getActiveUserEmail();
      if (email) {
        const users = getUsers();
        activeUser = users[email] || null;
      } else {
        activeUser = null;
      }
    } else {
      // Live Firebase Auth
      try {
        const user = auth.currentUser;

        if (user) {
          const email = user.email;
          
          let username = user.displayName || email.split('@')[0];
          let shopName = "My Zaro Storefront";
          
          // Firestore profile lookup skipped (not enabled at this stage)
          // username and shopName fall back to Auth displayName and localStorage
          const storedName = localStorage.getItem(`zaro-name-${user.uid}`);
          const storedShop = localStorage.getItem(`zaro-shop-${user.uid}`);
          if (storedName) username = storedName;
          if (storedShop) shopName = storedShop;
          
          // Retrieve local-only properties (avatar and orders list)
          const storedAvatar = localStorage.getItem(`zaro-avatar-${email}`) || "";
          const storedOrders = JSON.parse(localStorage.getItem(`zaro-orders-${email}`)) || [
            {
              id: `ZARO-${Math.floor(10000 + Math.random() * 90000)}`,
              projectName: `${shopName} Launch Concept`,
              category: 'Consultation & Schema Mapping',
              price: 3500,
              date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              estDelivery: 'Immediate Delivery',
              status: 'launched'
            }
          ];
          
          // Save back default order list to localStorage if first time loading
          if (!localStorage.getItem(`zaro-orders-${email}`)) {
            localStorage.setItem(`zaro-orders-${email}`, JSON.stringify(storedOrders));
          }

          activeUser = {
            id: user.uid,
            name: username,
            shop: shopName,
            email: email,
            avatar: storedAvatar,
            orders: storedOrders
          };
        } else {
          activeUser = null;
        }
      } catch (err) {
        console.error("Firebase Auth session load failure:", err);
        activeUser = null;
      }
    }
    
    // Update DOM elements
    if (activeUser) {
      // Logged In view
      headerLoginBtn.style.display = 'none';
      headerProfileBtn.style.display = 'block';
      
      const initials = getInitials(activeUser.name);
      
      // Update initials
      headerProfileInitials.textContent = initials;
      drawerAvatarInitials.textContent = initials;
      
      // Update custom uploaded avatars
      if (activeUser.avatar) {
        headerProfileImg.src = activeUser.avatar;
        headerProfileImg.style.display = 'block';
        headerProfileInitials.style.display = 'none';
        
        drawerAvatarImg.src = activeUser.avatar;
        drawerAvatarImg.style.display = 'block';
        drawerAvatarInitials.style.display = 'none';
      } else {
        headerProfileImg.style.display = 'none';
        headerProfileInitials.style.display = 'flex';
        
        drawerAvatarImg.style.display = 'none';
        drawerAvatarInitials.style.display = 'flex';
      }
      
      // Update profile drawer fields
      profileNameInput.value = activeUser.name;
      profileShopDisplay.value = activeUser.shop;
      profileEmailDisplay.value = activeUser.email;
      
      // Render orders list
      renderOrders(activeUser.orders || []);
    } else {
      // Logged Out view
      headerLoginBtn.style.display = 'block';
      headerProfileBtn.style.display = 'none';
      profileDrawer.style.display = 'none';
    }
  };

  /* --- 12. DYNAMIC ORDER PLACEMENT ENGINE --- */
  
  // Render orders inside drawer helper
  const renderOrders = (orders) => {
    if (!orders || orders.length === 0) {
      ordersListContainer.innerHTML = `
        <div class="orders-empty-state">
          <i class="ri-shopping-bag-3-line"></i>
          <h4>No Active Website Orders</h4>
          <p>Configure the "Value Boost" calculator or select standard packages to draft your custom ZARO storefront design project!</p>
        </div>
      `;
      return;
    }
    
    // Reverse array to show newest orders first
    const sortedOrders = [...orders].reverse();
    
    ordersListContainer.innerHTML = sortedOrders.map(order => {
      let statusClass = 'status-draft';
      let statusLabel = '⚡ Initial Draft';
      
      if (order.status === 'development') {
        statusClass = 'status-dev';
        statusLabel = '🔨 In Development';
      } else if (order.status === 'launched') {
        statusClass = 'status-launched';
        statusLabel = '✅ Launched Store';
      }
      
      return `
        <div class="order-card">
          <div class="order-header">
            <div>
              <div class="order-id">${order.projectName}</div>
              <div class="order-meta-info">Order ID: ${order.id} | Ordered on ${order.date}</div>
            </div>
            <span class="order-status ${statusClass}">${statusLabel}</span>
          </div>
          
          <div class="order-details-grid">
            <div class="order-detail-item">
              <h5>Project Category</h5>
              <p>${order.category}</p>
            </div>
            <div class="order-detail-item">
              <h5>Development Cost</h5>
              <p>₹${order.price.toLocaleString('en-IN')}</p>
            </div>
            <div class="order-detail-item">
              <h5>Est. Delivery</h5>
              <p>${order.estDelivery}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  // Add order function
  const placeOrder = async (projectName, category, price) => {
    if (!activeUser) {
      showToast('Login Required', 'Please log in or register to place website designs orders!', 'warning');
      // Auto open auth modal
      openAuthModal();
      return false;
    }
    
    // Generate order object
    const randId = `ZARO-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // Calculate custom delivery window (e.g. 14 days later)
    const deliveryDate = new Date();
    deliveryDate.setDate(today.getDate() + 14);
    const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    
    const newOrder = {
      id: randId,
      projectName: projectName,
      category: category,
      price: price,
      date: formattedDate,
      estDelivery: formattedDelivery,
      status: 'draft' // status stages: draft, development, launched
    };
    
    const currentOrders = activeUser.orders || [];
    currentOrders.push(newOrder);
    
    // Update db / localStorage
    activeUser.orders = currentOrders;
    localStorage.setItem(`zaro-orders-${activeUser.email}`, JSON.stringify(currentOrders));
    
    if (!firebaseConfigured || !auth) {
      updateActiveUserData({ orders: currentOrders });
    }
    
    await checkActiveSession();
    
    showToast(
      '🚀 Project Draft Placed!', 
      `Your custom ${category} storefront design (ID: ${randId}) is now active in your tracker.`, 
      'success'
    );
    
    // Auto open profile drawer so they see their new order!
    openProfileDrawer();
    return true;
  };

  /* --- 13. INTERACTIVE ACTIONS HOOKS FOR ORDER PLACEMENT --- */

  // Hook 1: ROI Value Estimator Calculator order claim
  const calculatorCTA = document.querySelector('#calculator .calc-cta .btn');
  if (calculatorCTA) {
    calculatorCTA.addEventListener('click', (e) => {
      e.preventDefault();
      
      const selectBusinessType = document.getElementById('calc-business-type');
      const sliderSpend = document.getElementById('slider-spend');
      
      const businessSector = selectBusinessType.options[selectBusinessType.selectedIndex].text;
      const originalSector = selectBusinessType.value;
      const averageSpend = parseInt(sliderSpend.value);
      
      // Calculate dynamic design cost based on average spend
      let projectDesignPrice = 12500; // base price
      if (originalSector === 'grocery') projectDesignPrice = 18500;
      if (originalSector === 'retail') projectDesignPrice = 15000;
      if (originalSector === 'salon') projectDesignPrice = 10000;
      if (originalSector === 'cafe') projectDesignPrice = 11500;
      
      const projectName = `${activeUser ? activeUser.shop : 'My'} Digital Front`;
      
      placeOrder(projectName, businessSector, projectDesignPrice);
    });
  }

  // Hook 2: Portfolio Devices Showcases order claim
  const portfolioOrderButtons = document.querySelectorAll('.desktop-content span, .mobile-content span');
  portfolioOrderButtons.forEach(btn => {
    btn.style.cursor = 'pointer';
    
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Figure out active filter
      const activeTabBtn = document.querySelector('.portfolio-tab.active');
      const activeFilter = activeTabBtn ? activeTabBtn.getAttribute('data-filter') : 'boutique';
      
      let projName = 'Bella Chic Boutique Website';
      let projCategory = 'Premium Fashion Boutique';
      let projPrice = 15000;
      
      if (activeFilter === 'cafe') {
        projName = 'The Aroma Cup digital QR Menu';
        projCategory = 'Interactive QR Cafe Menu';
        projPrice = 11500;
      } else if (activeFilter === 'services') {
        projName = 'Nirvana Salon Calendar Booking Website';
        projCategory = 'Service Showcase & Appointments';
        projPrice = 10000;
      } else if (activeFilter === 'grocery') {
        projName = 'FreshMart Digital Storefront';
        projCategory = 'Online Grocery & Delivery';
        projPrice = 18500;
      } else if (activeFilter === 'fitness') {
        projName = 'IronCore Fitness Membership Portal';
        projCategory = 'Fitness Studio & Class Booking';
        projPrice = 14000;
      } else if (activeFilter === 'realestate') {
        projName = 'PrimeNest Property Listing Platform';
        projCategory = 'Real Estate Showcase & Tours';
        projPrice = 22000;
      }
      
      placeOrder(projName, projCategory, projPrice);
    });
  });

  // Hook 3: Consultation Form Submit integrates dynamic mock order!
  // (Merged into the primary consultation form handler above to avoid duplicate listeners)
  // Orders are placed silently when a logged-in user submits the consultation form
  const originalConsultationSubmitHandler = consultationForm.onsubmit;
  consultationForm.addEventListener('submit', () => {
    if (activeUser) {
      const shopName = document.getElementById('form-shop-name').value;
      const sector = document.getElementById('form-business-type').value;
      
      let priceVal = 12000;
      if (sector.includes('Boutique')) priceVal = 15000;
      if (sector.includes('Cafe')) priceVal = 11500;
      if (sector.includes('Salon')) priceVal = 10000;
      if (sector.includes('Grocery')) priceVal = 18500;
      
      setTimeout(() => {
        placeOrder(`${shopName} Storefront mockup`, sector, priceVal);
      }, 1500);
    }
  });

  /* --- 14. AUTHENTICATION CONTROLLER FLOWS --- */

  const openAuthModal = () => {
    authModal.style.display = 'flex';
    authModal.style.opacity = '1';
    authLoginView.style.display = 'block';
    authSignupView.style.display = 'none';
  };

  const closeAuthModal = () => {
    authModal.style.opacity = '0';
    setTimeout(() => {
      authModal.style.display = 'none';
    }, 300);
  };

  const openProfileDrawer = () => {
    profileDrawer.style.display = 'flex';
  };

  const closeProfileDrawer = () => {
    profileDrawer.style.display = 'none';
  };

  // Event Listeners for openers
  headerLoginBtn.addEventListener('click', openAuthModal);
  headerProfileBtn.addEventListener('click', openProfileDrawer);
  
  authModalClose.addEventListener('click', closeAuthModal);
  profileDrawerClose.addEventListener('click', closeProfileDrawer);
  
  // Close modals when clicking outside
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAuthModal();
  });
  profileDrawer.addEventListener('click', (e) => {
    if (e.target === profileDrawer) closeProfileDrawer();
  });

  // Switch links
  goToSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    authLoginView.style.display = 'none';
    authSignupView.style.display = 'block';
  });

  goToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    authSignupView.style.display = 'none';
    authLoginView.style.display = 'block';
  });

  // Register Submit Handlers
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const shop = document.getElementById('signup-shop').value;
    const email = document.getElementById('signup-email').value.toLowerCase().trim();
    const password = document.getElementById('signup-password').value;
    
    if (password.length < 6) {
      showToast('Validation Error', 'Password must be at least 6 characters long!', 'danger');
      return;
    }
    
    if (!firebaseConfigured || !auth) {
      // Mock signup flow
      const users = getUsers();
      if (users[email]) {
        showToast('Registration Error', 'An account with this email already exists!', 'danger');
        return;
      }
      
      const initialOrders = [
        {
          id: `ZARO-${Math.floor(10000 + Math.random() * 90000)}`,
          projectName: `${shop} Launch Concept`,
          category: 'Consultation & Schema Mapping',
          price: 3500,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          estDelivery: 'Immediate Delivery',
          status: 'launched'
        }
      ];

      users[email] = {
        name,
        shop,
        email,
        password,
        avatar: '',
        orders: initialOrders
      };
      
      saveUsers(users);
      setActiveUserEmail(email);
      
      showToast('Success!', `Welcome to ZARO Agency, ${name}! Your account is now active.`, 'success');
      
      signupForm.reset();
      closeAuthModal();
      await checkActiveSession();
    } else {
      // Firebase signup flow
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Registering...';
      
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, {
          displayName: name
        });
        
        // Save name & shop to localStorage (Firestore not enabled at this stage)
        localStorage.setItem(`zaro-name-${user.uid}`, name);
        localStorage.setItem(`zaro-shop-${user.uid}`, shop);
        
        // Initialize default orders list for tracking
        const initialOrders = [
          {
            id: `ZARO-${Math.floor(10000 + Math.random() * 90000)}`,
            projectName: `${shop} Launch Concept`,
            category: 'Consultation & Schema Mapping',
            price: 3500,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            estDelivery: 'Immediate Delivery',
            status: 'launched'
          }
        ];
        localStorage.setItem(`zaro-orders-${email}`, JSON.stringify(initialOrders));
        
        showToast('Success!', `Welcome to ZARO, ${name}! Your account has been registered.`, 'success');
        
        signupForm.reset();
        closeAuthModal();
        await checkActiveSession();
      } catch (err) {
        const code = err.code || '';
        let errMsg = 'Registration failed. Please try again.';
        if (code === 'auth/email-already-in-use') errMsg = 'User already exists. Please sign in.';
        else if (code === 'auth/invalid-email') errMsg = 'Please enter a valid email address.';
        else if (code === 'auth/weak-password') errMsg = 'Password must be at least 6 characters.';
        showToast('Registration Error', errMsg, 'danger');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });

  // Login Submit Handlers
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.toLowerCase().trim();
    const password = document.getElementById('login-password').value;
    
    if (!firebaseConfigured || !auth) {
      // Mock login flow
      const users = getUsers();
      const user = users[email];
      
      if (!user || user.password !== password) {
        showToast('Auth Failure', 'Incorrect email address or password. Try again.', 'danger');
        return;
      }
      
      setActiveUserEmail(email);
      showToast('Signed In Successfully!', `Welcome back, ${user.name}!`, 'success');
      
      loginForm.reset();
      closeAuthModal();
      await checkActiveSession();
    } else {
      // Firebase login flow
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Signing In...';
      
      try {
        await signInWithEmailAndPassword(auth, email, password);
        
        showToast('Signed In Successfully!', 'Welcome back to ZARO Client Workspace!', 'success');
        
        loginForm.reset();
        closeAuthModal();
        await checkActiveSession();
      } catch (err) {
        const code = err.code || '';
        let errMsg = 'Login failed. Please try again.';
        if (
          code === 'auth/wrong-password' ||
          code === 'auth/user-not-found' ||
          code === 'auth/invalid-credential' ||
          code === 'auth/invalid-email'
        ) { errMsg = 'Email or password is incorrect.'; }
        showToast('Auth Failure', errMsg, 'danger');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });

  // Google Sign-In Handler
  const googleSignInBtn = document.getElementById('google-signin-btn');
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', async () => {
      if (!firebaseConfigured || !auth) {
        showToast('Auth Error', 'Firebase is not configured for Google Sign-In.', 'danger');
        return;
      }
      
      const provider = new GoogleAuthProvider();
      const originalText = googleSignInBtn.innerHTML;
      googleSignInBtn.disabled = true;
      googleSignInBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Loading...';
      
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        if (user.displayName) {
          localStorage.setItem(`zaro-name-${user.uid}`, user.displayName);
        }
        
        showToast('Signed In Successfully!', `Welcome to ZARO, ${user.displayName || 'User'}!`, 'success');
        
        closeAuthModal();
        await checkActiveSession();
      } catch (err) {
        console.error(err);
        showToast('Auth Failure', 'Google Sign-In failed or was cancelled.', 'danger');
      } finally {
        googleSignInBtn.disabled = false;
        googleSignInBtn.innerHTML = originalText;
      }
    });
  }

  /* --- 15. PROFILE DETAIL SAVING & AVATAR UPLOAD --- */

  // Save Display name
  saveProfileBtn.addEventListener('click', async () => {
    const newName = profileNameInput.value.trim();
    if (!newName) {
      showToast('Error', 'Client display name cannot be blank!', 'danger');
      return;
    }
    
    if (!firebaseConfigured || !auth) {
      // Mock save
      updateActiveUserData({ name: newName });
      await checkActiveSession();
      showToast('Profile Updated', 'Your Display Name has been saved successfully!', 'success');
    } else {
      // Firebase save
      saveProfileBtn.disabled = true;
      saveProfileBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Saving...';
      try {
        const user = auth.currentUser;
        if (!user) throw new Error("No active user found!");

        await updateProfile(user, {
          displayName: newName
        });
        
        // Save name to localStorage (Firestore not enabled at this stage)
        localStorage.setItem(`zaro-name-${user.uid}`, newName);
        
        showToast('Profile Updated', 'Your Display Name has been saved successfully!', 'success');
        await checkActiveSession();
      } catch (err) {
        showToast('Update Failed', err.message, 'danger');
      } finally {
        saveProfileBtn.disabled = false;
        saveProfileBtn.innerHTML = '<i class="ri-save-line"></i> Save Profile Details';
      }
    }
  });

  // Avatar file input listener
  avatarUploadTrigger.addEventListener('click', () => {
    avatarFileInput.click();
  });

  avatarFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check size limit (2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('File Too Large', 'Please upload a photo smaller than 2MB!', 'danger');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async function(event) {
      const base64String = event.target.result;
      
      if (activeUser) {
        activeUser.avatar = base64String;
        localStorage.setItem(`zaro-avatar-${activeUser.email}`, base64String);
        
        if (!firebaseConfigured || !auth) {
          updateActiveUserData({ avatar: base64String });
        }
        
        await checkActiveSession();
        showToast('Avatar Updated', 'Your profile picture has been customized successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  });

  // Sign out Handler
  logoutBtn.addEventListener('click', async () => {
    const userName = activeUser ? activeUser.name : 'Client';
    
    if (!firebaseConfigured || !auth) {
      setActiveUserEmail(null);
      await checkActiveSession();
      closeProfileDrawer();
      showToast('Logged Out', `Goodbye, ${userName}! Have a wonderful day!`, 'warning');
    } else {
      logoutBtn.disabled = true;
      logoutBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Signing Out...';
      try {
        await signOut(auth);
        await checkActiveSession();
        closeProfileDrawer();
        showToast('Logged Out', `Goodbye, ${userName}! Have a wonderful day!`, 'warning');
      } catch (err) {
        showToast('Logout Error', err.message, 'danger');
      } finally {
        logoutBtn.disabled = false;
        logoutBtn.innerHTML = '<i class="ri-logout-box-r-line"></i> Sign Out';
      }
    }
  });

  /* --- 9. HIGH-PERFORMANCE SCROLL REVEAL ENGINE --- */
  const revealElements = document.querySelectorAll('.reveal-element');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });
    
    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback if browser does not support IntersectionObserver
    revealElements.forEach(el => el.classList.add('active'));
  }

  // Bind session updates
  if (firebaseConfigured && auth) {
    onAuthStateChanged(auth, async (user) => {
      console.log("Firebase Auth state changed:", user);
      await checkActiveSession();
    });
  }

  // Active check on load
  checkActiveSession();


  /* --- 16. FAQ ACCORDION --- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-open');
      
      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('faq-open');
        const btn = otherItem.querySelector('.faq-question');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      
      // Toggle current item
      if (!isOpen) {
        item.classList.add('faq-open');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });


  /* --- 17. PRICING BILLING TOGGLE --- */
  const billingToggle = document.getElementById('billing-toggle');
  const billingMonthlyLabel = document.getElementById('billing-monthly-label');
  const billingAnnualLabel = document.getElementById('billing-annual-label');
  const priceValues = document.querySelectorAll('.price-value');
  
  let isAnnual = false;

  if (billingToggle) {
    billingToggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      billingToggle.classList.toggle('annual-mode', isAnnual);
      
      // Update label active states
      billingMonthlyLabel.classList.toggle('active-label', !isAnnual);
      billingAnnualLabel.classList.toggle('active-label', isAnnual);
      
      // Update prices with animation
      priceValues.forEach(el => {
        const monthlyPrice = parseInt(el.getAttribute('data-monthly'));
        const annualPrice = parseInt(el.getAttribute('data-annual'));
        const targetPrice = isAnnual ? annualPrice : monthlyPrice;
        
        el.style.transform = 'translateY(-6px)';
        el.style.opacity = '0';
        
        setTimeout(() => {
          el.textContent = targetPrice.toLocaleString('en-IN');
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
        }, 200);
      });
    });
  }


  /* --- 18. PASSWORD VISIBILITY TOGGLES --- */
  const passwordToggleBtns = document.querySelectorAll('.password-toggle-btn');
  passwordToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      if (!targetInput) return;
      
      const icon = btn.querySelector('i');
      if (targetInput.type === 'password') {
        targetInput.type = 'text';
        icon.className = 'ri-eye-line';
      } else {
        targetInput.type = 'password';
        icon.className = 'ri-eye-off-line';
      }
    });
  });


  /* --- 19. FORGOT PASSWORD FLOW --- */
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const loginEmailInput = document.getElementById('login-email');
      const email = loginEmailInput ? loginEmailInput.value.trim().toLowerCase() : '';
      
      if (!email) {
        showToast('Email Required', 'Please enter your email address first, then click Forgot Password.', 'warning');
        if (loginEmailInput) loginEmailInput.focus();
        return;
      }
      
      if (!firebaseConfigured || !auth) {
        // Mock fallback — can't send real emails
        showToast('Reset Sent!', `If an account exists for ${email}, a password reset link has been sent.`, 'success');
        return;
      }
      
      try {
        await sendPasswordResetEmail(auth, email);
        showToast('Reset Email Sent!', `A password reset link has been sent to ${email}. Check your inbox.`, 'success');
      } catch (err) {
        const code = err.code || '';
        if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
          // For security, show the same success message
          showToast('Reset Sent!', `If an account exists for ${email}, a password reset link has been sent.`, 'success');
        } else {
          showToast('Error', 'Failed to send reset email. Please try again later.', 'danger');
        }
      }
    });
  }


  /* --- 20. ESCAPE KEY TO CLOSE MODALS & DRAWERS --- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close auth modal if open
      if (authModal && authModal.style.display !== 'none') {
        closeAuthModal();
      }
      // Close profile drawer if open
      if (profileDrawer && profileDrawer.style.display !== 'none') {
        closeProfileDrawer();
      }
      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains('active')) {
        toggleMobileMenu(true);
      }
    }
  });

});
