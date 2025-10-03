# Property Dekho - Real Estate Platform

A modern full-stack real estate platform built with MERN stack, featuring property listings, advanced search, map integration, image upload, and user authentication.

## 🚀 Features

### Core Features
- **User Authentication** - JWT-based login/signup with Google OAuth
- **Property Management** - Full CRUD operations for properties
- **Image Upload** - Cloudinary integration with fallback support
- **Advanced Search** - Multi-field search with smart suggestions
- **Interactive Map** - Property locations with markers and popups
- **Favorites & Comparison** - Save and compare up to 4 properties
- **Responsive Design** - Mobile-first, touch-friendly interface

### Advanced Features
- **Infinite Scroll** - Smooth property loading
- **Real-time Filters** - Price, type, location, amenities
- **Image Carousel** - Zoom, swipe, full-screen view
- **Nearby Properties** - Location-based property discovery
- **User Dashboard** - Manage listings and favorites
- **Contact System** - Inquiry forms and messaging

## 🛠️ Tech Stack

**Frontend:**
- React 19 + Vite
- Tailwind CSS
- Framer Motion
- React Query
- Axios
- Lucide Icons

**Backend:**
- Node.js + Express
- MongoDB Atlas
- JWT Authentication
- Cloudinary
- Multer
- Passport.js (Google OAuth)

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (optional)
- Google OAuth credentials (optional)

## ⚡ Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd Property_Dekho

# Install backend dependencies
cd Server
npm install

# Install frontend dependencies
cd ../Client
npm install
```

### 2. Environment Setup

**Backend (.env in Server folder):**
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

# Cloudinary (optional - uses placeholder images if not provided)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# URLs
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
COOKIE_KEY=your_cookie_session_key
```

**Frontend (.env in Client folder):**
```env
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. Database Setup

```bash
# Seed database with sample data
cd Server
npm run seed
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd Server
npm start

# Terminal 2 - Frontend
cd Client
npm start
```

### 5. Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 🔐 Demo Credentials

After running the seed script:

- **User:** john@example.com / password123
- **User:** jane@example.com / password123
- **Admin:** admin@example.com / password123

## 📁 Project Structure

```
Property_Dekho/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── api/           # Axios configuration
│   ├── .env.example       # Environment template
│   └── package.json
│
├── Server/                 # Node.js Backend
│   ├── controllers/        # Route handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middlewares/       # Custom middleware
│   ├── config/            # Configuration files
│   ├── utils/             # Utility functions
│   ├── scripts/           # Database scripts
│   ├── .env.example       # Environment template
│   └── package.json
│
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication
```bash
POST /auth/signup          # User registration
POST /auth/login           # User login
GET  /auth/me              # Get current user
GET  /auth/google          # Google OAuth login
```

### Properties
```bash
GET    /properties         # List properties (with filters)
GET    /properties/:id     # Get single property
POST   /properties         # Create property (auth required)
PUT    /properties/:id     # Update property (auth required)
DELETE /properties/:id     # Delete property (auth required)
GET    /properties/nearby/:id  # Get nearby properties
```

### User Features
```bash
GET  /users/profile        # Get user profile
PUT  /users/profile        # Update profile
POST /users/favorites      # Toggle favorite
GET  /users/favorites      # Get favorites
POST /users/comparisons    # Toggle comparison
GET  /users/comparisons    # Get comparisons
```

### File Upload
```bash
POST /uploads/image        # Upload single image
POST /uploads/images       # Upload multiple images
```

## 🔍 Search Features

### Search Types
- **Text Search:** Property name, description, location
- **Location Search:** City, region, address
- **Filter Search:** Type, price, bedrooms, amenities
- **Map Search:** Nearby properties within radius

### Search Examples
```bash
# Search by location
GET /properties?query=New York

# Search with filters
GET /properties?type=apartment&minPrice=100000&maxPrice=500000

# Search by coordinates
GET /properties?lat=40.7128&lng=-74.0060&radius=10

# Combined search
GET /properties?query=modern&type=apartment&city=New York
```

## 🗺️ Map Integration

### Features
- Interactive property markers
- Property details on click
- User location detection
- Nearby property discovery
- Custom map controls
- Responsive design

### Usage
1. Switch to "Map" view mode
2. Click markers for property details
3. Use controls for navigation
4. Allow location access for user position

## 📱 Mobile Features

- Touch-friendly interface
- Swipe gestures for image carousel
- Responsive grid layouts
- Mobile-optimized search
- Touch-friendly map controls

## 🔒 Security Features

- JWT authentication
- Input sanitization
- XSS protection
- CORS configuration
- Rate limiting
- Password hashing (bcrypt)
- Environment validation

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Update CORS origins
3. Deploy to Heroku/Railway/DigitalOcean
4. Update frontend API URL

### Frontend Deployment
1. Update VITE_API_URL to production backend
2. Build: `npm run build`
3. Deploy to Vercel/Netlify/AWS S3

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Google OAuth login
- [ ] Property creation with image upload
- [ ] Property search and filtering
- [ ] Map view and property markers
- [ ] Favorites and comparison features
- [ ] Responsive design on mobile
- [ ] Image carousel functionality

### API Testing
```bash
# Test backend connection
curl http://localhost:5000/properties

# Test authentication
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Test property creation
curl -X POST http://localhost:5000/properties \
  -H "Authorization: Bearer <TOKEN>" \
  -F "title=Test Property" \
  -F "price=250000" \
  -F "type=apartment"
```

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MongoDB connection string
- Verify all required environment variables
- Ensure Node.js version 18+

**Frontend build fails:**
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check environment variables
- Verify API URL is correct

**Images not uploading:**
- Check Cloudinary credentials
- Verify file size limits (10MB max)
- Fallback URLs used if Cloudinary unavailable

**Google OAuth not working:**
- Verify Google OAuth credentials
- Check callback URL configuration
- Ensure domain is authorized

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

---

**Built with ❤️ using MERN Stack**