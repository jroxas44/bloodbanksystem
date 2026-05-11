# Multi-stage build for Nuxt.js application

# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy built application from builder
COPY --from=builder /app/.output ./
COPY --from=builder /app/prisma ./prisma/

# Generate Prisma client in production
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "server/index.mjs"]
