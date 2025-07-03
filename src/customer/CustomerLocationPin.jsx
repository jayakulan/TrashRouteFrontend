import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Recycle, Search, Plus, Minus, Navigation, Bell } from "lucide-react"
import UserProfileDropdown from "./UserProfileDropdown"

const PinLocation = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate();

  const pickupDetails = {
    wasteTypes: "Mixed Recyclables, Cardboard",
    quantities: "2 bags, 3 boxes",
    totalWeight: "15 kg",
    location: "123 Elm Street, San Francisco",
  }

  const handleMapClick = (event) => {
    // Simulate getting new coordinates (random nearby for demo)
    const randomLat = coordinates.latitude + (Math.random() - 0.5) * 0.01;
    const randomLng = coordinates.longitude + (Math.random() - 0.5) * 0.01;
    setCoordinates({ latitude: randomLat, longitude: randomLng });
    console.log("Map clicked, new coordinates:", randomLat, randomLng);
  }

  const handleZoomIn = () => {
    console.log("Zoom in")
  }

  const handleZoomOut = () => {
    console.log("Zoom out")
  }

  const handleLocationCenter = () => {
    console.log("Center on user location")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <nav className="container mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-34" />
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/customer/trash-type" className="text-gray-700 hover:text-gray-900 font-medium">Request Pickup</Link>
            <Link to="/customer/track-pickup" className="text-gray-700 hover:text-gray-900 font-medium">Track Pickup</Link>
            <Link to="/customer/history-log" className="text-gray-700 hover:text-gray-900 font-medium">History Log</Link>
            <Link to="/customer/notification-log" className="text-gray-700 hover:text-gray-900 font-medium" aria-label="Notification Log"><Bell className="w-5 h-5" /></Link>
            <UserProfileDropdown />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-8 flex gap-12">
        {/* Left: Map Section */}
        <section className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link to="/customer/trash-type" className="text-blue-600 hover:text-blue-700">Request Pickup</Link>
            <span className="text-gray-400">/</span>
            <Link to="/select-waste-type" className="text-blue-600 hover:text-blue-700">Select Waste Type</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">Pin Location</span>
          </div>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-900 mb-1">Step 2 of 3</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full" style={{ width: "33.33%", background: '#3a5f46' }}></div>
            </div>
          </div>
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Pin your location</h1>
          {/* Map Card */}
          <div className="relative bg-white rounded-2xl shadow border overflow-hidden" style={{ minHeight: 380 }}>
            {/* Floating Search Bar */}
            <div className="absolute top-6 left-6 right-32 z-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for a location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                />
              </div>
            </div>
            {/* Map Controls */}
            <div className="absolute top-6 right-6 z-10 flex flex-col space-y-2">
              <button onClick={handleZoomIn} className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={handleZoomOut} className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={handleLocationCenter} className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Navigation className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {/* Map Placeholder */}
            <div
              className="w-full h-96 bg-[#1b6b6b] relative cursor-crosshair"
              onClick={handleMapClick}
              style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: "20px 20px" }}
            >
              {/* Street Grid Overlay */}
              <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  {[...Array(15)].map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="white" strokeWidth="0.5" />
                  ))}
                  {[...Array(20)].map((_, i) => (
                    <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="300" stroke="white" strokeWidth="0.5" />
                  ))}
                  <line x1="0" y1="150" x2="400" y2="150" stroke="white" strokeWidth="2" />
                  <line x1="200" y1="0" x2="200" y2="300" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              {/* Location Pin */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              {/* Coordinates */}
              <div className="absolute left-6 bottom-4 text-xs text-gray-400 font-medium">
                Longitude: {coordinates.latitude.toFixed(4)}, Latitude: {coordinates.longitude.toFixed(4)}
              </div>
            </div>
          </div>
          {/* Coordinates Card - below the map */}
          <div className="mt-8 mb-4 w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow border p-6 flex flex-col gap-2 items-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pinned Location</h2>
              <div className="flex gap-8 text-base">
                <div className="text-blue-600 font-medium">Longitude: <span className="text-gray-900 font-normal">{coordinates.latitude.toFixed(6)}</span></div>
                <div className="text-blue-600 font-medium">Latitude: <span className="text-gray-900 font-normal">{coordinates.longitude.toFixed(6)}</span></div>
              </div>
            </div>
          </div>
          {/* Next Button - Centered below coordinates card */}
          <div className="w-full max-w-2xl mx-auto flex justify-center mb-8">
            <button 
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 px-8 rounded-lg transition-colors"
              onClick={() => navigate('/customer/pickup-summary')}
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default PinLocation
