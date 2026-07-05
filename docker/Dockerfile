# Multi-stage build for Notion Clone

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client

COPY client/package.json client/package-lock.json* ./
RUN npm ci

COPY client/. ./
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/server

COPY server/package.json server/package-lock.json* ./
RUN npm ci --only=production

COPY server/. ./
COPY --from=frontend-builder /app/client/dist /app/client/dist

# Stage 3: Production Image
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY server/package.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built artifacts
COPY --from=backend-builder /app/server ./
COPY --from=backend-builder /app/client/dist /app/client/dist

EXPOSE 3001

CMD ["node", "dist/server.js"]
