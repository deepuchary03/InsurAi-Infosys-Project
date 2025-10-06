@echo off
REM Build and Deploy Script for Insurance Application (Windows)

echo 🚀 Starting Insurance Application Build Process...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

echo.
echo 📦 Building Backend...
cd backend
call mvnd clean package -DskipTests
if %errorlevel% neq 0 (
    echo ❌ Backend build failed!
    exit /b 1
)
echo ✅ Backend build successful!
cd ..

echo.
echo 📦 Building Frontend...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend npm install failed!
    exit /b 1
)
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    exit /b 1
)
echo ✅ Frontend build successful!
cd ..

echo.
echo 🐳 Building Docker Images...
docker-compose build
if %errorlevel% neq 0 (
    echo ❌ Docker build failed!
    exit /b 1
)
echo ✅ Docker images built successfully!

echo.
echo 🚀 Starting Services...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ❌ Failed to start services!
    exit /b 1
)

echo ✅ Services started successfully!
echo.
echo 🌐 Application URLs:
echo    Frontend: http://localhost
echo    Backend:  http://localhost:8081
echo    Health:   http://localhost:8081/actuator/health
echo.
echo 📋 Useful Commands:
echo    View logs:     docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart:       docker-compose restart
echo.
echo 🎉 Deployment completed successfully!
