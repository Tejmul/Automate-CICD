# Project State and Progress Plan

## 1) Project Snapshot

- **Project name:** ShopSmart (Automate-CICD)
- **Type:** Full-stack ecommerce demo with CI/CD and infrastructure setup
- **Repository layout:** Monorepo (`client`, `server`, `terraform`, `.github/workflows`, `scripts`)
- **Current app goal:** Provide an end-to-end storefront powered by DummyJSON with persistent cart, wishlist, and orders.

## 2) Tech Stack

### Frontend (`client`)

- React (Vite)
- React Router
- React Query
- Vitest + Testing Library
- Playwright (E2E)

### Backend (`server`)

- Node.js + Express
- Prisma ORM
- SQLite (`better-sqlite3`)
- Zod validation
- Jest + Supertest

### DevOps / Infra

- GitHub Actions workflows for lint/test/build/E2E/deploy
- Docker + Docker Compose for local/dev and production containerization
- Terraform for AWS S3 infrastructure provisioning
- Render deployment descriptor (`render.yaml`)

## 3) What Is Implemented (Completed)

### Product and Storefront Features

- Product listing, product detail, category browsing, and search through API routes.
- Frontend pages for:
  - Home
  - Shop/Catalog
  - Product details
  - Cart
  - Wishlist
  - Orders

### Stateful Commerce Features

- Cart persistence per user
- Wishlist persistence per user
- Order creation and order history
- Demo auth flow based on request headers (`x-user-email`, optional `x-user-name`)

### API Surface (Backend)

- Health:
  - `GET /api/health`
- Products:
  - `GET /api/products`
  - `GET /api/products/:id`
  - `GET /api/products/categories`
  - `GET /api/products/category/:category`
- Cart (auth required):
  - `GET /api/cart`
  - `POST /api/cart`
  - `PATCH /api/cart/:productId`
  - `DELETE /api/cart/:productId`
- Wishlist (auth required):
  - `GET /api/wishlist`
  - `POST /api/wishlist`
  - `DELETE /api/wishlist/:productId`
- Orders (auth required):
  - `GET /api/orders`
  - `POST /api/orders`

### Database Model (Prisma/SQLite)

- `User`
- `CartItem`
- `Order`
- `OrderItem`
- `WishlistItem`
- `Product`
- `OrderStatus` enum (`PENDING`, `PAID`, `SHIPPED`, `CANCELLED`)

### Testing Coverage (Implemented)

- Frontend unit/integration tests (Vitest)
- Backend tests (Jest/Supertest)
- E2E browser tests (Playwright)
- API fixture and mock-assisted frontend tests

## 4) CI/CD and Automation Status

## Active GitHub Actions Workflows

- `ci.yml`
  - Client lint + tests + build
  - Server lint + tests
  - Playwright E2E after both pass
- `frontend-tests.yml`
  - Frontend lint/format/test/build + Playwright + artifact upload
- `integration.yml`
  - Matrix testing across Node `20.x` and `22.x` for server and client
- `server_matrix.yml`
  - Server matrix testing for Node `20.x` and `22.x`
- `deploy.yml`
  - Deployment to EC2 over SSH
  - Pull latest `main`, install deps, run migrations, restart backend with PM2, build frontend, copy dist, restart Nginx

## Local Automation Scripts

- `scripts/run.sh`:
  - Installs server/client dependencies and starts both apps
- `scripts/health_check.sh`:
  - Calls `/api/health` endpoint and validates service status

## 5) Environment and Runtime State

### Backend Environment Variables

- `PORT` (default `5001`)
- `DATABASE_URL` (SQLite path)
- `ALLOWED_ORIGINS` (comma-separated CORS whitelist)

### Frontend Environment Variables

- `VITE_API_URL` (optional for production or external backend)

### Local Development Ports

- Frontend: `5173`
- Backend: `5001`

## 6) Containerization State

### Development Compose

- `docker-compose.yml` defines:
  - `server` service with DB volume and healthcheck
  - `client` service depending on healthy server
  - Named volumes for server/client dependencies and SQLite data

### Production Dockerfile

- Root `Dockerfile`:
  - Uses Node 20 Alpine
  - Installs build toolchain for SQLite native dependency
  - Installs server production dependencies
  - Generates Prisma client
  - Runs Prisma migrations before starting backend

## 7) Infrastructure as Code State (`terraform`)

- AWS provider configured
- Randomized unique S3 bucket naming implemented
- S3 bucket resource with optional `force_destroy`
- Versioning enabled
- Default encryption enabled (AES-256 or optional KMS key)
- Public access blocked
- Ownership controls enforced
- Optional lifecycle transitions (`STANDARD_IA`, `GLACIER`)
- Useful outputs available (name, ARN, region, domain, encryption, versioning)

## 8) Deployment State

- **Render descriptor present:** `render.yaml` includes backend web service + frontend static service.
- **GitHub EC2 deploy workflow present:** pull + migrate + PM2 restart + Nginx reload.
- **Status note:** Multiple deployment strategies exist (Render and EC2). Decide one primary production path to reduce operational drift.

## 9) Current Strengths

- End-to-end flow from product discovery to order creation is available.
- Good testing depth (unit + integration + E2E).
- CI has matrix support and quality gates.
- Dockerized development and production readiness patterns are in place.
- Infrastructure configuration follows secure S3 defaults.

## 10) Gaps / Improvements To Track

- Consolidate overlapping workflows to reduce CI duplication and runtime cost.
- Define one authoritative deployment environment (EC2 or Render).
- Add release/versioning strategy (tags + release notes).
- Add observability baseline (structured logs, error tracking, uptime alerting).
- Add backup and recovery plan for persistent data (if production scale grows).
- Add architecture diagrams and API contract documentation (OpenAPI optional).

## 11) Project Plan From This Point

### Phase A: Stabilize (Now)

- Keep all existing tests green on Node 20/22.
- Ensure Prisma migrations are deterministic and documented.
- Validate Docker compose developer onboarding flow.

### Phase B: Simplify Delivery

- Choose one CI entry workflow and make others reusable or scoped.
- Finalize a single production deployment target.
- Add branch protection rules requiring CI success.

### Phase C: Production Hardening

- Add monitoring and alerting.
- Add security scanning (dependency and container image scanning).
- Add rollback playbook for failed deployment.

### Phase D: Product Iteration

- Improve checkout/order status UX.
- Add user profile/account features.
- Add pagination and caching strategies for product APIs.

## 12) Team Usage Guide

- Update this file whenever any of the following changes:
  - APIs added/removed
  - Database schema/migrations
  - CI workflow changes
  - Deployment/infrastructure changes
  - Test strategy updates
- Keep sections 3, 4, 8, and 10 always current.
- Use this file as the source for sprint planning and handovers.

## 13) Quick Commands

### Run Backend

```bash
cd server
npm install
npm run dev
```

### Run Frontend

```bash
cd client
npm install
npm run dev
```

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm run lint
npm test -- --run
npm run build
```

### E2E Tests

```bash
cd client
npx playwright install --with-deps chromium
npm run e2e
```

## 14) Ownership and Change Log

- **Document owner:** Project maintainers
- **Last reviewed:** 2026-05-02
- **Recommended cadence:** Review weekly or after each merged feature/deploy change.
