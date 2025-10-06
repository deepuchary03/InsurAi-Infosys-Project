#!/bin/bash

# Build and Deploy Script for Insurance Application

set -e  # Exit on any error

echo "🚀 Starting Insurance Application Build Process..."

# Function to print colored output
print_step() {
    echo -e "\n\033[1;34m$1\033[0m"
}

print_success() {
    echo -e "\033[1;32m$1\033[0m"
}

print_error() {
    echo -e "\033[1;31m$1\033[0m"
}

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "=> Docker is not running. Please start Docker and try again."
    exit 1
fi

print_step "=> Building Backend..."
cd backend
if mvn clean package -DskipTests; then
    print_success "=> Backend build successful!"
else
    print_error "=> Backend build failed!"
    exit 1
fi
cd ..

print_step "=> Building Frontend..."
cd frontend
if npm install && npm run build; then
    print_success "=> Frontend build successful!"
else
    print_error "=> Frontend build failed!"
    exit 1
fi
cd ..

print_step "=> Building Docker Images..."
if docker-compose build; then
    print_success "=> Docker images built successfully!"
else
    print_error "=> Docker build failed!"
    exit 1
fi

print_step "🚀 Starting Services..."
if docker-compose up -d; then
    print_success "=> Services started successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost"
    echo "   Backend:  http://localhost:8081"
    echo "   Health:   http://localhost:8081/actuator/health"
    echo ""
    echo "📋 Useful Commands:"
    echo "   View logs:     docker-compose logs -f"
    echo "   Stop services: docker-compose down"
    echo "   Restart:       docker-compose restart"
else
    print_error "=> Failed to start services!"
    exit 1
fi

print_success "🎉 Deployment completed successfully!"