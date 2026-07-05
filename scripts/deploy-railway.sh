#!/bin/bash

echo "🚀 Deploying Nation to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if authenticated
if ! railway whoami &> /dev/null; then
    echo "⚠️  Not logged in. Opening browser for authentication..."
    railway login --open
    echo "After signing in, run: railway up"
    exit 1
fi

# Deploy from GitHub
echo "Deploying from GitHub repository..."
railway up --from-github

echo "✅ Deployment complete!"
