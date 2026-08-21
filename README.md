# ZARO — Full-Stack Web Application

A unified web application ecosystem featuring a high-conversion agency landing page, a dedicated Supabase-powered Login & Showcase page, a React Client & Freelancer Portal, and an Express.js REST API backend.

---

## ⚡ How to Run with VS Code "Go Live" Extension

1. Open this workspace in **VS Code**.
2. Click the **"Go Live"** button at the bottom right corner of VS Code (or right-click [`index.html`](file:///c:/Users/GOPIPRAKAN/OneDrive/Desktop/sample%20zaro/index.html) &rarr; **Open with Live Server**).
3. It will immediately open `http://127.0.0.1:5500/index.html`:
   - **Main Website**: Home page with ROI calculator, pricing, and dark/light themes.
   - **Login Page**: Click **Login** in the navbar to open the Supabase login experience (`login/index.html`).
   - **Logo Click**: In the login page, click the **ZARO** logo to return directly to the main website.

---

## ☁️ 1-Click Vercel Deployment

This project uses a **single root `package.json`** and [`vercel.json`](file:///c:/Users/GOPIPRAKAN/OneDrive/Desktop/sample%20zaro/vercel.json) to eliminate nested repository/framework warnings:

1. Push your code to your GitHub repo (`gopiprakan/zaro-web`).
2. In [Vercel Dashboard](https://vercel.com/new), import the repository as the **Root Project** (`./`).
3. Click **Deploy**.

- **`/`**: Main Agency Website
- **`/login`**: Supabase Login & Registration
- **`/portal`**: React Client & Freelancer Portal
- **`/api/*`**: Serverless Express Backend API

---

## 📁 Clean Repository Layout (Single Root Package)

```
sample zaro/
├── index.html                   # Main ZARO agency landing page (Go Live entrypoint)
├── style.css                    # CSS Design System
├── script.js                    # Dynamic scripts & Supabase session sync
├── ZARO_logo.png                # Brand logo asset
│
├── login/                       # Supabase Login & Artwork Showcase Page
│   ├── index.html               # Login & Registration UI
│   ├── style.css                # Dark cosmic design theme
│   ├── script.js                # Form validation, carousel & Supabase auth
│   ├── assets/                  # Artwork slides & creator avatars
│   └── src/supabaseClient.js    # Supabase Client connector
│
├── src/
│   └── supabaseClient.js        # Global Supabase client
│
├── portal/                      # React Client & Freelancer Portal (Source files)
│   ├── src/
│   ├── index.html
│   └── vite.config.js
│
├── backend/                     # Express REST API Backend (Source files)
│   ├── server.js
│   ├── routes/
│   └── data/
│
├── api/
│   └── index.js                 # Vercel Serverless Function entrypoint
│
├── vercel.json                  # Unified Vercel configuration
└── package.json                 # Single consolidated package.json
```

---

## 🛠️ Unified Terminal Commands

| Command | Action |
| :--- | :--- |
| `npm run dev` | Serves root website on `http://localhost:3000` |
| `npm run dev:portal` | Starts the React Portal dev server on `http://localhost:5173` |
| `npm run dev:backend` | Starts the Express API server on `http://localhost:5000` |
| `npm run build` | Builds the React portal production bundle from root |
