import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const ManageProfile = () => {
  const [vendor, setVendor] = useState({});
  const [logo, setLogo] = useState(null);

  const vendorData = JSON.parse(localStorage.getItem("vendor"));
  const vendorId = vendorData ? vendorData._id : null;

  const fetchProfile = useCallback(async () => {
    if (!vendorId) {
      console.error("Vendor ID not found in localStorage");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/vendor/profile/${vendorId}`);
      setVendor(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, [vendorId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => setVendor({ ...vendor, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorId) return alert("Vendor ID is missing. Please log in again.");

    const formData = new FormData();
    Object.entries(vendor).forEach(([key, value]) => formData.append(key, value));
    if (logo) formData.append("logo", logo);

    try {
      await axios.put(`http://localhost:5000/api/vendor/profile/${vendorId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile Updated Successfully!");
      fetchProfile();
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update profile!");
    }
  };

  return (
    <div className="container my-4 p-4 vendor-profile">
      <h2 className="text-center text-white">Manage Profile</h2>
      <form onSubmit={handleSubmit} className="text-white">
        {["fullname", "companyName", "description", "location", "contact"].map((field) => (
          <div className="form-group" key={field}>
            <label>{field.replace(/([A-Z])/g, " $1").trim()}</label>
            <input
              type="text"
              name={field}
              className="form-control"
              value={vendor[field] || ""}
              onChange={handleChange}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Upload Logo</label>
          <input type="file" className="form-control-file" onChange={(e) => setLogo(e.target.files[0])} />
          {vendor.logo && <img src={`http://localhost:5000/uploads/${vendor.logo}`} alt="Logo" width="100" />}
        </div>

        <button type="submit" className="btn btn-primary mt-3">Update Profile</button>
      </form>
    </div>
  );
};

export default ManageProfile;
