FROM node:20-alpine AS deps
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --ignore-scripts

FROM deps AS test
WORKDIR /app
COPY backend/ ./
RUN npm test

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY backend/ ./
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --retries=6 CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["npm","run","start"]