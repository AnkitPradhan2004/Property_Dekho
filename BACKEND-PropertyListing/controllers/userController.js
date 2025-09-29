const User = require("../models/User");
// ⭐ Add/Remove Favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) return res.status(400).json({ message: "propertyId required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.indexOf(propertyId);
    if (index > -1) {
      user.favorites.splice(index, 1); // remove
    } else {
      user.favorites.push(propertyId); // add
    }

    await user.save();
    res.json({ message: "Favorites updated", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ⚖️ Add/Remove Comparison
exports.toggleComparison = async (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) return res.status(400).json({ message: "propertyId required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.comparisons.indexOf(propertyId);
    if (index > -1) {
      user.comparisons.splice(index, 1); // remove
    } else {
      user.comparisons.push(propertyId); // add
    }

    await user.save();
    res.json({ message: "Comparisons updated", comparisons: user.comparisons });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ⭐ Get Favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ⚖️ Get Comparisons
exports.getComparisons = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("comparisons");
    res.json(user.comparisons);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};