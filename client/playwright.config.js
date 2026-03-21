import { defineConfig } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, "../server");

export default defineConfig({
  testDir: "./tests-e2e",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:5173",
    trace: "retain-on-failure",
  },
  // In CI, start API + Vite here. A prior workflow step cannot leave a background
  // server running — the step’s shell exits and the process is torn down.
  webServer: process.env.CI
    ? [
        {
          command:
            "npx prisma migrate deploy && npx prisma generate && node src/index.js",
          cwd: serverRoot,
          url: "http://127.0.0.1:5001/api/health",
          reuseExistingServer: false,
          timeout: 120_000,
          env: {
            ...process.env,
            NODE_ENV: "test",
            PORT: "5001",
            DATABASE_URL: "file:./dev.db",
            ALLOWED_ORIGINS: "http://127.0.0.1:5173",
          },
        },
        {
          command: "npm run dev -- --host 127.0.0.1 --port 5173",
          cwd: __dirname,
          url: "http://127.0.0.1:5173",
          reuseExistingServer: false,
          timeout: 120_000,
        },
      ]
    : undefined,
});
