# Deployment Guide

## Railway.app Deployment

### Step 1: Connect Your Repository

1. Go to [Railway.app](https://railway.app/)
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository: `stromtr00per/nation`
4. Railway will automatically detect the `railway.json` config

### Step 2: Configure Environment Variables

In Railway dashboard, add these environment variables:

```bash
# Database URL (Railway will create PostgreSQL automatically)
DATABASE_URL=postgres://username:password@host:5432/dbname

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-key-change-this-in-production

# Frontend URL (update after deployment)
FRONTEND_URL=http://localhost:5173  # For local dev
FRONTEND_URL=https://your-domain.com # For production
```

### Step 3: Deploy

Railway will automatically:
- Build the project
- Create a PostgreSQL database
- Deploy the server

### Step 4: Update Frontend

After deployment, update the frontend `.env` file:

```bash
VITE_API_URL=http://your-railway-app-url:3001
```

The Railway app will be at: `https://your-app-name.railway.app`

## Local Development

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

## Docker Deployment

```bash
cd docker
docker-compose up -d
```
