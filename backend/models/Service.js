import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    serviceName: { type: String, required: true, trim: true }, // ✅ Removed unique constraint
    description: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema, "services");
export default Service;
