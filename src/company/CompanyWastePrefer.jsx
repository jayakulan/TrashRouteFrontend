import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Diamond } from "lucide-react"
import UserProfileDropdowncom from "./UserProfileDropdowncom"

const WastePreferences = () => {
  const [selectedWasteType, setSelectedWasteType] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

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

  const handleSubmit = async () => {
    setLoading(true)
    setError("")
    setResult(null)
    try {
      const res = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Company/Companywasteprefer.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `waste_type=${selectedWasteType}`,
      })
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            {/* Logo */}
            <div>
              <img src="/images/logo.png" alt="Logo" className="h-16 w-34" />
            </div>
            {/* Navigation - right aligned */}
            <div className="flex items-center space-x-8 ml-auto">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
              <Link to="/company-waste-prefer" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
              <Link to="/company/historylogs" className="text-gray-700 hover:text-gray-900 font-medium">Historylogs</Link>
              {/* Notification Bell Icon */}
              <button className="relative focus:outline-none" aria-label="Notifications">
                <svg className="w-6 h-6 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {/* User Avatar Dropdown */}
              <UserProfileDropdowncom />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Waste Preferences</h1>
          <p className="text-lg text-gray-600">Select the type of waste your company processes.</p>
        </div>

        {/* Waste Type Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {wasteTypes.map((wasteType) => (
            <div
              key={wasteType.id}
              onClick={() => toggleWasteType(wasteType.id)}
              className={`
                relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg
                ${selectedWasteType === wasteType.id ? "ring-4 ring-[#3a5f46] ring-opacity-50" : "hover:shadow-md"}
              `}
            >
              {/* Card Image/Background */}
              <div className={`${wasteType.bgColor} h-64 flex items-center justify-center relative`}>
                {/* Placeholder for actual images */}
                <div className="text-white text-6xl opacity-20">
                  {wasteType.name === "Plastic" && <span role="img" aria-label="Plastic Bottle">🧴</span>}
                  {wasteType.name === "Metal" && <span role="img" aria-label="Wrench">🔧</span>}
                  {wasteType.name === "Paper" && <span role="img" aria-label="Paper">📄</span>}
                  {wasteType.name === "Glass" && <span role="img" aria-label="Glass Jar">🫙</span>}
                </div>

                {/* Selection Indicator */}
                {selectedWasteType === wasteType.id && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-[#3a5f46] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="bg-white p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{wasteType.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{wasteType.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
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
    </div>
  )
}

export default WastePreferences