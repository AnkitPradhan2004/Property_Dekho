const express = require("express");
const router = express.Router();
const controller = require("../controllers/propertyController");
const { isAuthenticated, isAdmin, isOwnerOrAdmin } = require("../middlewares/authMiddleware");

// Public
router.get("/", controller.getProperties);
router.get("/:id", controller.getPropertyById);

// Protected
router.post("/", isAuthenticated, controller.createProperty);
router.put("/:id", isAuthenticated, controller.updateProperty);

// Delete allowed for admin or property owner
router.delete("/:id", isAuthenticated, isOwnerOrAdmin, controller.deleteProperty);

module.exports = router;
