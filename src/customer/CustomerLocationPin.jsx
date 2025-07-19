// Place this at the top of the file, outside the component
const GOOGLE_MAPS_LIBRARIES = ['places'];

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Recycle, Search, Plus, Minus, Navigation, Bell } from "lucide-react"
import UserProfileDropdown from "./UserProfileDropdown"
import { GoogleMap } from '@react-google-maps/api';
import CustomerNotification from "./CustomerNotification";
import { useGoogleMaps } from "../components/GoogleMapsProvider";

// --- PlaceAutocompleteInput: Uses the new PlaceAutocompleteElement web component ---
function PlaceAutocompleteInput({ onPlaceSelect }) {
  const inputRef = useRef(null);
  useEffect(() => {
    if (window.customElements && !window.customElements.get('gmpx-place-autocomplete')) {
      // Optionally, dynamically load the web component if not present
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@googlemaps/places-autocomplete-element/dist/index.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
    if (window.google && window.google.maps && window.google.maps.places && inputRef.current) {
      // Remove any previous autocomplete element
      inputRef.current.innerHTML = '';
      const autocompleteEl = document.createElement('gmpx-place-autocomplete');
      autocompleteEl.setAttribute('style', 'width: 100%;');
      autocompleteEl.addEventListener('gmpx-placeautocomplete-placechange', (event) => {
        const place = event.detail;
        if (onPlaceSelect) onPlaceSelect(place);
      });
      inputRef.current.appendChild(autocompleteEl);
    }
  }, [onPlaceSelect]);
  return <div ref={inputRef} style={{ width: '100%' }} />;
}

// --- Main Component ---
const GOOGLE_MAPS_MAP_ID = '2d11b98e205d938c1f59291f'; // Custom Map ID for TrashRoute

const PinLocation = () => {
  const { isLoaded, loadError: googleMapsError, isLoading: isGoogleMapsLoading } = useGoogleMaps();
  const [coordinates, setCoordinates] = useState({
    latitude: 9.6615, // Jaffna, Sri Lanka
    longitude: 80.0255,
  })
  const [address, setAddress] = useState("");
  const [searchQuery, setSearchQuery] = useState("")
  const [mapZoom, setMapZoom] = useState(17);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const autocompleteInputRef = useRef(null);

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
  }

  const handleZoomIn = () => setMapZoom((z) => Math.min(z + 1, 21));
  const handleZoomOut = () => setMapZoom((z) => Math.max(z - 1, 2));
  const handleLocationCenter = () => {
    if (map) {
      map.setCenter({ lat: coordinates.latitude, lng: coordinates.longitude });
      setMapZoom(17);
    }
  }

  // Locate Me button using Geolocation API
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
          setMapZoom(18);
        },
        (error) => {
          setMessage({ type: "error", text: "Unable to get your location." });
          setLoading(false);
        }
      );
    } else {
      setMessage({ type: "error", text: "Geolocation is not supported by your browser." });
    }
  };

  const handleSaveLocation = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Customer/CustomerLocationPin.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setMessage({ type: "success", text: "Location saved successfully!" });
        localStorage.setItem('locationData', JSON.stringify({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          requestIds: result.data.request_ids,
          totalUpdated: result.data.total_updated
        }));
        setTimeout(() => {
          navigate('/customer/pickup-summary');
        }, 1500);
      } else {
        setMessage({ type: "error", text: result.message || "Failed to save location" });
      }
    } catch (error) {
      setMessage({ type: "error", text: `Network error: ${error.message}. Please try again.` });
    } finally {
      setLoading(false);
    }
  };

  // --- AdvancedMarkerElement integration ---
  useEffect(() => {
    if (isLoaded && map && window.google) {
      // Remove old marker if any
      if (marker) marker.setMap(null);
      const newMarker = new window.google.maps.Marker({
        position: { lat: coordinates.latitude, lng: coordinates.longitude },
        map,
        title: "Selected Location",
        draggable: true,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3a5f46',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2
        }
      });
      newMarker.addListener("dragend", (e) => {
        setCoordinates({
          latitude: e.latLng.lat(),
          longitude: e.latLng.lng(),
        });
      });
      setMarker(newMarker);
    }
    // eslint-disable-next-line
  }, [isLoaded, map, coordinates]);

  // Reverse geocoding to get address from coordinates
  useEffect(() => {
    if (
      isLoaded &&
      window.google &&
      window.google.maps &&
      typeof window.google.maps.Geocoder === "function" &&
      coordinates.latitude &&
      coordinates.longitude
    ) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: coordinates.latitude, lng: coordinates.longitude } },
        (results, status) => {
          if (status === "OK" && results[0]) {
            setAddress(results[0].formatted_address);
          } else {
            setAddress("Address not found");
          }
        }
      );
    }
  }, [isLoaded, coordinates]);

  const mapContainerStyle = {
    width: '100%',
    height: '380px',
    borderRadius: '1rem',
  };

  const center = {
    lat: coordinates.latitude,
    lng: coordinates.longitude,
  };

  // Show error if Google Maps failed to load
  if (googleMapsError) {
    return (
      <div className="min-h-screen bg-gray-50">
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

        <main className="container mx-auto px-8 py-8">
          <div className="bg-white border rounded-2xl shadow-sm p-8 text-center">
            <div className="text-6xl mb-4">🗺️</div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Accent bar at the very top */}
      <div className="absolute top-0 left-0 right-0 w-screen h-1 bg-[#26a360] rounded-t-2xl z-50"></div>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
        <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
          {/* Logo with animation */}
          <div className="flex items-center">
            <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
          </div>
          {/* Navigation Links with enhanced animations */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
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
          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === "success" 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              <div className="flex items-center space-x-2">
                <span className="text-lg">
                  {message.type === "success" ? "✅" : "❌"}
                </span>
                <span className="font-medium">{message.text}</span>
              </div>
            </div>
          )}
          {/* Map Card */}
          <div className="relative bg-white rounded-2xl shadow border overflow-hidden" style={{ minHeight: 380 }}>
            {/* Floating Search Bar with PlaceAutocompleteElement */}
            <div className="absolute top-6 left-6 right-32 z-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                {isLoaded && (
                  <PlaceAutocompleteInput
                    onPlaceSelect={place => {
                      if (place && place.location) {
                        setCoordinates({
                          latitude: place.location.lat,
                          longitude: place.location.lng,
                        });
                        setSearchQuery(place.formatted_address || "");
                      }
                    }}
                  />
                )}
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
              <button onClick={handleLocateMe} className="w-10 h-10 bg-blue-50 border border-blue-200 rounded-lg shadow flex items-center justify-center hover:bg-blue-100 transition-colors" title="Locate Me">
                <Navigation className="w-5 h-5 text-blue-600" />
              </button>
            </div>
            {/* Google Map Integration */}
            <div style={{ width: '100%', height: 380 }}>
              {(isGoogleMapsLoading || !isLoaded || !window.google || !window.google.maps || !window.google.maps.Map) && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      {isGoogleMapsLoading ? "Loading Google Maps..." : "Initializing map..."}
                    </p>
                  </div>
                </div>
              )}
              {isLoaded && window.google && window.google.maps && window.google.maps.Map && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  zoom={mapZoom}
                  onClick={handleMapClick}
                  mapId={GOOGLE_MAPS_MAP_ID} // Pass the Map ID here for Advanced Markers
                  options={{
                    mapTypeId: 'roadmap',
                    streetViewControl: true,
                    fullscreenControl: true,
                    zoomControl: false
                  }}
                  onLoad={setMap}
                />
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
              <div className="text-gray-700 text-sm mt-2">
                <span className="font-medium">Address:</span> {address}
              </div>
            </div>
          </div>
          {/* Next Button - Centered below coordinates card */}
          <div className="w-full max-w-2xl mx-auto flex justify-center mb-8">
            <button 
              className="next-btn py-4 px-12 rounded-full text-lg"
              onClick={handleSaveLocation}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                "Next"
              )}
            </button>
          </div>
        </section>
      </main>
      {/*
        IMPORTANT: For PlaceAutocompleteElement and AdvancedMarkerElement to work,
        add these to your public/index.html (or equivalent):
        <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places,marker"></script>
        <script src="https://unpkg.com/@googlemaps/places-autocomplete-element/dist/index.min.js"></script>
      */}
    </div>
  )
}

export default PinLocation
