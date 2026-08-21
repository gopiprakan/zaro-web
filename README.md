# ZARO — Full-Stack Web Application

A modern web application ecosystem featuring a high-conversion agency landing page, a React-powered Client & Freelancer Portal, and an Express.js REST API backend.

---

## ☁️ 1-Click Vercel Deployment (Unified Full-Stack App)

This repository is pre-configured with [`vercel.json`](file:///c:/Users/GOPIPRAKAN/OneDrive/Desktop/sample%20zaro/vercel.json) and [`api/index.js`](file:///c:/Users/GOPIPRAKAN/OneDrive/Desktop/sample%20zaro/api/index.js) so Vercel deploys the **entire full-stack application as a single unified project**:

- **Root URL (`/`)**: Main Agency Landing Page (`index.html`, `style.css`, `script.js`)
- **Portal URL (`/portal`)**: Client, Freelancer & Admin React Portal
- **API Endpoints (`/api/*`)**: Serverless Express REST API Backend

### How to Deploy to Vercel:
1. Push your changes to your GitHub repository (`gopiprakan/zaro-web`).
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import the repository (`gopiprakan/zaro-web`) as the **Root Project** (leave root directory as `./`).
4. Click **Deploy** — Vercel will automatically build the portal and deploy the landing page + serverless backend in one go!

---

## 📁 Project Architecture

```
sample zaro/
├── api/
│   └── index.js                 # Vercel Serverless Function entrypoint
├── frontend/
│   ├── index.html               # Main ZARO agency landing page
│   ├── style.css                # Custom responsive CSS design system
│   ├── script.js               # Dynamic interactions, ROI calculator, session engine
│   ├── ZARO_logo.png           # Brand logo asset
│   └── portal/                  # React + Vite Client & Freelancer Portal
│       ├── src/                 # React components, pages, context
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
├── backend/
│   ├── server.js                # Express REST API entry point (local dev)
│   ├── package.json             # Backend dependencies (express, cors, dotenv, morgan)
│   ├── .env                     # Server environment configuration
│   ├── routes/                  # API routes (auth, projects, orders, users, contact)
│   ├── controllers/             # Request handlers and business logic
│   └── data/                    # JSON database store & helpers
│
├── vercel.json                  # Vercel unified routing and build configuration
└── package.json                 # Unified root orchestration scripts
```

---

## 🚀 Quick Start Commands (Local Development)

### 1. Run the Main Landing Page (Frontend)
```bash
npm run dev:frontend
# Serves frontend on http://localhost:3000
```

### 2. Run the Client & Freelancer Portal (React App)
```bash
npm run dev:portal
# Starts Vite dev server on http://localhost:5173
```

### 3. Run the Backend REST API (Express Server)
```bash
npm run dev:backend
# Starts Express API server on http://localhost:5000
```

---

## 📡 Backend API Endpoints

- **Health Check**: `GET /api/health`
- **Authentication**:
  - `POST /api/auth/login` — Email/password login
  - `POST /api/auth/signup` — New account registration
  - `POST /api/auth/demo-login` — Instant 1-click role demo login
  - `GET /api/auth/me?email=...` — Fetch current user profile
- **Projects**:
  - `GET /api/projects` — List all projects (filterable by email/role)
  - `GET /api/projects/:id` — Get project details & milestones
  - `POST /api/projects` — Create a new project
  - `PATCH /api/projects/:id/status` — Update project status and progress
- **Storefront Orders**:
  - `GET /api/orders` — List storefront orders
  - `POST /api/orders` — Create a new storefront order
- **Users**:
  - `GET /api/users` — List platform users
  - `GET /api/users/:id` — Get user profile
  - `PATCH /api/users/:id` — Update user profile
- **Contact & Inquiries**:
  - `POST /api/contact` — Submit design quote inquiry
  - `GET /api/contact` — View inquiry submissions
