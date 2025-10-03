const Property = require("../models/Property");

// GET /properties (with filters)
exports.getProperties = async (req, res) => {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      city,
      bedrooms,
      amenities,
      sortBy,
      sortOrder,
      page,
      limit,
      lat,
      lng,
      radius,
      query,
      location
    } = req.query;

    let filters = {};

    // General search query
    if (query) {
      filters.$or = [
        { title: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { "location.city": new RegExp(query, 'i') },
        { "location.region": new RegExp(query, 'i') },
        { "location.address": new RegExp(query, 'i') },
        { amenities: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    // Location filter
    if (location && !query) {
      filters.$or = [
        { "location.city": new RegExp(location, 'i') },
        { "location.region": new RegExp(location, 'i') },
        { "location.address": new RegExp(location, 'i') }
      ];
    }

    // Type filter
    if (type) filters.type = type;

    // Location filter - support multiple location fields
    if (city) {
      filters.$or = [
        { "location.city": new RegExp(city, 'i') },
        { "location.region": new RegExp(city, 'i') },
        { "location.address": new RegExp(city, 'i') },
        { "title": new RegExp(city, 'i') },
        { "description": new RegExp(city, 'i') }
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    // Bedrooms filter
    if (bedrooms) filters.bedrooms = { $gte: Number(bedrooms) };

    // Amenities filter (comma separated) - sanitize input
    if (amenities) {
      const sanitizedAmenities = amenities.split(",").map(a => a.trim()).filter(a => a.length > 0);
      if (sanitizedAmenities.length > 0) {
        filters.amenities = { $all: sanitizedAmenities };
      }
    }

    // Geo-radius filter (requires property.location.coordinates with [lng,lat])
    if (lat && lng && radius) {
      filters["location.coordinates"] = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius / 6378.1] // radius in km
        }
      };
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1; // default newest first
    }

    const total = await Property.countDocuments(filters);
    const properties = await Property.find(filters)
      .populate("agent", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.json({
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      properties
    });
  } catch (err) {
    console.error('Get properties error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /properties/:id
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("agent", "name email phone");
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /properties (Admin/Agent only)
exports.createProperty = async (req, res) => {
  try {
    console.log('Received property creation request:', req.body);
    
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is required' });
    }
    
    // Validate and sanitize input data
    const allowedFields = ['title', 'description', 'type', 'price', 'location', 'bedrooms', 'bathrooms', 'squareFootage', 'amenities', 'images'];
    const propertyData = {};
    
    allowedFields.forEach(field => {
      if (req.body && req.body[field] !== undefined) {
        propertyData[field] = req.body[field];
      }
    });
    
    // Ensure required fields
    if (!propertyData.title || !propertyData.price || !propertyData.type) {
      return res.status(400).json({ message: 'Title, price, and type are required' });
    }
    
    // Validate price is a positive number
    const price = parseFloat(propertyData.price);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Price must be a valid positive number' });
    }
    propertyData.price = price;
    
    // Validate numeric fields
    if (propertyData.bedrooms !== undefined && propertyData.bedrooms !== '') {
      const bedrooms = parseInt(propertyData.bedrooms);
      if (isNaN(bedrooms) || bedrooms < 0) {
        return res.status(400).json({ message: 'Bedrooms must be a valid number' });
      }
      propertyData.bedrooms = bedrooms;
    }
    
    if (propertyData.bathrooms !== undefined && propertyData.bathrooms !== '') {
      const bathrooms = parseInt(propertyData.bathrooms);
      if (isNaN(bathrooms) || bathrooms < 0) {
        return res.status(400).json({ message: 'Bathrooms must be a valid number' });
      }
      propertyData.bathrooms = bathrooms;
    }
    
    if (propertyData.squareFootage !== undefined && propertyData.squareFootage !== '') {
      const sqft = parseFloat(propertyData.squareFootage);
      if (isNaN(sqft) || sqft <= 0) {
        return res.status(400).json({ message: 'Square footage must be a valid positive number' });
      }
      propertyData.squareFootage = sqft;
    }
    
    // Ensure location object exists and has required fields
    if (!propertyData.location || typeof propertyData.location !== 'object') {
      propertyData.location = {};
    }
    
    // Add default coordinates if not provided
    if (!propertyData.location.coordinates || !Array.isArray(propertyData.location.coordinates)) {
      propertyData.location.coordinates = [0, 0]; // Default coordinates [lng, lat]
    }
    
    propertyData.agent = req.user._id;
    console.log('Creating property with data:', propertyData);
    
    const property = await Property.create(propertyData);
    res.status(201).json(property);
  } catch (err) {
    console.error('Create property error:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(400).json({ message: err.message || "Invalid data" });
  }
};

// PUT /properties/:id
exports.updateProperty = async (req, res) => {
  try {
    // Check if property exists and user owns it
    const existingProperty = await Property.findById(req.params.id);
    if (!existingProperty) return res.status(404).json({ message: "Property not found" });
    
    // Only allow owner or admin to update
    if (req.user.role !== 'admin' && existingProperty.agent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Parse JSON fields if they come as strings (from FormData)
    const parseField = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    // Validate and sanitize input data
    const allowedFields = ['title', 'description', 'type', 'price', 'location', 'bedrooms', 'bathrooms', 'squareFootage', 'amenities', 'images'];
    const updateData = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = parseField(req.body[field]);
      }
    });
    
    const property = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.json(property);
  } catch (err) {
    console.error('Update property error:', err.message);
    res.status(400).json({ message: "Invalid data" });
  }
};

// DELETE /properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    // Check if property exists and user owns it
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    
    // Only allow owner or admin to delete
    if (req.user.role !== 'admin' && property.agent.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /properties/user/:userId - Get user's properties
exports.getUserProperties = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Getting properties for user:', userId, 'Requested by:', req.user._id);
    
    // Only allow users to see their own properties or admin to see any
    if (req.user.role !== 'admin' && userId !== req.user._id.toString()) {
      console.log('Access denied: user role:', req.user.role, 'userId:', userId, 'req.user._id:', req.user._id.toString());
      return res.status(403).json({ message: "Access denied" });
    }

    const properties = await Property.find({ agent: userId })
      .populate('agent', 'name email')
      .sort({ createdAt: -1 });
    
    console.log('Found properties:', properties.length);
    res.json(properties);
  } catch (err) {
    console.error('Get user properties error:', err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /properties/nearby/:id - Get nearby properties
exports.getNearbyProperties = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    const { coordinates } = property.location || {};
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ message: "Property location not available" });
    }

    const radius = parseFloat(req.query.radius) || 5; // 5km default
    const limit = parseInt(req.query.limit) || 10;

    const nearbyProperties = await Property.find({
      _id: { $ne: property._id },
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [coordinates, radius / 6378.1]
        }
      }
    })
    .populate("agent", "name email")
    .limit(limit)
    .sort({ createdAt: -1 });

    res.json({
      center: coordinates,
      radius,
      properties: nearbyProperties
    });
  } catch (err) {
    console.error('Get nearby properties error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};

