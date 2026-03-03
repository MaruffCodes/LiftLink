import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ serviceName: "", description: "", category: "" });
  const [editingService, setEditingService] = useState(null);
  const [message, setMessage] = useState("");

  const vendorData = JSON.parse(localStorage.getItem("vendor"));
  const vendorId = vendorData ? vendorData._id : null;

  useEffect(() => {
    if (vendorId) fetchServices();
  }, [vendorId]);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/services/vendor/${vendorId}`);
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const handleServiceChange = (e) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const addService = async () => {
    if (!newService.serviceName.trim()) {
      alert("Service name cannot be empty!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/services/add", { ...newService, vendorId });
      setNewService({ serviceName: "", description: "", category: "" });
      setMessage("Service added successfully!");
      fetchServices();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error adding service:", err);
    }
  };

  const deleteService = async (serviceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/services/${vendorId}/${serviceId}`);
      setMessage("Service deleted successfully!");
      fetchServices();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting service:", err);
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service);
  };

  const handleEditChange = (e) => {
    setEditingService({ ...editingService, [e.target.name]: e.target.value });
  };

  const updateService = async () => {
    if (!editingService.serviceName.trim()) {
      alert("Service name cannot be empty!");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/services/${vendorId}/${editingService._id}`,
        editingService
      );
      setEditingService(null);
      alert("Service updated successfully!");
      fetchServices();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error updating service:", err);
    }
  };

  return (
    <div className="container my-4 p-4">
      <h2 className="text-center">Manage Services</h2>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="form-group">
        <label>Service Name</label>
        <input
          type="text"
          name="serviceName"
          className="form-control"
          value={newService.serviceName}
          onChange={handleServiceChange}
        />
      </div>
      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          name="description"
          className="form-control"
          value={newService.description}
          onChange={handleServiceChange}
        />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select
          name="category"
          className="form-control"
          value={newService.category}
          onChange={handleServiceChange}
        >
          <option value="">Select Category</option>
          <option value="Escalator">Escalator</option>
          <option value="Elevator">Elevator</option>
          <option value="Fabrication">Fabrication</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <button className="btn btn-success mt-2" onClick={addService}>
        Add Service
      </button>

      <h3 className="mt-4">Your Services</h3>
      <ul className="list-group">
        {services.map((service) => (
          <li
            key={service._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {editingService && editingService._id === service._id ? (
              <div className="w-100">
                <input
                  type="text"
                  name="serviceName"
                  className="form-control mb-2"
                  value={editingService.serviceName}
                  onChange={handleEditChange}
                />
                <input
                  type="text"
                  name="description"
                  className="form-control mb-2"
                  value={editingService.description}
                  onChange={handleEditChange}
                />
                <select
                  name="category"
                  className="form-control mb-2"
                  value={editingService.category}
                  onChange={handleEditChange}
                >
                  <option value="Escalator">Escalator</option>
                  <option value="Elevator">Elevator</option>
                  <option value="Fabrication">Fabrication</option>
                  <option value="Others">Others</option>
                </select>
                <button className="btn btn-primary btn-sm me-2" onClick={updateService}>
                  Save
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span>
                  <strong>{service.serviceName}</strong> - {service.description} (
                  {service.category})
                </span>
                <div>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(service)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteService(service._id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageServices;
