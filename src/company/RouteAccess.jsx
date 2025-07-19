"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Minus, Navigation } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import UserProfileDropdowncom from "./UserProfileDropdowncom"
import { Link } from "react-router-dom"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { getCookie } from "../utils/cookieUtils"

const GOOGLE_MAPS_API_KEY = "AIzaSyA5iEKgAwrJWVkCMAsD7_IilJ0YSVf_VGk"

// Helper function to generate random locations around a center point
function getRandomLatLng(center, radius) {
  const y0 = center.lat
  const x0 = center.lng
  const rd = radius / 111300
  const u = Math.random()
  const v = Math.random()
  const w = rd * Math.sqrt(u)
  const t = 2 * Math.PI * v
  const x = w * Math.cos(t)
  const y = w * Math.sin(t)
  return { lat: y0 + y, lng: x0 + x }
}

const RouteActivation = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [cardType, setCardType] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [amount] = useState(500)
  const [map, setMap] = useState(null)
  const [mapZoom, setMapZoom] = useState(12)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  
  // Random values for route details
  const [routeDetails, setRouteDetails] = useState({
    customerCount: Math.floor(Math.random() * 15) + 5, // Random between 5-20 customers
    approximateQuantity: Math.floor(Math.random() * 50) + 20, // Random between 20-70 kg
    routeStatus: "Pending" // Can be "Pending", "Accepted", "Rejected"
  })
  
  // Generate 10 random locations
  const [randomLocations, setRandomLocations] = useState([])
  const [backendData, setBackendData] = useState({ customerCount: null, approximateQuantity: null });
  const [loadingBackend, setLoadingBackend] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const navigate = useNavigate()
  const location = useLocation();
  const wasteType = location.state?.wasteType || null;

  // Generate random locations on component mount
  useEffect(() => {
    const center = { lat: 6.9271, lng: 79.8612 } // Colombo, Sri Lanka
    const locations = Array.from({ length: 10 }, () => getRandomLatLng(center, 5000)) // 5km radius
    setRandomLocations(locations)
  }, [])

  // Fetch backend data for route details
  useEffect(() => {
    setLoadingBackend(true);
    setBackendError("");
    let url, body;
    const company_id = getCookie("company_id");
    if (!company_id) {
      setBackendError("Company ID not found. Please log in again.");
      setLoadingBackend(false);
      return;
    }
    if (wasteType) {
      url = "http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Company/Companywasteprefer.php";
      body = `waste_type=${wasteType}&company_id=${company_id}`;
    } else {
      url = "http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Company/Routeaccess.php";
      body = `company_id=${company_id}`;
    }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBackendData({
            customerCount: data.customerCount,
            approximateQuantity: data.approximateQuantity,
          });
        } else {
          setBackendError(data.message || "Failed to fetch route data.");
        }
        setLoadingBackend(false);
      })
      .catch(err => {
        setBackendError("Network error. Please try again.");
        setLoadingBackend(false);
      });
  }, [wasteType]);

  const handleMapLoad = (mapInstance) => {
    setMap(mapInstance)
    setIsMapLoaded(true)
    
    // Fit bounds to show all markers
    if (randomLocations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      randomLocations.forEach(loc => bounds.extend(loc))
      mapInstance.fitBounds(bounds)
    }
  }

  const handleMapError = (error) => {
    console.error("Google Maps API Error:", error)
  }

  const handleZoomIn = () => {
    if (map) {
      setMapZoom(prev => Math.min(prev + 1, 20))
      map.setZoom(map.getZoom() + 1)
    }
  }

  const handleZoomOut = () => {
    if (map) {
      setMapZoom(prev => Math.max(prev - 1, 3))
      map.setZoom(map.getZoom() - 1)
    }
  }

  const handleLocationCenter = () => {
    if (map && randomLocations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      randomLocations.forEach(loc => bounds.extend(loc))
      map.fitBounds(bounds)
    }
  }

  const handleAcceptRoute = () => {
    setRouteDetails(prev => ({
      ...prev,
      routeStatus: "Accepted"
    }));
    console.log("Route accepted - Payment method enabled");
  }

  const handleRejectRoute = () => {
    setRouteDetails(prev => ({
      ...prev,
      routeStatus: "Rejected"
    }));
    console.log("Route rejected - Navigating to dashboard");
    navigate("/company-waste-prefer");
  }

  const handlePayNow = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)
  const handleProceed = async (e) => {
    e.preventDefault();
    setPaymentMessage("");
    // Card number validation: 16 digits
    if (!/^\d{16}$/.test(cardNumber)) {
      setPaymentMessage("Card number must be exactly 16 digits.");
      return;
    }
    // Expiry date validation: MM/YY and not expired
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setPaymentMessage("Expiry date must be in MM/YY format.");
      return;
    }
    const [expMonth, expYear] = expiry.split('/').map(Number);
    if (expMonth < 1 || expMonth > 12) {
      setPaymentMessage("Expiry month must be between 01 and 12.");
      return;
    }
    // Get current month/year
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // last two digits
    const currentMonth = now.getMonth() + 1;
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      setPaymentMessage("Card expiry date has already passed.");
      return;
    }
    // CVV validation: 3 digits
    if (!/^\d{3}$/.test(cvv)) {
      setPaymentMessage("CVV must be exactly 3 digits.");
      return;
    }
    setPaymentLoading(true);
    const company_id = getCookie("company_id");
    if (!company_id) {
      setPaymentMessage("Company ID not found. Please log in again.");
      setPaymentLoading(false);
      return;
    }
    try {
      const res = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Company/payments.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `company_id=${company_id}&card_number=${cardNumber}&cardholder_name=${encodeURIComponent(cardName)}&expiry_date=${expiry}&pin_number=${cvv}&amount=${amount}&waste_type=${encodeURIComponent(wasteType || '')}`,
      });
      const data = await res.json();
      if (data.success) {
        setPaymentMessage("Payment successful! Route access unlocked.");
        setShowModal(false);
        // Redirect to RouteMap with company_id and route_id
        navigate("/company/route-map", {
          state: {
            company_id: company_id,
            route_id: data.route_id
          }
        });
      } else {
        setPaymentMessage(data.message || "Payment failed. Please try again.");
      }
    } catch (err) {
      setPaymentMessage("Network error. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const lockedMapOptions = {
    mapTypeId: 'roadmap',
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: false,
    draggable: false,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    clickableIcons: false,
    gestureHandling: "none", // disables all gestures
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
          <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
            {/* Logo with animation */}
            <div className="flex items-center">
              <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
            </div>
            {/* Navigation - right aligned, all in one flex */}
            <div className="flex items-center space-x-8 ml-auto">
              <a href="/company-waste-prefer" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</a>
              <a href="/company/historylogs" className="text-gray-700 hover:text-gray-900 font-medium">Historylogs</a>
              {/* Notification Bell Icon */}
              <button className="relative focus:outline-none" aria-label="Notifications">
                <svg className="w-6 h-6 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {/* User Avatar Dropdown */}
              <UserProfileDropdowncom />
            </div>
            {/* Mobile menu button with notification/profile remains unchanged */}
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
      </header>

      {/* Map Section */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#3a5f46] mb-2 flex items-center gap-2">
            <span>Route Access</span>
            <span className="inline-block bg-[#e6f4ea] text-[#3a5f46] px-2 py-1 rounded text-xs font-semibold">Company</span>
          </h1>
          <p className="text-gray-600 mb-4">Unlock and manage your waste collection routes. Pay the subscription fee to activate access and optimize your company's workflow.</p>
        </div>
        <div className="relative bg-white rounded-2xl shadow-xl border border-[#e6f4ea] overflow-hidden">
          {/* Search Input */}
          <div className="absolute top-6 left-6 right-24 z-10">
            <div className="relative">
              <Search className="absolute left-4 top-3 text-[#3a5f46]" />
              <input
                type="text"
                placeholder="Search for an address or a place"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#e6f4ea] bg-[#f7faf9] focus:ring-[#3a5f46] focus:ring-2 shadow-sm"
              />
            </div>
          </div>

          {/* Map Control Buttons */}
          <div className="absolute top-6 right-6 z-10 flex flex-col space-y-3">
            {[{icon: Plus, label: "Zoom In"}, {icon: Minus, label: "Zoom Out"}, {icon: Navigation, label: "Center"}].map(({icon: Icon, label}, i) => (
              <button key={i} className="bg-[#f7faf9] p-3 rounded-full shadow hover:bg-[#e6f4ea] group transition" title={label}>
                <Icon className="text-[#3a5f46] w-5 h-5 group-hover:scale-110 transition" />
              </button>
            ))}
          </div>

          {/* Google Maps Display */}
          <div className="w-full h-80 relative">
            {(routeDetails.routeStatus === "Pending" || routeDetails.routeStatus === "Accepted") ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 bg-opacity-80 z-20 rounded-2xl border-2 border-dashed border-gray-400">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v1m0 4a2 2 0 002-2h-4a2 2 0 002 2zm6-4V9a6 6 0 10-12 0v8a2 2 0 002 2h8a2 2 0 002-2z" />
                </svg>
                <div className="text-xl font-bold text-gray-500 mb-2">Map Locked</div>
                <div className="text-gray-500 text-center">Unlock the route by completing the payment.</div>
              </div>
            ) : (
              <LoadScript 
                googleMapsApiKey={GOOGLE_MAPS_API_KEY}
                onError={handleMapError}
              >
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={{ lat: 6.9271, lng: 79.8612 }} // Colombo, Sri Lanka
                  zoom={mapZoom}
                  onLoad={handleMapLoad}
                  options={{
                    mapTypeId: 'roadmap',
                    streetViewControl: true,
                    fullscreenControl: true,
                    zoomControl: false,
                    styles: [
                      {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                      }
                    ]
                  }}
                >
                  {/* Render random location markers */}
                  {randomLocations.map((location, index) => (
                    <Marker
                      key={index}
                      position={location}
                      label={{
                        text: `${index + 1}`,
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                      icon={{
                        path: window.google?.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#3a5f46',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2
                      }}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
            )}
            {/* Loading overlay */}
            {!isMapLoaded && routeDetails.routeStatus !== "Pending" && routeDetails.routeStatus !== "Accepted" && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Route Action Buttons */}
          <div className="p-6 border-t border-[#e6f4ea]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#3a5f46]">Route Assignment</h3>
              <span className={`relative flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-200
                ${routeDetails.routeStatus === "Pending" ? "bg-[#eaf3ee] text-[#3a5f46] border border-[#3a5f46] shadow-md" :
                routeDetails.routeStatus === "Accepted" ? "bg-green-100 text-green-800" :
                  "bg-red-100 text-red-800"}
              `}>
                {routeDetails.routeStatus === "Pending" && (
                  <span className="relative flex h-3 w-3 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3a5f46] opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#3a5f46]"></span>
                  </span>
                )}
                {routeDetails.routeStatus}
              </span>
            </div>
            
            {/* Route Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#f7faf9] rounded-lg p-4 border border-[#e6f4ea]">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#3a5f46]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="font-medium text-[#3a5f46]">No. of Customers</span>
                </div>
                <p className="text-2xl font-bold text-[#3a5f46]">
                  {loadingBackend ? "Loading..." : backendData.customerCount ?? "--"}
                </p>
              </div>
              
              <div className="bg-[#f7faf9] rounded-lg p-4 border border-[#e6f4ea]">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-[#3a5f46]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="font-medium text-[#3a5f46]">Approximate Quantity</span>
                </div>
                <p className="text-2xl font-bold text-[#3a5f46]">
                  {loadingBackend ? "Loading..." : (backendData.approximateQuantity ?? "--")} kg
                </p>
              </div>
            </div>
            {backendError && (
              <div className="text-red-600 text-center mb-4">{backendError}</div>
            )}
            
            {/* Accept/Reject Buttons */}
            <div className="flex gap-4">
              <button 
                className={`flex-1 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                  routeDetails.routeStatus === "Accepted" 
                    ? "bg-[#30543C] text-white cursor-not-allowed border border-[#30543C]" 
                    : "bg-[#30543C] hover:bg-[#3a5f46] text-white border border-[#30543C]"
                }`}
                onClick={handleAcceptRoute}
                disabled={routeDetails.routeStatus === "Accepted"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {routeDetails.routeStatus === "Accepted" ? "Route Accepted" : "Accept Route"}
              </button>
              
              <button 
                className={`flex-1 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 ${
                  routeDetails.routeStatus === "Rejected" 
                    ? "bg-[#9D3939] text-white cursor-not-allowed border border-[#7a2323]" 
                    : "bg-[#9D3939] hover:bg-[#7a2323] text-white border border-[#9D3939]"
                }`}
                onClick={handleRejectRoute}
                disabled={routeDetails.routeStatus === "Rejected"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {routeDetails.routeStatus === "Rejected" ? "Route Rejected" : "Reject Route"}
              </button>
            </div>
          </div>
        </div>

        {/* Route Status */}
        {routeDetails.routeStatus === "Pending" && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#eaf3ee] via-white to-white border-l-4 border-[#3a5f46] text-[#3a5f46] px-6 py-5 rounded-2xl mt-8 mb-8 shadow-lg relative overflow-hidden">
            {/* Decorative clock icon */}
            <svg className="w-8 h-8 text-[#3a5f46] mr-2 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#3a5f46" strokeWidth="2" fill="#eaf3ee" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 2" />
            </svg>
            <div className="flex-1">
              <span className="block font-semibold text-base">Routes are currently locked.</span>
              <span className="block text-sm opacity-80">Pay the subscription fee to access them.</span>
            </div>
          </div>
        )}
        
        {routeDetails.routeStatus === "Accepted" && (
          <div className="flex items-center gap-4 bg-gradient-to-r from-[#eaf3ee] via-white to-white border-l-4 border-[#3a5f46] text-[#3a5f46] px-6 py-5 rounded-2xl mt-8 mb-8 shadow-lg relative overflow-hidden">
            {/* Decorative checkmark icon */}
            <svg className="w-8 h-8 text-[#3a5f46] mr-2 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#3a5f46" strokeWidth="2" fill="#eaf3ee" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
            </svg>
            <div className="flex-1">
              <span className="block font-semibold text-base">Route accepted!</span>
              <span className="block text-sm opacity-80">Please complete the payment to activate route access.</span>
            </div>
          </div>
        )}
        
        {routeDetails.routeStatus === "Rejected" && (
          <div className="flex items-center gap-2 bg-[#9d3939] border-l-4 border-[#7a2323] text-white px-4 py-3 rounded mt-8 mb-8 shadow">
            <svg className="w-6 h-6 text-white opacity-80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Route rejected. Redirecting to dashboard...</span>
          </div>
        )}
      </section>

      {/* Subscription & Payment Card - Only show when route is accepted */}
      {routeDetails.routeStatus === "Accepted" && (
        <section className="max-w-4xl mx-auto px-4 mb-16 flex justify-center animate-fade-in">
          <div
            className="relative w-full max-w-xl min-h-[380px] p-12 rounded-[12px] shadow-2xl border border-[#B5CCC0] flex flex-col items-center"
            style={{
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #30543C 0%, #7AA48E 100%)'
            }}
          >
            {/* Chip Icon */}
            <div className="absolute left-6 top-6 flex items-center">
              <svg className="w-10 h-7" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="38" height="26" rx="6" fill="#eaf3ee" stroke="#b2c7b9" strokeWidth="2"/>
                <rect x="8" y="8" width="24" height="4" rx="2" fill="#b2c7b9"/>
                <rect x="8" y="16" width="10" height="2" rx="1" fill="#b2c7b9"/>
                <rect x="22" y="16" width="10" height="2" rx="1" fill="#b2c7b9"/>
              </svg>
            </div>
            {/* Card Title */}
            <h2 className="text-2xl font-extrabold text-white mb-2 mt-8 tracking-wide w-full text-left">Activate Route Access</h2>
            {/* Amount */}
            <p className="text-lg mb-2 w-full text-left">
              <span className="text-[#eaf3ee] font-semibold">Total fee:</span> <span className="font-extrabold text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">Rs.<span className="text-white font-extrabold">500</span></span>
            </p>
            {/* Divider */}
            <div className="w-full border-t border-white/20 my-4"></div>
            {/* Payment Method Label */}
            <h3 className="text-lg font-semibold mb-4 text-white w-full text-left opacity-80">Payment Method</h3>
            {/* Pay Now Button as Card Chip Area */}
            <button
              onClick={handlePayNow}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-lg shadow-inner border border-[#eaf3ee] bg-white text-black transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#39ff14] mb-2 active:bg-[#7AA48E] active:text-[#1E422F]"
              style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10), 0 1.5px 0 #eaf3ee inset' }}
            >
              {/* Embossed chip icon on button */}
              <svg className="w-6 h-6 mr-2" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="30" height="18" rx="4" fill="#eaf3ee" stroke="#b2c7b9" strokeWidth="2"/>
                <rect x="7" y="7" width="18" height="3" rx="1.5" fill="#b2c7b9"/>
              </svg>
              <span>Pay Now</span>
            </button>
            {/* Secure Payment Line */}
            <div className="w-full text-right mt-2">
              <span className="text-xs text-white/60 tracking-wider select-none">Secure Payment • TXN#{Math.floor(Math.random()*900000+100000)}</span>
            </div>
          </div>
        </section>
      )}

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-0 bg-transparent border-none" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none' }}>
              <img src="/images/close.png" alt="Close" style={{ width: 24, height: 24, display: 'block' }} />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">Card Payment</h2>
            <form onSubmit={handleProceed} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Card Type</label>
                <select value={cardType} onChange={e => setCardType(e.target.value)} required className="w-full border rounded-lg px-3 py-2">
                  <option value="">Select Card Type</option>
                  <option value="Visa">Visa</option>
                  <option value="MasterCard">MasterCard</option>
                  <option value="Amex">Amex</option>
                  <option value="Rupay">Rupay</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Card Number</label>
                <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required maxLength={16} className="w-full border rounded-lg px-3 py-2" placeholder="1234 5678 9012 3456" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Name on Card</label>
                <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} required className="w-full border rounded-lg px-3 py-2" placeholder="Cardholder Name" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">Expiry Date</label>
                  <input type="text" value={expiry} onChange={e => setExpiry(e.target.value)} required maxLength={5} className="w-full border rounded-lg px-3 py-2" placeholder="MM/YY" />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium mb-1">CVV</label>
                  <input type="password" value={cvv} onChange={e => setCvv(e.target.value)} required maxLength={4} className="w-full border rounded-lg px-3 py-2" placeholder="CVV" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Amount</label>
                <input type="text" value={`Rs.${amount}`} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-100" />
              </div>
              <button type="submit" className="w-full bg-[#3a5f46] hover:bg-[#2e4d3a] text-white font-semibold py-3 rounded-lg transition" disabled={paymentLoading}>
                {paymentLoading ? "Processing..." : "Proceed"}
              </button>
              {paymentMessage && (
                <div className={`mt-4 text-center font-semibold ${paymentMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>{paymentMessage}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RouteActivation
