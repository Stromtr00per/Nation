#!/bin/bash
# Railway start script for Nation app
set -e

# Change to server directory
cd /app/server

# Install dependencies
echo "Installing dependencies..."
if [ ! -d "node_modules" ] || [ -f "start.sh" ]; then
  npm install --only=production 2>&1 | tail -5
fi

# Build if needed
if [ ! -d "dist" ]; then
  echo "Building application..."
  npm run build 2>&1 | tail -5
fi

# Start the server
echo "Starting Nation server..."
exec node dist/server.js
