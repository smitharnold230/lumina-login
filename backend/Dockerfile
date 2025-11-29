# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Install tsx for running TypeScript
RUN npm install tsx

# Copy server code
COPY server ./server

# Expose port
EXPOSE 5000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the server
CMD ["npx", "tsx", "server/index.ts"]
