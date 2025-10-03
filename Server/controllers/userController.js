const User = require("../models/User");
const mongoose = require('mongoose');

// GET /users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate('favorites comparisons');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(400).json({ message: "Invalid data" });
  }
};

// ⭐ Add/Remove Favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    console.log('Toggle favorite request:', { userId: req.user._id, propertyId });
    
    if (!propertyId) {
      console.log('Missing propertyId in request');
      return res.status(400).json({ message: "propertyId required" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      console.log('Invalid propertyId format:', propertyId);
      return res.status(400).json({ message: "Invalid propertyId format" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      console.log('User not found:', req.user._id);
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.favorites.indexOf(propertyId);
    let action;
    if (index > -1) {
      user.favorites.splice(index, 1); // remove
      action = 'removed';
      console.log('Removed from favorites:', propertyId);
    } else {
      user.favorites.push(propertyId); // add
      action = 'added';
      console.log('Added to favorites:', propertyId);
    }

    await user.save();
    console.log('Favorites updated successfully:', { action, favoritesCount: user.favorites.length });
    res.json({ message: "Favorites updated", favorites: user.favorites, action });
  } catch (err) {
    console.error('Toggle favorite error:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ⚖️ Add/Remove Comparison
exports.toggleComparison = async (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) return res.status(400).json({ message: "propertyId required" });

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: "Invalid propertyId format" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.comparisons.indexOf(propertyId);
    let action;
    if (index > -1) {
      user.comparisons.splice(index, 1); // remove
      action = 'removed';
    } else {
      if (user.comparisons.length >= 4) {
        return res.status(400).json({ message: "Maximum 4 properties can be compared" });
      }
      user.comparisons.push(propertyId); // add
      action = 'added';
    }

    await user.save();
    res.json({ message: "Comparisons updated", comparisons: user.comparisons, action });
  } catch (err) {
    console.error('Toggle comparison error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ⭐ Get Favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.favorites);
  } catch (err) {
    console.error('Get favorites error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ⚖️ Get Comparisons
exports.getComparisons = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("comparisons");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.comparisons);
  } catch (err) {
    console.error('Get comparisons error:', err.message);
    res.status(500).json({ message: "Server error" });
  }
};