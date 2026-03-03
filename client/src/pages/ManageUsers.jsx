import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2"; // SweetAlert2 for confirmations

// Global Reset for removing margin on top
const ManageUsers = () => {
  useEffect(() => {
    // Apply styles to remove default margin and padding
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
  }, []);

  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ fullName: "", email: "", mobile: "" });
  const [loading, setLoading] = useState(false); // ✅ Loading state

  // ✅ Fetch Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found in localStorage!");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/adminControls/users", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Fix: Ensure Bearer token format
      });

      setUsers(response.data || []); // Ensure response.data is not undefined or null
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
      setUsers([]); // Prevent undefined error
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete User with Confirmation
  const deleteUser = async (id) => {
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
        await axios.delete(`http://localhost:5000/api/adminControls/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Fix: Ensure Bearer token format
        });

        setUsers(users.filter((user) => user._id !== id)); // Remove user from state

        Swal.fire("Deleted!", "User has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete user.", "error");
        console.error("Error deleting user:", error.response?.data || error.message);
      }
    }
  };

  // ✅ Handle Edit Button Click
  const handleEdit = (user) => {
    setEditUser(user._id);
    setFormData({ fullName: user.fullName, email: user.email, mobile: user.mobile });
  };

  // ✅ Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Update User with Confirmation
  const updateUser = async () => {
    const confirmUpdate = await Swal.fire({
      title: "Update User?",
      text: "Are you sure you want to update this user?",
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
          `http://localhost:5000/api/adminControls/users/${editUser}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Fix: Ensure Bearer token format
          }
        );

        // Ensure the response data contains the updated user
        if (response.data && response.data.user) {
          setUsers(users.map((user) => (user._id === editUser ? response.data.user : user)));
        }

        setEditUser(null); // Close edit form

        Swal.fire("Updated!", "User details have been updated.", "success");

        // Re-fetch the updated users list after the update
        fetchUsers(); // Fetch users again to get the latest data
      } catch (error) {
        Swal.fire("Error!", "Failed to update user.", "error");
        console.error("Error updating user:", error.response?.data || error.message);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array ensures fetchUsers is called on mount only

  return (
    <div className="container-fluid" style={{ backgroundColor: "#003366", minHeight: "100vh", margin: 0 }}>
      <h2 className="text-white my-4 text-center">Manage Users</h2>
      {loading && <div className="text-white text-center mb-4">Loading users...</div>}

      <div className="list-group">
        {users && users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="list-group-item bg-dark text-white mb-3 rounded">
              {editUser === user._id ? (
                // ✅ Edit Form
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-control mb-2"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control mb-2"
                  />
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="form-control mb-2"
                  />
                  <div className="d-flex justify-content-between">
                    <button onClick={updateUser} className="btn btn-success">
                      Save
                    </button>
                    <button onClick={() => setEditUser(null)} className="btn btn-danger">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // ✅ Display User
                <div className="d-flex justify-content-between">
                  <div>
                    {user.fullName} - {user.email} - {user.mobile}
                  </div>
                  <div>
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn btn-warning btn-sm me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-white text-center">No users found</div> // Handle the case when no users are found
        )}
      </div>
    </div>
  );
};

export default ManageUsers;