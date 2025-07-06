import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Recycle, Search, Plus, Minus, Navigation, Bell } from "lucide-react"
import UserProfileDropdown from "./UserProfileDropdown"
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import CustomerNotification from "./CustomerNotification";

const PinLocation = () => {
  const [coordinates, setCoordinates] = useState({
    latitude: 9.6615, // Jaffna, Sri Lanka
    longitude: 80.0255,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [mapZoom, setMapZoom] = useState(17);
  const navigate = useNavigate();

  const pickupDetails = {
    wasteTypes: "Mixed Recyclables, Cardboard",
    quantities: "2 bags, 3 boxes",
    totalWeight: "15 kg",
    location: "123 Elm Street, San Francisco",
  }

  const handleMapClick = (event) => {
    setCoordinates({
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng(),
    });
    console.log("Map clicked, new coordinates:", event.latLng.lat(), event.latLng.lng());
  }

  const handleZoomIn = () => setMapZoom((z) => Math.min(z + 1, 21));
  const handleZoomOut = () => setMapZoom((z) => Math.max(z - 1, 2));
  const handleLocationCenter = () => {
    // Optionally implement geolocation
    console.log("Center on user location")
  }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyA5iEKgAwrJWVkCMAsD7_IilJ0YSVf_VGk',
  });

  const mapContainerStyle = {
    width: '100%',
    height: '380px',
    borderRadius: '1rem',
  };

  const center = {
    lat: coordinates.latitude,
    lng: coordinates.longitude,
  };

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
            <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
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
            <Link to="/customer/trash-type" className="text-theme-color hover:text-theme-color-dark font-medium">Request Pickup</Link>
            <span className="text-gray-400">/</span>
            <Link to="/select-waste-type" className="text-theme-color hover:text-theme-color-dark font-medium">Select Waste Type</Link>
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
            {/* Google Map Integration */}
            <div style={{ width: '100%', height: 380 }}>
              {isLoaded && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={mapZoom}
                  onClick={handleMapClick}
                >
                  <Marker position={center} />
                </GoogleMap>
              )}
            </div>
          </div>
          {/* Coordinates Card - below the map */}
          <div className="mt-8 mb-4 w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow border p-6 flex flex-col gap-2 items-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pinned Location</h2>
              <div className="flex gap-8 text-base">
                <div className="text-theme-color font-medium">Longitude: <span className="text-gray-900 font-normal">{coordinates.latitude.toFixed(6)}</span></div>
                <div className="text-theme-color font-medium">Latitude: <span className="text-gray-900 font-normal">{coordinates.longitude.toFixed(6)}</span></div>
              </div>
            </div>
          </div>
          {/* Next Button - Centered below coordinates card */}
          <div className="w-full max-w-2xl mx-auto flex justify-center mb-8">
            <button 
              className="next-btn py-4 px-12 rounded-full text-lg"
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
