import { useState } from "react"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Recycle } from "lucide-react"
import { useAuth } from "./context/AuthContext"
import ContactModal from "./ContactForm"
import Navbar from './components/Navbar';
import Footer from './footer.jsx'

const Login = () => {
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
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useAuth()

  // Forgot password states
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [forgotError, setForgotError] = useState("")
  const [forgotSuccess, setForgotSuccess] = useState("")
  
  // Contact modal state
  const [showContactModal, setShowContactModal] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const result = await login(formData.email, formData.password)
    if (!result.success) {
      setError(result.message || "Login failed")
    }
  }

  // Forgot password: send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setForgotError("")
    setForgotSuccess("")
    try {
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/forgetpassword.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_otp", email: forgotEmail }),
        credentials: "include",
      })
      const result = await response.json()
      if (result.success) {
        setForgotSuccess("OTP sent to your email.")
        setShowEmailModal(false)
        setShowOtpModal(true)
      } else {
        setForgotError(result.message || "Failed to send OTP")
      }
    } catch (err) {
      setForgotError("Server error")
    }
  }

  // Forgot password: verify OTP only
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setForgotError("")
    setForgotSuccess("")
    try {
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/forgetpassword.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_otp",
          email: forgotEmail,
          otp,
        }),
        credentials: "include",
      })
      const result = await response.json()
      if (result.success) {
        setShowOtpModal(false)
        setShowResetModal(true)
      } else {
        setForgotError(result.message || "Invalid OTP")
      }
    } catch (err) {
      setForgotError("Server error")
    }
  }

  // Forgot password: reset password after OTP verified
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setForgotError("")
    setForgotSuccess("")
    try {
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/forgetpassword.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_otp_and_reset",
          email: forgotEmail,
          otp,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
        credentials: "include",
      })
      const result = await response.json()
      if (result.success) {
        setForgotSuccess("Password reset successful! You can now log in.")
        setShowResetModal(false)
        setForgotEmail("")
        setOtp("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setForgotError(result.message || "Failed to reset password")
      }
    } catch (err) {
      setForgotError("Server error")
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your TrashRoute account</p>
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
          {forgotSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center mb-4 animate-fade-in">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{forgotSuccess}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <button
                type="button"
                className="text-[#3a5f46] hover:text-[#2e4d3a] text-sm font-medium bg-transparent border-0 p-0 transition-colors"
                onClick={() => setShowEmailModal(true)}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] hover:from-[#2e4d3a] hover:to-[#1a3d2a] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:ring-offset-2 mt-8 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Sign In</span>
              </div>
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-gray-600 text-sm">Don't have an account? </span>
              <Link to="/signup" className="text-[#3a5f46] hover:text-[#2e4d3a] text-sm font-semibold transition-colors">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password: Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-scale-in">
            <button onClick={() => setShowEmailModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#3a5f46] to-[#2e4d3a] rounded-full mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
              <p className="text-gray-600">Enter your email to receive a reset code</p>
            </div>
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#3a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              {forgotError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center animate-shake">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{forgotError}</span>
                  </div>
                </div>
              )}
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] hover:from-[#2e4d3a] hover:to-[#1a3d2a] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:ring-offset-2 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Send OTP</span>
                </div>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password: OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-scale-in">
            <button onClick={() => setShowOtpModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#3a5f46] to-[#2e4d3a] rounded-full mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">OTP Verification</h2>
              <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300 text-center tracking-widest text-2xl font-bold"
                  placeholder="000000"
                  autoFocus
                />
              </div>
              {forgotError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center animate-shake">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{forgotError}</span>
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
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password: Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-scale-in">
            <button onClick={() => setShowResetModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#3a5f46] to-[#2e4d3a] rounded-full mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-gray-600">Create your new password</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#3a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-[#3a5f46]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] focus:bg-white transition-all duration-300"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              {forgotError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center animate-shake">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{forgotError}</span>
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
                  <span>Reset Password</span>
                </div>
              </button>
            </form>
          </div>
        </div>
      )}

       {/* Contact Modal */}
       {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
       
       <Footer />
     </div>
   )
 }

export default Login