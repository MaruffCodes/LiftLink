import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

const AdminLogin = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", { email, password });

      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        setIsAuthenticated(true);

        // Show success message using SweetAlert2
        Swal.fire({
          title: "Login successful!",
          text: "Redirecting to admin panel...",
          icon: "success",
          timer: 1500, // Wait for 1.5 seconds before redirect
          showConfirmButton: false,
        });

        // Redirect after 1.5 seconds (matching the timer above)
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        setError("No token received. Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data);

      // Show error message using SweetAlert2 for invalid credentials
      Swal.fire({
        title: "Invalid Credentials",
        text: "The email or password you entered is incorrect.",
        icon: "error",
        confirmButtonColor: "#d33", // Red color for error
      });

      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: "#003366", minHeight: "100vh", padding: 0 }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="col-12 col-md-6 col-lg-4 bg-dark p-4 rounded">
          <h2 className="text-white text-center mb-4">Admin Login</h2>
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;