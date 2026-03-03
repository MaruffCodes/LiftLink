const express = require('express');
const router = express.Router();
const Service = require('../models/Service'); // Assuming your service model is named Service
const Vendor = require('../models/Vendor');  // Assuming your vendor model is named Vendor

// Search for vendors by category or service name
router.get('/search', async (req, res) => {
  const keyword = req.query.keyword.toLowerCase();

  try {
    const services = await Service.find({
      $or: [
        { serviceName: { $regex: keyword, $options: 'i' } }, // Case insensitive search for service name
        { category: { $regex: keyword, $options: 'i' } },   // Case insensitive search for category
      ]
    }).populate('vendor'); // Populating vendor details for each service

    // Filter unique vendors
    const vendorIds = [...new Set(services.map(service => service.vendor._id))];
    const vendors = await Vendor.find({ _id: { $in: vendorIds } });

    res.json(vendors);
  } catch (err) {
    console.error("Error searching for vendors:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
