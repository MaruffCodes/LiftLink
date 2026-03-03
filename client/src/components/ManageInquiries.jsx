import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ManageInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [reply, setReply] = useState({ inquiryId: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const vendorId = JSON.parse(localStorage.getItem("vendor"))?._id; // Assuming vendor info is stored in localStorage

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!vendorId) {
        alert("You must be logged in as a vendor.");
        navigate("/vendor/login"); // Redirect if vendor is not logged in
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/inquiries/vendor/${vendorId}`);
        const data = await res.json();
        if (res.ok) {
          setInquiries(data);
        } else {
          console.error("Error fetching inquiries:", data);
        }
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      }
    };

    fetchInquiries();
  }, [vendorId, navigate]);

  const handleReplyChange = (e) => {
    setReply({ ...reply, [e.target.name]: e.target.value });
  };

  const submitReply = async (inquiryId) => {
    if (!reply.message.trim()) {
      alert("Please enter a reply message.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:5000/api/inquiries/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inquiryId,
          reply: reply.message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Reply sent successfully.");
        setInquiries((prevInquiries) =>
          prevInquiries.map((inquiry) =>
            inquiry._id === inquiryId ? { ...inquiry, reply: data.reply } : inquiry
          )
        );
        setReply({ inquiryId: "", message: "" });
      } else {
        console.error("Error submitting reply:", data);
      }
      setSubmitting(false);
    } catch (error) {
      console.error("Error submitting reply:", error);
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h1>Manage Inquiries</h1>

      {inquiries.length === 0 ? (
        <p>No inquiries found.</p>
      ) : (
        <div>
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Inquiry from: {inquiry.userId.username}</h5>
                <p>Email: {inquiry.userId.email}</p>
                <p>{inquiry.message}</p>
                <p><strong>Vendor's Reply:</strong> {inquiry.reply || "No reply yet."}</p>
                <textarea
                  name="message"
                  value={reply.inquiryId === inquiry._id ? reply.message : ""}
                  onChange={handleReplyChange}
                  placeholder="Write your reply..."
                  rows="3"
                  className="form-control mb-2"
                />
                <button
                  className="btn btn-primary"
                  onClick={() => submitReply(inquiry._id)}
                  disabled={submitting || reply.inquiryId !== inquiry._id}
                >
                  {submitting ? "Sending..." : "Reply"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageInquiry;
