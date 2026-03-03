import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tab, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const VendorPublicProfile = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [inquiry, setInquiry] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const vendorRes = await fetch(`http://localhost:5000/api/vendor/profile/${vendorId}`);
        const vendorData = await vendorRes.json();
        setVendor(vendorData);
        setServices(vendorData.services || []);
        setProjects(vendorData.projects || []);

        const reviewsRes = await fetch(`http://localhost:5000/api/reviews/vendor/${vendorId}`);
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching vendor profile data:", err);
      }
    };

    fetchVendorDetails();

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setInquiry((prev) => ({
        ...prev,
        name: user.username || "",
        email: user.email || "",
      }));
    }
  }, [vendorId]);

  const goToService = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  const renderStars = (rating, uniqueId = "") => {
    return [...Array(5)].map((_, i) => (
      <span key={`star-${uniqueId}-${i}`} className={i < rating ? "text-warning" : "text-muted"}>
        ★
      </span>
    ));
  };

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, comment: e.target.value });
  };

  const handleRatingClick = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const submitReview = async () => {
    if (!newReview.rating || !newReview.comment.trim()) {
      alert("Please provide a rating and comment.");
      return;
    }

    try {
      setSubmitting(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vendorId,
          userId: user?._id || "anonymous",
          userName: user?.username || "Anonymous",
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => [data, ...prev]);
        setNewReview({ rating: 0, comment: "" });
      } else {
        console.error("Review submission failed:", data);
      }

      setSubmitting(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      setSubmitting(false);
    }
  };

  const handleInquiryChange = (e) => {
    setInquiry({ ...inquiry, [e.target.name]: e.target.value });
  };

  const submitInquiry = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("You must be logged in to send an inquiry.");
      return;
    }

    if (!inquiry.name || !inquiry.email || !inquiry.message) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:5000/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inquiry, vendorId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Inquiry sent successfully!");
        setInquiry((prev) => ({
          ...prev,
          message: "",
        }));
      } else {
        console.error("Inquiry submission failed:", data);
      }

      setSubmitting(false);
    } catch (error) {
      console.error("Error sending inquiry:", error);
      setSubmitting(false);
    }
  };

  if (!vendor) return <div>Loading vendor profile...</div>;

  return (
    <div className="container my-4">
      {/* Vendor Info */}
      <div className="d-flex align-items-center mb-4">
        <img
          src={`http://localhost:5000/uploads/${vendor.logo || "default.png"}`}
          alt="vendor"
          className="rounded-circle me-3"
          style={{ width: "80px", height: "80px", objectFit: "cover" }}
        />
        <div>
          <h3>{vendor.fullname || vendor.companyName}</h3>
          <p>{vendor.description || "No description provided."}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Container defaultActiveKey="services">
        <Nav variant="tabs">
          {services.length > 0 && (
            <Nav.Item>
              <Nav.Link eventKey="services">Services</Nav.Link>
            </Nav.Item>
          )}
          {projects.length > 0 && (
            <Nav.Item>
              <Nav.Link eventKey="projects">Projects</Nav.Link>
            </Nav.Item>
          )}
          <Nav.Item>
            <Nav.Link eventKey="reviews">Reviews</Nav.Link>
          </Nav.Item>
         {/*} <Nav.Item>
            <Nav.Link eventKey="inquiry">Inquiry</Nav.Link>
          </Nav.Item>*/}
        </Nav>

        <Tab.Content className="mt-4">
          {/* Services */}
          <Tab.Pane eventKey="services">
            <div className="row">
              {services.map((service) => (
                <div className="col-md-4 mb-3" key={service._id}>
                  <div
                    className="card shadow-sm h-100"
                    onClick={() => goToService(service._id)}
                    style={{ cursor: "pointer" }}
                  >
                    {service.image && (
                      <img
                        src={`http://localhost:5000/uploads/${service.image}`}
                        className="card-img-top"
                        alt="Service"
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{service.serviceName}</h5>
                      <p className="card-text">{service.description?.substring(0, 100)}...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Pane>

          {/* Projects */}
          <Tab.Pane eventKey="projects">
            <div className="row">
              {projects.map((project) => (
                <div className="col-md-12 mb-3" key={project._id}>
                  <div className="d-flex shadow p-3 rounded bg-white">
                    <img
                      src={`http://localhost:5000/uploads/${project.images}`}
                      alt="Project"
                      className="rounded me-3"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                    <div>
                      <h5 style={{ color: "black" }}>{project.projectName}</h5>
                      <p style={{ color: "black" }}>{project.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Pane>

          {/* Reviews */}
          <Tab.Pane eventKey="reviews">
            <div className="mb-4">
              <h5>Leave a Review</h5>
              <div className="mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={`new-review-star-${star}`}
                    style={{ cursor: "pointer", fontSize: "1.5rem" }}
                    className={star <= newReview.rating ? "text-warning" : "text-muted"}
                    onClick={() => handleRatingClick(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write your review..."
                value={newReview.comment}
                onChange={handleReviewChange}
              ></textarea>
              <button
                className="btn btn-primary mt-2"
                onClick={submitReview}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>

            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <ul className="list-group">
                {reviews.map((review) => (
                  <li className="list-group-item" key={review._id}>
                    <div className="d-flex justify-content-between">
                      <strong>{review.userName}</strong>
                      <div>{renderStars(review.rating || 0, `review-${review._id}`)}</div>
                    </div>
                    <p className="mb-0">{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </Tab.Pane>

          {/* Inquiry */}
         {/* <Tab.Pane eventKey="inquiry">
            <h5>Send an Inquiry</h5>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Your Name"
                value={inquiry.name}
                onChange={handleInquiryChange}
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Your Email"
                value={inquiry.email}
                onChange={handleInquiryChange}
              />
            </div>
            <div className="mb-3">
              <textarea
                name="message"
                className="form-control"
                rows="4"
                placeholder="Your Message"
                value={inquiry.message}
                onChange={handleInquiryChange}
              ></textarea>
            </div>
            <button
              className="btn btn-success"
              onClick={submitInquiry}
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Send Inquiry"}
            </button>
          </Tab.Pane>*/}
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default VendorPublicProfile;
