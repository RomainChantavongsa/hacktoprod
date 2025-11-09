# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HackToGone3Contrees is a **SaaS platform for connecting transporters and shippers** (donneurs d'ordre). It's a full-stack application with React (frontend), Node.js/Express (backend), and PostgreSQL (database). The project is containerized with Docker and supports cross-platform development (Windows, Linux, macOS).

### Business Model
- **Transporteurs** (Truckers): Browse transport offers, submit bids
- **Donneurs d'ordre** (Shippers): Post transport offers, receive and accept bids
- **Core Features**: JWT auth, real-time notifications (Twilio), voice assistant (ElevenLabs)

## Development Commands

### Quick Start
```bash
# Setup environment (copies .env.example to .env)
make setup

# Start all services (backend, frontend, database)
make start

# View logs
make logs

# Stop services
make stop
```

### Development Without Docker
```bash
# Backend development
cd backend && npm install && npm run dev

# Frontend development
cd frontend && npm install && npm run dev
```

### Testing and Building
```bash
# Frontend
cd frontend
npm run build    # Production build
npm run lint     # Lint code

# Backend
cd backend
npm run dev      # Development mode with nodemon
```

### Database Operations
```bash
# Connect to PostgreSQL shell
make db-shell

# Backup database
make db-backup

# Restore database
make db-restore FILE=backup.sql
```

## Architecture

### Stack
- **Frontend**: React 19 + Vite 7 + ESLint
- **Backend**: Node.js + Express 5 + JWT authentication
- **Database**: PostgreSQL 15 (Alpine)
- **Infrastructure**: Docker Compose with multi-container orchestration

### Service Communication
- Services communicate via Docker's bridge network (`app-network`)
- Frontend connects to backend via `VITE_API_URL` environment variable
- Backend connects to database via `DATABASE_URL` (format: `postgres://user:pass@db:5432/dbname`)
- Database service named `db` is referenced in connection strings (not `localhost`)

### Backend Structure
```
backend/
├── server.js              # Express app entry point
├── config/
│   ├── index.js          # Centralized environment config
│   └── database.js       # PostgreSQL connection pool setup
└── utils/
    └── jwt.js            # JWT utilities
```

**Key Backend Patterns:**
- All environment variables centralized in `config/index.js`
- Database connection uses pg Pool with error handling and connection events
- JWT configuration includes 24h expiration by default
- Server runs on port from `PORT` env variable (default: 3001)

### Frontend Structure
```
frontend/src/
├── components/
│   ├── common/           # Reusable components (Button, Input, Card, Navbar, Loading)
│   ├── transporteur/     # Transporter-specific components
│   └── donneur/          # Shipper-specific components
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── Login.jsx         # Login page
│   ├── Register.jsx      # Registration with user type selection
│   ├── DashboardTransporteur.jsx  # Transporter dashboard (view offers, submit bids)
│   └── DashboardDonneur.jsx       # Shipper dashboard (create/manage offers)
├── contexts/
│   └── AuthContext.jsx   # Authentication context with login/register/logout
├── services/
│   └── api.js            # Axios-based API service with interceptors
├── hooks/                # Custom React hooks
└── utils/                # Utility functions
```

**Key Frontend Patterns:**
- **TailwindCSS** for styling with custom primary color palette
- **React Router v6** for navigation with PrivateRoute protection
- **Axios** for API calls with JWT token interceptor in `localStorage`
- **React Toastify** for notifications
- **Component architecture**: Reusable common components, page-specific logic in pages
- **Auth flow**: AuthContext provides `user`, `login`, `register`, `logout` methods
- **Dashboard routing**: Automatic redirect based on `user.user_type` (transporteur/donneur)
- Vite dev server runs on port 3000 with host 0.0.0.0 for Docker compatibility
- API calls use `import.meta.env.VITE_API_URL` (default: http://localhost:3001/api)

## Environment Configuration

### Critical Environment Variables
- `DATABASE_URL`: Must use service name `db` not `localhost` (e.g., `postgres://user:pass@db:5432/dbname`)
- `JWT_SECRET`: Should be strong random string (64 chars recommended)
- `VITE_API_URL`: Frontend must point to backend (e.g., `http://localhost:3001`)
- `PORT` / `BACKEND_PORT`: Backend server port
- `FRONTEND_PORT`: Frontend dev server port

### External Services
The project includes configuration for:
- **Twilio**: SMS/communication services (via `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`)
- **AWS S3**: File storage (via `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME`, `AWS_REGION`)

Configuration is centralized in `backend/config/index.js`.

## Docker Architecture

### Service Dependencies
- `backend` depends on `db` (database must start first)
- `frontend` depends on `backend`
- All services share `app-network` bridge network

### Volume Mounts
- Backend code mounted at `/usr/src/app` with `node_modules` volume
- Frontend code mounted at `/app` with `node_modules` volume
- PostgreSQL data persisted in `postgres_data` named volume

### Hot Reloading
Both frontend and backend support hot-reloading:
- Backend uses nodemon
- Frontend uses Vite's built-in HMR
- Code changes reflect immediately without rebuild

## Common Issues

### Port Conflicts
If services fail to start, check for port conflicts:
```bash
# Linux/macOS
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :5432

# Windows
netstat -ano | findstr :3000
```

### Database Connection Errors
- Ensure `DATABASE_URL` uses `db` hostname (Docker service name), not `localhost`
- Check that database container is running: `docker-compose ps`
- View database logs: `make logs-db`

### Changes Not Reflecting
If code changes don't appear:
```bash
make rebuild    # Full rebuild without cache
```

### Complete Reset
To reset everything including database:
```bash
make clean    # WARNING: Deletes all data
make start
```

## Security Notes

- **Never commit `.env` file** - it's gitignored and contains secrets
- Use `.env.example` as template for environment variables
- Generate strong JWT secrets (use `openssl rand -base64 64` or similar)
- In production, use Docker Secrets or external secret management (e.g., HashiCorp Vault)
- PostgreSQL SSL is disabled in development, enabled in production (see `backend/config/database.js`)

## Cross-Platform Support

The project includes platform-specific scripts:
- **Windows**: `*.bat`, `*.ps1` scripts
- **Linux/macOS**: `*.sh` scripts
- **Universal**: Makefile works on all platforms

When adding shell commands, test on multiple platforms or use Make targets which handle cross-platform compatibility.
