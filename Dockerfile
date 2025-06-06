# Multi-stage build for production
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY . .
EXPOSE 8787
# Use build and serve for development to avoid tsx issues
CMD ["sh", "-c", "pnpm run build && node dist/server.js"]

# Production build stage
FROM base AS build
COPY . .
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

# Install pnpm and wget (for health checks)
RUN npm install -g pnpm && apk add --no-cache wget

WORKDIR /app

# Copy package files and install production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S appuser -u 1001 -G nodejs
USER appuser

# Expose port
EXPOSE 8787

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8787/health || exit 1

# Start the application
CMD ["node", "dist-server/server.js"]
