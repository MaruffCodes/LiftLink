// routes/serviceRoutes.js

import express from "express";
import mongoose from "mongoose";
import Service from "../models/Service.js";

const router = express.Router();

// Get all services (Explore)
router.get("/all", async (req, res) => {
  try {
    const services = await Service.find().populate("vendor");
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Get services by vendorId
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return res.status(400).json({ message: "Invalid Vendor ID" });
    }

    const services = await Service.find({ vendor: vendorId });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Get single service by ID
router.get("/single/:serviceId", async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId).populate("vendor");
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Add new service
router.post("/add", async (req, res) => {
  try {
    const { serviceName, description, category, vendorId } = req.body;
    if (!vendorId || !serviceName)
      return res.status(400).json({ message: "Missing required fields" });

    const newService = new Service({
      serviceName,
      description,
      category,
      vendor: vendorId,
    });

    await newService.save();
    res.status(201).json({ success: true, service: newService });
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Update service
router.put("/:vendorId/:serviceId", async (req, res) => {
  try {
    const { vendorId, serviceId } = req.params;
    const updatedService = await Service.findOneAndUpdate(
      { _id: serviceId, vendor: vendorId },
      req.body,
      { new: true }
    );
    res.json({ success: true, service: updatedService });
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Delete service
router.delete("/:vendorId/:serviceId", async (req, res) => {
  try {
    const { vendorId, serviceId } = req.params;
    await Service.findOneAndDelete({ _id: serviceId, vendor: vendorId });
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

//images

export default router;
