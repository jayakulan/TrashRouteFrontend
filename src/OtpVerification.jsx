import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from './footer.jsx';

const OtpVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [success, setSuccess] = useState("");

  if (!email) {
    navigate("/signup");
    return null;
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/Backend/api/verify_otp_and_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setSuccess("Your registration is successful!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setOtpError(result.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setOtpError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative">
        <h2 className="text-xl font-bold mb-4 text-center">OTP Verification</h2>
        <p className="mb-2 text-gray-700 text-center">
          Enter the OTP sent to <span className="font-semibold">{email}</span>.
        </p>
        <form onSubmit={handleOtpVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            maxLength={6}
            className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-center tracking-widest text-lg"
            placeholder="Enter OTP"
            autoFocus
          />
          {otpError && <div className="text-red-600 text-sm text-center">{otpError}</div>}
          {success && <div className="text-green-600 text-sm text-center font-semibold">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Verify OTP
          </button>
        </form>
      </div>
      
      <Footer />
    </div>
  );
};

export default OtpVerification; 