import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5001",
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    include: ["src/**/*.test.{js,jsx}"],
    exclude: ["tests-e2e/**", "node_modules/**", "dist/**"],
    reporters: ["default", ["junit", { outputFile: "test-results/vitest-junit.xml" }]],
  },
});
