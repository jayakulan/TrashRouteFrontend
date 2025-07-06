"use client"

import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Minus, Navigation, Check } from "lucide-react"
import { GoogleMap, LoadScript, Polyline } from "@react-google-maps/api"
import UserProfileDropdowncom from "./UserProfileDropdowncom"

const GOOGLE_MAPS_API_KEY = "AIzaSyA5iEKgAwrJWVkCMAsD7_IilJ0YSVf_VGk"

const GOOGLE_MAPS_MAP_ID = "2d11b98e205d938c1f59291f" // Custom Map ID for TrashRoute

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
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [optimizedLocations, setOptimizedLocations] = useState([])
  const [markers, setMarkers] = useState([])
  const [apiError, setApiError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [households, setHouseholds] = useState([
    { id: 1, address: "123 Elm Street", contact: "Sarah Miller", notes: "Leave bins by the curb", collected: false },
    { id: 2, address: "456 Oak Avenue", contact: "David Lee", notes: "Backyard gate code: 7890", collected: false },
    { id: 3, address: "789 Pine Lane", contact: "Emily Chen", notes: "Bins behind the garage", collected: false },
    { id: 4, address: "101 Maple Drive", contact: "Robert Green", notes: "Contactless pickup preferred", collected: false },
    { id: 5, address: "222 Cedar Court", contact: "Jessica White", notes: "Bins near the side entrance", collected: false }
  ])

  useEffect(() => {
    const center = { lat: 20.5937, lng: 78.9629 }
    const locations = Array.from({ length: 10 }, () => getRandomLatLng(center, 1000000))
    const optimized = getOptimizedPath(locations)
    setOptimizedLocations(optimized)
  }, [])

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
          alert("Location access denied or unavailable.")
        }
      )
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

  const center = { lat: 20.5937, lng: 78.9629 }

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
            <div className="text-6xl mb-4">🗺️</div>
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
        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3a5f46] mb-2 flex items-center gap-2">
            <span>Route Map</span>
            <span className="inline-block bg-[#e6f4ea] text-[#3a5f46] px-2 py-1 rounded text-xs font-semibold">Company</span>
          </h1>
          <p className="text-gray-600 mb-4">View, manage, and complete your waste collection route. Use the map and controls to optimize your workflow.</p>
        </div>

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

          {isLoading && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          )}

          <LoadScript 
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            onError={onError}
          >
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
              {optimizedLocations.length > 1 && (
                <Polyline
                  path={optimizedLocations}
                  geodesic={true}
                  strokeColor="#4285F4"
                  strokeOpacity={0.8}
                  strokeWeight={4}
                />
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Household Details Card */}
        <div className="bg-white border rounded-2xl shadow-xl">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#3a5f46] flex items-center gap-2">
              <span>Household Details</span>
              <span className="inline-block bg-[#e6f4ea] text-[#3a5f46] px-2 py-1 rounded text-xs font-semibold">Route</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Progress:</span>
              <div className="w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 rounded-full bg-[#3a5f46] transition-all"
                  style={{ width: `${(collectedCount / totalCount) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-700 font-semibold">{collectedCount}/{totalCount}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#f7faf9] text-xs font-medium text-[#3a5f46] uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">#</th>
                  <th className="px-6 py-3 text-left">Address</th>
                  <th className="px-6 py-3 text-left">Contact</th>
                  <th className="px-6 py-3 text-left">Notes</th>
                  <th className="px-6 py-3 text-left">Collected</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredHouseholds.map((h, idx) => (
                  <tr key={h.id} className={idx % 2 === 0 ? "bg-[#f7faf9]" : "bg-white"}>
                    <td className="px-6 py-4 font-semibold text-gray-700">{h.id}</td>
                    <td className="px-6 py-4">{h.address}</td>
                    <td className="px-6 py-4">{h.contact}</td>
                    <td className="px-6 py-4">{h.notes}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleCollected(h.id)}
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
          <div className="p-6 bg-[#f7faf9] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-700 font-medium flex items-center gap-2">
              <span>Route Completion:</span>
              <span className="font-bold text-[#3a5f46]">{collectedCount} of {totalCount} households collected</span>
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
        </div>
      </main>
    </div>
  )
}

export default RouteMap
