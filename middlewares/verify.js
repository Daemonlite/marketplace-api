import jwt from "jsonwebtoken";
import User from "../models/User.js";

const verifyToken = async (req, res, next) => {
  try {
    // 1. Check for Authorization header (case-insensitive)
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // 2. Verify token format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format. Use 'Bearer <token>'",
      });
    }

    // 3. Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not provided",
      });
    }

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 5. Check if user exists and is not blocked
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "You are blocked by the admin",
      });
    }

    // 6. Attach user to request
    req.user = user; // Attach full user document instead of just decoded token
    next();

  } catch (error) {
    console.error("Token verification error:", error);
    
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};

export default verifyToken;