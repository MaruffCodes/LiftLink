import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const vendor = JSON.parse(localStorage.getItem("vendor"));
  const [searchQuery, setSearchQuery] = useState("");

  const handleProfileClick = () => {
    if (user) {
      navigate("/userProfile");
    } else if (vendor) {
      navigate("/vendorDashboard/profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("vendor");
    navigate("/");
    window.location.reload();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/Explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#001F3F", height: "70px" }}>
      <div className="container-fluid" style={{ height: "100%" }}>
        <Link className="navbar-brand text-white" to="/" style={{ lineHeight: "70px" }}>
          LIFTLINK
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto" style={{ lineHeight: "70px" }}>
            <li className="nav-item">
              <Link to="/" className="nav-link active text-white">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/Explore" className="nav-link text-white">Explore</Link>
            </li>
            <li className="nav-item">
              <Link to="/Contact" className="nav-link text-white">Contact</Link>
            </li>
            <li className="nav-item">
              <Link to="/About" className="nav-link text-white">About Us</Link>
            </li>
          </ul>

          <form className="d-flex align-items-center ms-auto" onSubmit={handleSearchSubmit}>
            <input
              id="searchbar"
              className="form-control me-2"
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
            <button id="searchbtn" className="btn btn-outline-success me-2" type="submit">
              Search
            </button>

            {user || vendor ? (
              <>
                <button
                  className="btn btn-outline-light d-flex align-items-center me-2"
                  type="button"
                  onClick={handleProfileClick}
                  title="Go to Profile"
                >
                  <FaUserCircle size={22} style={{ marginRight: "5px" }} />
                  Profile
                </button>
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-outline-success dropdown-toggle"
                  type="button"
                  id="loginDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Login
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="loginDropdown">
                  <li>
                    <Link className="dropdown-item" to="/Login">Login as User</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/LoginVendor">Login as Vendor</Link>
                  </li>
                </ul>
              </div>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
