import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Diamond } from "lucide-react"
import UserProfileDropdowncom from "./UserProfileDropdowncom"
import Footer from "../footer.jsx"
import { setCookie, getCookie, deleteCookie } from '../utils/cookieUtils';

const WastePreferences = () => {
  const [selectedWasteType, setSelectedWasteType] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPopup, setShowPopup] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setShowPopup(true)
  }, [])

  const wasteTypes = [
    {
      id: "plastic",
      name: "Plastic",
      description: "Reusable plastic bottles and containers",
      bgColor: "bg-teal-400",
    },
    {
      id: "metal",
      name: "Metal",
      description: "Scrap tools and metallic items",
      bgColor: "bg-gray-800",
    },
    {
      id: "paper",
      name: "Paper",
      description: "Used papers, boxes, and cartons",
      bgColor: "bg-yellow-500",
    },
    {
      id: "glass",
      name: "Glass",
      description: "Glass jars and bottles",
      bgColor: "bg-gray-900",
    },
  ]

  const toggleWasteType = (wasteTypeId) => {
    setSelectedWasteType(wasteTypeId)
    setResult(null)
    setError("")
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    console.log("Submitting waste preference");
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const token = getCookie("token"); // or localStorage.getItem("token")
      console.log("JWT token:", token); // Debug: check the value

      const res = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Company/Companywasteprefer.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Bearer " + token
        },
        body: `waste_type=${selectedWasteType}`,
      });
      const data = await res.json()
      if (data.success) {
        navigate("/company/route-access", {
          state: {
            wasteType: selectedWasteType
          }
        });
      } else {
        setError(data.message || "Failed to fetch data.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
    // Optionally navigate after showing results
    // navigate("/company/route-access")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Info Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative border-t-8 border-[#26a360] animate-fade-in">
            <p className="text-gray-700 mb-6 font-bold text-xl">You can select a waste type at a time.</p>
            <button
              className="mt-2 px-6 py-2 bg-[#26a360] hover:bg-[#218a4d] text-white font-semibold rounded-full shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#26a360]"
              onClick={() => setShowPopup(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
      {/* Fixed Header Container */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
        {/* Accent bar at the very top */}
        <div className="w-full h-1 bg-[#26a360]"></div>
        {/* Navigation */}
        <nav className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50">
          <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
            {/* Logo with animation */}
            <div className="flex items-center">
              <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
            </div>
            {/* Navigation - right aligned */}
            <div className="flex items-center space-x-8">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 focus:outline-none bg-transparent"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
              </button>
              <button
                type="button"
                onClick={() => navigate("/company-waste-prefer")}
                className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 focus:outline-none bg-transparent"
              >
                <span className="relative z-10">Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
              </button>
              <button
                type="button"
                onClick={() => navigate("/company/historylogs")}
                className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 focus:outline-none bg-transparent"
              >
                <span className="relative z-10">Historylogs</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
              </button>
              {/* Notification Bell Icon */}
              <button className="relative focus:outline-none" aria-label="Notifications">
                <svg className="w-6 h-6 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {/* User Avatar Dropdown */}
              <UserProfileDropdowncom />
            </div>
            {/* Mobile menu button with notification/profile */}
            <div className="md:hidden flex items-center">
              <button className="relative focus:outline-none" aria-label="Notifications">
                <svg className="w-6 h-6 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <UserProfileDropdowncom />
              <button className="ml-2 relative group p-2 rounded-lg transition-all duration-300 hover:bg-[#3a5f46]/10">
                <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300"></div>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl pt-[85px]">
        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Waste Preferences</h1>
          <p className="text-lg text-[#3a5f46]">Select the type of waste your company processes.</p>
        </div>

        {/* Waste Type Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {wasteTypes.map((wasteType) => (
            <div
              key={wasteType.id}
              onClick={() => toggleWasteType(wasteType.id)}
              className={`
                relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200
                border-2 shadow-lg
                bg-[#f5f7f6]
                ${selectedWasteType === wasteType.id ? 'border-4  bg-[#eaf3ee]' : ''}
                hover:scale-105 hover:border-[#3a5f46] hover:shadow-lg 
                group
              `}
              style={{ minHeight: '340px' }}
            >
              {/* Card Image/Background */}
              <div className="h-48 flex items-center justify-center relative p-2">
                <img 
                  src={`/images/${wasteType.id}com.${wasteType.id === 'paper' ? 'jpg' : 'jpeg'}`} 
                  alt={`${wasteType.name} waste`}
                  className={
                    selectedWasteType === wasteType.id
                      ? 'w-full h-full object-cover rounded-md transition-all duration-200'
                      : 'w-full h-full object-cover rounded-md transition-all duration-200 group-hover:grayscale'
                  }
                />
                {/* Selection Indicator */}
                {selectedWasteType === wasteType.id && (
                  <div className="absolute top-3 right-3 w-8 h-8 bg-[#3a5f46] rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              {/* Card Content */}
              <div className="p-5 flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-black mb-1">{wasteType.name}</h3>
                <p className="text-[#3a5f46] text-sm leading-relaxed text-left">{wasteType.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!selectedWasteType || loading}
              className={`
                px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200
                ${
                  selectedWasteType && !loading
                    ? "bg-[#3a5f46] hover:bg-[#2e4d3a] text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {loading ? "Loading..." : "Submit Waste Preferences"}
            </button>
          </div>
        </form>

        {/* Selection Summary */}
        {selectedWasteType && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Selected: {wasteTypes.find((type) => type.id === selectedWasteType)?.name}
            </p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-white rounded-2xl shadow border p-8">
              <h2 className="text-2xl font-bold mb-4 text-[#3a5f46]">Pickup Request Summary</h2>
              <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                <div className="text-lg font-semibold text-gray-700">
                  <span className="block text-[#3a5f46] text-3xl font-bold">{result.customerCount}</span>
                  No. of Customers
                </div>
                <div className="text-lg font-semibold text-gray-700">
                  <span className="block text-[#3a5f46] text-3xl font-bold">{result.approximateQuantity} kg</span>
                  Approximate Quantity
                </div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-8 text-center text-red-600 font-semibold">{error}</div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default WastePreferences