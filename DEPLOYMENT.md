# Insurance Application - Docker & Render Deployment Guide

This guide covers deploying the Insurance Application using Docker locally and on Render.

## 🐳 Local Docker Development

### Prerequisites
- Docker and Docker Compose installed
- MySQL (optional, will be provided by Docker)

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url>
cd insur-ai-updated-2

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services
- **Frontend**: http://localhost (React app with Nginx)
- **Backend**: http://localhost:8081 (Spring Boot API)
- **Database**: MySQL on port 3306

### Individual Service Commands
```bash
# Build and run backend only
cd backend
docker build -t insurance-backend .
docker run -p 8081:8081 insurance-backend

# Build and run frontend only
cd frontend
docker build -t insurance-frontend .
docker run -p 80:80 insurance-frontend
```

## ☁️ Render Deployment

### Backend Deployment on Render

1. **Create a new Web Service** on Render dashboard
2. **Connect your GitHub repository**
3. **Configure the service**:
   - **Name**: `insurance-backend`
   - **Environment**: `Docker`
   - **Build Command**: `cd backend && mvn clean package -DskipTests`
   - **Start Command**: `java -Dspring.profiles.active=prod -jar backend/target/*.jar`
   - **Port**: `8081`

4. **Set Environment Variables**:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=jdbc:mysql://your-mysql-host:3306/insurancedb?allowPublicKeyRetrieval=true&useSSL=true&serverTimezone=UTC
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   ```

5. **Database Setup**:
   - Use Render's PostgreSQL addon OR
   - External MySQL service (PlanetScale, Railway, etc.)

### Frontend Deployment on Render

1. **Create a new Static Site** on Render dashboard
2. **Connect the same GitHub repository**
3. **Configure the service**:
   - **Name**: `insurance-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

4. **Set Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

### Database Options for Production

#### Option 1: PlanetScale (Recommended)
```bash
# Sign up at planetscale.com
# Create database
# Get connection string
# Update DATABASE_URL environment variable
```

#### Option 2: Render PostgreSQL
```bash
# Add PostgreSQL addon in Render dashboard
# Update application-prod.properties to use PostgreSQL
# Update dependencies in pom.xml
```

## 🔧 Configuration Files Explained

### Backend Dockerfile
- Multi-stage build for optimization
- Uses Maven for dependency management
- Health checks for monitoring

### Frontend Dockerfile
- Node.js build stage
- Nginx production server
- Optimized for static file serving

### docker-compose.yml
- Complete local development environment
- MySQL database with initialization
- Network configuration for service communication

## 🚀 Deployment Checklist

### Before Deployment
- [ ] Update CORS origins in backend
- [ ] Set secure passwords for production
- [ ] Configure SSL certificates
- [ ] Set up database backups
- [ ] Configure monitoring and logging

### Environment Variables
- [ ] DATABASE_URL
- [ ] DB_USERNAME
- [ ] DB_PASSWORD
- [ ] ADMIN_USERNAME
- [ ] ADMIN_PASSWORD
- [ ] REACT_APP_API_URL

## 📝 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Check database connection
   - Verify environment variables
   - Check logs: `docker-compose logs backend`

2. **Frontend can't connect to backend**
   - Verify REACT_APP_API_URL
   - Check CORS configuration
   - Ensure backend is accessible

3. **Database connection issues**
   - Verify database URL format
   - Check credentials
   - Ensure database exists

### Health Check Endpoints
- Backend health: `http://your-backend-url/actuator/health`
- Frontend: Any route should return the React app

## 🔒 Security Considerations

1. **Change default passwords**
2. **Use environment variables for secrets**
3. **Enable HTTPS in production**
4. **Configure proper CORS origins**
5. **Set up database SSL/TLS**
6. **Implement proper error handling**

## 📊 Monitoring

- Use Render's built-in monitoring
- Set up log aggregation
- Configure health check alerts
- Monitor database performance