# ⚡ Quick Start Guide

Get your Online Corporate Insurance System up and running in 10 minutes!

---

## 🎯 What You'll Need

- ☑️ Java 17 or higher
- ☑️ Node.js 18+ and npm
- ☑️ MySQL 8.0+
- ☑️ Google Gemini API Key (free at https://makersuite.google.com/app/apikey)
- ☑️ 10 minutes of your time

---

## 🚀 5-Step Setup

### Step 1: Download/Clone the Project ⬇️

```powershell
cd C:\Users\chary\Desktop\mvp
```

---

### Step 2: Setup MySQL Database 🗄️

Open MySQL Workbench or command line:

```sql
CREATE DATABASE insurance_db;
```

That's it! Tables will be auto-created on first run.

---

### Step 3: Configure Backend ⚙️

1. Open `backend/src/main/resources/application.properties`

2. Update these values:

```properties
# Your MySQL password
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Get this from: https://makersuite.google.com/app/apikey
gemini.api.key=YOUR_GEMINI_API_KEY

# Optional: For email notifications
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

3. Save the file

---

### Step 4: Start Backend 🎮

```powershell
cd backend
mvn spring-boot:run
```

✅ Wait for: `"🚀 Online Corporate Insurance System Started Successfully!"`

Backend is now running on **http://localhost:8081**

---

### Step 5: Start Frontend 🎨

Open a **new terminal**:

```powershell
cd frontend
npm install
npm run dev
```

✅ Wait for: `"Local: http://localhost:3000"`

---

## 🎉 Access Your Application

Open your browser and go to:

```
http://localhost:3000
```

---

## 👤 Create Your First Account

### Register as a Customer

1. Click **"Sign up"** on the login page
2. Fill in:
   - **Email:** customer@test.com
   - **Password:** password123
   - **Full Name:** John Doe
   - **Role:** Customer
3. Click **"Create Account"**

You're now logged in! 🎊

---

## 🧪 Test the Features

### 1. Browse Agents 👥

- Click **"Agents"** in the navigation
- See available insurance agents
- View their ratings and specializations

### 2. Book an Appointment 📅

- Click **"Book Appointment"** button
- Select an agent
- Choose a time slot
- Confirm booking

**Note:** You'll need to create an agent account first and set availability!

### 3. Try the AI Assistant 🤖

- Click **"AI Assistant"** in navigation
- Type or speak: **"What types of insurance do you offer?"**
- Get instant AI-powered responses
- Try voice input by clicking the microphone 🎤

### 4. View Dashboard 📊

- See your appointment statistics
- View upcoming appointments
- Quick actions at your fingertips

---

## 🎭 Create Different User Types

### Create an Agent Account

1. **Logout** from customer account
2. **Sign up** again with:
   - Role: **Agent**
   - Specialization: Life Insurance
3. **Login** as agent
4. Set your availability:
   - Go to availability settings
   - Add time slots

### Create an Admin Account

1. **Register** with role: **Admin**
2. **Login** as admin
3. Access the **Admin Dashboard** with:
   - 📊 Comprehensive analytics
   - 📅 Appointment calendar
   - 📈 Charts and statistics

---

## 🎨 Dashboard Overview

### Customer Dashboard

- View total appointments
- See upcoming meetings
- Book new appointments
- Access AI assistant
- Browse agents

### Agent Dashboard

- Manage availability
- View appointment requests
- Confirm/cancel bookings
- Track statistics

### Admin Dashboard

- System-wide analytics
- Interactive calendar with all appointments
- Pie chart: Appointment distribution
- Bar chart: Weekly/monthly trends
- AI query statistics
- User management insights

---

## 🔧 Common Issues & Solutions

### ❌ "Connection refused" Error

**Problem:** Backend not started  
**Solution:** Run `mvn spring-boot:run` in backend directory

---

### ❌ MySQL Connection Error

**Problem:** Wrong password or database doesn't exist  
**Solution:**

```sql
-- Check database exists
SHOW DATABASES;

-- Create if needed
CREATE DATABASE insurance_db;
```

---

### ❌ "CORS Error" in Browser

**Problem:** Backend not running or wrong URL  
**Solution:** Ensure backend is on port 8081

---

### ❌ npm Install Fails

**Solution:**

```powershell
# Clear npm cache
npm cache clean --force
rm -r node_modules
rm package-lock.json
npm install
```

---

### ❌ AI Assistant Not Working

**Problem:** Invalid or missing Gemini API key  
**Solution:**

1. Get free key from https://makersuite.google.com/app/apikey
2. Add to `application.properties`
3. Restart backend

---

## 📱 Features Checklist

Test these features to ensure everything works:

- ✅ **User Registration** - Create account
- ✅ **Login/Logout** - Authentication works
- ✅ **Agent Browsing** - View agent list
- ✅ **Appointment Booking** - Schedule meeting
- ✅ **AI Assistant** - Ask questions
- ✅ **Voice Input** - Speak to AI
- ✅ **Dashboard Stats** - View analytics
- ✅ **Email Notifications** - Check inbox (if configured)
- ✅ **Calendar View** - Admin dashboard
- ✅ **Charts** - Admin analytics

---

## 🎓 Sample Data

### Test Scenarios

**Scenario 1: Customer Books Appointment**

```
1. Register as customer
2. Browse available agents
3. Select agent
4. Choose time slot
5. Confirm booking
6. View in "My Appointments"
```

**Scenario 2: Agent Manages Availability**

```
1. Register as agent
2. Go to availability settings
3. Add multiple time slots
4. View incoming appointments
5. Confirm/decline requests
```

**Scenario 3: AI Assistant Query**

```
1. Click "AI Assistant"
2. Ask: "How do I file a claim?"
3. Get AI response
4. Try booking suggestion if offered
```

**Scenario 4: Admin Views Analytics**

```
1. Login as admin
2. View dashboard statistics
3. Check appointment calendar
4. Analyze pie/bar charts
5. Review AI query logs
```

---

## 🌟 Pro Tips

### Tip 1: Voice Recognition

- Works best in Chrome browser
- Requires microphone permission
- Clear speech for best results

### Tip 2: Email Notifications

- Use Gmail App Password (not regular password)
- Enable "Less secure app access" or use OAuth
- Check spam folder for test emails

### Tip 3: Database Inspection

```sql
-- View all users
SELECT * FROM users;

-- View appointments
SELECT * FROM appointments;

-- View AI queries
SELECT * FROM ai_query_logs;
```

### Tip 4: Testing Multiple Roles

- Use incognito/private windows
- Or different browsers
- Or logout between role switches

---

## 📚 Next Steps

### Explore the Documentation

1. **README.md** - Full project overview
2. **API_DOCUMENTATION.md** - Complete API reference
3. **ARCHITECTURE.md** - System design details
4. **DEPLOYMENT.md** - Production deployment guide

### Customize the System

1. Modify insurance types in backend
2. Customize email templates
3. Add your branding/logo
4. Adjust color schemes in Tailwind config
5. Add more AI query categories

### Extend Features

- Add payment integration
- Implement policy document upload
- Add SMS notifications
- Create mobile app
- Add multi-language support
- Implement chat system

---

## 🆘 Need Help?

### Resources

- **Backend Logs:** Check console where `mvn spring-boot:run` is running
- **Frontend Logs:** Open browser Developer Tools (F12) → Console
- **Database:** Use MySQL Workbench to inspect data
- **API Testing:** Use Postman or cURL commands from API docs

### Debug Checklist

1. ✅ MySQL service running?
2. ✅ Backend showing "Started Successfully"?
3. ✅ Frontend showing "Local: http://localhost:3000"?
4. ✅ Browser console showing no errors?
5. ✅ Gemini API key valid?
6. ✅ Database credentials correct?

---

## 🎊 You're All Set!

Your Online Corporate Insurance System is now running with:

✅ **AI-Powered Assistant** using Google Gemini  
✅ **Interactive Calendar** with FullCalendar  
✅ **Beautiful Charts** with Recharts  
✅ **Voice Recognition** with Web Speech API  
✅ **Email Notifications** with JavaMail  
✅ **Secure Authentication** with JWT  
✅ **Professional UI** with Tailwind CSS

**Time to explore and innovate! 🚀**

---

## 📞 Quick Reference

### URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:8081
- API Health: http://localhost:8081/api/v1/health

### Default Ports

- Frontend: 3000
- Backend: 8081
- MySQL: 3306

### Key Directories

- Backend Code: `backend/src/main/java/com/insurance`
- Frontend Code: `frontend/src`
- Backend Config: `backend/src/main/resources/application.properties`

---

**Enjoy building with the Online Corporate Insurance System! 🎉**
