## ShopSmart — DummyJSON Ecommerce (Fullstack + DevOps-ready)

### What this is :
- **Frontend**: React (Vite) + React Router + React Query, UI inspired by modern ecommerce patterns (Nike energy, Prada minimal grids, mobile-first pacing).
- **Backend**: Express + Prisma (SQLite) with a clean API layer that proxies/consumes `dummyjson.com` for products and persists **cart / wishlist / orders**.
- **DevOps**: CI (lint + unit tests + build), Dependabot, and bonus E2E Playwright flow.

### Architecture (high-level)
- **Products**: fetched from DummyJSON via `server/src/services/dummyjson.js`, exposed through `GET /api/products/*`.
- **Stateful commerce**: cart/wishlist/orders live in SQLite via Prisma models in `server/prisma/schema.prisma`.
- **Auth (demo)**: protected routes require `x-user-email` (and optional `x-user-name`). Frontend sends these automatically.

### API overview
- **Health**: `GET /api/health`
- **Products**:
  - `GET /api/products?limit=&skip=&q=`
  - `GET /api/products/:id`
  - `GET /api/products/categories`
  - `GET /api/products/category/:category`
- **Cart** (auth required): `GET/POST/PATCH/DELETE /api/cart`
- **Wishlist** (auth required): `GET/POST/DELETE /api/wishlist`
- **Orders** (auth required): `GET/POST /api/orders`

### Local development
In two terminals:

```bash
cd server
npm install
npm run dev
```

```bash
cd client
npm install
npm run dev
```

Then open the app at `http://localhost:5173`.

### Environment variables
Backend (`server/.env`):
- `PORT` (default `5001`)
- `DATABASE_URL` (default `file:./dev.db`)
- `ALLOWED_ORIGINS` (comma-separated)

Frontend:
- `VITE_API_URL` (optional). When omitted, Vite dev proxy forwards `/api` to `http://localhost:5001`.

### Testing
Backend:

```bash
cd server
npm test
```

Frontend:

```bash
cd client
npm run lint
npm test -- --run
npm run build
```

Bonus E2E (requires Playwright browsers):

```bash
cd client
npx playwright install --with-deps chromium
npm run e2e
```

### Deployment notes (as required)
- **Backend**: deploy to Render (configure env vars + run Prisma migrate if needed)
- **Frontend**: deploy to Vercel (set `VITE_API_URL` to your Render backend URL)
- **CORS**: ensure `ALLOWED_ORIGINS` includes your Vercel URL
