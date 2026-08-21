import React, { createContext, useContext, useState, useEffect } from 'react';

const isConfigured = true;

const AuthContext = createContext(null);

// Preset demo accounts for quick testing
export const DEMO_ACCOUNTS = {
  client: {
    uid: 'demo-client-001',
    email: 'client@zaro.dev',
    displayName: 'Elena Rostova',
    role: 'client',
    company: 'Luxe Botanica Retail',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    balance: 14250,
    totalSpent: 42500,
    activeProjectsCount: 3,
  },
  freelancer: {
    uid: 'demo-freelancer-001',
    email: 'freelancer@zaro.dev',
    displayName: 'Marcus Sterling',
    role: 'freelancer',
    title: 'Senior Full-Stack & UI/UX Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    balance: 8940,
    totalEarned: 68500,
    successRate: '99.4%',
    activeContractsCount: 4,
  },
  admin: {
    uid: 'demo-admin-001',
    email: 'admin@zaro.dev',
    displayName: 'Alexander Vance',
    role: 'admin',
    title: 'Platform Master Director',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    permissions: 'Full System Access',
    activeUsersCount: 1420,
  },
};

// Initial platform data store for interactive richness
const INITIAL_PROJECTS = [
  {
    id: 'PRJ-1082',
    title: 'Luxury Boutique E-Commerce Redesign',
    clientName: 'Elena Rostova',
    clientEmail: 'client@zaro.dev',
    freelancerName: 'Marcus Sterling',
    freelancerEmail: 'freelancer@zaro.dev',
    category: 'Full-Stack Web',
    budget: 6800,
    paid: 3400,
    status: 'In Progress',
    progress: 68,
    deadline: '2026-09-15',
    description: 'High-conversion Shopify + Headless React storefront with 3D garment visualizer and Stripe integrated checkout.',
    milestones: [
      { name: 'Wireframing & UI Kit Design', amount: 1800, status: 'Completed' },
      { name: 'Frontend React Development', amount: 2400, status: 'In Progress' },
      { name: 'Backend API & Stripe Connect', amount: 1600, status: 'Pending' },
      { name: 'SEO Optimization & Deploy', amount: 1000, status: 'Pending' },
    ]
  },
  {
    id: 'PRJ-1083',
    title: 'Gourmet Artisanal Cafe Landing & Ordering System',
    clientName: 'Elena Rostova',
    clientEmail: 'client@zaro.dev',
    freelancerName: 'Sarah Jenkins',
    freelancerEmail: 'sarah@zaro.dev',
    category: 'UI/UX & Web App',
    budget: 4200,
    paid: 4200,
    status: 'Under Review',
    progress: 95,
    deadline: '2026-08-30',
    description: 'Dynamic table-booking, WhatsApp order sync, and custom live order tracking dashboard.',
    milestones: [
      { name: 'Design System & Branding', amount: 1200, status: 'Completed' },
      { name: 'Interactive Menu & Cart', amount: 1800, status: 'Completed' },
      { name: 'WhatsApp & SMS Webhooks', amount: 1200, status: 'Completed' },
    ]
  },
  {
    id: 'PRJ-1084',
    title: 'AI Smart Inventory Analytics Dashboard',
    clientName: 'Horizon Corp',
    clientEmail: 'horizon@client.com',
    freelancerName: 'Marcus Sterling',
    freelancerEmail: 'freelancer@zaro.dev',
    category: 'Data & Dashboard',
    budget: 9500,
    paid: 9500,
    status: 'Completed',
    progress: 100,
    deadline: '2026-07-20',
    description: 'Predictive stock ordering intelligence platform with automated vendor replenishment triggers.',
    milestones: [
      { name: 'Predictive ML Model Endpoint', amount: 3500, status: 'Completed' },
      { name: 'Real-Time WebSockets UI', amount: 4000, status: 'Completed' },
      { name: 'Enterprise Cloud Deployment', amount: 2000, status: 'Completed' },
    ]
  },
  {
    id: 'PRJ-1085',
    title: 'Hyper-Local SEO & Geo-Targeted Marketing Hub',
    clientName: 'Elena Rostova',
    clientEmail: 'client@zaro.dev',
    freelancerName: 'Devon Miles',
    freelancerEmail: 'devon@zaro.dev',
    category: 'Digital Growth',
    budget: 2900,
    paid: 1000,
    status: 'In Progress',
    progress: 35,
    deadline: '2026-10-05',
    description: 'Google Business profile automation, localized schema generation, and review management system.',
    milestones: [
      { name: 'Schema Markup Setup', amount: 1000, status: 'Completed' },
      { name: 'Review Collector Widget', amount: 1000, status: 'In Progress' },
      { name: 'Local Citation Building', amount: 900, status: 'Pending' },
    ]
  }
];

const INITIAL_JOBS = [
  {
    id: 'JOB-301',
    title: 'Next.js E-Commerce Storefront with Sanity CMS',
    client: 'Nordic Living Co.',
    budget: '$4,500 - $6,000',
    type: 'Fixed Price',
    experience: 'Expert',
    proposals: 8,
    posted: '2 hours ago',
    tags: ['Next.js', 'Sanity CMS', 'Tailwind', 'Stripe'],
    description: 'We are seeking an experienced front-end developer to build a lightning-fast minimalist home decor storefront with seamless CMS management.'
  },
  {
    id: 'JOB-302',
    title: 'Real-Time WhatsApp CRM Webhook Integration',
    client: 'Aura Fitness Club',
    budget: '$2,800',
    type: 'Fixed Price',
    experience: 'Intermediate',
    proposals: 14,
    posted: '5 hours ago',
    tags: ['Node.js', 'WhatsApp API', 'Webhooks', 'PostgreSQL'],
    description: 'Build a multi-agent WhatsApp customer chat gateway that logs inquiries directly into our web dashboard.'
  },
  {
    id: 'JOB-303',
    title: 'Interactive 3D WebGL Product Showcase',
    client: 'Velocita Luxury Watches',
    budget: '$7,200 - $9,000',
    type: 'Fixed Price',
    experience: 'Expert',
    proposals: 5,
    posted: '1 day ago',
    tags: ['Three.js', 'WebGL', 'React Three Fiber', 'GSAP'],
    description: 'Create an ultra-luxurious 3D watch customizer allowing clients to select dials, bezels, and watch straps in real-time.'
  },
  {
    id: 'JOB-304',
    title: 'High-Converting Landing Page for SaaS Startup',
    client: 'Synthetix AI',
    budget: '$3,200',
    type: 'Fixed Price',
    experience: 'Intermediate',
    proposals: 19,
    posted: '1 day ago',
    tags: ['React', 'Framer Motion', 'Figma', 'SEO'],
    description: 'Convert Figma designs into an ultra-smooth, responsive landing page with micro-interactions and dark mode.'
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'conv-1',
    participant: {
      name: 'Marcus Sterling',
      role: 'Senior Full-Stack Freelancer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      online: true,
      lastSeen: 'Active now'
    },
    project: 'Luxury Boutique E-Commerce Redesign',
    messages: [
      { id: 1, sender: 'Marcus Sterling', text: 'Hi Elena! I have pushed the updated checkout prototype to the preview staging link.', time: '10:14 AM', isMe: false },
      { id: 2, sender: 'Elena Rostova', text: 'Fantastic Marcus! Testing the mobile drawer right now. It is extremely responsive.', time: '10:18 AM', isMe: true },
      { id: 3, sender: 'Marcus Sterling', text: 'Great! The Stripe sandbox keys are connected so you can run test card transactions freely.', time: '10:22 AM', isMe: false }
    ]
  },
  {
    id: 'conv-2',
    participant: {
      name: 'Sarah Jenkins',
      role: 'UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      online: false,
      lastSeen: '15m ago'
    },
    project: 'Gourmet Artisanal Cafe Landing',
    messages: [
      { id: 1, sender: 'Sarah Jenkins', text: 'The cafe table reservation animations are ready for final sign-off.', time: 'Yesterday', isMe: false },
      { id: 2, sender: 'Elena Rostova', text: 'Reviewing today with the cafe manager. Looks brilliant so far!', time: 'Yesterday', isMe: true }
    ]
  }
];

const INITIAL_PAYMENTS = [
  { id: 'INV-9021', project: 'Luxury Boutique E-Commerce Redesign', milestone: 'Frontend React Development', amount: 2400, fee: 72, date: '2026-08-12', status: 'Paid', method: 'Stripe Business Vault' },
  { id: 'INV-9020', project: 'Luxury Boutique E-Commerce Redesign', milestone: 'Wireframing & UI Kit Design', amount: 1800, fee: 54, date: '2026-08-02', status: 'Paid', method: 'Stripe Business Vault' },
  { id: 'INV-9019', project: 'Gourmet Artisanal Cafe Landing', milestone: 'Interactive Menu & Cart', amount: 1800, fee: 54, date: '2026-07-28', status: 'Paid', method: 'Corporate Visa ****8901' },
  { id: 'INV-9018', project: 'Gourmet Artisanal Cafe Landing', milestone: 'Design System & Branding', amount: 1200, fee: 36, date: '2026-07-15', status: 'Paid', method: 'Corporate Visa ****8901' },
  { id: 'INV-9017', project: 'AI Smart Inventory Analytics Dashboard', milestone: 'Full Escrow Settlement', amount: 9500, fee: 285, date: '2026-07-21', status: 'Paid', method: 'Direct Wire ACH' }
];

const INITIAL_USERS = [
  { id: 'USR-01', name: 'Elena Rostova', email: 'client@zaro.dev', role: 'client', status: 'Active', verified: true, spent: '$42,500', joined: '2026-01-14' },
  { id: 'USR-02', name: 'Marcus Sterling', email: 'freelancer@zaro.dev', role: 'freelancer', status: 'Active', verified: true, earned: '$68,500', rating: 4.98, joined: '2025-11-20' },
  { id: 'USR-03', name: 'Sarah Jenkins', email: 'sarah@zaro.dev', role: 'freelancer', status: 'Active', verified: true, earned: '$34,200', rating: 4.92, joined: '2026-02-01' },
  { id: 'USR-04', name: 'Horizon Corp (David Vance)', email: 'horizon@client.com', role: 'client', status: 'Active', verified: true, spent: '$29,000', joined: '2026-03-10' },
  { id: 'USR-05', name: 'Devon Miles', email: 'devon@zaro.dev', role: 'freelancer', status: 'Active', verified: false, earned: '$12,800', rating: 4.85, joined: '2026-04-18' },
  { id: 'USR-06', name: 'Alexander Vance', email: 'admin@zaro.dev', role: 'admin', status: 'Active', verified: true, access: 'Super Admin', joined: '2025-09-01' }
];

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('zaro_portal_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [role, setRole] = useState(() => {
    return currentUser?.role || localStorage.getItem('zaro_portal_role') || 'client';
  });

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('zaro_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('zaro_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('zaro_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });
  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('zaro_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('zaro_users_list');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Persist storage whenever collections change
  useEffect(() => {
    localStorage.setItem('zaro_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('zaro_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('zaro_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('zaro_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('zaro_users_list', JSON.stringify(usersList));
  }, [usersList]);

  // Initialize auth state on mount
  useEffect(() => {
    setLoading(false);
  }, []);

  // Quick 1-click Demo Login
  const loginAsDemo = (demoRole = 'client') => {
    const targetAccount = DEMO_ACCOUNTS[demoRole] || DEMO_ACCOUNTS.client;
    setCurrentUser(targetAccount);
    setRole(targetAccount.role);
    localStorage.setItem('zaro_portal_user', JSON.stringify(targetAccount));
    localStorage.setItem('zaro_portal_role', targetAccount.role);
    return targetAccount;
  };

  // Standard Login
  const login = async (email, password, desiredRole = 'client') => {
    const matchedUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    const resolvedRole = matchedUser ? matchedUser.role : desiredRole;
    
    const userObj = {
      uid: matchedUser ? matchedUser.id : `user-${Date.now()}`,
      email: email.toLowerCase(),
      displayName: matchedUser ? matchedUser.name : email.split('@')[0],
      role: resolvedRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      balance: 5000,
    };
    setCurrentUser(userObj);
    setRole(resolvedRole);
    localStorage.setItem('zaro_portal_user', JSON.stringify(userObj));
    localStorage.setItem('zaro_portal_role', resolvedRole);
    return userObj;
  };

  // Standard Sign Up
  const signup = async (email, password, displayName, assignedRole = 'client', extraInfo = {}) => {
    const newUser = {
      uid: `user-${Date.now()}`,
      email: email.toLowerCase(),
      displayName: displayName || email.split('@')[0],
      role: assignedRole,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${displayName || email}`,
      company: extraInfo.company || 'ZARO Member',
      title: extraInfo.title || 'Freelance Specialist',
      balance: 0,
    };
    setCurrentUser(newUser);
    setRole(assignedRole);
    localStorage.setItem('zaro_portal_user', JSON.stringify(newUser));
    localStorage.setItem('zaro_portal_role', assignedRole);

    // Add to users list
    setUsersList(prev => [
      {
        id: `USR-${Date.now().toString().slice(-4)}`,
        name: displayName || email.split('@')[0],
        email: email.toLowerCase(),
        role: assignedRole,
        status: 'Active',
        verified: false,
        joined: 'Today'
      },
      ...prev
    ]);
    return newUser;
  };

  // Google Sign-In
  const loginWithGoogle = async (preferredRole = 'client') => {
    return loginAsDemo(preferredRole);
  };

  // Switch Active Role for easy testing
  const switchRole = (newRole) => {
    setRole(newRole);
    if (currentUser) {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      localStorage.setItem('zaro_portal_user', JSON.stringify(updated));
      localStorage.setItem('zaro_portal_role', newRole);
    }
  };

  // Logout
  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('zaro_portal_user');
    localStorage.removeItem('zaro_portal_role');
  };

  // Data helpers
  const addProject = (projectData) => {
    const newPrj = {
      id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'In Progress',
      progress: 10,
      paid: 0,
      milestones: [{ name: 'Project Kickoff & Spec Alignment', amount: Math.round(projectData.budget * 0.3), status: 'In Progress' }],
      ...projectData
    };
    setProjects(prev => [newPrj, ...prev]);
    return newPrj;
  };

  const addJob = (jobData) => {
    const newJob = {
      id: `JOB-${Math.floor(300 + Math.random() * 700)}`,
      proposals: 0,
      posted: 'Just now',
      ...jobData
    };
    setJobs(prev => [newJob, ...prev]);
    return newJob;
  };

  const sendMessage = (convId, text) => {
    setMessages(prev =>
      prev.map(c => {
        if (c.id === convId) {
          const newMsg = {
            id: Date.now(),
            sender: currentUser?.displayName || 'Me',
            text,
            time: 'Just now',
            isMe: true
          };
          return { ...c, messages: [...c.messages, newMsg] };
        }
        return c;
      })
    );
  };

  const addPayment = (paymentData) => {
    const newPayment = {
      id: `INV-${Math.floor(9000 + Math.random() * 999)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      fee: Math.round(paymentData.amount * 0.03),
      ...paymentData
    };
    setPayments(prev => [newPayment, ...prev]);
    return newPayment;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isConfigured,
        loading,
        login,
        signup,
        loginAsDemo,
        loginWithGoogle,
        switchRole,
        logout,
        projects,
        setProjects,
        addProject,
        jobs,
        setJobs,
        addJob,
        messages,
        setMessages,
        sendMessage,
        payments,
        setPayments,
        addPayment,
        usersList,
        setUsersList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
