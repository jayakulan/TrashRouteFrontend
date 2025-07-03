import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Recycle, Bell, Minus, Plus } from "lucide-react"
import MinimumWastePopup from "./MinimumWastePopup"
import UserProfileDropdown from "./UserProfileDropdown"

const CustomerTrashType = () => {
  const [wasteTypes, setWasteTypes] = useState({
    plastics: { quantity: 3, selected: true },
    paper: { quantity: 3, selected: true },
    glass: { quantity: 3, selected: true },
    metals: { quantity: 3, selected: true },
  })

  const navigate = useNavigate()

  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(() => {
    const hide = localStorage.getItem("hideMinimumWastePopup") === "true"
    const shouldShow = sessionStorage.getItem("showMinimumWastePopup") === "true"
    if (!hide && shouldShow) {
      sessionStorage.removeItem("showMinimumWastePopup")
      return true
    }
    return false
  })

  const handleClosePopup = () => setIsPopupOpen(false)
  const handleLearnMore = () => {
    // You can navigate to a help page or show more info here
    setIsPopupOpen(false)
  }
  const handleDontShowAgain = () => {
    localStorage.setItem("hideMinimumWastePopup", "true")
  }

  const updateQuantity = (type, newQuantity) => {
    if (newQuantity >= 0 && newQuantity <= 50) {
      setWasteTypes((prev) => ({
        ...prev,
        [type]: { ...prev[type], quantity: newQuantity },
      }))
    }
  }

  const handleSliderChange = (type, value) => {
    updateQuantity(type, Number.parseInt(value))
  }

  const wasteTypeData = [
    {
      id: "plastics",
      name: "Plastics",
      emoji: "🧴",
      description: "Plastic bottles, containers, and packaging",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        </div>
      ),
    },
    {
      id: "paper",
      name: "Paper",
      emoji: "📄",
      description: "Newspapers, magazines, cardboard, and paper packaging",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600">
            <path
              fill="currentColor"
              d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"
            />
          </svg>
        </div>
      ),
    },
    {
      id: "glass",
      name: "Glass",
      emoji: "🫙",
      description: "Glass bottles and jars",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        </div>
      ),
    },
    {
      id: "metals",
      name: "Metals",
      emoji: "🥫",
      description: "Aluminum and steel cans",
      icon: (
        <div className="w-6 h-6 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-blue-600">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
        </div>
      ),
    },
  ]

  const profileRef = useRef(null)
  const [showProfile, setShowProfile] = useState(false)
  const [user, setUser] = useState({
    profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "User",
    email: "user@email.com",
  })

  const logout = () => {
    // Implement logout functionality
    setShowProfile(false)
  }

  // Close profile box when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  return (
    <div className="min-h-screen bg-gray-50">
      <MinimumWastePopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onLearnMore={handleLearnMore}
        onDontShowAgain={handleDontShowAgain}
      />
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
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/customer/trash-type" className="text-blue-600 hover:text-blue-700">
            Request Pickup
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Select Waste Types</span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Step 1 of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full" style={{ width: "33.33%", background: '#3a5f46' }}></div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Select Waste Types</h1>
          <p className="text-gray-600 text-lg">
            Choose the types of waste you want to have picked up and indicate the approximate quantity for each.
          </p>
        </div>

        {/* Recyclables Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recyclables</h2>

          <div className="space-y-6">
            {wasteTypeData.map((wasteType) => (
              <div key={wasteType.id} className="bg-white rounded-lg border border-gray-200 p-6">
                {/* Waste Type Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {wasteType.icon}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{wasteType.name}</h3>
                        <span className="text-lg">{wasteType.emoji}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{wasteType.description}</p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(wasteType.id, wasteTypes[wasteType.id].quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                      {wasteTypes[wasteType.id].quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(wasteType.id, wasteTypes[wasteType.id].quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quantity Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Quantity (kg)</span>
                    <span className="text-sm font-semibold text-gray-900">{wasteTypes[wasteType.id].quantity}</span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={wasteTypes[wasteType.id].quantity}
                      onChange={(e) => handleSliderChange(wasteType.id, e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3a5f46 0%, #3a5f46 ${(wasteTypes[wasteType.id].quantity / 50) * 100}%, #e5e7eb ${(wasteTypes[wasteType.id].quantity / 50) * 100}%, #e5e7eb 100%)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center">
          <button onClick={() => navigate('/customer/location-pin')}>
            Next
          </button>
        </div>
      </main>
    </div>
  )
}

export default CustomerTrashType