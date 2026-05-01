# ============================================================
# Stage 1 — Vite client → server/public (Express static + SPA)
# ============================================================
FROM node:20-alpine AS client-builder

WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# ============================================================
# Stage 2 — Server deps + embed client dist
# ============================================================
FROM node:20-alpine AS server-builder

WORKDIR /app

COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci

COPY server/ ./server/
COPY --from=client-builder /app/client/dist ./server/public

RUN cd server && npm prune --omit=dev

# ============================================================
# Stage 3 — Production runtime (Node only)
# ============================================================
FROM node:20-alpine AS production

WORKDIR /app/server

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=server-builder /app/server/node_modules ./node_modules
COPY --from=server-builder /app/server/package.json ./package.json
COPY --from=server-builder /app/server/src ./src
COPY --from=server-builder /app/server/public ./public

RUN chown -R appuser:appgroup /app

USER appuser

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5001/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/index.js"]
