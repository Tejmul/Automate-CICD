import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './tests-e2e',
    timeout: 30_000,
    retries: process.env.CI ? 1 : 0,
    use: {
        baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
        trace: 'retain-on-failure',
    },
    webServer: process.env.CI
        ? [
              {
                  command: 'npm run dev -- --host 127.0.0.1 --port 5173',
                  port: 5173,
                  reuseExistingServer: false,
              },
          ]
        : undefined,
})

