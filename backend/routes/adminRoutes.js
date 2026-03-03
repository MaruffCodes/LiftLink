import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import User from "../models/User.js"; // ✅ Import User model
import Vendor from "../models/Vendor.js"; // ✅ Import Vendor model
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ Import authMiddleware

const router = express.Router();

// ✅ Admin Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ role: "admin", email: admin.email }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch All Users (with admin authentication)
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find(); // ✅ Fetch users from MongoDB
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// ✅ Fetch All Vendors (with admin authentication)
router.get("/vendors", authMiddleware, async (req, res) => {
  try {
    const vendors = await Vendor.find(); // ✅ Fetch vendors from MongoDB
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendors" });
  }
});

// ✅ Update User (with admin authentication)
router.put("/users/:id", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// ✅ Update Vendor (with admin authentication)
router.put("/vendors/:id", authMiddleware, async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(updatedVendor);
  } catch (error) {
    res.status(500).json({ message: "Error updating vendor" });
  }
});

// ✅ Delete User (with admin authentication)
router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// ✅ Delete Vendor (with admin authentication)
router.delete("/vendors/:id", authMiddleware, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vendor" });
  }
});

export default router;