import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Diamond } from "lucide-react"

const WastePreferences = () => {
  const [selectedWasteTypes, setSelectedWasteTypes] = useState(new Set())
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
    const newSelected = new Set(selectedWasteTypes)
    if (newSelected.has(wasteTypeId)) {
      newSelected.delete(wasteTypeId)
    } else {
      newSelected.add(wasteTypeId)
    }
    setSelectedWasteTypes(newSelected)
  }

  const handleSubmit = () => {
    console.log("Selected waste types:", Array.from(selectedWasteTypes))
    // Handle submission logic here
    navigate("/company/route-access")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="Logo" className="h-16 w-34" />
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link to="/requests" className="text-gray-700 hover:text-gray-900 font-medium">
                Requests
              </Link>
              <Link to="/schedule" className="text-gray-700 hover:text-gray-900 font-medium">
                Schedule
              </Link>
              <Link to="/reports" className="text-gray-700 hover:text-gray-900 font-medium">
                Reports
              </Link>
              <Link to="/settings" className="text-gray-700 hover:text-gray-900 font-medium">
                Settings
              </Link>
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
              <img src="/placeholder.svg?height=32&width=32" alt="User" className="w-8 h-8 rounded-full object-cover" />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Waste Preferences</h1>
          <p className="text-lg text-gray-600">Select the types of waste your company processes.</p>
        </div>

        {/* Waste Type Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {wasteTypes.map((wasteType) => (
            <div
              key={wasteType.id}
              onClick={() => toggleWasteType(wasteType.id)}
              className={`
                relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg
                ${selectedWasteTypes.has(wasteType.id) ? "ring-4 ring-blue-500 ring-opacity-50" : "hover:shadow-md"}
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
                {selectedWasteTypes.has(wasteType.id) && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
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
            disabled={selectedWasteTypes.size === 0}
            className={`
              px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200
              ${
                selectedWasteTypes.size > 0
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Submit Waste Preferences
          </button>
        </div>

        {/* Selection Summary */}
        {selectedWasteTypes.size > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Selected:{" "}
              {Array.from(selectedWasteTypes)
                .map((id) => wasteTypes.find((type) => type.id === id)?.name)
                .join(", ")}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default WastePreferences