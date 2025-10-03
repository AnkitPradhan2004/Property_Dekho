const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Property = require('../models/Property');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/property-dekho');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('Cleared existing data');

    // Create 10 Indian users + 1 admin
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = await User.create([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Amit Singh',
        email: 'amit@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Sneha Patel',
        email: 'sneha@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Vikram Gupta',
        email: 'vikram@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Kavya Reddy',
        email: 'kavya@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Ananya Joshi',
        email: 'ananya@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Rohit Agarwal',
        email: 'rohit@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Deepika Nair',
        email: 'deepika@example.com',
        password: hashedPassword,
        role: 'user'
      },
      {
        name: 'Ankit Pradhan',
        email: 'ankit@gmail.com',
        password: await bcrypt.hash('password@123', 12),
        role: 'admin'
      }
    ]);

    console.log('Created 10 Indian users + 1 admin');

    // Sample property images
    const sampleImages = [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop'
    ];

    // Create 2 properties per user (1 for rent, 1 for sale)
    const properties = [];
    const indianCities = [
      { city: 'Mumbai', region: 'Maharashtra', coords: [72.8777, 19.0760] },
      { city: 'Delhi', region: 'Delhi', coords: [77.1025, 28.7041] },
      { city: 'Bangalore', region: 'Karnataka', coords: [77.5946, 12.9716] },
      { city: 'Hyderabad', region: 'Telangana', coords: [78.4867, 17.3850] },
      { city: 'Chennai', region: 'Tamil Nadu', coords: [80.2707, 13.0827] },
      { city: 'Kolkata', region: 'West Bengal', coords: [88.3639, 22.5726] },
      { city: 'Pune', region: 'Maharashtra', coords: [73.8567, 18.5204] },
      { city: 'Ahmedabad', region: 'Gujarat', coords: [72.5714, 23.0225] },
      { city: 'Jaipur', region: 'Rajasthan', coords: [75.7873, 26.9124] },
      { city: 'Surat', region: 'Gujarat', coords: [72.8311, 21.1702] }
    ];

    const propertyTypes = ['apartment', 'house', 'office'];
    const amenitiesList = [
      ['Parking', 'Lift', 'Security', 'Power Backup'],
      ['Garden', 'Parking', 'Modular Kitchen', 'Balcony'],
      ['Swimming Pool', 'Gym', 'Club House', 'Security'],
      ['Park View', 'Parking', 'Lift', 'Intercom'],
      ['Gated Community', 'Security', 'Garden', 'Parking']
    ];

    // Create properties for each user (excluding admin)
    for (let i = 0; i < 10; i++) {
      const user = users[i];
      const cityData = indianCities[i];
      
      // Property for RENT
      properties.push({
        title: `${propertyTypes[i % 3].charAt(0).toUpperCase() + propertyTypes[i % 3].slice(1)} for Rent in ${cityData.city}`,
        description: `Beautiful ${propertyTypes[i % 3]} available for rent in prime location of ${cityData.city}. Well-maintained property with modern amenities.`,
        price: 15000 + (i * 5000),
        type: propertyTypes[i % 3],
        location: {
          address: `${100 + i} Main Road, Sector ${i + 1}`,
          city: cityData.city,
          region: cityData.region,
          zip: `${400000 + i}01`,
          coordinates: cityData.coords
        },
        amenities: amenitiesList[i % 5],
        bedrooms: 2 + (i % 3),
        bathrooms: 1 + (i % 2),
        squareFootage: 800 + (i * 200),
        images: [sampleImages[i % 5], sampleImages[(i + 1) % 5]],
        agent: user._id
      });

      // Property for SALE
      properties.push({
        title: `${propertyTypes[(i + 1) % 3].charAt(0).toUpperCase() + propertyTypes[(i + 1) % 3].slice(1)} for Sale in ${cityData.city}`,
        description: `Spacious ${propertyTypes[(i + 1) % 3]} for sale in ${cityData.city}. Ready to move property with all modern facilities and excellent connectivity.`,
        price: 2500000 + (i * 500000),
        type: propertyTypes[(i + 1) % 3],
        location: {
          address: `${200 + i} Park Street, Block ${String.fromCharCode(65 + i)}`,
          city: cityData.city,
          region: cityData.region,
          zip: `${400000 + i}02`,
          coordinates: cityData.coords
        },
        amenities: amenitiesList[(i + 1) % 5],
        bedrooms: 2 + ((i + 1) % 4),
        bathrooms: 2 + (i % 2),
        squareFootage: 1000 + (i * 300),
        images: [sampleImages[(i + 2) % 5], sampleImages[(i + 3) % 5]],
        agent: user._id
      });
    }

    await Property.create(properties);
    console.log('Created 20 properties (2 per user - 1 rent, 1 sale)');
    console.log('Indian users and properties created successfully!');
    console.log('\n=== USER CREDENTIALS (All passwords: password123) ===');
    console.log('1. rajesh@example.com - Rajesh Kumar');
    console.log('2. priya@example.com - Priya Sharma');
    console.log('3. amit@example.com - Amit Singh');
    console.log('4. sneha@example.com - Sneha Patel');
    console.log('5. vikram@example.com - Vikram Gupta');
    console.log('6. kavya@example.com - Kavya Reddy');
    console.log('7. arjun@example.com - Arjun Mehta');
    console.log('8. ananya@example.com - Ananya Joshi');
    console.log('9. rohit@example.com - Rohit Agarwal');
    console.log('10. deepika@example.com - Deepika Nair');
    console.log('\nAdmin: ankit@gmail.com / password@123');
    console.log('\nTotal: 20 properties created (2 per user - 1 for rent, 1 for sale)');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();