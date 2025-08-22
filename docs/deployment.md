# Backend Deployment Documentation

## Overview
This document describes the architecture, deployment process, and operational details for the backend of the `portfolio-site` project.  
The backend is deployed on a self-managed VPS, containerized with Docker, reverse-proxied with Caddy, and integrated with GitHub for automated deployments.

---

## System Architecture

### Components
- **GitHub Repository**
  - Source of truth for backend code (`portfolio-site`).
  - Pushes to the `main` branch trigger deployments.

- **Webhook Listener**
  - Node.js service running on the VPS.
  - Receives GitHub webhook events.
  - Validates signatures and triggers the deployment script.

- **Deployment Script**
  - Executes build, test, and deployment steps.
  - Runs Docker multi-stage builds.
  - Deploys the backend via Docker Compose.
  - Implements rollback if the new container fails health checks.

- **Docker & Docker Compose**
  - Builds container images with Git commit SHA tags.
  - Defines and runs the backend service in `docker-compose.yml`.
  - Health checks ensure container readiness.

- **Caddy Reverse Proxy**
  - Proxies external traffic from `https://api.lukeedwards.me` to `http://127.0.0.1:8000`.
  - Provides TLS certificates automatically via Let’s Encrypt.
  - Enforces HTTPS with auto-renewal.

- **Backend Service**
  - Node.js/Express application.
  - Exposes API endpoints for frontend consumption.
  - Implements CORS, rate limiting, and security headers.

---

## Deployment Workflow

### 1. Code Push
- Developer pushes code to the `main` branch of the GitHub repo.

### 2. Webhook Trigger
- GitHub webhook sends a `push` event to the VPS endpoint (`/github` on port 8088).
- The webhook listener:
  - Verifies the HMAC signature with the shared secret.
  - Extracts the commit SHA.
  - Spawns the deployment script with the commit SHA as an argument.

### 3. Build & Test
- Deployment script:
  - Updates the repository to the latest `main`.
  - Runs Docker multi-stage build:
    - `deps` → install dependencies (`npm ci`).
    - `test` → run automated tests.
    - `runtime` → produce production-ready image.
  - Tags the image with `<commit-sha>` and `latest`.

### 4. Deploy
- Script starts the backend container with Docker Compose.
- Environment variables loaded from `.env`.
- Container bound to `127.0.0.1:8000` (not exposed publicly).
- Health check:
  - Queries `http://localhost:8000/api/health`.
  - Retries until healthy.
- If health fails:
  - Container is stopped.
  - Rollback to the previous stable image.

### 5. Serve via Caddy
- Caddy routes requests:
https://api.lukeedwards.me/* → http://127.0.0.1:8000/*

pgsql
Copy
Edit
- Automatically provisions TLS certs from Let’s Encrypt.
- Auto-renews certificates.

---

## Security

- **CORS**: Only `https://lukeedwards.me` (frontend domain) is allowed to access the API.
- **Helmet**: Adds HTTP security headers to all responses.
- **Rate Limiting**: Limits requests per IP to mitigate abuse.
- **Isolation**: Backend only binds to localhost, making it inaccessible except via proxy.
- **TLS**: All external traffic encrypted via HTTPS with automatic certificate renewal.

---

## Operational Notes

### Starting Services
- Webhook listener runs under **PM2**:
```bash
pm2 start /home/luke/opt/webhook/github.js --name webhook
pm2 save
Backend managed by Docker Compose:

bash
Copy
Edit
cd ~/backend
docker compose up -d
Logs
Webhook:

bash
Copy
Edit
pm2 logs webhook --lines 100
Backend:

bash
Copy
Edit
docker compose -f ~/backend/docker-compose.yml logs -f backend
Health Check
Verify backend health:

bash
Copy
Edit
curl -s https://api.lukeedwards.me/api/health
Rollback (manual)
If automated rollback fails:

bash
Copy
Edit
export TAG=<previous-sha>
docker compose -f ~/backend/docker-compose.yml up -d
Key Features
Automated CI/CD with GitHub → VPS webhooks.

Zero-downtime deploys with health-gated rollouts.

Automatic rollback on failure.

Dockerized builds with commit SHA tagging.

Secure reverse proxy with HTTPS + Let’s Encrypt.

Hardened backend with CORS, rate limiting, and security headers.

Future Improvements
CI pipeline with GitHub Actions self-hosted runner (to remove webhook complexity).

Blue/green deployments for even safer releases.

Centralized logging and monitoring (ELK stack or Prometheus/Grafana).

Secrets management via Vault or environment manager.
