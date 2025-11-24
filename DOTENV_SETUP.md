# 🚀 Quick Setup with .env File

The backend now supports loading environment variables from a `.env` file automatically!

## Setup Steps:

### 1. Copy the example file:

```bash
cd backend
cp .env.example .env
```

### 2. Edit `.env` with your credentials:

```bash
MYSQL_PASSWORD=your_password
GEMINI_API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

### 3. Run the application:

```bash
mvn spring-boot:run
```

That's it! The `.env` file will be automatically loaded when the application starts.

## How It Works:

1. **DotenvConfig.java** - Loads `.env` file before Spring Boot starts
2. **spring.factories** - Registers the initializer
3. **dotenv-java** - Handles .env file parsing

## Priority:

1. Environment variables from `.env` file (highest priority)
2. System environment variables
3. Default values in `application.properties` (fallback)

## Production:

In production, don't use `.env` files. Instead:

- Set environment variables directly in your hosting platform
- Use secret management services (AWS Secrets Manager, Azure Key Vault, etc.)

---

**Note:** The `.env` file is in `.gitignore` and will never be committed to version control.
