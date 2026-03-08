# Dockerfile for Next.js production build

# 1. Dependency installation stage
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
# If you have a package-lock.json, copy it as well.
# COPY package-lock.json ./
RUN npm install

# 2. Builder stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 3. Production runner stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Copy standalone output from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# Set the command to start the app
# The standalone output creates a server.js file.
CMD ["node", "server.js"]
