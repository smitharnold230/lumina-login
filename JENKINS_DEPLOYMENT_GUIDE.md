# Lumina Login - Jenkins Pipeline Deployment Guide

## Overview

Three independent Jenkins pipelines handle deployment of **Backend**, **Frontend**, and **Database** services without using a shared Docker network. Services communicate via **host IP addresses** and port bindings.

---

## Architecture Without Shared Network

### Communication Pattern
- **Frontend** → connects to Backend via `http://{BACKEND_HOST}:{BACKEND_PORT}`
- **Backend** → connects to Database via `mongodb://{DB_HOST}:{DB_PORT}`
- All containers expose ports to the **Docker host** (your Jenkins server)
- Services use **host machine IP** (typically `172.17.0.1` for Docker on Windows/Mac)

### Deployment Order
1. **Database** (must start first)
2. **Backend** (depends on Database)
3. **Frontend** (depends on Backend)

---

## Jenkins Pipeline Setup

### Prerequisites

#### 1. Install Required Jenkins Plugins
- **Git Plugin** (for checkout)
- **Docker Pipeline** (for Docker commands)
- **Pipeline** (if not already installed)

#### 2. Configure Jenkins Credentials

**For MongoDB Root Password:**
1. Go to **Manage Jenkins** → **Manage Credentials**
2. Click **Add Credentials**
3. Create a **Secret text** credential:
   - ID: `mongo-root-password`
   - Secret: `strongpassword123` (or your secure password)

**For JWT Secret:**
1. Create another **Secret text** credential:
   - ID: `jwt-secret-key`
   - Secret: `your_very_long_and_secure_jwt_secret_key_here_12345`

#### 3. Ensure Docker/Docker-Compose Available
```powershell
docker --version
docker-compose --version
```

---

## Pipeline Files Created

### 1. **backend/Jenkinsfile.backend**
**Purpose:** Builds and deploys Backend Express service

**Environment Variables:**
- `NODE_ENV=production`
- `PORT=5000`
- `MONGODB_URI=mongodb://admin:strongpassword123@{MONGODB_HOST}:27017/lumina?authSource=admin`
- `JWT_SECRET` (from credentials)

**Parameters:**
- `BRANCH_TO_BUILD` (main/prod)
- `MONGODB_HOST` (default: 172.17.0.1)
- `MONGODB_PORT` (default: 27017)

**Stages:**
1. Initialization (logging)
2. Checkout Backend code
3. Validate Docker
4. Remove existing container
5. Build Docker image
6. Run container
7. Health check (`/api/health`)
8. Log collection

---

### 2. **frontend/Jenkinsfile.frontend**
**Purpose:** Builds and deploys React + Nginx frontend

**Environment Variables:**
- `NODE_ENV=production`
- `VITE_API_URL=http://{BACKEND_HOST}:5000`

**Parameters:**
- `BRANCH_TO_BUILD` (main/prod/prod.1.0)
- `BACKEND_HOST` (default: 172.17.0.1)
- `BACKEND_PORT` (default: 5000)

**Stages:**
1. Initialization
2. Checkout Frontend code
3. Validate Docker
4. Remove existing container
5. Build Docker image
6. Run container
7. Health check (port 80)
8. Log collection

---

### 3. **database/Jenkinsfile.database**
**Purpose:** Deploys MongoDB with initialization

**Environment Variables:**
- `MONGO_INITDB_ROOT_USERNAME=admin`
- `MONGO_INITDB_ROOT_PASSWORD` (from credentials)
- `MONGO_INITDB_DATABASE=lumina`

**Parameters:**
- `BRANCH_TO_BUILD` (main/prod)

**Stages:**
1. Initialization
2. Checkout Database code
3. Validate Docker
4. Remove existing container
5. Run container
6. Health check (mongosh ping)
7. Verify collections
8. Log collection

---

## Running the Pipelines

### Step 1: Create Pipeline Jobs in Jenkins

**For each service (Database, Backend, Frontend):**

1. In Jenkins, click **New Item**
2. Enter job name: `lumina-{database|backend|frontend}`
3. Select **Pipeline**
4. Click **OK**
5. Under **Pipeline** section:
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** `https://github.com/smitharnold230/lumina-login.git`
   - **Branch:** `*/main` (or your default)
   - **Script Path:** `{database|backend|frontend}/Jenkinsfile.{database|backend|frontend}`
6. Click **Save**

---

### Step 2: Run Pipelines in Order

**Option A: Manual Trigger**
1. Go to `lumina-database` job → **Build with Parameters**
   - Select `main` branch → **Build**
2. Wait for success ✓
3. Go to `lumina-backend` job → **Build with Parameters**
   - Select `main` branch
   - `MONGODB_HOST`: `172.17.0.1` (or actual Jenkins host IP)
   - **Build**
4. Wait for success ✓
5. Go to `lumina-frontend` job → **Build with Parameters**
   - Select `main` branch
   - `BACKEND_HOST`: `172.17.0.1`
   - **Build**

**Option B: Build Automation (Optional)**
Add post-success triggers in Jenkins:
- Database → triggers Backend (when successful)
- Backend → triggers Frontend (when successful)

---

## Post-Deployment Validation

### 1. Verify Containers Running
```powershell
docker ps -a
# Look for: lumina-database, lumina-backend, lumina-frontend
```

### 2. Check Container Health
```powershell
# Database
docker logs lumina-database | tail -20

# Backend
docker logs lumina-backend | tail -20
curl http://localhost:5000/api/health

# Frontend
docker logs lumina-frontend | tail -20
curl http://localhost
```

### 3. Verify Services Can Communicate

**From Jenkins Server:**
```powershell
# Test Backend → Database connection
docker exec lumina-backend curl http://172.17.0.1:27017

# Test Frontend → Backend API
docker exec lumina-frontend curl http://172.17.0.1:5000/api/health
```

### 4. Access Applications
- **Frontend:** `http://localhost`
- **Backend API:** `http://localhost:5000`
- **MongoDB:** `mongodb://admin:strongpassword123@localhost:27017`

---

## Environment Variable Details

### Backend Connection String Breakdown
```
mongodb://admin:strongpassword123@172.17.0.1:27017/lumina?authSource=admin
         └─ username
                    └─ password
                                    └─ host
                                                    └─ port
                                                            └─ database
                                                                             └─ auth source
```

### Frontend API URL
```
http://172.17.0.1:5000
  └─ Jenkins host IP
           └─ Backend port
```

---

## Troubleshooting

### Issue: Backend can't connect to Database
**Solution:**
1. Verify MongoDB is running: `docker ps -a | findstr lumina-database`
2. Check MongoDB logs: `docker logs lumina-database`
3. Verify credentials in pipeline: `MONGO_INITDB_ROOT_PASSWORD`
4. Ensure `MONGODB_HOST` is set to Jenkins host IP (not `localhost`)

### Issue: Frontend can't reach Backend
**Solution:**
1. Verify Backend is running: `docker ps -a | findstr lumina-backend`
2. Check Backend logs: `docker logs lumina-backend`
3. Update Frontend pipeline parameter: `BACKEND_HOST` to Jenkins host IP
4. Rebuild Frontend to pick up new API URL

### Issue: Jenkins credentials not working
**Solution:**
1. Verify credentials created in **Manage Credentials**
2. Credentials ID must match pipeline references:
   - `mongo-root-password`
   - `jwt-secret-key`
3. Re-run pipeline

### Issue: Docker command not found
**Solution:**
1. Ensure Docker Desktop is running
2. Verify Docker installation:
   ```powershell
   docker --version
   docker-compose --version
   ```
3. Restart Jenkins service

---

## Security Recommendations

### 1. Rotate Credentials Regularly
```powershell
# Update MongoDB password in Jenkins credentials
# Update JWT secret in Jenkins credentials
```

### 2. Use Strong Passwords
- Current: `strongpassword123` → Update to 32+ character random string
- Generate with: `openssl rand -base64 32`

### 3. Restrict Network Access (Future)
- Use firewall rules to limit port access
- Only expose ports to authenticated users
- Consider VPN/SSH tunneling for external access

### 4. Monitor Logs
- Archive build logs in Jenkins
- Monitor container logs for errors
- Set up alerts for failed deployments

---

## Deployment Checklist

- [ ] MongoDB password stored in Jenkins credentials
- [ ] JWT secret stored in Jenkins credentials
- [ ] Database pipeline job created and tested
- [ ] Backend pipeline job created with correct `MONGODB_HOST`
- [ ] Frontend pipeline job created with correct `BACKEND_HOST`
- [ ] Health checks passing for all services
- [ ] Services accessible from Jenkins host
- [ ] Logs collected and reviewed

---

## Next Steps

1. **Update secrets:** Change default passwords to strong values
2. **Test locally:** Run pipelines on development Jenkins
3. **Monitor:** Set up logging and alerting
4. **Scale:** Add more backend/frontend instances if needed
5. **CI/CD:** Add automated testing before deployment

---

## Quick Reference Commands

```powershell
# Check all services
docker ps -a

# View service logs
docker logs lumina-database
docker logs lumina-backend
docker logs lumina-frontend

# Stop specific service
docker-compose -f backend/docker-compose.yml down backend

# Restart specific service
docker-compose -f backend/docker-compose.yml restart backend

# Remove all containers
docker-compose -f backend/docker-compose.yml down
docker-compose -f frontend/docker-compose.yml down
docker-compose -f database/docker-compose.yml down

# Test API
curl http://localhost:5000/api/health
curl http://localhost

# Test Database connection
docker exec lumina-database mongosh --username admin --password strongpassword123 --authenticationDatabase admin --eval "db.adminCommand('ping')"
```

---

**Created:** December 1, 2025  
**Project:** Lumina Login (Microservices)  
**Deployment Strategy:** Independent Jenkins Pipelines (No Shared Network)
