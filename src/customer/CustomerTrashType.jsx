import { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Recycle, Bell, Minus, Plus, ArrowLeft } from "lucide-react"
import MinimumWastePopup from "./MinimumWastePopup"
import UserProfileDropdown from "./UserProfileDropdown"
import CustomerNotification from "./CustomerNotification"
import { setCookie, getCookie } from "../utils/cookieUtils";

const CustomerTrashType = () => {
  const [wasteTypes, setWasteTypes] = useState({
    plastics: { quantity: 3, selected: false },
    paper: { quantity: 3, selected: false },
    glass: { quantity: 3, selected: false },
    metals: { quantity: 3, selected: false },
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const navigate = useNavigate()

  // Debug: Log state changes
  useEffect(() => {
    console.log('Waste types state updated:', wasteTypes);
  }, [wasteTypes]);

  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(() => {
    const hide = getCookie("hideMinimumWastePopup") === "true"
    return !hide;
  })

  const handleClosePopup = () => setIsPopupOpen(false)
  const handleLearnMore = () => {
    // You can navigate to a help page or show more info here
    setIsPopupOpen(false)
  }
  const handleDontShowAgain = () => {
    setCookie("hideMinimumWastePopup", "true")
  }

  const updateQuantity = (type, newQuantity) => {
    if (newQuantity >= 3 && newQuantity <= 50) {
      setWasteTypes((prev) => ({
        ...prev,
        [type]: { ...prev[type], quantity: newQuantity },
      }))
    }
  }

  const handleSliderChange = (type, value) => {
    updateQuantity(type, Number.parseInt(value))
  }

  const toggleWasteType = (type) => {
    console.log('Toggling waste type:', type);
    console.log('Current state before toggle:', wasteTypes);
    
    setWasteTypes((prev) => {
      const currentSelected = prev[type].selected;
      const newSelected = !currentSelected;
      
      console.log(`Changing ${type} from ${currentSelected} to ${newSelected}`);
      
      const newState = {
        ...prev,
        [type]: { 
          ...prev[type], 
          selected: newSelected 
        },
      };
      
      console.log('New waste types state:', newState);
      return newState;
    });
  }

  const handleSubmitWasteTypes = async () => {
    // Check if at least one waste type is selected
    const selectedWasteTypes = Object.entries(wasteTypes).filter(([_, data]) => data.selected);
    
    if (selectedWasteTypes.length === 0) {
      setMessage({ type: "error", text: "Please select at least one waste type" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Prepare data for backend
      const wasteTypesData = Object.entries(wasteTypes).map(([type, data]) => ({
        type: type.charAt(0).toUpperCase() + type.slice(1), // Capitalize first letter
        quantity: data.quantity,
        selected: data.selected
      }));

      console.log('Sending waste types data:', wasteTypesData);

      // Get token from cookies
      const token = getCookie('token');
      console.log('Token from cookies:', token ? 'Token exists' : 'No token found');
      
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Customer/CustomerTrashType.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          wasteTypes: wasteTypesData
        }),
        credentials: "include",
      });

      const result = await response.json();
      const addressToSave = result.data && result.data.address ? result.data.address : "";
      setCookie('locationData', JSON.stringify({
        address: addressToSave,
        requestIds: result.data.request_ids,
        totalUpdated: result.data.total_updated
      }));
      
      console.log('Response from server:', result);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Backend result:', result);

      if (result.success) {
        setMessage({ type: "success", text: "Waste types saved successfully!" });
        
        // Store the request data in cookies for the next step
        // Note: We'll keep using localStorage for this data as it's temporary and doesn't need to persist across sessions
        setCookie('wasteTypesData', JSON.stringify(wasteTypesData));
        setCookie('pickupRequests', JSON.stringify(result.data));
        
        // Navigate to next step after a short delay
          navigate('/customer/location-pin');
      } else {
        setMessage({ type: "error", text: result.message || "Failed to save waste types" });
      }
    } catch (error) {
      console.error('Error submitting waste types:', error);
      setMessage({ type: "error", text: `Network error: ${error.message}. Please try again.` });
    } finally {
      setLoading(false);
    }
  };

  const wasteTypeData = [
    {
      id: "plastics",
      name: "Plastics",
      emoji: "🧴",
      description: "Plastic bottles, containers, and packaging",
      image: "/images/plastictype.png",
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
      image: "/images/papertype.png",
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
      image: "/images/glasstype.png",
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
      image: "/images/metaltype.png",
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

  // Remove profileRef, profileOpen, and related useEffect
  const [user, setUser] = useState({
    profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "User",
    email: "user@email.com",
  })

  const logout = () => {
    // Implement logout functionality
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MinimumWastePopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onLearnMore={handleLearnMore}
        onDontShowAgain={handleDontShowAgain}
      />
      {/* Accent bar at the very top */}
      <div className="absolute top-0 left-0 right-0 w-screen h-1 bg-[#26a360] rounded-t-2xl z-50"></div>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
        <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
          {/* Logo with animation */}
          <div className="flex items-center">
            <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
          </div>
          {/* Navigation Links - right aligned */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium ml-auto">
            <a href="/" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Home</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/trash-type" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Request Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/track-pickup" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Track Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/history-log" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">History Log</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
          </div>
          {/* Notification and Profile */}
          <div className="hidden md:flex items-center space-x-4 ml-4">
            <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
            <UserProfileDropdown />
          </div>
          {/* Mobile menu button with animation */}
          <div className="md:hidden flex items-center">
            <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
            <UserProfileDropdown />
            <button className="ml-2 relative group p-2 rounded-lg transition-all duration-300 hover:bg-[#3a5f46]/10">
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <button
          className="flex items-center text-theme-color hover:text-theme-color-dark font-medium mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/customer/trash-type" className="text-theme-color hover:text-theme-color-dark">
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

        {/* Message Display */}
        {message.text && message.type === "success" && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
            <div className="flex items-center space-x-2">
              <span className="text-lg">✅</span>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Recyclables Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Materials for Pickup & Processing </h2>

          <div className="space-y-6">
            {wasteTypeData.map((wasteType) => (
              <div
                key={wasteType.id}
                className={`waste-card bg-white rounded-lg border border-gray-200 p-6 flex items-center transition-all duration-200 ${wasteTypes[wasteType.id].selected ? '' : 'opacity-60'}`}
                style={{ position: 'relative', zIndex: 1 }}
              >
                {/* Toggle Button */}
                <button
                  className={`toggle-btn mr-6 ${wasteTypes[wasteType.id].selected ? 'selected' : ''}`}
                  aria-label={wasteTypes[wasteType.id].selected ? `Deselect ${wasteType.name}` : `Select ${wasteType.name}`}
                  type="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Toggle button clicked:', wasteType.id);
                    toggleWasteType(wasteType.id);
                  }}
                  style={{
                    backgroundColor: wasteTypes[wasteType.id].selected ? '#3a5f46' : '#fff',
                    borderColor: '#3a5f46',
                    cursor: 'pointer',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid #3a5f46',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span 
                    className="toggle-check"
                    style={{
                      display: wasteTypes[wasteType.id].selected ? 'block' : 'none',
                      color: '#fff',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}
                  >
                    &#10003;
                  </span>
                </button>
                {/* Waste Type Header */}
                <div className="flex-1">
                  <div className="mb-4">
                    <div className="flex items-center space-x-3">
                      <img src={wasteType.image} alt={wasteType.name + ' icon'} className="w-10 h-10 rounded object-cover" />
                      <h3 className="text-lg font-semibold text-gray-900">{wasteType.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{wasteType.description}</p>
                  </div>
                  {/* Quantity Controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Approximate Quantity (kg)</span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        type="range"
                        min="3"
                        max="50"
                        value={wasteTypes[wasteType.id].quantity}
                        onChange={(e) => handleSliderChange(wasteType.id, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #3a5f46 0%, #3a5f46 ${((wasteTypes[wasteType.id].quantity - 3) / 47) * 100}%, #e5e7eb ${((wasteTypes[wasteType.id].quantity - 3) / 47) * 100}%, #e5e7eb 100%)`,
                          opacity: wasteTypes[wasteType.id].selected ? 1 : 0.5,
                        }}
                      />
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQuantity(wasteType.id, Math.max(3, wasteTypes[wasteType.id].quantity - 1)) }}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                          disabled={wasteTypes[wasteType.id].quantity <= 3}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                          {wasteTypes[wasteType.id].quantity}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); updateQuantity(wasteType.id, wasteTypes[wasteType.id].quantity + 1) }}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-gray-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <div className="flex justify-center">
          <button 
            className="next-btn py-4 px-12 rounded-full text-lg" 
            onClick={handleSubmitWasteTypes}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </main>
    </div>
  )
}

export default CustomerTrashType