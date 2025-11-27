const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "your_jwt_secret");

      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) return res.status(401).json({ message: "User not found" });

      return next();
    }

    return res.status(401).json({ message: "No token, authorization denied" });

  } catch (err) {
    return res.status(401).json({ message: "Token failed or expired" });
  }
};

// Admin only
const adminProtect = (req, res, next) => {
  if (req.user && req.user.isAdmin === true) return next();
  return res.status(403).json({ message: "Admin access only" });
};

module.exports = { protect, adminProtect };
