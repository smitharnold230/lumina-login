# Multi-stage build for Lumina Login App

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Build backend and serve
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Install tsx for running TypeScript server
RUN npm install tsx

# Copy server code
COPY server ./server

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist ./dist

# Expose ports
EXPOSE 5000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the backend server (serves both API and frontend)
CMD ["npx", "tsx", "server/index-prod.ts"]
