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
      radius
    } = req.query;

    let filters = {};

    // Type filter
    if (type) filters.type = type;

    // Location filter
    if (city) filters["location.city"] = city;

    // Price filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    // Bedrooms filter
    if (bedrooms) filters.bedrooms = { $gte: Number(bedrooms) };

    // Amenities filter (comma separated)
    if (amenities) filters.amenities = { $all: amenities.split(",") };

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
    console.error(err);
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
    const property = await Property.create({ ...req.body, agent: req.user._id });
    res.status(201).json(property);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// PUT /properties/:id
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json(property);
  } catch (err) {
    res.status(400).json({ message: "Invalid data" });
  }
};

// DELETE /properties/:id
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

