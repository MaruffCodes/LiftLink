import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);

    try {
      const response = await axios.get(`http://localhost:5000/api/search/search?keyword=${keyword}`);
      setVendors(response.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      alert("An error occurred while searching.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-container">
      <form className="d-flex align-items-center ms-auto" onSubmit={handleSearchSubmit} role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search by category or service"
          aria-label="Search"
          value={keyword}
          onChange={handleSearchChange}
        />
        <button className="btn btn-outline-success me-2" type="submit">Search</button>
      </form>

      {isLoading ? <p>Loading...</p> : (
        <div className="results">
          {vendors.length > 0 ? (
            vendors.map(vendor => (
              <div key={vendor._id} className="vendor-card" onClick={() => navigate(`/vendor/profile/${vendor._id}`)}>
                <h5>{vendor.fullname}</h5>
                <p>{vendor.description}</p>
              </div>
            ))
          ) : (
            <p>No vendors found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
