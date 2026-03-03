import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div
      className="container-fluid"
      style={{
        backgroundColor: "#003366", // Navy blue background
        minHeight: "100vh", // Ensure full viewport height
        margin: "0", // Remove margins
        padding: "0", // Remove padding
      }}
    >
      <div className="text-center text-white py-5">
        <h2 className="display-4 font-weight-bold">Admin Dashboard</h2>
        <p className="lead">Edit The Users and Vendors</p>
      </div>
      <nav>
        <ul className="list-group">
          <li className="list-group-item bg-dark text-white mb-3">
            <Link
              to="/admin/users"
              className="text-decoration-none text-white p-3 rounded shadow-sm w-100 d-block text-center"
              style={{
                backgroundColor: "#00509e", // Light navy blue
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
              }}
            >
              <i className="bi bi-person-lines-fill"></i> Manage Users
            </Link>
          </li>
          <li className="list-group-item bg-dark text-white mb-3">
            <Link
              to="/admin/vendors"
              className="text-decoration-none text-white p-3 rounded shadow-sm w-100 d-block text-center"
              style={{
                backgroundColor: "#00509e", // Light navy blue
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
              }}
            >
              <i className="bi bi-shop-window"></i> Manage Vendors
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;