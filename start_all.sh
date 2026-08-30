#!/bin/bash
# COGNYX Full-Stack Launcher (macOS/Linux)

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

echo "==================================================================="
echo "               COGNYX HEALTH SCIENCES ENGINE"
echo "         Precision Digital Phenotyping & Diagnostic AI"
echo "==================================================================="

echo "[1/3] Starting Python ML Microservice on port 8000..."
cd "$SCRIPT_DIR/ml_service" && python3 -m uvicorn main:app --port 8000 --reload &
ML_PID=$!
cd "$SCRIPT_DIR"

sleep 2

echo "[2/3] Opening browser at http://localhost:3005..."
if which xdg-open > /dev/null; then
  xdg-open "http://localhost:3005" &
elif which open > /dev/null; then
  open "http://localhost:3005" &
fi

echo "[3/3] Starting Express Backend Server on port 3005..."

cleanup() {
  echo "Stopping services..."
  kill $ML_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

node "$SCRIPT_DIR/backend/server.js"
