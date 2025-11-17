# 🏠 Property Dekho - Full Stack Real Estate Platform

A complete MERN stack real estate application with property listings, user authentication, image upload, search functionality, and admin panel.

## 🌟 Live Demo

- **Frontend**: https://property-dekho-in.onrender.com
- **Backend API**: https://propertydekho-in.onrender.com

## ✨ Features

### 🏡 Property Management
- Browse properties with infinite scroll
- Advanced search and filtering
- Create, edit, delete property listings
- Image upload with Cloudinary integration
- Interactive property maps
- Nearby properties discovery

### 👤 User Features
- JWT Authentication + Google OAuth
- User registration and login
- Profile management
- Favorites system
- Property comparison (up to 4)
- Real-time chat between users

### 🔐 Admin Features
- Admin dashboard
- User management (block/unblock)
- Property oversight
- Role-based access control

### 🎨 UI/UX
- Responsive design (mobile-first)
- Modern animations with Framer Motion
- Toast notifications
- Loading states and skeletons
- Touch-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data fetching
- **Axios** - HTTP client
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Socket.io** - Real-time chat
- **Cloudinary** - Image storage
- **Nodemailer** - Email service

## 🚀 Quick Start

> **⚡ FASTEST WAY:** Use the automated setup scripts!

### Option 1: Automated Setup (Recommended)
```bash
# 1. Setup dependencies and database
setup-dev.bat

# 2. Start development servers
start-dev.bat
```

### Option 2: Manual Setup

#### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

#### 1. Clone Repository
```bash
git clone https://github.com/AnkitPradhan2004/Property_Dekho.git
cd Property_Dekho
```

#### 2. Backend Setup
```bash
cd Server
npm install

# Environment is already configured for development
# Seed database with sample data
npm run seed

# Start server
npm run dev
```

#### 3. Frontend Setup
```bash
cd ../Client
npm install

# Environment is already configured for development
# Start frontend
npm run dev
```

#### 4. Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/health

### 🆘 Having Issues?
- Check **[QUICK_START.md](QUICK_START.md)** for step-by-step guide
- See **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for common problems

## 📋 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_chars
JWT_EXPIRES_IN=1d

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# URLs
FRONTEND_URL=http://localhost:5173
CLIENT_URL=http://localhost:5173
COOKIE_KEY=your_cookie_secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## 👥 Test Accounts

After running `npm run seed`:

**Regular Users** (password: `password123`):
- rajesh@example.com
- priya@example.com
- amit@example.com
- sneha@example.com
- vikram@example.com

**Admin** (password: `password@123`):
- ankit@gmail.com

## 🔌 API Endpoints

### Authentication
```
POST /auth/signup          # User registration
POST /auth/login           # User login
GET  /auth/me              # Get current user
GET  /auth/google          # Google OAuth
```

### Properties
```
GET    /properties         # Get all properties (with filters)
GET    /properties/:id     # Get single property
POST   /properties         # Create property (auth required)
PUT    /properties/:id     # Update property (auth required)
DELETE /properties/:id     # Delete property (auth required)
```

### Users
```
GET  /users/profile        # Get user profile
PUT  /users/profile        # Update profile
POST /users/favorites      # Toggle favorite
GET  /users/favorites      # Get favorites
POST /users/comparisons    # Toggle comparison
GET  /users/comparisons    # Get comparisons
```

### File Upload
```
POST /uploads/image        # Upload single image
POST /uploads/images       # Upload multiple images
```

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
│   └── package.json
│
├── USER_CREDENTIALS.md     # Test user accounts
└── README.md              # This file
```

## 🚀 Deployment

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set Root Directory: `Server`
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add environment variables
7. Deploy

### Frontend (Render)
1. Create new Static Site on Render
2. Connect GitHub repository
3. Set Root Directory: `Client`
4. Set Build Command: `npm run build`
5. Set Publish Directory: `dist`
6. Add environment variables
7. Deploy

## 🔒 Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt (12 rounds)
- Input sanitization and validation
- XSS protection with security headers
- Rate limiting on API endpoints
- CORS configuration
- Environment variable protection

## 🎯 Key Features Showcase

### Advanced Search
- Multi-field search (title, description, location)
- Price range filtering
- Property type filtering
- Amenities filtering
- Location-based search

### Real-time Chat
- Socket.io powered messaging
- User authentication for chat
- Message history
- Online/offline status

### Image Management
- Cloudinary integration
- Multiple image upload
- Image optimization
- Fallback placeholder images

### Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Ankit Pradhan**
- GitHub: [@AnkitPradhan2004](https://github.com/AnkitPradhan2004)
- Email: 2004ankitpradhan@gmail.com
- LinkedIn: [Ankit Pradhan](https://linkedin.com/in/ankitpradhan2004)

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for image management
- Render for deployment
- React community for amazing ecosystem
- All open-source contributors

---

⭐ **Star this repository if you found it helpful!**

🐛 **Found a bug?** [Create an issue](https://github.com/AnkitPradhan2004/Property_Dekho/issues)

💡 **Have suggestions?** [Start a discussion](https://github.com/AnkitPradhan2004/Property_Dekho/discussions)