import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Recycle } from "lucide-react"
import { useAuth } from "./context/AuthContext"
import ContactModal from "./ContactForm"

const Login = () => {
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
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="Logo" className="h-16 w-34" />
            </Link>
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">
                Home
              </Link>
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium" onClick={(e) => {
                e.preventDefault();
                navigate('/');
                // Wait for navigation to complete, then scroll to services section
                setTimeout(() => {
                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    const navHeight = 64; // Height of the fixed navigation bar
                    const servicesPosition = servicesSection.offsetTop - navHeight;
                    window.scrollTo({
                      top: servicesPosition,
                      behavior: 'smooth'
                    });
                  }
                }, 100);
              }}>
                Services
              </Link>
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium" onClick={(e) => {
                e.preventDefault();
                navigate('/');
                // Wait for navigation to complete, then scroll to about section
                setTimeout(() => {
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) {
                    const navHeight = 64; // Height of the fixed navigation bar
                    const aboutPosition = aboutSection.offsetTop - navHeight;
                    window.scrollTo({
                      top: aboutPosition,
                      behavior: 'smooth'
                    });
                  }
                }, 100);
              }}>
                About Us
              </Link>
              <button
                type="button"
                className="text-gray-700 hover:text-gray-900 font-medium bg-transparent border-0 p-0"
                onClick={() => setShowContactModal(true)}
              >
                Contact
              </button>
              <Link to="/signup" className="text-gray-700 hover:text-gray-900 font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          </div>

          {error && (
            <div className="text-red-600 text-sm mb-2 text-center">{error}</div>
          )}
          {forgotSuccess && (
            <div className="text-green-600 text-sm mb-2 text-center">{forgotSuccess}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 bg-blue-50 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium bg-transparent border-0 p-0"
                onClick={() => setShowEmailModal(true)}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Log In
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-gray-600 text-sm">{"Don't have an account? "}</span>
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password: Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={() => setShowEmailModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Enter your email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter your email"
                />
              </div>
              {forgotError && <div className="text-red-600 text-sm text-center">{forgotError}</div>}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">Send OTP</button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password: OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={() => setShowOtpModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-center">Enter OTP</h2>
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Enter OTP"
                />
              </div>
              {forgotError && <div className="text-red-600 text-sm text-center">{forgotError}</div>}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">Verify OTP</button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password: Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={() => setShowResetModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="New password"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Confirm new password"
                />
              </div>
              {forgotError && <div className="text-red-600 text-sm text-center">{forgotError}</div>}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">Reset Password</button>
            </form>
          </div>
                 </div>
       )}

       {/* Contact Modal */}
       {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
     </div>
   )
 }

export default Login