# Stage 1: Build the frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy configuration files first
COPY frontend/tailwind.config.js ./
COPY frontend/postcss.config.js ./

# Copy the rest of the frontend code
COPY frontend/ .

# Install build dependencies
RUN npm install --save-dev tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.17

# Build the frontend
RUN npm run build

# Stage 2: Build the backend
FROM node:18-alpine as backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Stage 3: Create production image
FROM node:18-alpine as production
WORKDIR /app

# Copy frontend build from frontend-builder
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Copy backend from backend-builder
COPY --from=backend-builder /app/backend ./backend

# Install MongoDB client
RUN apk add --no-cache mongodb-client

# Expose the backend port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV MONGODB_URI=mongodb://localhost:27017/resume_db

# Start the backend server
CMD ["node", "./backend/app.js"]
