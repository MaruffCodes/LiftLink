import Inquiry from "../models/Inquiry.js";

export const createInquiry = async (req, res) => {
  try {
    const { vendorId, name, email, message } = req.body;

    if (!vendorId || !name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const inquiry = new Inquiry({ vendorId, name, email, message });
    await inquiry.save();

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ error: "Failed to create inquiry" });
  }
};
