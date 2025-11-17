# Property Dekho - Troubleshooting Guide

## Initial Setup Issues

### 1. App Not Loading / Data Not Loading

**Symptoms:**
- Blank page or loading spinner that never stops
- "Unable to connect to server" error
- Properties not showing up

**Solutions:**

1. **Check if both servers are running:**
   ```bash
   # Backend should be running on http://localhost:5000
   # Frontend should be running on http://localhost:5173
   ```

2. **Verify MongoDB connection:**
   - Make sure MongoDB URI in Server/.env is correct
   - Check if MongoDB Atlas cluster is accessible

3. **Run the setup script:**
   ```bash
   # Run this from the Property_Dekho folder
   setup-dev.bat
   ```

4. **Manual setup if script fails:**
   ```bash
   # Install server dependencies
   cd Server
   npm install
   
   # Install client dependencies  
   cd ../Client
   npm install
   
   # Seed database with sample data
   cd ../Server
   npm run seed
   ```

### 2. CORS Errors

**Symptoms:**
- "Access to fetch blocked by CORS policy" in browser console

**Solutions:**
1. Ensure Server/.env has: `CLIENT_URL=http://localhost:5173`
2. Ensure Client/.env has: `VITE_API_URL=http://localhost:5000`
3. Restart both servers after changing environment files

### 3. Database Connection Issues

**Symptoms:**
- "Mongo connection error" in server console
- Server crashes on startup

**Solutions:**
1. Check MongoDB URI in Server/.env
2. Ensure MongoDB Atlas cluster is running and accessible
3. Check network connectivity to MongoDB

### 4. Port Already in Use

**Symptoms:**
- "Port 5000 is already in use" or "Port 5173 is already in use"

**Solutions:**
1. Kill existing processes:
   ```bash
   # Kill processes on port 5000
   netstat -ano | findstr :5000
   taskkill /f /pid [PID_NUMBER]
   
   # Kill processes on port 5173  
   netstat -ano | findstr :5173
   taskkill /f /pid [PID_NUMBER]
   ```

2. Or use the start-dev.bat script which automatically kills existing processes

## Development Workflow

### Starting the Application

1. **Recommended:** Use the batch script
   ```bash
   start-dev.bat
   ```

2. **Manual start:**
   ```bash
   # Terminal 1 - Backend
   cd Server
   npm run dev
   
   # Terminal 2 - Frontend  
   cd Client
   npm run dev
   ```

### Testing the Setup

1. **Check backend health:**
   - Visit: http://localhost:5000/health
   - Should return: `{"status":"OK","message":"Property Dekho API is running"}`

2. **Check frontend:**
   - Visit: http://localhost:5173
   - Should load the Property Dekho homepage

3. **Test API connection:**
   - Visit: http://localhost:5000/properties/test
   - Should return: `{"message":"Backend is working!"}`

## Common Issues & Fixes

### No Properties Showing

1. **Seed the database:**
   ```bash
   cd Server
   npm run seed
   ```

2. **Check API endpoint:**
   - Open browser dev tools
   - Check Network tab for failed requests to /properties

### Authentication Issues

1. **Clear browser storage:**
   - Open browser dev tools
   - Go to Application/Storage tab
   - Clear localStorage and sessionStorage

2. **Check JWT secret:**
   - Ensure JWT_SECRET in Server/.env is at least 32 characters

### Image Upload Issues

1. **Check Cloudinary config:**
   - Verify CLOUDINARY_* variables in Server/.env
   - Test Cloudinary connection

## Environment Variables

### Server/.env (Required)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_32_chars_minimum
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Client/.env (Required)
```
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```

## Getting Help

If you're still experiencing issues:

1. Check the browser console for JavaScript errors
2. Check the server console for backend errors
3. Verify all environment variables are set correctly
4. Try clearing browser cache and localStorage
5. Restart both servers

## Sample User Credentials (After Seeding)

- **Admin:** ankit@gmail.com / password@123
- **Users:** rajesh@example.com / password123 (and 9 others)

The seed script creates 20 sample properties across 10 Indian cities.