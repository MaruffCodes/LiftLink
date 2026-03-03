import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import multer from "multer";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import vendorAuthRoutes from "./routes/vendorAuthRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminControlsRoutes from "./routes/adminControls.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import Vendor from "./models/Vendor.js";
import Service from "./models/Service.js";
import Admin from "./models/Admin.js";


dotenv.config();
connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

// Ensure Admin Exists at Startup
const createAdminIfNotExists = async () => {
  try {
    const adminExists = await Admin.findOne({ email: "admin@gmail.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await Admin.create({ email: "admin@gmail.com", password: hashedPassword });
      console.log(" Admin account created: admin@gmail.com / admin123");
    } else {
      console.log(" Admin already exists, skipping creation.");
    }
  } catch (error) {
    console.error(" Error ensuring admin exists:", error);
  }
};
createAdminIfNotExists();

//  Routes
app.use("/api/users", userRoutes);
app.use("/api/vendor/auth", vendorAuthRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/adminControls", adminControlsRoutes);
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api/reviews", reviewRoutes);

//  Serve uploads folder
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

//  Multer Storage Configuration (for vendor profile images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(path.resolve(), "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Vendor Profile Update Route (Fixes Services Issue)
app.put("/api/vendor/profile/:id", upload.single("logo"), async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    const { fullname, companyName, companyType, location, contact, email, compregno, description, services } = req.body;

    vendor.fullname = fullname || vendor.fullname;
    vendor.companyName = companyName || vendor.companyName;
    vendor.companyType = companyType || vendor.companyType;
    vendor.location = location || vendor.location;
    vendor.contact = contact || vendor.contact;
    vendor.email = email || vendor.email;
    vendor.compregno = compregno || vendor.compregno;
    vendor.description = description || vendor.description;

    // Convert service names into ObjectIds
    if (services) {
      try {
        const parsedServices = typeof services === "string" ? JSON.parse(services) : services;
        const serviceIds = await Promise.all(
          parsedServices.map(async (serviceName) => {
            const service = await Service.findOne({ serviceName });
            return service ? service._id : null;
          })
        );
        vendor.services = serviceIds.filter((id) => id !== null); // Removes null values
      } catch (error) {
        console.error(" Service Parsing Error:", error);
      }
    }

    if (req.file) vendor.logo = req.file.filename;

    await vendor.save();
    res.json({ message: " Profile updated successfully!", vendor });
  } catch (error) {
    console.error(" Vendor Profile Update Error:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
});
