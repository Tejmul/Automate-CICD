# ─── Production Server ────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Native addon (better-sqlite3) needs a toolchain on Alpine
RUN apk add --no-cache python3 make g++

# Install server dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server source
COPY server/ ./server/

# Generate Prisma client
RUN cd server && npx prisma generate

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

# Run Prisma migrations and start server
CMD cd server && npx prisma migrate deploy && node src/index.js
