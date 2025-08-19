// Place this at the top of the file, outside the component
const GOOGLE_MAPS_LIBRARIES = ['places'];

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Recycle, Search, Plus, Minus, Navigation, Bell } from "lucide-react"
import UserProfileDropdown from "./UserProfileDropdown"
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CustomerNotification from "./CustomerNotification";
import { useMapbox } from "../components/MapboxProvider";
import { getCookie } from "../utils/cookieUtils";
import { reverseGeocode, geocodeAddress } from "../utils/mapboxUtils";
import Footer from "../footer.jsx"
import CustomerHeader from "./CustomerHeader";

// Set Mapbox access token
mapboxgl.accessToken = "pk.eyJ1IjoidmlzaG5udTA0IiwiYSI6ImNtZThtcnd0bDBiOGsya3FhbzI4cnVmcDUifQ.7-tKIyQsvzMkXIw3CeU0AA";

// --- PlaceAutocompleteInput: Uses Mapbox Geocoding API ---
function PlaceAutocompleteInput({ onPlaceSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const searchPlaces = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=lk&types=address,poi`
      );
      const data = await response.json();
      
      if (data.features) {
        setSuggestions(data.features.slice(0, 5));
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchPlaces(query);
  };

  const handleSuggestionClick = (suggestion) => {
    const [lng, lat] = suggestion.center;
    setSearchQuery(suggestion.place_name);
    setShowSuggestions(false);
    if (onPlaceSelect) {
      onPlaceSelect({
        location: { lat, lng },
        formatted_address: suggestion.place_name
      });
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search for a location..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3a5f46] focus:border-transparent"
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{suggestion.text}</div>
              <div className="text-sm text-gray-500">{suggestion.place_name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
const PinLocation = () => {
  const { isLoaded, loadError: mapboxError, isLoading: isMapboxLoading } = useMapbox();
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
  const [mapInitialized, setMapInitialized] = useState(false);
  const navigate = useNavigate();
  const mapContainer = useRef(null);

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;
    setCoordinates({
      latitude: lat,
      longitude: lng,
    });
  }

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
      setMapZoom(map.getZoom());
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
      setMapZoom(map.getZoom());
    }
  };

  const handleLocationCenter = () => {
    if (map) {
      map.flyTo({
        center: [coordinates.longitude, coordinates.latitude],
        zoom: 17
      });
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
          if (map) {
            map.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 18
            });
          }
          setLoading(false);
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
      const token = getCookie('token');
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

  // Initialize Mapbox map
  useEffect(() => {
    // Wait for the component to be fully mounted and the container to be available
    const initializeMap = () => {
      if (mapContainer.current && !mapInitialized && mapboxgl && mapboxgl.Map) {
        console.log('Initializing Mapbox map...');
        console.log('Map container:', mapContainer.current);
        console.log('Mapbox GL available:', !!mapboxgl);
        console.log('Mapbox Map constructor available:', !!mapboxgl.Map);
        
        try {
          const newMap = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [coordinates.longitude, coordinates.latitude],
            zoom: mapZoom,
            attributionControl: false
          });

          console.log('Map instance created:', newMap);

          // Add navigation controls
          newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

          // Add click event
          newMap.on('click', handleMapClick);

          // Add zoom change event
          newMap.on('zoom', () => {
            setMapZoom(newMap.getZoom());
          });

          // Add load event
          newMap.on('load', () => {
            console.log('Map loaded successfully');
            setMap(newMap);
            setMapInitialized(true);
          });

          // Add error event
          newMap.on('error', (e) => {
            console.error('Map error:', e);
          });

          return () => {
            if (newMap) {
              newMap.remove();
            }
          };
        } catch (error) {
          console.error('Error creating map:', error);
          setMapInitialized(true); // Prevent infinite retries
        }
      }
    };

    // Use a small delay to ensure the DOM is ready
    const timer = setTimeout(initializeMap, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [coordinates.longitude, coordinates.latitude, mapZoom, mapInitialized]);

  // Update marker when coordinates change
  useEffect(() => {
    if (map && coordinates.latitude && coordinates.longitude) {
      // Remove old marker
      if (marker) {
        marker.remove();
      }

      // Add new marker
      const newMarker = new mapboxgl.Marker({
        color: '#3a5f46',
        draggable: true
      })
        .setLngLat([coordinates.longitude, coordinates.latitude])
        .addTo(map);

      // Add drag end event
      newMarker.on('dragend', () => {
        const lngLat = newMarker.getLngLat();
        setCoordinates({
          latitude: lngLat.lat,
          longitude: lngLat.lng,
        });
      });

      setMarker(newMarker);
    }
  }, [map, coordinates.latitude, coordinates.longitude]);

  // Reverse geocoding to get address from coordinates
  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      reverseGeocode(coordinates.latitude, coordinates.longitude)
        .then(address => {
          setAddress(address);
        })
        .catch(error => {
          console.error('Reverse geocoding error:', error);
          setAddress("Address not found");
        });
    }
  }, [coordinates]);

  // Show error if Mapbox failed to load
  if (mapboxError) {
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
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Mapbox API Error</h3>
            <p className="text-gray-500 mb-4">
              Failed to load Mapbox API. Please refresh the page.
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
      <CustomerHeader />

      {/* Main Content */}
      <main className="container mx-auto px-8 py-8 flex gap-12 pt-[85px]">
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
            {/* Floating Search Bar */}
            <div className="absolute top-6 left-6 right-32 z-10">
              <PlaceAutocompleteInput
                onPlaceSelect={place => {
                  if (place && place.location) {
                    setCoordinates({
                      latitude: place.location.lat,
                      longitude: place.location.lng,
                    });
                    setSearchQuery(place.formatted_address || "");
                    if (map) {
                      map.flyTo({
                        center: [place.location.lng, place.location.lat],
                        zoom: 17
                      });
                    }
                  }
                }}
              />
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
            {/* Mapbox Map */}
            <div style={{ width: '100%', height: 380, position: 'relative' }}>
              {!map && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
              <div 
                ref={mapContainer} 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  zIndex: 1
                }} 
              />
            </div>
          </div>
          {/* Coordinates Card - below the map */}
          <div className="mt-8 mb-4 w-full max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow border p-6 flex flex-col gap-2 items-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Pinned Location</h2>
              <div className="flex gap-8 text-base">
                <div className="text-theme-color font-medium">Latitude: <span className="text-gray-900 font-normal">{coordinates.latitude.toFixed(6)}</span></div>
                <div className="text-theme-color font-medium">Longitude: <span className="text-gray-900 font-normal">{coordinates.longitude.toFixed(6)}</span></div>
              </div>
              <div className="text-gray-700 text-sm mt-2">
                <span className="font-medium">Address:</span> {address}
              </div>
<<<<<<< HEAD
              {/* Static map preview */}
              {coordinates.latitude && coordinates.longitude && (
                <img
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.latitude},${coordinates.longitude}&zoom=16&size=320x120&markers=color:green%7C${coordinates.latitude},${coordinates.longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`}
                  alt="Pinned Location Map"
                  style={{ borderRadius: '0.75rem', marginTop: 8, boxShadow: '0 2px 8px #0001' }}
                />
              )}
=======
>>>>>>> c0d75f95245af2629157f5001e729091ad1ccb90
            </div>
          </div>
          {/* Next Button - Centered below coordinates card */}
          <div className="w-full max-w-2xl mx-auto flex justify-center mb-2">
            <button
              onClick={() => navigate(-1)}
              className="py-2 px-8 rounded-full text-base border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 mb-2"
            >
              ← Back
            </button>
          </div>
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
      
      <Footer />
    </div>
  )
}

export default PinLocation
