# Property Dekho - Quick Start Guide

## 🚀 Get Started in 2 Steps

### Step 1: Install Dependencies
```bash
# Install frontend dependencies
cd Client
npm install
```

### Step 2: Start Frontend (Uses Deployed Backend)
```bash
# Start frontend only - connects to deployed backend automatically
start-frontend-only.bat
```

### Step 3: Open Application
- Frontend: http://localhost:5173
- Backend API: https://property-dekho-in.onrender.com
- Health Check: https://property-dekho-in.onrender.com/health

## ✅ What's Fixed

### Environment Configuration
- ✅ Client now connects to local server (http://localhost:5000)
- ✅ Server accepts requests from local client (http://localhost:5173)
- ✅ CORS properly configured for development
- ✅ Environment variables set for local development

### Error Handling
- ✅ Better error messages when server is not running
- ✅ React Error Boundary to catch UI crashes
- ✅ Improved retry logic for API calls
- ✅ Network error handling in authentication

### Database & Data
- ✅ Seed script creates 20 sample properties
- ✅ 10 Indian users + 1 admin account
- ✅ Properties across major Indian cities
- ✅ Sample images and realistic data

### Development Experience
- ✅ Automatic dependency installation
- ✅ Port conflict resolution
- ✅ Health check endpoint
- ✅ Comprehensive troubleshooting guide

## 🔑 Test Credentials

### Admin Account
- Email: `ankit@gmail.com`
- Password: `password@123`

### Sample User Accounts
- Email: `rajesh@example.com`
- Password: `password123`
- (9 more users available - see TROUBLESHOOTING.md)

## 🏠 Sample Data

After running the seed script, you'll have:
- **20 Properties** across 10 Indian cities
- **Mumbai, Delhi, Bangalore, Hyderabad, Chennai** and more
- **Apartments, Houses, Offices** for rent and sale
- **Realistic pricing** and property details
- **Sample images** from Unsplash

## 🛠️ Common Commands

```bash
# Full setup (first time)
setup-dev.bat

# Start development servers
start-dev.bat

# Seed database only
cd Server
npm run seed

# Install dependencies only
cd Server && npm install
cd Client && npm install
```

## 🔍 Verify Everything Works

1. **Backend Health Check**
   - Visit: http://localhost:5000/health
   - Should show: `{"status":"OK"}`

2. **Properties API**
   - Visit: http://localhost:5000/properties/test
   - Should show: `{"message":"Backend is working!"}`

3. **Frontend Loading**
   - Visit: http://localhost:5173
   - Should load Property Dekho homepage with properties

4. **Database Connection**
   - Properties should be visible on homepage
   - Login should work with test credentials

## 🆘 Need Help?

If something doesn't work:
1. Check `TROUBLESHOOTING.md` for detailed solutions
2. Verify environment variables in `.env` files
3. Check browser console for errors
4. Check server console for backend errors

## 📁 Project Structure

```
Property_Dekho/
├── Client/          # React frontend (Vite)
├── Server/          # Node.js backend (Express)
├── start-dev.bat    # Start development servers
├── setup-dev.bat    # Setup script
└── TROUBLESHOOTING.md
```

## 🎯 Next Steps

After setup:
1. Explore the property listings
2. Test user registration/login
3. Try creating a new property listing
4. Test the search and filter functionality
5. Check the responsive design on mobile

Happy coding! 🎉