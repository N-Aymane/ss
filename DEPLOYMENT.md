# Deployment Guide

This guide covers deploying the SALESUCRE CO. e-commerce website to various platforms.

## 🚀 Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Prerequisites
- GitHub repository with your code
- Vercel account

### Steps

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   ```env
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-secure-jwt-secret-32-chars-minimum"
   ADMIN_EMAIL="admin@yourdomain.com"
   ADMIN_PASSWORD="your-secure-admin-password"
   NEXTAUTH_SECRET="your-nextauth-secret-32-chars-minimum"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   ```

3. **Database Setup**
   - Use a cloud database (PostgreSQL recommended)
   - Update `DATABASE_URL` in environment variables
   - Run migrations: `npx prisma db push`
   - Seed database: `npm run db:seed`

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your site will be available at `https://your-project.vercel.app`

## 🐳 Docker Deployment

### Dockerfile

Create a `Dockerfile` in the root directory:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=file:./dev.db
      - JWT_SECRET=your-jwt-secret
      - ADMIN_EMAIL=admin@example.com
      - ADMIN_PASSWORD=admin123
    volumes:
      - ./prisma:/app/prisma
```

### Commands

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d
```

## 🌊 DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Run Command: `npm start`

3. **Environment Variables**
   - Add all required environment variables
   - Use DigitalOcean Managed Database for production

4. **Deploy**
   - App Platform will handle the deployment

## 🚂 Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository

2. **Add Database**
   - Add PostgreSQL service
   - Copy connection string to `DATABASE_URL`

3. **Environment Variables**
   - Set all required environment variables

4. **Deploy**
   - Railway will automatically deploy

## 📊 Database Options

### PostgreSQL (Recommended)

**Providers:**
- **Supabase** (Free tier available)
- **PlanetScale** (MySQL-compatible)
- **Railway** (PostgreSQL)
- **DigitalOcean Managed Database**

**Connection String Format:**
```
postgresql://username:password@host:port/database?sslmode=require
```

### Setup Steps:
1. Create database instance
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `npx prisma db push`
4. Seed database: `npm run db:seed`

## 🔧 Production Checklist

### Security
- [ ] Change default admin credentials
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS
- [ ] Set secure environment variables
- [ ] Update CORS settings if needed

### Performance
- [ ] Enable compression
- [ ] Configure CDN for static assets
- [ ] Set up database connection pooling
- [ ] Enable caching headers

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Database performance monitoring

### Backup
- [ ] Database backup strategy
- [ ] Environment variables backup
- [ ] Code repository backup

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check TypeScript errors

2. **Database Connection**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Ensure database exists

3. **Environment Variables**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure secrets are properly encoded

4. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify NEXTAUTH_URL matches domain
   - Check cookie settings for HTTPS

### Getting Help

- Check deployment platform logs
- Verify environment variables
- Test database connection
- Check application logs

## 📈 Scaling

### Horizontal Scaling
- Use load balancers
- Multiple application instances
- Database read replicas

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable caching

### CDN Setup
- Configure for static assets
- Enable image optimization
- Set appropriate cache headers
