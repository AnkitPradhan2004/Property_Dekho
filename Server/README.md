# Property Dekho - Backend

MERN stack property listing application backend with JWT authentication, Cloudinary image upload, and MongoDB.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your values

# Start MongoDB (if using Docker)
docker-compose up -d

# Seed database with sample data
npm run seed

# Start development server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key (min 32 characters)
- `PORT` - Server port (default: 5000)

### Optional (fallbacks provided)
- `CLOUDINARY_*` - Image upload (uses placeholder URLs if not provided)
- `EMAIL_*` - Password reset emails
- `CLIENT_URL` - Frontend URL for CORS

## Database Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and get connection string
3. Set `MONGODB_URI` in `.env`

### Option 2: Local MongoDB with Docker
```bash
docker-compose up -d
# Use: MONGODB_URI=mongodb://localhost:27017/property-dekho
```

### Option 3: Local MongoDB Installation
Install MongoDB locally and use: `MONGODB_URI=mongodb://localhost:27017/property-dekho`

## API Endpoints

### Authentication
```bash
# Signup
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get current user
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### Properties
```bash
# Get all properties
curl -X GET http://localhost:5000/properties

# Get property by ID
curl -X GET http://localhost:5000/properties/<PROPERTY_ID>

# Create property (requires auth)
curl -X POST http://localhost:5000/properties \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Property","price":100000,"type":"apartment"}'
```

### Image Upload
```bash
# Upload single image
curl -X POST http://localhost:5000/uploads/image \
  -H "Authorization: Bearer <TOKEN>" \
  -F "image=@/path/to/image.jpg"

# Upload multiple images
curl -X POST http://localhost:5000/uploads/images \
  -H "Authorization: Bearer <TOKEN>" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### User Features
```bash
# Toggle favorite
curl -X POST http://localhost:5000/users/favorites \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"propertyId":"<PROPERTY_ID>"}'

# Get favorites
curl -X GET http://localhost:5000/users/favorites \
  -H "Authorization: Bearer <TOKEN>"
```

## Sample Credentials (after seeding)

- **User**: john@example.com / password123
- **User**: jane@example.com / password123  
- **Admin**: admin@example.com / password123

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Populate database with sample data

## Features

- ✅ JWT Authentication
- ✅ Property CRUD operations
- ✅ Image upload (Cloudinary + fallback)
- ✅ User favorites and comparisons
- ✅ Advanced filtering and search
- ✅ Rate limiting and security headers
- ✅ Input validation and sanitization
- ✅ Error handling and logging

## File Structure

```
Server/
├── config/           # Configuration files
├── controllers/      # Route handlers
├── middlewares/      # Custom middleware
├── models/          # MongoDB schemas
├── routes/          # API routes
├── scripts/         # Utility scripts
├── utils/           # Helper functions
├── .env.example     # Environment template
├── docker-compose.yml # Local MongoDB
└── server.js        # Entry point
```

## Troubleshooting

### MongoDB Connection Issues
- Check `MONGODB_URI` format
- Ensure MongoDB is running
- Check network connectivity for Atlas

### Cloudinary Upload Issues
- Verify credentials in `.env`
- Check file size limits (10MB max)
- Fallback URLs used if Cloudinary unavailable

### Authentication Issues
- Ensure `JWT_SECRET` is set and secure
- Check token format: `Bearer <token>`
- Verify user exists and is active