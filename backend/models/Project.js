import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    projectName: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
    images: [{ type: String }], // ✅ Added for multiple image support
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema, "projects");
export default Project;
