const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");
const controller = require("../controllers/adminController");

// Only admin can access these routes
router.get("/users", isAuthenticated, isAdmin, controller.getAllUsers);
router.patch("/block/:id", isAuthenticated, isAdmin, controller.blockUser);
router.patch("/unblock/:id", isAuthenticated, isAdmin, controller.unblockUser);

module.exports = router;
