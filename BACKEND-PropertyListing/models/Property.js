const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  type: { type: String, enum: ["apartment", "house", "office"], required: true },
  location: {
    address: String,
    city: String,
    region: String,
    zip: String,
    coordinates: { type: [Number], index: "2dsphere" } // [lng, lat]
  },
  amenities: [String], // ["pool", "garden", "garage"]
  bedrooms: Number,
  bathrooms: Number,
  squareFootage: Number,
  images: [String], // URLs to images
  floorPlans: [String],
  videoTourUrl: String,
  virtualTourUrl: String,
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Property", propertySchema);
