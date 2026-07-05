# Notion Clone - Deployment Guide

## Quick Start Options

### Option 1: Docker (Recommended)

**1. Build and Run:**
```bash
cd /Users/KRPX/AI/notion-clone/docker
docker-compose up -d
```

**2. Access:** http://localhost:3001

**3. Production deployment:**
```bash
# Build image
docker-compose build

# Run with your domain
docker-compose up -d
```

### Option 2: Railway.app (Easiest - Free Tier)

1. **Push to GitHub:**
   ```bash
   cd /Users/KRPX/AI/notion-clone
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js app

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-app.railway.app
   JWT_SECRET=your-secret-key
   ```

### Option 3: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
- Frontend is already optimized for Vercel
- Deploy client folder to Vercel
- Update `FRONTEND_URL` in backend

**Backend (Railway):**
- Deploy server with Railway as shown above

### Option 4: Deploy to Your Own Server

**1. Build Docker Image:**
```bash
cd /Users/KRPX/AI/notion-clone/docker
docker build -t notion-clone .
docker push your-registry/notion-clone
```

**2. Run on Server:**
```bash
docker run -d -p 3001:3001 \
  --name notion-clone \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  your-registry/notion-clone
```

## Environment Variables

Required for all deployments:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Client URL | `https://app.example.com` |
| `JWT_SECRET` | JWT signing secret | `your-32-char-secret-key` |
| `NODE_ENV` | Environment | `production` |

## Testing Locally First

Before deploying, test locally:

```bash
# Test Docker build
cd /Users/KRPX/AI/notion-clone/docker
docker-compose build
docker-compose up

# Test locally
cd /Users/KRPX/AI/notion-clone/server
npm run dev  # Server
npm run dev  # Client (different terminal)
```

## Recommended Deployment Flow

1. **Local Testing** ✅
   - Test with Docker locally
   - Verify all features work

2. **GitHub Push** ✅
   - Push code to private/public repo
   - Add `.gitignore` (already created)

3. **Platform Selection**
   - **Small project**: Railway (free tier)
   - **Medium project**: Railway + Vercel
   - **Large project**: Your own server with Docker

4. **Deploy & Configure**
   - Set environment variables
   - Update `FRONTEND_URL` to production domain
   - Use strong `JWT_SECRET`

5. **Monitor**
   - Check logs
   - Monitor errors
   - Set up alerts

## Security Checklist

- [ ] Use strong random `JWT_SECRET` (32+ chars)
- [ ] Never commit `.env` files (already in .gitignore)
- [ ] Use HTTPS (both Railway and Vercel provide this)
- [ ] Set `NODE_ENV=production`
- [ ] Enable database backups (Railway offers this)

## Next Steps

Want me to:
1. Build and test Docker image locally?
2. Set up Railway deployment?
3. Create GitHub repository for deployment?
