const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ message: "User does not exists" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    return res.status(200).json({ message: "User Logged In!" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/signup", async (req, res) => {
  const { username, email, oassword } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(401).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
