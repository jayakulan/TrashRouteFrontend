"use client"

import { useEffect, useRef, useState } from "react"
import { Link, useLocation, useParams, useNavigate } from "react-router-dom"
import { Plus, Minus, Navigation, Check } from "lucide-react"
import { GoogleMap, Polyline } from "@react-google-maps/api"
import UserProfileDropdowncom from "./UserProfileDropdowncom"
import { useGoogleMaps } from "../components/GoogleMapsProvider"
import { getCookie } from "../utils/cookieUtils"

const GOOGLE_MAPS_MAP_ID = "2d11b98e205d938c1f59291f" // Custom Map ID for TrashRoute

function getOptimizedPath(points) {
  if (points.length === 0) return []
  const visited = Array(points.length).fill(false)
  const path = [0]
  visited[0] = true
  for (let i = 1; i < points.length; i++) {
    let last = path[path.length - 1]
    let minDist = Infinity
    let next = -1
    for (let j = 0; j < points.length; j++) {
      if (!visited[j]) {
        const d = Math.hypot(points[last].lat - points[j].lat, points[last].lng - points[j].lng)
        if (d < minDist) {
          minDist = d
          next = j
        }
      }
    }
    path.push(next)
    visited[next] = true
  }
  return path.map(idx => points[idx])
}

const RouteMap = () => {
  const { isLoaded: isGoogleMapsLoaded, loadError: googleMapsError, isLoading: isGoogleMapsLoading } = useGoogleMaps()
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [optimizedLocations, setOptimizedLocations] = useState([])
  const [markers, setMarkers] = useState([])
  const [apiError, setApiError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [customersError, setCustomersError] = useState("")

  const [households, setHouseholds] = useState([])

  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackHousehold, setFeedbackHousehold] = useState(null);
  const [feedback, setFeedback] = useState({
    pickup_completed: true,
    rating: 5,
    comment: "",
    entered_otp: ""
  });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const location = useLocation();
  const params = useParams();
  const company_id = location.state?.company_id || getCookie("company_id");
  const route_id = location.state?.route_id || params.route_id || null;
  const waste_type = location.state?.waste_type || null;

  const navigate = useNavigate();

  // Fetch customer data for this route
  useEffect(() => {
    // Only fetch if both company_id and route_id are present
    if (!company_id || !route_id) return;
    setLoadingCustomers(true);
    setCustomersError("");
    fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Company/Routemap.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `company_id=${company_id}&route_id=${route_id}`,
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setHouseholds(result.households);
          setCustomersError(""); // Clear error on success
          
          // Create optimized path from customer locations
          if (result.households.length > 0) {
            const locations = result.households.map(customer => ({
              lat: customer.latitude,
              lng: customer.longitude
            }));
            const optimized = getOptimizedPath(locations);
            setOptimizedLocations(optimized);
          }
        } else {
          setCustomersError(result.message || "Failed to fetch customer data");
        }
      })
      .catch(err => {
        setCustomersError("Network error. Please try again.");
      })
      .finally(() => setLoadingCustomers(false));
  }, [company_id, route_id]);

  const onLoad = (map) => {
    setMap(map)
    setIsLoading(false)
    
    // Create regular markers after map loads
    if (window.google && optimizedLocations.length > 0) {
      const newMarkers = optimizedLocations.map((location, index) => {
        return new window.google.maps.Marker({
          position: location,
          map: map,
          label: {
            text: `${index + 1}`,
            color: 'white',
            fontWeight: 'bold'
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        })
      })
      
      setMarkers(newMarkers)
      
      // Fit bounds to show all markers
      const bounds = new window.google.maps.LatLngBounds()
      optimizedLocations.forEach(loc => bounds.extend(loc))
      map.fitBounds(bounds)
    }
  }

  const onError = (error) => {
    console.error("Google Maps API Error:", error)
    setApiError(true)
    setIsLoading(false)
  }

  // Show error if Google Maps failed to load
  if (googleMapsError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <nav className="container mx-auto px-6 py-4 flex justify-between">
            <img src="/images/logo.png" className="h-16" alt="Logo" />
            <div className="flex space-x-6 items-center">
              <Link to="/company-waste-prefer">Dashboard</Link>
              <Link to="/company/historylogs">Historylogs</Link>
              <UserProfileDropdowncom />
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Route Map</h1>
          <p className="text-gray-600 mb-6">View and manage your waste collection route.</p>

          <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🗺</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Google Maps API Error</h3>
            <p className="text-gray-500 mb-4">
              Failed to load Google Maps API. Please refresh the page.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#3a5f46] text-white px-4 py-2 rounded hover:bg-[#2e4d3a]"
            >
              Refresh Page
            </button>
          </div>
        </main>
      </div>
    )
  }

  const handleLocateMe = () => {
    if (navigator.geolocation && map) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const userLoc = { lat: coords.latitude, lng: coords.longitude }
          setCurrentLocation(userLoc)
          
          new window.google.maps.Marker({
            position: userLoc,
            map: map,
            label: {
              text: 'You',
              color: 'white',
              fontWeight: 'bold'
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#34A853',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }
          })
          
          map.setCenter(userLoc)
          map.setZoom(14)
        },
        (err) => {
          console.error("Location error:", err)
          let errorMessage = "Location access denied or unavailable.";
          
          switch(err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "Location access denied. Please enable location services in your browser settings.";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable. Please check your device's location services.";
              break;
            case err.TIMEOUT:
              errorMessage = "Location request timed out. Please try again.";
              break;
            default:
              errorMessage = "An unknown error occurred while getting your location.";
          }
          
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  const handleZoomIn = () => map && map.setZoom(map.getZoom() + 1)
  const handleZoomOut = () => map && map.setZoom(map.getZoom() - 1)
  const handleLocationCenter = () => {
    if (map && optimizedLocations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      optimizedLocations.forEach(loc => bounds.extend(loc))
      map.fitBounds(bounds)
    }
  }

  const toggleCollected = (id) => {
    setHouseholds(prev =>
      prev.map(h => (h.id === id ? { ...h, collected: !h.collected } : h))
    )
  }

  const collectedCount = households.filter(h => h.collected).length
  const totalCount = households.length
  const filteredHouseholds = households.filter(h =>
    h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.notes.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  }

  const center = { lat: 6.9271, lng: 79.8612 } // Colombo, Sri Lanka

  if (apiError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <nav className="container mx-auto px-6 py-4 flex justify-between">
            <img src="/images/logo.png" className="h-16" alt="Logo" />
            <div className="flex space-x-6 items-center">
              <Link to="/company-waste-prefer">Dashboard</Link>
              <Link to="/company/historylogs">Historylogs</Link>
              <UserProfileDropdowncom />
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2">Route Map</h1>
          <p className="text-gray-600 mb-6">View and manage your waste collection route.</p>

          <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🗺</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Google Maps API Error</h3>
            <p className="text-gray-500 mb-4">
              There was an issue loading the Google Maps API. Please check your API key configuration.
            </p>
            <div className="text-sm text-gray-400 mb-4">
              <p>Common issues:</p>
              <ul className="list-disc list-inside">
                <li>API key is invalid or restricted</li>
                <li>Maps JavaScript API is not enabled</li>
                <li>Billing is not set up for the project</li>
              </ul>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#3a5f46] text-white px-4 py-2 rounded hover:bg-[#2e4d3a]"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  const handleOpenFeedbackPopup = (household) => {
    setFeedbackHousehold(household);
    setShowFeedbackPopup(true);
    setFeedbackMessage('');
    setFeedbackError('');
  };

  const handleCollectedClick = (household) => {
    if (!household.collected) {
      handleOpenFeedbackPopup(household);
    } else {
      toggleCollected(household.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
          <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
            {/* Logo with animation */}
            <div className="flex items-center">
              <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
            </div>
            {/* Navigation Links with enhanced animations */}
            <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
              <a href="/company-waste-prefer" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Dashboard</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
              <a href="/company/historylogs" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Historylogs</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            </div>
            {/* Notification and Profile */}
            <div className="hidden md:flex items-center space-x-4 ml-4">
              <button className="relative focus:outline-none" aria-label="Notifications">
                <svg className="w-6 h-6 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
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
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3a5f46] mb-2 flex items-center gap-2">
            <span>Route Map</span>
            <span className="inline-block bg-[#e6f4ea] text-[#3a5f46] px-2 py-1 rounded text-xs font-semibold">Company</span>
          </h1>
          <p className="text-gray-600 mb-4">View, manage, and complete your waste collection route. Use the map and controls to optimize your workflow.</p>
          {waste_type && (
            <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-4 py-3 rounded">
              <p className="font-semibold">Waste Type: {waste_type}</p>
              <p className="text-sm">Showing customers for {waste_type} waste collection</p>
            </div>
          )}
        </div>

        {/* Loading State for Customers */}
        {loadingCustomers && (
          <div className="bg-white border rounded-2xl shadow-sm p-8 text-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading customer data...</p>
          </div>
        )}

        {/* Error State for Customers */}
        {customersError && households.length === 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-semibold">Error loading customers:</p>
            <p>{customersError}</p>
          </div>
        )}

        {/* Map Card */}
        <div className="relative bg-white rounded-2xl shadow-xl border border-[#e6f4ea] overflow-hidden mb-10">
          {/* Map Control Buttons */}
          <div className="absolute top-6 left-6 z-10 flex flex-col space-y-3">
            <button onClick={handleZoomIn} className="bg-[#f7faf9] p-3 rounded-full shadow hover:bg-[#e6f4ea] group transition" title="Zoom In">
              <Plus className="text-[#3a5f46] w-5 h-5 group-hover:scale-110 transition" />
            </button>
            <button onClick={handleZoomOut} className="bg-[#f7faf9] p-3 rounded-full shadow hover:bg-[#e6f4ea] group transition" title="Zoom Out">
              <Minus className="text-[#3a5f46] w-5 h-5 group-hover:scale-110 transition" />
            </button>
            <button onClick={handleLocationCenter} className="bg-[#f7faf9] p-3 rounded-full shadow hover:bg-[#e6f4ea] group transition" title="Center">
              <Navigation className="text-[#3a5f46] w-5 h-5 group-hover:scale-110 transition" />
            </button>
          </div>
          <button
            onClick={handleLocateMe}
            className="absolute top-6 right-6 z-10 bg-[#3a5f46] px-4 py-2 rounded shadow hover:bg-[#2e4d3a] flex items-center space-x-2 text-white font-semibold transition"
          >
            <span className="text-lg">📍</span>
            <span className="text-sm font-medium">Locate Me</span>
          </button>

          {(isGoogleMapsLoading || isLoading) && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {isGoogleMapsLoading ? "Loading Google Maps..." : "Loading map..."}
                </p>
              </div>
            </div>
          )}

          {isGoogleMapsLoaded && window.google && window.google.maps && window.google.maps.Map ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={5}
              onLoad={onLoad}
              mapId={GOOGLE_MAPS_MAP_ID}
              options={{
                mapTypeId: 'roadmap',
                streetViewControl: true,
                fullscreenControl: true,
                zoomControl: false
              }}
            >
              {optimizedLocations.length > 1 && window.google.maps.Polyline && (
                <Polyline
                  path={optimizedLocations}
                  geodesic={true}
                  strokeColor="#4285F4"
                  strokeOpacity={0.8}
                  strokeWeight={4}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {isGoogleMapsLoading ? "Loading Google Maps..." : "Initializing map..."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Household Details Card */}
        <div className="bg-white border rounded-2xl shadow-xl">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#3a5f46] flex items-center gap-2">
              <span>Customer Details</span>
              <span className="inline-block bg-[#e6f4ea] text-[#3a5f46] px-2 py-1 rounded text-xs font-semibold">Route</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 rounded-full bg-[#3a5f46] transition-all"
                  style={{ width: `${totalCount > 0 ? (collectedCount / totalCount) * 100 : 0}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700 font-semibold">{collectedCount}/{totalCount}</span>
            </div>
          </div>
          
          {totalCount === 0 && !loadingCustomers && !customersError ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Customers Found</h3>
              <p className="text-gray-500">There are no customers with pickup requests for this waste type.</p>
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#f7faf9] text-xs font-medium text-[#3a5f46] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Address</th>
                  <th className="px-6 py-3 text-left">Contact</th>
                    <th className="px-6 py-3 text-left">Details</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Collected</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredHouseholds.map((h, idx) => (
                  <tr key={h.id} className={idx % 2 === 0 ? "bg-[#f7faf9]" : "bg-white"}>
                    <td className="px-6 py-4 font-semibold text-gray-700">{h.id}</td>
                    <td className="px-6 py-4">{h.address}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{h.contact}</div>
                          <div className="text-sm text-gray-500">{h.customer_phone}</div>
                        </div>
                      </td>
                    <td className="px-6 py-4">{h.notes}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          h.status === 'Request received' ? 'bg-blue-100 text-blue-800' :
                          h.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          h.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {h.status}
                        </span>
                      </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCollectedClick(h)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm ${
                          h.collected
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-red-100 text-red-800 border border-red-300 hover:bg-red-200"
                        }`}
                      >
                        {h.collected ? (
                          <span className="inline-flex items-center"><Check className="w-4 h-4 mr-1" />Collected</span>
                        ) : (
                          <span className="inline-flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>Not Collected</span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          
          {totalCount > 0 && (
          <div className="p-6 bg-[#f7faf9] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <span>Route Completion:</span>
                <span className="font-bold text-[#3a5f46]">{collectedCount} of {totalCount} customers collected</span>
            </div>
            <button
              onClick={() => alert("Route completed!")}
              disabled={collectedCount !== totalCount}
              className={`px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 shadow transition-colors duration-200
                ${collectedCount === totalCount
                  ? "bg-[#3a5f46] text-white hover:bg-[#2e4d3a]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              <Check className="inline w-6 h-6" />
              Complete Route
            </button>
          </div>
          )}
        </div>
      </main>
      {showFeedbackPopup && feedbackHousehold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Animated Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn" aria-hidden="true"></div>
          {/* Animated Popup */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-[#e6f4ea] animate-popupEnter">
            {/* Close Button */}
            <button
              type="button"
              aria-label="Close feedback form"
              onClick={() => { setShowFeedbackPopup(false); setFeedbackHousehold(null); setFeedbackMessage(''); setFeedbackError(''); }}
              className="absolute top-3 right-3 text-gray-400 hover:text-[#3a5f46] transition-colors text-2xl font-bold focus:outline-none"
            >
              &times;
            </button>
            <h3 className="text-2xl font-extrabold mb-4 text-[#3a5f46] flex items-center gap-2">
              <span className="inline-block bg-[#e6f4ea] text-[#3a5f46] px-2 py-1 rounded text-xs font-semibold">Feedback</span>
              Company Pickup
            </h3>
            {feedbackMessage && (
              <div className="mb-4 p-3 rounded bg-green-100 text-green-800 font-semibold text-center">
                {feedbackMessage}
              </div>
            )}
            {feedbackError && (
              <div className="mb-4 p-3 rounded bg-red-100 text-red-800 font-semibold text-center">
                {feedbackError}
              </div>
            )}
            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                setFeedbackSubmitting(true);
                setFeedbackMessage('');
                setFeedbackError('');
                try {
                  // OTP verification if pickup is completed
                  if (feedback.pickup_completed) {
                    if (!feedback.entered_otp) {
                      setFeedbackError("Please enter the customer's OTP to verify the pickup.");
                      setFeedbackSubmitting(false);
                      return;
                    }
                    const otpResponse = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Company/verifyotpcus.php", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        request_id: feedbackHousehold.request_id,
                        entered_otp: feedback.entered_otp
                      })
                    });
                    const otpResult = await otpResponse.json();
                    if (!otpResult.success) {
                      setFeedbackError(otpResult.message);
                      setFeedbackSubmitting(false);
                      return;
                    }
                  }
                  const request_id = feedbackHousehold.request_id || 1;
                  const company_id = getCookie("company_id");
                  if (!company_id) {
                    setFeedbackError("Company ID not found. Please log in again.");
                    setFeedbackSubmitting(false);
                    return;
                  }
                  const payload = {
                    request_id,
                    company_id,
                    pickup_completed: feedback.pickup_completed,
                    rating: feedback.rating,
                    comment: feedback.comment,
                    entered_otp: feedback.entered_otp
                  };
                  const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Company/company_feedback.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                  });
                  const data = await response.json();
                  if (data.success) {
                    setFeedbackMessage(data.message || "Feedback submitted successfully!");
                    setFeedbackError('');
                    setHouseholds(prev =>
                      prev.map(h =>
                        h.request_id === feedbackHousehold.request_id
                          ? { ...h, status: 'Completed', collected: true }
                          : h
                      )
                    );
                    setTimeout(() => {
                      setShowFeedbackPopup(false);
                      setFeedbackHousehold(null);
                      setFeedback({ pickup_completed: true, rating: 5, comment: "", entered_otp: "" });
                      setFeedbackMessage('');
                    }, 2000);
                  } else {
                    setFeedbackError(data.message || "Failed to submit feedback.");
                    setFeedbackMessage('');
                  }
                } catch (err) {
                  setFeedbackError("Error submitting feedback: " + err.message);
                  setFeedbackMessage('');
                } finally {
                  setFeedbackSubmitting(false);
                }
              }}
            >
              <div>
                <label className="block mb-1 font-semibold text-[#3a5f46]">Pickup Completed</label>
                <div className="flex gap-4">
                  <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${feedback.pickup_completed ? 'bg-[#e6f4ea] border-[#3a5f46] text-[#3a5f46]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}> 
                    <input
                      type="radio"
                      className="accent-[#3a5f46]"
                      name="pickup_completed"
                      value="yes"
                      checked={feedback.pickup_completed}
                      onChange={() => setFeedback(f => ({ ...f, pickup_completed: true }))}
                    />
                    Yes
                  </label>
                  <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${!feedback.pickup_completed ? 'bg-[#e6f4ea] border-[#3a5f46] text-[#3a5f46]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}> 
                    <input
                      type="radio"
                      className="accent-[#3a5f46]"
                      name="pickup_completed"
                      value="no"
                      checked={!feedback.pickup_completed}
                      onChange={() => setFeedback(f => ({ ...f, pickup_completed: false }))}
                    />
                    No
                  </label>
                </div>
              </div>
              {/* OTP Verification Field - Only show if pickup is completed */}
              {feedback.pickup_completed && (
                <div>
                  <label className="block mb-1 font-semibold text-[#3a5f46]">
                    Customer OTP Verification
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="text-sm text-gray-600 mb-2">
                    Ask the customer for their OTP to verify the pickup request
                  </div>
                  <input
                    type="text"
                    value={feedback.entered_otp}
                    onChange={e => setFeedback(f => ({ ...f, entered_otp: e.target.value }))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full border border-[#e6f4ea] rounded-lg p-3 focus:ring-2 focus:ring-[#3a5f46] focus:outline-none transition"
                    required={feedback.pickup_completed}
                  />
                </div>
              )}
              <div>
                <label className="block mb-1 font-semibold text-[#3a5f46]">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button
                      type="button"
                      key={n}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border text-lg font-bold transition-colors focus:outline-none ${feedback.rating === n ? 'bg-[#3a5f46] text-white border-[#3a5f46] scale-110 shadow' : 'bg-gray-100 text-[#3a5f46] border-gray-200 hover:bg-[#e6f4ea]'}`}
                      onClick={() => setFeedback(f => ({ ...f, rating: n }))}
                      aria-label={`Rate ${n}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-semibold text-[#3a5f46]">Comment</label>
                <textarea
                  className="w-full border border-[#e6f4ea] rounded-lg p-3 min-h-[80px] focus:ring-2 focus:ring-[#3a5f46] focus:outline-none transition"
                  value={feedback.comment}
                  onChange={e => setFeedback(f => ({ ...f, comment: e.target.value }))}
                  placeholder="Share your experience (optional)"
                  maxLength={500}
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowFeedbackPopup(false); setFeedbackHousehold(null); setFeedbackMessage(''); setFeedbackError(''); }}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={feedbackSubmitting}
                  className={`px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2 transition-colors duration-200 shadow ${feedbackSubmitting ? 'bg-[#3a5f46]/70 cursor-wait' : 'bg-[#3a5f46] hover:bg-[#2e4d3a]'}`}
                >
                  {feedbackSubmitting && (
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                  )}
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
          {/* Animations */}
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            .animate-fadeIn { animation: fadeIn 0.3s ease; }
            @keyframes popupEnter { from { opacity: 0; transform: scale(0.85) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            .animate-popupEnter { animation: popupEnter 0.35s cubic-bezier(0.4,0,0.2,1); }
          `}</style>
        </div>
      )}
    </div>
  )
}

export default RouteMap