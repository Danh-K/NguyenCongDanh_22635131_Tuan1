const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken, authorize } = require("../middleware/authMiddleware");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", verifyToken, authController.getMe);

router.post("/refresh-token", authController.refreshToken);

router.put("/change-password", verifyToken, authController.changePassword);

// Routes for testing Authorization
router.get("/admin", verifyToken, authorize("admin"), (req, res) => {
  res.json({ message: "Chào mừng Admin! Bạn có quyền truy cập này." });
});

router.get("/guest", verifyToken, authorize("user", "admin"), (req, res) => {
    res.json({ message: "Chào mừng Guest/User! Bạn có quyền truy cập này." });
});

module.exports = router;
