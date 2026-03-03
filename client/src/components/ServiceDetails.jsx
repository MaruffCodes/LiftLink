import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ServiceDetails = () => {
  const { id: serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/single/${serviceId}`);
        setService(res.data);
      } catch (err) {
        console.error("Error fetching service:", err);
      }
    };
    fetchService();
  }, [serviceId]);

  if (!service) return <div className="text-center my-5">Loading...</div>;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-4">
          <img
            src={`http://localhost:5000/uploads/${service.image || "default.png"}`}
            alt={service.serviceName}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-8">
          <h3>{service.serviceName}</h3>
          <p><strong>Description:</strong> {service.description}</p>
          <p><strong>Category:</strong> {service.category}</p>

          <div
            className="d-flex align-items-center mt-4"
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/vendor/profile/${service.vendor._id}`)}
          >
            <img
              src={`http://localhost:5000/uploads/${service.vendor.logo || "default.png"}`}
              alt="vendor"
              className="rounded-circle me-3"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
            <h6 className="mb-0">
              {service.vendor.fullname || service.vendor.companyName || "Vendor"}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
