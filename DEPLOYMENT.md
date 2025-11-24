# 🚀 Deployment Guide

## Table of Contents

1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Production Checklist](#production-checklist)

---

## Backend Deployment

### Option 1: Deploy to Heroku

#### Prerequisites

- Heroku CLI installed
- Heroku account

#### Steps

1. **Create Procfile in backend root:**

```
web: java -jar target/online-insurance-system-1.0.0.jar
```

2. **Create system.properties:**

```
java.runtime.version=17
```

3. **Deploy commands:**

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set GEMINI_API_KEY=your-gemini-key
heroku config:set EMAIL_USERNAME=your-email
heroku config:set EMAIL_PASSWORD=your-email-password

# Deploy
git push heroku main

# Open app
heroku open
```

### Option 2: Deploy to AWS Elastic Beanstalk

1. **Package application:**

```bash
mvn clean package
```

2. **Install AWS CLI and EB CLI**

3. **Initialize Elastic Beanstalk:**

```bash
eb init -p java-17 insurance-system
```

4. **Create environment:**

```bash
eb create insurance-prod-env
```

5. **Set environment variables in EB Console**

6. **Deploy:**

```bash
eb deploy
```

### Option 3: Docker Deployment

#### Create Dockerfile in backend root:

```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/online-insurance-system-1.0.0.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Create docker-compose.yml:

```yaml
version: "3.8"
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: insurance_db
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

  backend:
    build: ./backend
    ports:
      - "8081:8081"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/insurance_db
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=rootpassword
      - JWT_SECRET=your-secret-key
      - GEMINI_API_KEY=your-gemini-key
    depends_on:
      - mysql

volumes:
  mysql-data:
```

#### Deploy:

```bash
docker-compose up -d
```

---

## Frontend Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**

```bash
npm install -g vercel
```

2. **Build project:**

```bash
cd frontend
npm run build
```

3. **Deploy:**

```bash
vercel
```

4. **Configure environment variables in Vercel dashboard:**

- `VITE_API_URL` = Your backend URL

5. **Set up automatic deployments from GitHub**

### Option 2: Deploy to Netlify

1. **Build project:**

```bash
cd frontend
npm run build
```

2. **Deploy using Netlify CLI:**

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

3. **Or connect GitHub repo in Netlify dashboard**

4. **Configure environment variables:**

- `VITE_API_URL` = Your backend URL

### Option 3: Deploy to AWS S3 + CloudFront

1. **Build project:**

```bash
npm run build
```

2. **Create S3 bucket and enable static website hosting**

3. **Upload dist folder:**

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

4. **Create CloudFront distribution**

5. **Update API URL in environment**

### Option 4: Deploy to Firebase Hosting

1. **Install Firebase CLI:**

```bash
npm install -g firebase-tools
```

2. **Initialize Firebase:**

```bash
firebase init hosting
```

3. **Build and deploy:**

```bash
npm run build
firebase deploy
```

---

## Database Setup

### Production MySQL Setup

#### Option 1: AWS RDS

1. Create RDS MySQL instance
2. Configure security groups
3. Note connection details
4. Update backend application.properties

#### Option 2: DigitalOcean Managed Database

1. Create MySQL database cluster
2. Configure firewall rules
3. Get connection string
4. Update backend configuration

#### Option 3: PlanetScale (Serverless MySQL)

1. Create database
2. Create production branch
3. Get connection string
4. Update backend configuration

---

## Environment Configuration

### Backend Environment Variables

**Required:**

```
DATABASE_URL=jdbc:mysql://host:port/database
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
JWT_SECRET=your-256-bit-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

**Optional:**

```
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
CORS_ALLOWED_ORIGINS=https://your-frontend.com
SERVER_PORT=8081
```

### Frontend Environment Variables

```
VITE_API_URL=https://your-backend-api.com/api/v1
```

---

## Production Checklist

### Security

- [ ] Change JWT secret to strong random string
- [ ] Enable HTTPS for both frontend and backend
- [ ] Configure proper CORS origins
- [ ] Use environment variables for all secrets
- [ ] Enable SQL injection protection
- [ ] Implement rate limiting
- [ ] Add API request validation
- [ ] Configure secure headers

### Database

- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Optimize indexes
- [ ] Set up monitoring
- [ ] Use read replicas for scaling
- [ ] Configure SSL connections

### Backend

- [ ] Enable production logging
- [ ] Configure error tracking (Sentry)
- [ ] Set up health check endpoints
- [ ] Enable metrics collection
- [ ] Configure auto-scaling
- [ ] Add request logging
- [ ] Implement caching (Redis)
- [ ] Set up CDN for static assets

### Frontend

- [ ] Minify and bundle assets
- [ ] Enable gzip compression
- [ ] Configure CDN
- [ ] Add error boundary components
- [ ] Implement analytics
- [ ] Add loading states
- [ ] Optimize images
- [ ] Enable service worker for PWA

### Monitoring

- [ ] Set up application monitoring
- [ ] Configure uptime monitoring
- [ ] Set up error alerting
- [ ] Monitor API response times
- [ ] Track database performance
- [ ] Monitor server resources

### Testing

- [ ] Run all unit tests
- [ ] Perform integration testing
- [ ] Conduct security audit
- [ ] Load testing
- [ ] User acceptance testing
- [ ] Cross-browser testing

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Application

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Set up JDK 17
        uses: actions/setup-java@v2
        with:
          java-version: "17"

      - name: Build with Maven
        run: mvn clean package -DskipTests

      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name"
          heroku_email: "your-email@example.com"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{secrets.API_URL}}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{secrets.VERCEL_TOKEN}}
          vercel-org-id: ${{secrets.ORG_ID}}
          vercel-project-id: ${{secrets.PROJECT_ID}}
```

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check backend health
curl https://your-api.com/api/v1/health

# Test authentication
curl -X POST https://your-api.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 2. Monitor Logs

```bash
# Heroku
heroku logs --tail

# AWS
aws logs tail /aws/elasticbeanstalk/your-app

# Docker
docker logs -f container-name
```

### 3. Set Up Alerts

- Configure email/SMS alerts for errors
- Set up uptime monitoring
- Configure performance alerts

---

## Backup Strategy

### Database Backups

**Automated daily backups:**

```bash
# MySQL dump script
mysqldump -u username -p database_name > backup_$(date +%Y%m%d).sql
```

**Backup to S3:**

```bash
aws s3 cp backup.sql s3://your-bucket/backups/
```

### Application Backups

- Version control (Git)
- Tagged releases
- Docker images
- Configuration backups

---

## Rollback Procedure

### Backend Rollback

```bash
# Heroku
heroku rollback

# Docker
docker-compose down
docker-compose up -d --build previous-version

# AWS EB
eb deploy --version previous-version
```

### Frontend Rollback

```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

---

## Performance Optimization

### Backend

1. Enable database connection pooling
2. Implement Redis caching
3. Use async processing for emails
4. Optimize database queries
5. Enable gzip compression

### Frontend

1. Code splitting
2. Lazy loading components
3. Image optimization
4. CDN for static assets
5. Service worker caching

---

## Cost Estimation

### Free Tier Options

**Backend:**

- Heroku Free Tier (limited hours)
- AWS Free Tier (12 months)

**Frontend:**

- Vercel Free Tier
- Netlify Free Tier

**Database:**

- PlanetScale Free Tier (5GB)
- AWS RDS Free Tier (12 months)

### Production Costs (Estimated Monthly)

- Backend: $10-50
- Frontend: $0-20
- Database: $15-100
- Email Service: $0-10
- Monitoring: $0-20

**Total: $25-200/month** depending on traffic

---

## Support & Maintenance

- Regular security updates
- Dependency updates
- Database maintenance
- Log cleanup
- Performance monitoring
- User feedback implementation

---

**Your application is now ready for production! 🚀**
