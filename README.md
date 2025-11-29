# Lumina Login - Microservices Architecture

A modern full-stack authentication system built with microservices architecture using Docker.

## 📁 Project Structure

```
lumina-login/
├── frontend/              # React frontend service
│   ├── components/        # React components
│   ├── services/          # API services
│   ├── Dockerfile         # Frontend container config
│   ├── nginx.conf         # Nginx configuration
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
│
├── backend/              # Express backend service
│   ├── server/           # Backend source code
│   │   ├── routes/       # API routes
│   │   └── types/        # TypeScript types
│   ├── Dockerfile        # Backend container config
│   └── package.json      # Backend dependencies
│
├── database/             # MongoDB configuration
│   └── mongo-init.js     # Database initialization
│
└── docker-compose.yml    # Orchestration configuration
```

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite (Nginx) - Port 80
- **Backend**: Express + Node.js - Port 5000
- **Database**: MongoDB - Port 27017

All services communicate through a Docker network.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Docker Compose

### Run Everything

```powershell
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
```

## 🛠️ Development Setup

### Frontend Development
```powershell
cd frontend
npm install
npm run dev
# Access at http://localhost:3000
```

### Backend Development
```powershell
cd backend
npm install
npm run dev
# API at http://localhost:5000
```

## 📦 Docker Commands

### Build Individual Services
```powershell
# Build frontend
docker build -t lumina-frontend ./frontend

# Build backend
docker build -t lumina-backend ./backend
```

### Manage Services
```powershell
# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart backend

# View service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs database
```

## 🌐 API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/health` - Backend health check

## 🔒 Environment Variables

### Frontend
```
VITE_API_URL=http://localhost:5000
```

### Backend
```
MONGODB_URI=mongodb://admin:password123@database:27017/lumina
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

## 🗑️ Cleanup

```powershell
# Stop and remove everything
docker-compose down -v

# Remove all images
docker-compose down --rmi all
```

## 🎨 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Framer Motion, Nginx
- **Backend**: Node.js, Express 5, TypeScript, JWT, bcrypt
- **Database**: MongoDB 7
- **DevOps**: Docker, Docker Compose

---

Built with ❤️ using Docker microservices architecture
