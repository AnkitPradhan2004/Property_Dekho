const express = require("express");
const router = express.Router();
const controller = require("../controllers/propertyController");
const { isAuthenticated, isAdmin, isOwnerOrAdmin } = require("../middlewares/authMiddleware");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Backend is working!", timestamp: new Date() });
});

// Public
router.get("/", controller.getProperties);
router.get("/nearby/:id", controller.getNearbyProperties);

// Get user's properties (must be before /:id to avoid conflicts)
router.get("/user/:userId", isAuthenticated, controller.getUserProperties);

// Get single property
router.get("/:id", controller.getPropertyById);

// Protected
router.post("/", isAuthenticated, controller.createProperty);
router.put("/:id", isAuthenticated, controller.updateProperty);
router.delete("/:id", isAuthenticated, controller.deleteProperty);

module.exports = router;
