<div align="center">

# ⚽ Equipes Server — Full-Stack Docker Platform

<p align="center">
  <strong>A production-grade, fully containerized Node.js + React microservices platform</strong><br/>
  featuring JWT authentication, MongoDB data persistence, Redis caching, and a modern React dashboard.
</p>

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Nginx](https://img.shields.io/badge/Nginx-Gateway-009639?style=for-the-badge&logo=nginx&logoColor=white)](https://nginx.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<br/>

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Services](#-services)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Run with Docker Compose](#run-with-docker-compose)
  - [Run Locally (Development)](#run-locally-development)
- [API Reference](#-api-reference)
  - [Team Server (Port 4000)](#team-server--port-4000)
  - [Auth Server (Port 3000)](#auth-server--port-3000)
- [Frontend Dashboard](#-frontend-dashboard)
- [Tech Stack](#-tech-stack)
- [Security](#-security)

---

## 🌐 Overview

**Equipes Server** is a full-stack containerized application built as a practical demonstration of modern microservices architecture. It exposes two independent Express REST API services and a React frontend dashboard to interact with them all from one control panel.

| Feature | Detail |
|---|---|
| 🔐 **Authentication** | JSON Web Tokens (JWT) with bcrypt password hashing |
| ⚽ **Teams CRUD** | Full Create / Read / Update / Delete operations on football clubs |
| ⚡ **Redis Caching** | In-memory key-value caching with live demonstration |
| 🍃 **MongoDB Persistence** | Mongoose-powered database with retry connection logic |
| 🎛️ **React Dashboard** | Modular React 19 app with React Router DOM and premium glassmorphic UI |
| 🐳 **Fully Dockerized** | One command to spin up all 7 containers |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                         │
└───────────────────────────────┬─────────────────────────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                      │
         ▼                      ▼                      ▼
  ┌─────────────┐      ┌──────────────┐      ┌──────────────────┐
  │  React App  │      │    Nginx     │      │   Auth Server    │
  │  :5173      │      │  Gateway     │      │   (server.js)    │
  │  (frontend) │      │  :8080       │      │   :3000          │
  └─────────────┘      └──────┬───────┘      └────────┬─────────┘
                              │                       │
                              ▼                       │ JWT
                      ┌──────────────┐               │
                      │  Team Server │               │
                      │  (index.js)  │               │
                      │  :4000       │               │
                      └──────┬───────┘               │
                             │                       │
              ┌──────────────┴──────────────┐        │
              ▼                             ▼        │
       ┌────────────┐               ┌────────────┐   │
       │  MongoDB   │               │   Redis    │   │
       │  :27017    │               │  Cache     │   │
       │            │               │  :6379     │   │
       └────────────┘               └────────────┘   │
              │                                      │
              ▼                                      │
       ┌──────────────┐                              │
       │ Mongo Express │◄────────────────────────────┘
       │   :8081       │  (DB Admin UI)
       └───────────────┘
```

---

## 🐳 Services

All services are orchestrated by a single `docker-compose.yml` file:

| Container | Image | Port | Description |
|---|---|---|---|
| `equipe-app-container` | Custom (Node 20) | `4000` | Team Server — handles football clubs CRUD + Redis + MongoDB |
| `auth-server-container` | Custom (Node 20) | `3000` | Auth Server — handles user registration, login, and JWT |
| `equipe-frontend-container` | Custom (Nginx + Vite build) | `5173` | React Dashboard UI |
| `mongo-container` | `mongo` | `27017` (internal) | MongoDB database engine |
| `mongo-express-container` | `mongo-express` | `8081` | Web-based MongoDB admin panel |
| `redis-container` | `redis` | `6379` (internal) | Redis in-memory cache |
| `nginx-container` | `nginx` | `8080` | Reverse proxy gateway to Team Server |

---

## 📁 Project Structure

```
Docker/
├── 📄 Dockerfile               # Main Node.js image (Team + Auth servers)
├── 📄 docker-compose.yml       # Orchestrates all 7 services
├── 📄 package.json             # Root Node.js dependencies
├── 📄 .env                     # Environment variables (JWT secret, ports, etc.)
├── 📄 equipe.json              # Seed data for football clubs
│
├── 📂 src/
│   ├── 📄 index.js             # Team Server (Port 4000) — MongoDB + Redis
│   ├── 📄 server.js            # Auth Server (Port 3000) — JWT authentication
│   ├── 📄 test-api.js          # Manual API testing script
│   └── 📂 middleware/
│       └── 📄 auth.js          # JWT Bearer token verification middleware
│
├── 📂 nginx/
│   └── 📄 default.conf         # Nginx reverse proxy configuration
│
└── 📂 frontend/                # React 19 + Vite dashboard
    ├── 📄 Dockerfile           # Multi-stage build → Nginx server
    ├── 📄 nginx.conf           # Nginx config for SPA routing fallback
    ├── 📄 index.html
    ├── 📄 package.json
    └── 📂 src/
        ├── 📄 main.jsx         # Entry point — BrowserRouter wrapper
        ├── 📄 App.jsx          # Layout shell — Routes switcher
        ├── 📄 index.css        # Global design tokens & base styles
        ├── 📄 App.css          # Dashboard component styles
        ├── 📂 components/
        │   ├── 📄 Navbar.jsx           # Navigation with NavLink active states
        │   └── 📄 StatusIndicator.jsx  # Live backend connection status
        └── 📂 pages/
            ├── 📄 Dashboard.jsx   # Architecture overview page (route: /)
            ├── 📄 AuthPage.jsx    # Login / Register / Profile (route: /auth)
            ├── 📄 TeamsPage.jsx   # Teams CRUD manager (route: /teams)
            └── 📄 RedisPage.jsx   # Redis cache demo (route: /redis)
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed on your machine:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (v20+)
- [Docker Compose](https://docs.docker.com/compose/) (included with Docker Desktop)
- [Node.js 20+](https://nodejs.org/) *(only required for local development)*

---

### Environment Variables

The `.env` file at the root of the project holds the configuration:

```env
PORT=4000               # Team Server port
PORT_SERVER=3000        # Auth Server port
NODE_ENV=development

JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=1h
```

> ⚠️ **Important**: For production, replace `JWT_SECRET` with a strong, randomly generated key (minimum 256-bit entropy). Never commit your `.env` file to version control.

---

### Run with Docker Compose

**Step 1 — Clone the repository:**
```bash
git clone <your-repo-url>
cd Docker
```

**Step 2 — Launch all containers:**
```bash
docker-compose up --build
```

That's it! 🎉 All 7 services will start automatically in the correct order.

**Step 3 — Access the applications:**

| Service | URL |
|---|---|
| 🎛️ React Dashboard | http://localhost:5173 |
| ⚽ Team API | http://localhost:4000 |
| 🔐 Auth API | http://localhost:3000 |
| 🗄️ Mongo Express | http://localhost:8081 |
| 🔁 Nginx Gateway | http://localhost:8080 |

**Stop all services:**
```bash
docker-compose down
```

**Stop and remove all data volumes:**
```bash
docker-compose down -v
```

---

### Run Locally (Development)

You can also run the servers locally without Docker, though MongoDB and Redis will need to be available:

```bash
# Install dependencies
npm install

# Run the Team Server (Port 4000)
npm run dev

# In a second terminal — Run the Auth Server (Port 3000)
npm run dev-server

# Run the React frontend (third terminal)
cd frontend
npm install
npm run dev
```

Access the dashboard at **http://localhost:5173**

> **Note:** When running locally, the MongoDB connection string uses `mongo` as the host (Docker internal hostname). Update `DB_HOST` in `src/index.js` to `localhost` for local development.

---

## 📡 API Reference

### Team Server · Port 4000

Base URL: `http://localhost:4000`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/equipes` | Get all football clubs |
| `GET` | `/equipes/:id` | Get a single club by ID |
| `POST` | `/equipes` | Add a new football club |
| `PUT` | `/equipes/:id` | Update a club's country |
| `DELETE` | `/equipes/:id` | Delete a club by ID |
| `GET` | `/` | Trigger Redis cache write (`Products` key) |
| `GET` | `/data` | Read `Products` key from Redis cache |

**Example — Add a team:**
```bash
curl -X POST http://localhost:4000/equipes \
  -H "Content-Type: application/json" \
  -d '{"id": 6, "name": "Chelsea", "country": "Angleterre"}'
```

---

### Auth Server · Port 3000

Base URL: `http://localhost:3000`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/register` | ❌ Public | Register a new user account |
| `POST` | `/api/login` | ❌ Public | Sign in and receive a JWT token |
| `GET` | `/api/profile` | ✅ Bearer Token | Get the authenticated user's profile |
| `POST` | `/api/refresh-token` | ✅ Bearer Token | Refresh and receive a new JWT token |
| `GET` | `/api/admin/users` | ✅ Admin Only | List all registered users |

**Example — Register a user:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@exemple.com", "password": "123456"}'
```

**Example — Login and save token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@exemple.com", "password": "123456"}' | jq -r .token)
```

**Example — Access protected profile:**
```bash
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Admin access** requires logging in with `admin@exemple.com`. The admin route `/api/admin/users` will return a list of all registered accounts.

---

## 🎛️ Frontend Dashboard

The React dashboard is built with **React 19**, **React Router DOM**, and a custom glassmorphic dark theme. It provides a visual interface to interact with all backend services.

### Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Overview Dashboard | Architecture diagram and service descriptions |
| `/auth` | Auth Center | Register, login, view JWT profile, admin panel |
| `/teams` | Teams Manager | Full CRUD operations on football clubs via MongoDB |
| `/redis` | Redis Cache Demo | Trigger write/read operations on the Redis cache |

### Key Features

- 🟢 **Live Service Status** — Animated indicators ping backends and report online/offline status in real time
- 🔐 **JWT Persistence** — Tokens are stored in `localStorage` and automatically re-validated on page load
- 👑 **Admin Panel** — An exclusive users list panel unlocks automatically when `admin@exemple.com` is logged in
- 📊 **Teams CRUD Table** — Edit country inline, add new clubs, or delete entries with immediate visual feedback
- ⚡ **Redis Live Console** — Visual HTML response preview of cache reads from the Redis backend

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router DOM, Vite 8, Vanilla CSS |
| **Team Backend** | Node.js 20, Express 5, Mongoose, Redis Client |
| **Auth Backend** | Node.js 20, Express 5, JWT (`jsonwebtoken`), bcryptjs |
| **Database** | MongoDB (via Docker), Mongoose ODM |
| **Cache** | Redis (via Docker), `redis` npm client |
| **Containerization** | Docker, Docker Compose |
| **Gateway/Proxy** | Nginx (reverse proxy + SPA static file server) |
| **Dev Tooling** | Nodemon, dotenv |

---

## 🔒 Security

- **Password Hashing**: All user passwords are hashed using `bcryptjs` with a cost factor of **10 salt rounds** before being stored. Plain-text passwords are never persisted.
- **JWT Signing**: Tokens are signed using **HS256** with a configurable `JWT_SECRET`. Tokens expire after the `JWT_EXPIRES_IN` window (default: 1 hour).
- **Protected Routes**: The `authMiddleware` in [`src/middleware/auth.js`](./src/middleware/auth.js) validates the `Authorization: Bearer <token>` header on every protected endpoint.
- **CORS**: Both servers apply a custom CORS middleware allowing cross-origin requests from the React frontend during development.

> 🚨 **Production Checklist**: Before deploying to production, rotate the `JWT_SECRET`, restrict CORS origins, add HTTPS via a reverse proxy, and replace the in-memory user store (`usersDB`) with a proper persistent database.

---

<div align="center">

Made with ❤️ using Node.js, React, Docker, MongoDB, Redis & Nginx

</div>
