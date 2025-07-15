"use client"

import { useState } from "react"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import ContactModal from "./ContactForm"
import Navbar from './components/Navbar';

const SignUp = () => {
  // Add custom animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.9);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
      }
      .animate-scale-in {
        animation: scaleIn 0.3s ease-out forwards;
      }
      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [showContactModal, setShowContactModal] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setError("")
    setSuccess("")
    const userData = {
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: "customer",
      contact_number: formData.phoneNumber,
      address: formData.address,
    }
    try {
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/request_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      })
      const result = await response.json()
      if (result.success) {
        setSuccess("OTP sent! Please enter the OTP sent to your email.")
        setShowOtpModal(true)
      } else {
        setError(result.message || "Failed to send OTP")
      }
    } catch (err) {
      setError("Server error")
    }
  }

  const handleOtpVerify = async (e) => {
    e.preventDefault()
    setOtpError("")
    try {
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/verify_otp_and_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp,
          name: formData.fullName,
          password: formData.password,
          address: formData.address,
          contact_number: formData.phoneNumber,
          role: "customer"
        }),
        credentials: "include",
      })
      const result = await response.json()
      if (result.success) {
        setShowOtpModal(false)
        setSuccess("OTP verified! Registration complete. Redirecting to login...")
        setTimeout(() => {
          navigate("/login")
        }, 1500)
      } else {
        setOtpError(result.message || "Invalid OTP. Please try again.")
      }
    } catch (err) {
      setOtpError("Server error")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onContactClick={() => setShowContactModal(true)} />

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#3a5f46] to-[#2e4d3a] rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] bg-clip-text text-transparent mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">Join TrashRoute and start your eco-friendly journey</p>
          </div>

          {/* Role Selection Tabs */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1 shadow-inner">
            <button
              type="button"
              className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 bg-white text-[#3a5f46] shadow-md transform scale-105 cursor-default"
              disabled
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Customer</span>
              </div>
            </button>
            <Link
              to="/company-signup"
              className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 text-gray-600 hover:text-[#3a5f46] hover:bg-white hover:shadow-md text-center transform hover:scale-105"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Company</span>
              </div>
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center mb-4 animate-shake">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center mb-4 animate-fade-in">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{success}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Full Name Field */}
            <div className="group">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#3a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#3a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#3a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#3a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address Field */}
            <div className="group">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#3a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="group">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#3a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] hover:from-[#2e4d3a] hover:to-[#1a3d2a] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:ring-offset-2 mt-8 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Account</span>
              </div>
            </button>

            {/* Login Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">Already have an account? </span>
              <Link to="/login" className="text-[#3a5f46] hover:text-[#2e4d3a] text-sm font-semibold transition-colors">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-scale-in">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#3a5f46] to-[#2e4d3a] rounded-full mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">OTP Verification</h2>
              <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
            </div>
            <form onSubmit={handleOtpVerify} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={e => { setOtp(e.target.value); setOtpError(""); }}
                  maxLength={6}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300 text-center tracking-widest text-2xl font-bold"
                  placeholder="000000"
                  autoFocus
                />
              </div>
              {otpError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center animate-shake">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{otpError}</span>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] hover:from-[#2e4d3a] hover:to-[#1a3d2a] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:ring-offset-2 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Verify OTP</span>
                </div>
              </button>
              <button
                type="button"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowOtpModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal onClose={() => setShowContactModal(false)} />
      )}
    </div>
  )
}

export default SignUp
