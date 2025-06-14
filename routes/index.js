const router = require("express").Router();

// Routes
const authRoutes = require("./authRoutes");

// End Points
router.use("/auth", authRoutes);

module.exports = router;