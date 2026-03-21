#!/usr/bin/env bash
# run.sh — Quick local development startup
# Installs dependencies and starts both server & client concurrently
set -e

echo "📦 Installing server dependencies..."
(cd server && npm install)

echo "📦 Installing client dependencies..."
(cd client && npm install)

echo ""
echo "🚀 Starting server (port 5001) & client (port 5173)..."
echo "   Server: http://localhost:5001"
echo "   Client: http://localhost:5173"
echo ""

# Start server in background
(cd server && npm run dev) &
SERVER_PID=$!

# Start client in foreground
(cd client && npm run dev)

# Cleanup
kill $SERVER_PID 2>/dev/null
