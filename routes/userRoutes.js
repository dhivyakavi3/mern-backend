const express = require("express");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ userId }, "your_jwt_secret", { expiresIn: "30d" });
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      isAdmin: isAdmin || false,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        }
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
