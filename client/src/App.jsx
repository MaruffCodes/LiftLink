// import react from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

import UserProfile from './components/UserProfile';
import Home from './components/Home';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import Explore from './components/Explore';
import About from './components/About';
import Contact from './components/Contact';
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Logsign from "./components/LogSign";
import Vendor_register from "./components/Vendor_register";
import VendorDashboard from "./components/VendorDashboard";
import ManageServices from "./components/ManageServices";
import ManageProfile from "./components/ManageProfile";
import ManageInquiries from "./components/ManageInquiries";
import LoginVendor from "./components/LoginVendor";
import CTASection from "./components/CTASection";
import VendorProfileForm from "./components/VendorProfileForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import ManageVendors from "./pages/ManageVendors";
import VendorPublicProfile from "./components/VendorPublicProfile";
import ServiceDetail from "./components/ServiceDetails";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
    <Navbar /> 

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Explore" element={<Explore />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path = "/vendor_register" element = {< Vendor_register />} />
      <Route path="/loginvendor" element={<LoginVendor />} />
      <Route path="/logsign" element={<Logsign />} />
      <Route path="/VendorProfileForm" element={<VendorProfileForm/>} />
      <Route path = "/vendorDashboard/*" element = {< VendorDashboard />} />
      <Route path = "/manageServices" element = {< ManageServices />} />
      <Route path = "/manageInquiries" element = {< ManageInquiries />} />
      <Route path="/vendor/dashboard/:vendorId" element={<ManageProfile />} />
      <Route path="/userProfile" element={<UserProfile />} />
      <Route path="/service/:id" element={<ServiceDetail />} />
      <Route path="/vendor/profile/:vendorId" element={<VendorPublicProfile />} />

      {/* Admin Routes */}
      <Route path="/admin-login" element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/admin" element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/admin-login" />} />
      <Route path="/admin/users" element={isAuthenticated ? <ManageUsers /> : <Navigate to="/admin-login" />} />
      <Route path="/admin/vendors" element={isAuthenticated ? <ManageVendors /> : <Navigate to="/admin-login" />} />
      
      <Route path="/footer" element={<Footer />} />
      <Route path="/CTASection" element={<CTASection />} />

    </Routes>
  </Router>
  );
}

export default App;
