const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/jwtMiddleware"); // Moved middleware to a separate file
const { route } = require("./quiz");

// Middleware to authenticate token
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ username: user.username });
  } catch (err) {
    console.error(err); // Use console.error for errors
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get user rank (Elo rating)
router.get("/rank", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ rank: user.eloRating });
  } catch (err) {
    console.error(err); // Consistent logging for errors
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the authenticated request
    const user = await User.findById(userId).select("-password"); // Exclude password from the result

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Return user data
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Change Password route
router.post("/change-password", authenticateToken, async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "New password is required" });
  }

  try {
    const userId = req.user.id; // Get user ID from the authenticated request
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password; // Update the user's password
    await user.save(); // Save the user with the new password

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
