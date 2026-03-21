#!/usr/bin/env bash
# health_check.sh — Check server health endpoint
# Usage: ./scripts/health_check.sh [host]
set -e

HOST="${1:-http://localhost:5001}"
ENDPOINT="$HOST/api/health"

echo "🔍 Checking health at $ENDPOINT..."

RESPONSE=$(curl -fsS "$ENDPOINT" 2>&1) || {
    echo "❌ Health check FAILED"
    echo "   Could not reach $ENDPOINT"
    exit 1
}

STATUS=$(echo "$RESPONSE" | grep -o '"status":"ok"' || true)

if [ -n "$STATUS" ]; then
    echo "✅ Server is healthy"
    echo "   Response: $RESPONSE"
    exit 0
else
    echo "⚠️ Server responded but status is not ok"
    echo "   Response: $RESPONSE"
    exit 1
fi
