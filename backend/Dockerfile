# -------------------
# 1. Dependencies
# -------------------
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies based on lockfile
COPY backend/package*.json ./
RUN npm ci --ignore-scripts


# -------------------
# 2. Test stage
# -------------------
FROM deps AS test
WORKDIR /app

# Copy source code and run tests
COPY backend/ ./
# Uncomment if your project requires a build before tests
# RUN npm run build
RUN npm test


# -------------------
# 3. Runtime stage
# -------------------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install curl so the healthcheck can run
RUN apk add --no-cache curl

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source
COPY backend/ ./

# Expose app port
EXPOSE 8000

# Start command
CMD ["npm","run","start"]
