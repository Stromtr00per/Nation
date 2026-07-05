#!/bin/bash

# Automated Railway Deployment Script
# For repository: stromtr00per/nation

set -e

RAILWAY_TOKEN="d1519053-e1bf-4d71-aaef-c6871d9c0f02"
export RAILWAY_TOKEN

echo "=========================================="
echo "🚀 Railway Automated Deployment"
echo "Repository: stromtr00per/nation"
echo "=========================================="

# Step 1: Install Railway CLI
echo ""
echo "Step 1: Installing Railway CLI..."
if ! command -v railway &> /dev/null; then
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
else
    echo "✅ Railway CLI already installed"
fi

# Step 2: Login with token
echo ""
echo "Step 2: Authenticating with Railway..."
railway login --token="$RAILWAY_TOKEN" || {
    echo "⚠️  Token login failed, trying browserless mode..."
    railway login -b
}

# Step 3: Deploy from GitHub
echo ""
echo "Step 3: Deploying from GitHub..."
railway up --from-github

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Wait for deployment to finish (5-10 minutes)"
echo "2. Add PostgreSQL service in Railway dashboard"
echo "3. Copy DATABASE_URL to environment variables"
echo "4. Update FRONTEND_URL in Railway settings"
echo "5. Update frontend .env: VITE_API_URL=<railway-url>"
echo ""
echo "View your app at: https://app.railway.app"
