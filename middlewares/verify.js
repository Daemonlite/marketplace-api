import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
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
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Handle different JWT errors specifically
        let message = "Invalid token";
        if (err.name === "TokenExpiredError") {
          message = "Token expired";
        } else if (err.name === "JsonWebTokenError") {
          message = "Malformed token";
        }

        return res.status(403).json({
          success: false,
          message,
        });
      }

      // 5. Attach user to request
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
    });
  }
};

export default verifyToken;
