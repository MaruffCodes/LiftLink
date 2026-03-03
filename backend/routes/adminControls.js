import express from "express";
import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get All Users
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Get All Vendors
router.get("/vendors", authMiddleware, async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendors" });
  }
});

// Update User
router.put("/users/:id", authMiddleware, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// Update Vendor
router.put("/vendors/:id", authMiddleware, async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json(updatedVendor); // Directly return the updated vendor object
  } catch (error) {
    res.status(500).json({ message: "Error updating vendor" });
  }
});

// Delete User
router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Delete Vendor
router.delete("/vendors/:id", authMiddleware, async (req, res) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vendor" });
  }
});

export default router;