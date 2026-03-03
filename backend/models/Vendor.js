import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  fullname: { type: String, trim: true, required: true },
  contact: { type: String, trim: true, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true, unique: true, trim: true },
  companyType: { type: String, trim: true },
  location: { type: String, trim: true },
  description: { type: String, trim: true },
  compregno: { type: String, trim: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service", default: [] }],
  logo: { type: String, trim: true },
}, { timestamps: true });

const Vendor = mongoose.model("Vendor", vendorSchema, "vendors");
export default Vendor;
