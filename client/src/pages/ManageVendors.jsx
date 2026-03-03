import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 for confirmations

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [editVendor, setEditVendor] = useState(null);
  const [formData, setFormData] = useState({ fullname: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(false); // ✅ Loading state

  // ✅ Fetch Vendors
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found in localStorage!");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/admin/vendors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVendors(response.data || []);
    } catch (error) {
      console.error("Error fetching vendors:", error.response?.data || error.message);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete Vendor with Confirmation
  const deleteVendor = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:5000/api/admin/vendors/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setVendors(vendors.filter((vendor) => vendor._id !== id)); // Remove vendor from state

        Swal.fire("Deleted!", "Vendor has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete vendor.", "error");
        console.error("Error deleting vendor:", error.response?.data || error.message);
      }
    }
  };

  // ✅ Handle Edit Button Click
  const handleEdit = (vendor) => {
    setEditVendor(vendor._id);
    setFormData({ fullname: vendor.fullname, email: vendor.email, mobile: vendor.mobile });
  };

  // ✅ Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Update Vendor with Confirmation
  const updateVendor = async () => {
    const confirmUpdate = await Swal.fire({
      title: "Update Vendor?",
      text: "Are you sure you want to update this vendor?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (confirmUpdate.isConfirmed) {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.put(
          `http://localhost:5000/api/admin/vendors/${editVendor}`,
          formData,  // Ensure this has { fullname, email, mobile }
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Ensure the response data contains the updated vendor
        setVendors(
          vendors.map((vendor) =>
            vendor._id === editVendor ? response.data : vendor
          )
        );

        setEditVendor(null); // Close edit form
        Swal.fire("Updated!", "Vendor details have been updated.", "success");

        // Re-fetch the updated vendors list after the update
        fetchVendors(); // Fetch vendors again to get the latest data
      } catch (error) {
        Swal.fire("Error!", "Failed to update vendor.", "error");
        console.error("Error updating vendor:", error.response?.data || error.message);
      }
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []); // Empty dependency array ensures fetchVendors is called on mount only

  return (
    <div className="container-fluid" style={{ backgroundColor: "#003366", minHeight: "100vh", margin: 0 }}>
      <h2 className="text-white my-4 text-center">Manage Vendors</h2>
      {loading && <div className="text-white text-center mb-4">Loading vendors...</div>}

      <div className="list-group">
        {vendors && vendors.length > 0 ? (
          vendors.map((vendor) => (
            <div key={vendor._id} className="list-group-item bg-dark text-white mb-3 rounded">
              <div className="d-flex justify-content-between">
                {editVendor === vendor._id ? (
                  <div className="w-100">
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}  // Updated to match model field
                      onChange={handleChange}
                      className="form-control mb-2"
                      placeholder="Full Name"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control mb-2"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className="form-control mb-2"
                      placeholder="Mobile"
                    />
                    <button onClick={updateVendor} className="btn btn-success btn-sm me-2">
                      Save
                    </button>
                    <button
                      onClick={() => setEditVendor(null)}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="d-flex w-100 justify-content-between">
                    <div>
                      {vendor.fullname} - {vendor.email}  - {vendor.mobile}
                    </div>
                    <div>
                      <button
                        onClick={() => handleEdit(vendor)}
                        className="btn btn-warning btn-sm me-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteVendor(vendor._id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-white text-center">No vendors found</div>
        )}
      </div>
    </div>
  );
};

export default ManageVendors;