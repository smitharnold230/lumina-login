# Lumina Login - Full Stack Authentication App

A modern login/registration system with MongoDB and Docker.

## 🚀 Features

- Modern UI with Framer Motion animations
- MongoDB database with Docker
- JWT authentication
- User registration and login
- Password hashing with bcrypt
- TypeScript support

## 📋 Prerequisites

- Node.js (v16+)
- Docker Desktop
- npm or yarn

## 🛠️ Setup Instructions

### 1. Start MongoDB with Docker

```powershell
docker-compose up -d
```

This will start MongoDB on port 27017.

### 2. Install Dependencies

```powershell
npm install
```

### 3. Configure Environment

The `.env` file is already configured with:
- MongoDB connection string
- JWT secret
- API URL

**⚠️ Important:** Change the JWT_SECRET in production!

### 4. Run the Application

Run both frontend and backend:

```powershell
npm run dev:all
```

Or run them separately:

```powershell
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

## 🌐 Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017

### MongoDB Credentials

- Username: `admin`
- Password: `password123`
- Database: `lumina`

## 📡 API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `GET /api/health` - Health check

## 🗄️ Database Management

### View MongoDB Data

```powershell
docker exec -it lumina-mongodb mongosh -u admin -p password123 --authenticationDatabase admin
```

Then in MongoDB shell:

```javascript
use lumina
db.users.find()
```

### Stop MongoDB

```powershell
docker-compose down
```

### Reset Database

```powershell
docker-compose down -v
docker-compose up -d
```

## 🔒 Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Change default MongoDB credentials in production
- Change JWT_SECRET in production
- Use HTTPS in production

## 📦 Tech Stack

- **Frontend:** React, TypeScript, Vite, Framer Motion, TailwindCSS
- **Backend:** Express, TypeScript
- **Database:** MongoDB
- **Container:** Docker
- **Authentication:** JWT, bcrypt

## 🐛 Troubleshooting

**MongoDB connection failed:**
- Ensure Docker is running
- Check if port 27017 is available
- Run `docker-compose logs mongodb`

**Frontend can't connect to backend:**
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env

## 📝 License

MIT
