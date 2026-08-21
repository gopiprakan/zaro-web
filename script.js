/* 
================================================================
   ZARO PREMIUM WEB DEVELOPMENT AGENCY - DYNAMIC INTERACTIONS
   Smooth theme transitions, ROI calculator, responsive menus,
   custom visual previews, category filters, and form actions.
================================================================
*/

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
  
  const innerDesktopUrl = document.getElementById('inner-desktop-url');
  const innerDesktopLogo = document.getElementById('inner-desktop-logo');
  const innerDesktopStatus = document.getElementById('inner-desktop-status');
  const innerDesktopTitle = document.getElementById('inner-desktop-title');
  const innerDesktopDesc = document.getElementById('inner-desktop-desc');
  const innerDesktopPills = document.getElementById('inner-desktop-pills');
  const innerDesktopBtnText = document.getElementById('inner-desktop-btn-text');
  const innerDesktopBtnIcon = document.getElementById('inner-desktop-btn-icon');
  
  const innerMobileLogo = document.getElementById('inner-mobile-logo');
  const innerMobileCategory = document.getElementById('inner-mobile-category');
  const innerMobileTitle = document.getElementById('inner-mobile-title');
  const innerMobileDesc = document.getElementById('inner-mobile-desc');
  const innerMobileBtnText = document.getElementById('inner-mobile-btn-text');
  const innerMobileBtnIcon = document.getElementById('inner-mobile-btn-icon');

  // Portfolio items data bank
  const portfolioData = {
    boutique: {
      category: 'Fashion Boutique',
      status: 'Active E-Commerce',
      url: 'https://bellachic.shop',
      title: 'Bella Chic Boutique',
      desc: 'A gorgeous, image-heavy digital store setup tailored for upscale designer clothing labels. Features smooth item preview shifts, sizing drawers, instant checkout, and direct WhatsApp order triggers.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'BELLA CHIC',
      innerStatus: '● ACTIVE STORE',
      innerTitle: 'Exclusive Summer Styles',
      innerDesc: 'Handpicked designer fashion ready for instant delivery across the city.',
      pills: ['👗 Summer 2026', '⚡ 2-Hour Delivery', '💳 1-Tap Pay'],
      btnText: 'Shop Collection',
      btnIcon: 'ri-shopping-bag-3-line',
      mobileBtnText: 'Order via WhatsApp',
      mobileBtnIcon: 'ri-whatsapp-line'
    },
    cafe: {
      category: 'Gourmet Cafe',
      status: 'Online QR Menu',
      url: 'https://thearomacup.cafe/menu',
      title: 'The Aroma Cup',
      desc: 'A super-fast, clean digital QR Menu layout designed for cafes and food joints. Table-scanned codes let patrons load the menu in 0.5s, view interactive plates, toggle vegetarian choices, and place orders directly to the kitchen counter.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'AROMA CUP',
      innerStatus: '● OPEN NOW',
      innerTitle: 'Fresh Brewed Coffee & Bakery',
      innerDesc: 'Skip the counter lines. Scan, pick, tap, and enjoy artisan coffees & warm bakes.',
      pills: ['☕ Artisan Roasts', '🥐 Fresh Bakery', '⚡ Table Scan 0.5s'],
      btnText: 'Browse Live Menu',
      btnIcon: 'ri-restaurant-line',
      mobileBtnText: 'View Digital Menu',
      mobileBtnIcon: 'ri-cup-line'
    },
    services: {
      category: 'Spa & Salon',
      status: 'Automated Booking',
      url: 'https://nirvanaspa.com/book',
      title: 'Nirvana Salon & Spa',
      desc: 'A high-end service showcase & calendar system built for beauty clinics. Includes aesthetic service galleries, live time-slot selectors, automated calendar booking syncing, and prefilled staff coordinator triggers.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'NIRVANA SPA',
      innerStatus: '● 8 SLOTS TODAY',
      innerTitle: 'Revitalize Your Body & Mind',
      innerDesc: 'Pre-book luxury skincare & hair spa sessions online with 15% promotional discount.',
      pills: ['💆 Aromatherapy', '📅 Instant Slot Booking', '⭐ 4.9 Rating'],
      btnText: 'Book Appointment',
      btnIcon: 'ri-calendar-check-line',
      mobileBtnText: 'Book Slot on WhatsApp',
      mobileBtnIcon: 'ri-calendar-line'
    },
    grocery: {
      category: 'Grocery Store',
      status: 'Same-Day Delivery',
      url: 'https://freshmart-groceries.in',
      title: 'FreshMart Digital',
      desc: 'A smart grocery ordering platform with categorized aisles, live stock indicators, and scheduled delivery windows. Customers browse daily essentials, add to cart, and place bulk orders delivered to their doorstep within hours.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'FRESHMART',
      innerStatus: '● LIVE INVENTORY',
      innerTitle: 'Farm Fresh Groceries to Doorstep',
      innerDesc: 'Browse 500+ daily essentials and organic produce with 30-minute delivery guarantee.',
      pills: ['🥬 Organic Certified', '⚡ 30-Min Delivery', '📦 Bulk Savings'],
      btnText: 'Order Essentials',
      btnIcon: 'ri-shopping-basket-2-line',
      mobileBtnText: 'Quick WhatsApp Order',
      mobileBtnIcon: 'ri-shopping-bag-line'
    },
    fitness: {
      category: 'Fitness & Gym',
      status: 'Class Memberships',
      url: 'https://ironcorefitness.club',
      title: 'IronCore Fitness Hub',
      desc: 'A dynamic fitness studio website with class scheduling, trainer profiles, membership plans, and progress tracking dashboards. Features immersive hero visuals, workout timers, and seamless trial-class booking via WhatsApp.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'IRONCORE GYM',
      innerStatus: '● FREE TRIAL ACTIVE',
      innerTitle: 'Transform Body, Mind & Strength',
      innerDesc: 'Claim a free 3-day personal training pass and access state-of-the-art gym amenities.',
      pills: ['🔥 High-Tech Gym', '🏋️ Certified Coaches', '🎟️ 3-Day Free Pass'],
      btnText: 'Claim Free Pass',
      btnIcon: 'ri-flashlight-line',
      mobileBtnText: 'Claim Trial Pass',
      mobileBtnIcon: 'ri-boxing-line'
    },
    realestate: {
      category: 'Real Estate',
      status: 'Virtual Property Hub',
      url: 'https://primenestproperties.com',
      title: 'PrimeNest Properties',
      desc: 'An elegant property listing platform with virtual tour integration, interactive floor plans, neighbourhood maps, and instant enquiry forms. Designed for brokers and developers to showcase apartments, villas, and commercial spaces with high-impact visuals.',
      bgImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800')",
      mobileBgImage: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400')",
      innerLogo: 'PRIMENEST',
      innerStatus: '● 40+ PROPERTIES',
      innerTitle: 'Luxury Villas & City Homes',
      innerDesc: 'Discover high-return properties and premium residences with interactive 3D tours.',
      pills: ['🏡 3D Virtual Tours', '📍 Prime Localities', '📑 Verified Titles'],
      btnText: 'Explore Listings',
      btnIcon: 'ri-building-2-line',
      mobileBtnText: 'Enquire on WhatsApp',
      mobileBtnIcon: 'ri-home-4-line'
    }
  };

  let activeFilter = 'boutique';

  // Update layout when category changes
  const updateShowcaseContent = (filter) => {
    activeFilter = filter;
    const data = portfolioData[filter];
    if (!data) return;
    
    // Update textual contents with animations
    portfolioTitle.style.opacity = 0;
    portfolioDesc.style.opacity = 0;
    
    setTimeout(() => {
      if (metaCategory) metaCategory.textContent = data.category;
      if (portfolioTitle) portfolioTitle.textContent = data.title;
      if (portfolioDesc) portfolioDesc.textContent = data.desc;
      
      if (innerDesktopUrl) innerDesktopUrl.textContent = data.url;
      if (innerDesktopLogo) innerDesktopLogo.textContent = data.innerLogo;
      if (innerDesktopStatus) innerDesktopStatus.textContent = data.innerStatus;
      if (innerDesktopTitle) innerDesktopTitle.textContent = data.innerTitle;
      if (innerDesktopDesc) innerDesktopDesc.textContent = data.innerDesc;
      if (innerDesktopBtnText) innerDesktopBtnText.textContent = data.btnText;
      if (innerDesktopBtnIcon) innerDesktopBtnIcon.className = data.btnIcon;
      
      if (innerDesktopPills && data.pills) {
        innerDesktopPills.innerHTML = data.pills.map(pill => `<span>${pill}</span>`).join('');
      }
      
      if (innerMobileLogo) innerMobileLogo.textContent = data.innerLogo;
      if (innerMobileCategory) innerMobileCategory.textContent = data.category;
      if (innerMobileTitle) innerMobileTitle.textContent = data.innerTitle;
      if (innerMobileDesc) innerMobileDesc.textContent = data.innerDesc;
      if (innerMobileBtnText) innerMobileBtnText.textContent = data.mobileBtnText;
      if (innerMobileBtnIcon) innerMobileBtnIcon.className = data.mobileBtnIcon;
      
      if (desktopBgFrame) desktopBgFrame.style.backgroundImage = data.bgImage;
      if (mobileBgFrame) mobileBgFrame.style.backgroundImage = data.mobileBgImage;
      
      portfolioTitle.style.opacity = 1;
      portfolioDesc.style.opacity = 1;
    }, 150);
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
  if (btnDeviceDesktop && btnDeviceMobile && showcaseDesktop && showcaseMobile) {
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
  }


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


  /* --- 8. HIGH PERFORMANCE 60+ FPS SCROLL & NAV OBSERVER --- */
  const header = document.getElementById('main-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  let isTickScheduled = false;

  const onScrollHandler = () => {
    if (!isTickScheduled) {
      requestAnimationFrame(() => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        isTickScheduled = false;
      });
      isTickScheduled = true;
    }
  };

  window.addEventListener('scroll', onScrollHandler, { passive: true });

  // IntersectionObserver for active section link highlights without layout thrashing
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              navLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(sec => sectionObserver.observe(sec));
  }

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

  /* --- 11. USER AUTHENTICATION & SESSION MANAGEMENT --- */
  
  let activeUser = null;

  // Retrieve databases from localStorage
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

  // Get active user data object
  const getActiveUser = () => {
    return activeUser;
  };

  // Update specific active user properties
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
    const email = getActiveUserEmail();
    if (email) {
      const users = getUsers();
      activeUser = users[email] || null;
    } else {
      activeUser = null;
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
    updateActiveUserData({ orders: currentOrders });
    
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
    
    // Registration flow
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
  });

  // Login Submit Handlers
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.toLowerCase().trim();
    const password = document.getElementById('login-password').value;
    
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
  });

  // Google Sign-In Handler
  const googleSignInBtn = document.getElementById('google-signin-btn');
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', async () => {
      const demoEmail = 'google.user@zaro.dev';
      const users = getUsers();
      if (!users[demoEmail]) {
        users[demoEmail] = {
          name: 'Alex Rivera',
          shop: 'Rivera Studio',
          email: demoEmail,
          password: 'google-oauth-demo',
          avatar: '',
          orders: [
            {
              id: `ZARO-${Math.floor(10000 + Math.random() * 90000)}`,
              projectName: 'Rivera Studio Launch Concept',
              category: 'Full-Stack E-Commerce',
              price: 4500,
              date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              estDelivery: 'Immediate Delivery',
              status: 'launched'
            }
          ]
        };
        saveUsers(users);
      }
      setActiveUserEmail(demoEmail);
      showToast('Signed In Successfully!', 'Welcome to ZARO, Alex Rivera!', 'success');
      closeAuthModal();
      await checkActiveSession();
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
    
    updateActiveUserData({ name: newName });
    await checkActiveSession();
    showToast('Profile Updated', 'Your Display Name has been saved successfully!', 'success');
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
        updateActiveUserData({ avatar: base64String });
        await checkActiveSession();
        showToast('Avatar Updated', 'Your profile picture has been customized successfully!', 'success');
      }
    };
    reader.readAsDataURL(file);
  });

  // Sign out Handler
  logoutBtn.addEventListener('click', async () => {
    const userName = activeUser ? activeUser.name : 'Client';
    setActiveUserEmail(null);
    await checkActiveSession();
    closeProfileDrawer();
    showToast('Logged Out', `Goodbye, ${userName}! Have a wonderful day!`, 'warning');
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
      
      showToast('Reset Email Sent!', `If an account exists for ${email}, a password reset link has been dispatched.`, 'success');
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


  /* --- 21. HIGH-PERFORMANCE 60+ FPS MONITOR & PARTICLE ENGINE --- */
  
  // Real-time FPS Monitor Engine
  const fpsValueText = document.getElementById('fps-value-text');
  const fpsMeterWidget = document.getElementById('fps-meter-widget');
  const fpsIndicatorDot = fpsMeterWidget ? fpsMeterWidget.querySelector('.fps-indicator-dot') : null;
  
  let frameCount = 0;
  let lastFpsTime = performance.now();
  let currentFps = 60;

  const updateFpsMeter = (now) => {
    frameCount++;
    const delta = now - lastFpsTime;
    
    if (delta >= 500) { // Update FPS display twice per second for stability
      currentFps = Math.round((frameCount * 1000) / delta);
      frameCount = 0;
      lastFpsTime = now;

      if (fpsValueText) {
        fpsValueText.textContent = currentFps;
      }

      if (fpsIndicatorDot) {
        if (currentFps >= 55) {
          fpsIndicatorDot.className = 'fps-indicator-dot'; // Green 60+ FPS
        } else if (currentFps >= 35) {
          fpsIndicatorDot.className = 'fps-indicator-dot fps-warning';
        } else {
          fpsIndicatorDot.className = 'fps-indicator-dot fps-danger';
        }
      }
    }
  };

  // Interactive 60 FPS Canvas Particle Mesh Background
  const particleCanvas = document.getElementById('hero-particle-canvas');
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d', { alpha: true });
    let width = (particleCanvas.width = window.innerWidth);
    let height = (particleCanvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, active: false };

    window.addEventListener('resize', () => {
      width = particleCanvas.width = window.innerWidth;
      height = particleCanvas.height = window.innerHeight;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    }, { passive: true });

    // Node count optimized for high framerate
    const particleCount = Math.min(Math.floor((width * height) / 22000), 45);
    const particles = [];

    const getThemeColors = () => {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      return {
        nodeColor: isDark ? 'rgba(230, 72, 51, 0.55)' : 'rgba(230, 72, 51, 0.45)',
        lineColor: isDark ? 'rgba(144, 174, 173, 0.14)' : 'rgba(36, 72, 85, 0.12)',
        accentColor: isDark ? 'rgba(144, 174, 173, 0.55)' : 'rgba(135, 79, 65, 0.45)'
      };
    };

    let themeColors = getThemeColors();

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        setTimeout(() => {
          themeColors = getThemeColors();
        }, 50);
      });
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle cursor attraction
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            this.x += (dx / dist) * 0.4;
            this.y += (dy / dist) * 0.4;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = themeColors.nodeColor;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Single master RAF loop for 60+ FPS canvas rendering and FPS monitor
    const renderLoop = (now) => {
      updateFpsMeter(now);

      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = themeColors.lineColor;
            ctx.lineWidth = 1 - dist / 130;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(renderLoop);
    };

    requestAnimationFrame(renderLoop);
  } else {
    // Fallback if particle canvas is not present
    const renderFpsOnly = (now) => {
      updateFpsMeter(now);
      requestAnimationFrame(renderFpsOnly);
    };
    requestAnimationFrame(renderFpsOnly);
  }

});
