# ShopSmart Frontend — Test Strategy

## Test Types

### 1. Unit Tests (Vitest + React Testing Library)
- **Location:** `src/**/*.test.{js,jsx}`
- **Runner:** [Vitest](https://vitest.dev/) with jsdom environment
- **Libraries:** `@testing-library/react`, `@testing-library/jest-dom`

#### Run Commands
```bash
npm test              # Run once
npm run test:watch    # Watch mode (re-runs on file change)
```

#### Current Coverage
| File | Tests | Description |
|------|-------|-------------|
| `App.test.jsx` | 1 | Renders ShopSmart title |
| `lib/api.test.js` | — | API utility tests |
| `ui/layout/Navbar.test.jsx` | — | Navbar component tests |
| `ui/pages/HomePage.test.jsx` | — | HomePage component tests |
| `ui/sections/Hero.test.jsx` | — | Hero section tests |

---

### 2. E2E Tests (Playwright)
- **Location:** `tests-e2e/*.spec.js`
- **Runner:** [Playwright](https://playwright.dev/)
- **Config:** `playwright.config.js`

#### Run Commands
```bash
npm run e2e                # Run headless
npm run test:e2e:headed    # Run with browser visible (debugging)
npm run test:all           # Run unit tests + E2E
```

#### Test Files
| File | Tests | Description |
|------|-------|-------------|
| `storefront.spec.js` | 1 | Full flow: shop → product → add to cart |
| `homepage.spec.js` | 7 | Hero heading, navbar, CTA, stats, trending |
| `navigation.spec.js` | 7 | All nav link routing, logo home, hero CTA |
| `search.spec.js` | 5 | Search input on catalog page |
| `responsive.spec.js` | 6 | Mobile/tablet/desktop viewport rendering |
| `api-mock.spec.js` | 5 | Mocked API responses, error resilience |

---

### 3. Code Quality
```bash
npm run lint           # ESLint
npm run format:check   # Prettier (CI-safe, exits with error)
npm run format         # Prettier (auto-fix)
```

---

## CI/CD Integration

All tests run automatically via GitHub Actions:

- **`ci.yml`** — Lint + unit tests + build on every push/PR
- **`frontend-tests.yml`** — Full frontend pipeline including E2E with Playwright report upload
- **`integration.yml`** — Full-stack (server + client) across Node 20/22
