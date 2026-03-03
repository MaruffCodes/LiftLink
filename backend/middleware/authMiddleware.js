import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header (format: 'Bearer <token>')
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifying token
    req.admin = decoded; // Attach decoded token (admin info) to the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

export default authMiddleware;