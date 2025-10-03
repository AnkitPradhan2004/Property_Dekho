const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Property = require("../models/Property");

const isOwnerOrAdmin = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // allow if admin or the property owner
    if (
      req.user.role === "admin" ||
      property.agent.toString() === req.user._id.toString()
    ) {
      return next();
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (err) {
    console.error('Owner/Admin check error:', err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

const isAuthenticated = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authorization Token Missing" });
    }
    const token = auth.split(' ')[1];
    const userDetails = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userDetails.id).select('-password');
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: "Access denied for users" });
};

module.exports = { isAdmin, isAuthenticated, isOwnerOrAdmin };