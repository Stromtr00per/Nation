#!/bin/bash

RAILWAY_TOKEN="d1519053-e1bf-4d71-aaef-c6871d9c0f02"
export RAILWAY_TOKEN

echo "🚀 Deploying Nation to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login with token
echo "Authenticating with Railway..."
railway login --token="$RAILWAY_TOKEN"

# Deploy from GitHub
echo "Deploying from GitHub repository..."
railway up --from-github

echo "✅ Deployment complete!"
