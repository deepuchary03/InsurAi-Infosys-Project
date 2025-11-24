# 🔐 Environment Variables Setup Guide

This guide explains how to properly configure environment variables for the Online Corporate Insurance System.

---

## 📋 Required Environment Variables

### 1. **MySQL Database Password**

```bash
MYSQL_PASSWORD=your_mysql_password
```

- Default: `5025`
- Description: Password for your MySQL root user
- Where to get: Set during MySQL installation

### 2. **Google Gemini API Key**

```bash
GEMINI_API_KEY=your_gemini_api_key
```

- Example: `AIzaSyBsycy5hRTzrUyIAZdRaBKDht1dPAlrVO0`
- Description: API key for Google Gemini AI integration
- **Where to get:** https://makersuite.google.com/app/apikey
- Free tier available with generous limits

### 3. **JWT Secret Key**

```bash
JWT_SECRET=your_long_secret_key_minimum_32_characters
```

- Example: `mySecretKeyForJWTTokenGenerationAndValidation12345678901234567890`
- Description: Secret key for signing JWT tokens
- **Important:** Must be at least 32 characters for HS256 algorithm
- Generate secure key: Use online generator or command below

### 4. **Gmail SMTP Username**

```bash
MAIL_USERNAME=your-email@gmail.com
```

- Example: `deepuchary03@gmail.com`
- Description: Gmail account for sending emails

### 5. **Gmail App Password**

```bash
MAIL_PASSWORD=your_app_password
```

- Example: `abcd efgh ijkl mnop`
- Description: Gmail App Password (NOT your regular Gmail password)
- **Where to get:** https://myaccount.google.com/apppasswords
- Follow steps below to generate

---

## 🚀 Setup Methods

### **Method 1: Using PowerShell Script (Windows - Recommended)**

1. Navigate to backend directory:

```powershell
cd c:\Users\chary\Desktop\mvp\backend
```

2. Run the setup script:

```powershell
.\set-env.ps1
```

3. Start the application:

```powershell
mvn spring-boot:run
```

---

### **Method 2: Using Bash Script (Mac/Linux)**

1. Navigate to backend directory:

```bash
cd /path/to/mvp/backend
```

2. Source the setup script:

```bash
source set-env.sh
```

3. Start the application:

```bash
mvn spring-boot:run
```

---

### **Method 3: Manual Setup (Windows PowerShell)**

```powershell
$env:MYSQL_PASSWORD = "5025"
$env:GEMINI_API_KEY = "AIzaSyBsycy5hRTzrUyIAZdRaBKDht1dPAlrVO0"
$env:JWT_SECRET = "mySecretKeyForJWTTokenGenerationAndValidation12345678901234567890"
$env:MAIL_USERNAME = "deepuchary03@gmail.com"
$env:MAIL_PASSWORD = "cspp rwsg obzt kngp"
```

---

### **Method 4: Manual Setup (Mac/Linux Terminal)**

```bash
export MYSQL_PASSWORD="5025"
export GEMINI_API_KEY="AIzaSyBsycy5hRTzrUyIAZdRaBKDht1dPAlrVO0"
export JWT_SECRET="mySecretKeyForJWTTokenGenerationAndValidation12345678901234567890"
export MAIL_USERNAME="deepuchary03@gmail.com"
export MAIL_PASSWORD="cspp rwsg obzt kngp"
```

---

### **Method 5: Using .env File with Maven Plugin**

1. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

2. Edit `.env` with your actual credentials

3. Install `dotenv-maven-plugin` in `pom.xml` (optional)

---

## 🔑 How to Get API Keys

### **1. Google Gemini API Key**

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Set as `GEMINI_API_KEY`

**Free Tier:**

- 60 requests per minute
- 1,500 requests per day
- Perfect for development and testing

---

### **2. Gmail App Password**

1. Go to https://myaccount.google.com/apppasswords
2. Sign in to your Gmail account
3. Enable 2-Step Verification if not already enabled
4. Select "Mail" as the app
5. Select "Other" as the device and name it "Insurance System"
6. Click "Generate"
7. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
8. Set as `MAIL_PASSWORD`

**Important:**

- Use App Password, NOT your regular Gmail password
- App Passwords work with 2FA enabled accounts
- Keep this password secure and never share it

---

## 🔐 Generate Secure JWT Secret

### Using OpenSSL:

```bash
openssl rand -base64 64
```

### Using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

### Using Python:

```bash
python -c "import secrets; print(secrets.token_urlsafe(64))"
```

### Using PowerShell:

```powershell
$bytes = New-Object byte[] 64
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

---

## ✅ Verify Environment Variables

### Check if variables are set:

**Windows PowerShell:**

```powershell
echo $env:MYSQL_PASSWORD
echo $env:GEMINI_API_KEY
echo $env:JWT_SECRET
echo $env:MAIL_USERNAME
echo $env:MAIL_PASSWORD
```

**Mac/Linux:**

```bash
echo $MYSQL_PASSWORD
echo $GEMINI_API_KEY
echo $JWT_SECRET
echo $MAIL_USERNAME
echo $MAIL_PASSWORD
```

---

## 🛡️ Security Best Practices

### ✅ DO:

- ✅ Use environment variables for all sensitive data
- ✅ Keep `.env` file in `.gitignore`
- ✅ Use different secrets for dev/staging/production
- ✅ Rotate secrets regularly
- ✅ Use Gmail App Passwords instead of regular passwords
- ✅ Generate strong, random JWT secrets (minimum 256 bits)
- ✅ Use secret management services in production (AWS Secrets Manager, Azure Key Vault)

### ❌ DON'T:

- ❌ Commit `.env` file to Git
- ❌ Share secrets in plaintext (Slack, email, etc.)
- ❌ Use weak or short JWT secrets
- ❌ Hardcode secrets in source code
- ❌ Use the same secrets across environments
- ❌ Use your regular Gmail password

---

## 🐳 Docker Environment Variables

If using Docker, set variables in `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - MAIL_USERNAME=${MAIL_USERNAME}
      - MAIL_PASSWORD=${MAIL_PASSWORD}
```

Or use `--env-file`:

```bash
docker-compose --env-file .env up
```

---

## 🏭 Production Deployment

### AWS:

- Use **AWS Secrets Manager** or **Parameter Store**
- Set environment variables in Elastic Beanstalk console
- Use IAM roles for secure access

### Heroku:

```bash
heroku config:set GEMINI_API_KEY=your_key
heroku config:set JWT_SECRET=your_secret
heroku config:set MAIL_USERNAME=your_email
heroku config:set MAIL_PASSWORD=your_password
```

### Azure:

- Use **Azure Key Vault**
- Set application settings in App Service

---

## 🔍 Troubleshooting

### Issue: "Unknown property" warnings in application.properties

**Solution:** These are expected warnings for custom properties. They don't affect functionality.

### Issue: Email sending fails

**Solution:**

1. Verify Gmail App Password is correct
2. Ensure 2FA is enabled on Gmail account
3. Check for "Less secure app access" message

### Issue: Gemini AI not responding

**Solution:**

1. Verify API key is valid
2. Check API quota limits
3. Ensure internet connection is active

### Issue: JWT token validation fails

**Solution:**

1. Ensure JWT_SECRET is at least 32 characters
2. Verify the same secret is used for signing and validation
3. Check token expiration times

---

## 📞 Support

For issues related to:

- **Gemini API:** https://ai.google.dev/docs
- **Gmail SMTP:** https://support.google.com/mail/answer/7126229
- **JWT:** https://jwt.io/introduction

---

**Last Updated:** November 23, 2025
