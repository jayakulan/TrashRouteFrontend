import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Recycle } from "lucide-react"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const navigate = useNavigate()

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
    try {
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/auth/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const result = await response.json()
      if (result.success) {
        const role = result.data.user.role
        if (role === "admin") {
          navigate("/admin/dashboard")
        } else if (role === "company") {
          navigate("/company-waste-prefer")
        } else if (role === "customer") {
          sessionStorage.setItem("showMinimumWastePopup", "true");
          navigate("/customer/trash-type")
        } else {
          setError("Unknown user role.")
        }
      } else {
        setError(result.message || "Login failed")
      }
    } catch (err) {
      setError("Server error")
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
              <span className="text-xl font-bold text-gray-900">TrashRoute</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">
                Home
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-gray-900 font-medium">
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
              <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
                Contact
              </Link>
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
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Forgot password?
              </Link>
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
    </div>
  )
}

export default Login