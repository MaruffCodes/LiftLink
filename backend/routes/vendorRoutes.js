import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import Vendor from "../models/Vendor.js";
import Service from "../models/Service.js";
import Project from "../models/Project.js";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Fetch full vendor profile (services + projects)
router.get("/profile/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(vendorId))
      return res.status(400).json({ message: "Invalid Vendor ID" });

    const vendor = await Vendor.findById(vendorId).populate("services");
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const projects = await Project.find({ vendor: vendorId });
    res.status(200).json({ ...vendor.toObject(), projects });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

// Update vendor profile
router.put(
  "/profile/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "projectImages", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const vendorId = req.params.id;
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) return res.status(404).json({ message: "Vendor not found" });

      const {
        fullname,
        companyName,
        companyType,
        location,
        contact,
        description,
        email,
        compregno,
        services,
        projectDescriptions,
      } = req.body;

      if (fullname) vendor.fullname = fullname;
      if (companyName) vendor.companyName = companyName;
      if (companyType) vendor.companyType = companyType;
      if (location) vendor.location = location;
      if (contact) vendor.contact = contact;
      if (description) vendor.description = description;
      if (email) vendor.email = email;
      if (compregno) vendor.compregno = compregno;

      // Update services
      if (services) {
        try {
          const parsedServices = Array.isArray(services)
            ? services
            : typeof services === "string"
            ? JSON.parse(services)
            : [];

          let serviceIds = [];

          for (const serviceName of parsedServices) {
            if (typeof serviceName !== "string" || !serviceName.trim()) continue;
            let existingService = await Service.findOne({ serviceName });

            if (!existingService) {
              existingService = new Service({ serviceName, vendor: vendorId });
              await existingService.save();
            }

            serviceIds.push(existingService._id);
          }

          vendor.services = serviceIds;
        } catch (err) {
          console.error("Error processing services:", err);
        }
      }

      // Update logo
      if (req.files?.logo?.length > 0) {
        if (vendor.logo) fs.unlinkSync(path.join(uploadDir, vendor.logo));
        vendor.logo = req.files.logo[0].filename;
      }

      await vendor.save();

      // Save project images
      if (req.files?.projectImages?.length > 0) {
        const parsedDescriptions = projectDescriptions ? JSON.parse(projectDescriptions) : [];
        for (let i = 0; i < req.files.projectImages.length; i++) {
          const project = new Project({
            vendor: vendorId,
            title: `Project ${i + 1}`,
            description: parsedDescriptions[i] || "",
            image: req.files.projectImages[i].filename,
          });
          await project.save();
        }
      }

      res.json({ message: "Vendor profile updated successfully!", vendor });
    } catch (err) {
      res.status(500).json({ error: "Error updating profile", details: err.message });
    }
  }
);



export default router;
