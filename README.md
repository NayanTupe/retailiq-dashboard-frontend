# 🚀 RetailIQ — AI SaaS Analytics Dashboard (Frontend)

## Local setup (works on any device)

Prerequisites: Git and Node.js 20.19 or newer.

```bash
git clone https://github.com/NayanTupe/retailiq-dashboard-frontend.git
cd retailiq-dashboard-frontend
npm ci
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` in `.env` to the backend URL you want to use. For the
deployed frontend, add the same variable in Vercel. Never commit `.env`; only
`.env.example` belongs in Git.

Before pushing changes, run:

```bash
npm run lint
npm run build
```

![React](https://img.shields.io/badge/React-Frontend-blue)
![Vite](https://img.shields.io/badge/Vite-Tooling-purple)
![Status](https://img.shields.io/badge/Project-Production%20UI-brightgreen)
![API](https://img.shields.io/badge/Backend-FastAPI-green)

---

# 🌐 LIVE DEMO

## 💻 Frontend (Vercel)
👉 https://retailiq-dashboard-frontend.vercel.app/

## 🚀 Backend API
👉 https://retailiq-api-yzso.onrender.com

---

# 🔥 PROJECT OVERVIEW

RetailIQ Frontend is a **modern SaaS analytics dashboard UI** built with React that visualizes AI-powered business insights.

It connects to a FastAPI backend and displays:

- Customer churn analytics
- Revenue insights
- Customer segmentation
- ML prediction results
- Interactive dashboard UI

---

# ⚙️ TECH STACK

- React.js (Vite)
- Axios (API calls)
- Framer Motion (animations)
- Recharts / Plotly (charts)
- CSS (Glassmorphism UI)
- FastAPI (backend integration)

---

# 🎯 FEATURES

## 📊 Dashboard
- Real-time KPIs
- Revenue tracking
- Customer metrics

## 📈 Analytics Pages
- Churn analysis
- Customer segmentation
- Membership insights

## 🔮 ML Prediction UI
- User input form
- Real-time churn prediction
- Risk level visualization

## 🎨 UI/UX
- Glassmorphism design
- Modern SaaS look
- Responsive layout
- Smooth animations

---

# 🧠 ARCHITECTURE
React Frontend (Vercel)
↓
FastAPI Backend (Render)
↓
Machine Learning Model


---

# 📁 PROJECT STRUCTURE
src/
├── api/ (axios client)
├── components/
├── pages/
│ ├── Dashboard.jsx
│ ├── Segments.jsx
│ ├── Prediction.jsx
│ ├── ChurnAnalytics.jsx
├── layout/
├── styles/
├── App.jsx
└── main.jsx

API INTEGRATION

Frontend communicates with backend using:

baseURL: "https://retailiq-api-yzso.onrender.com"

💡 KEY HIGHLIGHTS
Fully responsive SaaS dashboard
Real-time API integration
Modern UI (Streamlit-like experience in React)
Production deployment ready
Clean component architecture

🚀 FUTURE IMPROVEMENTS
Auth system (Login/Signup)
Role-based dashboard
Dark/Light theme toggle
Real-time WebSocket updates
AI chatbot assistant
👨‍💻 AUTHOR

Nayan Tupe
