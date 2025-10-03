const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/authMiddleware");
const controller = require("../controllers/userController");

// Profile
router.get("/profile", isAuthenticated, controller.getProfile);
router.put("/profile", isAuthenticated, controller.updateProfile);

// Favorites
router.post("/favorites", isAuthenticated, controller.toggleFavorite);
router.get("/favorites", isAuthenticated, controller.getFavorites);

// Comparisons
router.post("/comparisons", isAuthenticated, controller.toggleComparison);
router.get("/comparisons", isAuthenticated, controller.getComparisons);

module.exports = router;
