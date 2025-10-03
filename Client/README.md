# Property Dekho - Frontend

Modern React frontend for property listing application with advanced search, filters, image carousel, and comparison features.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your values

# Start development server
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

### Required
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

### Optional
- `VITE_CLOUDINARY_CLOUD_NAME` - For client-side image optimization
- `VITE_MAPBOX_TOKEN` - For map functionality
- `VITE_GOOGLE_MAPS_API_KEY` - Alternative map provider

## Features

### ✅ Core Features
- **Property Listings** - Grid, list, and map views
- **Advanced Search** - Real-time filtering and search
- **Image Carousel** - Zoom, swipe, and full-screen view
- **User Authentication** - Login, signup, and profile management
- **Favorites System** - Save and manage favorite properties
- **Property Comparison** - Side-by-side comparison of up to 4 properties
- **Infinite Scroll** - Smooth loading of more properties
- **Responsive Design** - Mobile-first, touch-friendly interface

### ✅ Advanced Features
- **Property Creation** - Upload images and create listings
- **Real-time Updates** - Live property data
- **Smart Filters** - Price range, location, amenities, etc.
- **Contact Forms** - Inquiry and contact functionality
- **Loading States** - Skeleton screens and shimmer effects
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Success and error feedback

## Sample Credentials

After backend seeding, use these credentials:

- **User**: john@example.com / password123
- **User**: jane@example.com / password123
- **Admin**: admin@example.com / password123

## Scripts

- `npm start` / `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
Client/
├── public/              # Static assets
├── src/
│   ├── api/            # API configuration
│   ├── components/     # Reusable components
│   ├── context/        # React context providers
│   ├── pages/          # Page components
│   ├── services/       # API service functions
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── .env.example        # Environment template
└── package.json        # Dependencies and scripts
```

## Key Components

### Pages
- **Home** - Property listings with search and filters
- **PropertyDetails** - Detailed property view with carousel
- **CreateListing** - Property creation form with image upload
- **Login/Signup** - Authentication pages
- **Dashboard** - User dashboard with favorites and listings

### Components
- **PropertyCard** - Property display card
- **PropertyCarousel** - Image carousel with zoom
- **ComparisonModal** - Side-by-side property comparison
- **AdvancedFilter** - Comprehensive filtering system
- **AnimatedSearchBar** - Search with suggestions
- **Navbar** - Navigation with user menu

## API Integration

The frontend integrates with the backend through:

### Authentication
```javascript
// Login
const response = await authAPI.login(email, password);

// Signup
const response = await authAPI.signup(name, email, password);

// Get current user
const user = await authAPI.getMe();
```

### Properties
```javascript
// Get properties with filters
const properties = await propertyAPI.getProperties({
  type: 'apartment',
  minPrice: 100000,
  maxPrice: 500000,
  city: 'New York'
});

// Create property with images
const formData = new FormData();
formData.append('title', 'Property Title');
formData.append('price', '250000');
// ... other fields
const property = await propertyAPI.createProperty(formData);
```

### Image Upload
```javascript
// Upload single image
const response = await uploadAPI.uploadImage(file);

// Upload multiple images
const response = await uploadAPI.uploadImages(files);
```

### User Features
```javascript
// Toggle favorite
await userAPI.toggleFavorite(propertyId);

// Get favorites
const favorites = await userAPI.getFavorites();

// Toggle comparison
await userAPI.toggleComparison(propertyId);
```

## Responsive Design

The application is fully responsive with:

- **Mobile First** - Optimized for mobile devices
- **Touch Friendly** - Large touch targets and gestures
- **Adaptive Layout** - Different layouts for different screen sizes
- **Performance** - Optimized images and lazy loading

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Adding New Components
1. Create component in `src/components/`
2. Export from component file
3. Import where needed

### Adding New Pages
1. Create page in `src/pages/`
2. Add route in `App.jsx`
3. Update navigation if needed

### API Integration
1. Add API functions to `src/services/api.js`
2. Use React Query for data fetching
3. Handle loading and error states

## Troubleshooting

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version: requires Node 18+

### API Connection Issues
- Verify `VITE_API_URL` in `.env`
- Check backend is running on correct port
- Verify CORS settings in backend

### Image Upload Issues
- Check file size limits (10MB max)
- Verify Cloudinary credentials
- Fallback URLs used if upload fails

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check JWT token format
- Verify backend auth endpoints

## Performance Optimization

- **Code Splitting** - Lazy loading of routes
- **Image Optimization** - WebP format and responsive images
- **Caching** - React Query for API caching
- **Bundle Analysis** - Use `npm run build` to analyze bundle size

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Environment Variables for Production
Set these in your deployment platform:
- `VITE_API_URL` - Your production API URL
- `VITE_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name