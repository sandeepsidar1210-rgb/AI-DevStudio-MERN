# AI-DevStudio: Intelligent Code & Content Analyzer

### Capstone Project — Full-Stack Developer Track (EduLinkUp Internship)

A MERN stack Micro-SaaS application that analyzes source code snippets and text content using the Gemini API — surfacing performance issues, security vulnerabilities, and SEO suggestions, backed by an analytics dashboard built on MongoDB aggregation pipelines.

---

## Live Demo

- **Frontend (App):** https://ai-dev-studio-mern.vercel.app
- **Backend (API):** https://ai-devstudio-mern.onrender.com

> Note: the backend runs on Render's free tier and spins down after inactivity. The first request after idle time may take 30–50 seconds to respond while the server wakes up.

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Recharts, Axios, React Router, lucide-react
- **Backend:** Node.js, Express.js (MVC structure)
- **Database:** MongoDB Atlas (Mongoose + aggregation pipelines)
- **AI Integration:** Google Gemini API (gemini-3.6-flash)
- **Auth:** JWT, bcrypt.js
- **Export:** html-to-image + jsPDF
- **Deployment:** Render (backend), Vercel (frontend), MongoDB Atlas (database)

---

## Features

- **Secure Authentication** — JWT-based register/login with protected routes
- **Code & Content Analyzer** — paste a code snippet or blog draft, get structured AI feedback:
  - Performance issues
  - Security vulnerabilities with threat level (Low/Medium/Critical)
  - SEO suggestions (for content)
  - Complexity & quality scores
- **Rate Limiting** — free tier capped at 3 analyses/day per user
- **Analytics Dashboard**
  - KPI summary cards (total scans, avg complexity, threats found, tokens used)
  - Language distribution (pie chart)
  - Threat level breakdown (bar chart)
  - Complexity & token usage trend over time (line chart)
  - Date range and language filters, backed by MongoDB aggregation pipelines
  - Toggleable/customizable chart widgets
  - Export dashboard as PDF or PNG image
- **Modern, consistent UI** — shared navbar, polished auth screens, and a unified dark theme across every page

---

## Project Status

**All core and capstone-required features implemented and deployed.**

| Feature | Status |
|---|---|
| Project scaffolding (backend/frontend structure) | Done |
| MongoDB Atlas connection | Done |
| JWT authentication (register/login) | Done |
| Gemini API integration (code + content analysis) | Done |
| Rate limiting (free tier usage caps) | Done |
| MongoDB aggregation pipelines (analytics) | Done |
| Analytics dashboard (charts + KPIs) | Done |
| Date/language filters | Done |
| Customizable/toggleable widgets | Done |
| PDF/Image export | Done |
| Modern UI overhaul (navbar, auth, analyzer, dashboard) | Done |
| Deployment (Render + Vercel) | Done |
| Project report | Done |
| Demo video | In progress |

---

## Directory Structure

```text
AI-DevStudio-MERN/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Route logic (auth, analysis, analytics)
│   │   ├── middleware/      # Auth guard, rate limiter
│   │   ├── models/          # Mongoose schemas (User, Analysis)
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Gemini LLM integration
│   │   ├── utils/           # Prompt templates
│   │   └── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/       # Navbar, ProtectedRoute
        ├── pages/            # Login, Register, Dashboard, Analyzer, AnalyticsDashboard
        ├── context/          # AuthContext
        ├── hooks/            # useAuth
        └── services/         # Axios instance
```

---

## Setup (Local Development)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Environment variables required (`backend/.env`):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Environment variables required (`frontend/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/analysis` | Submit code/content for AI analysis (rate-limited) |
| GET | `/api/analysis` | Get analysis history |
| GET | `/api/analytics/summary` | KPI summary (supports date/language filters) |
| GET | `/api/analytics/language-distribution` | Language breakdown |
| GET | `/api/analytics/threat-levels` | Threat level breakdown |
| GET | `/api/analytics/trend` | Complexity/token trend over time |

---

## Project Report

A detailed project report (architecture, MongoDB aggregation strategy, Gemini integration, visualization design, widget system, security, deployment, and lessons learned) is included in this repository as `AI-DevStudio-Capstone-Report.docx`.

---

*Built as part of the EduLinkUp Full-Stack Internship capstone submission.*