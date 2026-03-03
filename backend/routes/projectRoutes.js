import express from "express";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Get all projects (Explore page)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("vendor", "fullname companyName email logo");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Get all projects by a vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(vendorId))
      return res.status(400).json({ message: "Invalid Vendor ID" });

    const projects = await Project.find({ vendor: vendorId });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Get a single project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("vendor");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new project with image uploads
router.post("/add", upload.array("images", 10), async (req, res) => {
  try {
    const { vendorId, projectName, description, category } = req.body;
    if (!vendorId || !projectName) return res.status(400).json({ error: "All fields are required" });

    const images = req.files.map((file) => file.filename);

    const newProject = new Project({
      vendor: vendorId,
      projectName,
      description,
      category,
      images,
    });

    await newProject.save();
    res.status(201).json({ success: true, project: newProject });
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Update a project
router.put("/:vendorId/:projectId", async (req, res) => {
  try {
    const { vendorId, projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).json({ message: "Invalid Project ID" });

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, vendor: vendorId },
      req.body,
      { new: true }
    );

    res.json({ success: true, project: updatedProject });
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// Delete a project
router.delete("/:vendorId/:projectId", async (req, res) => {
  try {
    const { vendorId, projectId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).json({ message: "Invalid Project ID" });

    await Project.findOneAndDelete({ _id: projectId, vendor: vendorId });
    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

export default router;
