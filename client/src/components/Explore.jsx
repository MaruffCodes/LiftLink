import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Modal } from "react-bootstrap";
import "./Explore.css";

const Explore = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [expandedVendor, setExpandedVendor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    fetchVendorsWithServices();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = vendors.filter(({ services }) =>
        services.some(service =>
          service.category?.toLowerCase().includes(searchQuery)
        )
      );
      setFilteredVendors(filtered);
    } else {
      setFilteredVendors(vendors);
    }
  }, [vendors, searchQuery]);

  const fetchVendorsWithServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services/all");
      const grouped = {};

      res.data.forEach(service => {
        const vendorId = service.vendor._id;
        if (!grouped[vendorId]) {
          grouped[vendorId] = {
            vendor: service.vendor,
            services: [],
          };
        }
        grouped[vendorId].services.push(service);
      });

      const vendorList = Object.values(grouped);
      setVendors(vendorList);
      setFilteredVendors(vendorList);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const handleCardClick = (vendorId) => {
    setExpandedVendor(vendorId);
  };

  const handleClose = () => {
    setExpandedVendor(null);
  };

  return (
    <div className={`container my-5 ${expandedVendor ? "blurred" : ""}`}>
      <h2 className="text-center mb-4">Explore Companies</h2>
      {searchQuery && (
        <p className="text-center mb-4">
          Showing results for "<strong>{searchQuery}</strong>"
        </p>
      )}
      <div className="row">
        {filteredVendors.length > 0 ? (
          filteredVendors.map(({ vendor, services }) => (
            <div key={vendor._id} className="col-md-4 mb-4">
              <Card className="h-100 shadow card-hover" onClick={() => handleCardClick(vendor._id)} style={{ cursor: "pointer" }}>
                <div className="text-center pt-4">
                  <Card.Img
                    variant="top"
                    src={`http://localhost:5000/uploads/${vendor.logo || "default.png"}`}
                    style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                  />
                </div>
                <Card.Body className="text-center">
                  <Card.Title>{vendor.fullname}</Card.Title>
                  <Card.Text className="text-muted">
                    {services.slice(0, 2).map((s) => s.serviceName).join(", ")}...
                  </Card.Text>
                </Card.Body>
              </Card>

              {/* Modal */}
              <Modal show={expandedVendor === vendor._id} onHide={handleClose} centered backdrop="static">
                <Modal.Header closeButton>
                  <Modal.Title>{vendor.fullname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p><strong>Description:</strong> {vendor.description || "No description provided."}</p>
                  <p><strong>Contact:</strong> {vendor.contact || "N/A"}</p>
                  <p><strong>Email:</strong> {vendor.email || "N/A"}</p>
                  <hr />
                  <h6>Services:</h6>
                  <ul>
                    {services.map((s) => (
                      <li key={s._id}>{s.serviceName}</li>
                    ))}
                  </ul>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="primary"
                    onClick={() => {
                      navigate(`/vendor/profile/${vendor._id}`);
                      handleClose();
                    }}
                  >
                    View Profile
                  </Button>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          ))
        ) : (
          <p className="text-center mb-4">No companies found matching your search.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
