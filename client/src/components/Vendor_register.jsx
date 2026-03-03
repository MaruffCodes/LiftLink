import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const VendorRegister = () => {
  const [vendorData, setVendorData] = useState({
    fullname: "",
    contact :"",
    email: "",
    password: "",
    companyName: "",
    companyType: "",
    compregno: "",
    
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleVendorRegister = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        fullname: vendorData.fullname,
        contact: vendorData.contact, 
        email: vendorData.email,
        password: vendorData.password,
        companyName: vendorData.companyName,
        companyType: vendorData.companyType, 
        compregno: vendorData.compregno,
       // description: vendorData.description,
      };

      console.log("Sending Data:", requestData); 
  
      const res = await axios.post("http://localhost:5000/api/vendor/auth/register", requestData);

      console.log("Response:", res.data); 

      console.log("Vendor Registered:", res.data);
      alert("Vendor Registered Successfully");
      navigate("/LoginVendor");
    } catch (err) {
      console.error("Registration Error:", err);
      alert("Registration Failed");
    }
  };
  

  return (
    <div className="register-container d-flex align-items-center justify-content-center">
      <form className="register-form p-4 rounded" onSubmit={handleVendorRegister}>
        <h2 className="text-center mb-4 text-white">Vendor Registration</h2>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contact"
          placeholder="Mobile Number"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="companyType"
          placeholder="Company Type"
          className="form-control mb-3"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="compregno"
          placeholder="Company Registration Number"
          className="form-control mb-4"
          onChange={handleChange}
          required
        />
        

        {/* Register Button */}
        <button type="submit" className="btn btn-primary w-100 mb-3">
          Register
        </button>

        {/* Login Button */}
        <button
          type="button"
          className="btn btn-primary w-100"
          onClick={() => navigate("/LoginVendor")}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default VendorRegister;
