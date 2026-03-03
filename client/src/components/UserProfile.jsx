import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    mobile: "",
  });
  const [message, setMessage] = useState("");

  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/${userId}`);
        const data = await res.json();
        setUser(data);
        setFormData({
          username: data.username || "",
          fullName: data.fullName || "",
          email: data.email || "",
          mobile: data.mobile || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
        }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully!");
      } else {
        const errorData = await res.json();
        setMessage(errorData.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Something went wrong.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container my-5">
      <h2>User Profile</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleUpdate} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            type="text"
            name="username"
            value={formData.username}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter phone number"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>

      
    </div>
  );
};

export default UserProfile;
