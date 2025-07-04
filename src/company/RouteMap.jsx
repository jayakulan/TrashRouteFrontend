"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Diamond, Search, Plus, Minus, Navigation, Check } from "lucide-react"
import reactLogo from "../assets/react.svg";
import UserProfileDropdowncom from "./UserProfileDropdowncom";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GOOGLE_MAPS_API_KEY = "AIzaSyA5iEKgAwrJWVkCMAsD7_IilJ0YSVf_VGk";

function getRandomLatLng(center, radius) {
  // Generate random lat/lng within a radius (in meters) from center
  const y0 = center.lat;
  const x0 = center.lng;
  const rd = radius / 111300; // about 111300 meters in one degree
  const u = Math.random();
  const v = Math.random();
  const w = rd * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  return { lat: y0 + y, lng: x0 + x };
}

// Simple nearest neighbor TSP heuristic
function getOptimizedPath(points) {
  if (points.length === 0) return [];
  const visited = Array(points.length).fill(false);
  const path = [0];
  visited[0] = true;
  for (let i = 1; i < points.length; i++) {
    let last = path[path.length - 1];
    let minDist = Infinity;
    let next = -1;
    for (let j = 0; j < points.length; j++) {
      if (!visited[j]) {
        const d = Math.hypot(points[last].lat - points[j].lat, points[last].lng - points[j].lng);
        if (d < minDist) {
          minDist = d;
          next = j;
        }
      }
    }
    path.push(next);
    visited[next] = true;
  }
  return path.map(idx => points[idx]);
}

const center = { lat: 20.5937, lng: 78.9629 };
const randomLocations = Array.from({ length: 10 }, () => getRandomLatLng(center, 1000000));
const optimizedLocations = getOptimizedPath(randomLocations);

// Custom numbered icon
function createNumberedIcon(number) {
  return L.divIcon({
    className: "custom-numbered-icon",
    html: `<div style='background:#4285F4;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.2);'>${number}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function FitBounds({ locations }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [locations, map]);
  return null;
}

function RouteAnimation({ path }) {
  const map = useMap();
  const [idx, setIdx] = useState(0);
  const markerRef = useRef();
  useEffect(() => {
    if (!path.length) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % path.length;
      setIdx(i);
      if (markerRef.current) {
        markerRef.current.setLatLng(path[i]);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [path]);
  useEffect(() => {
    if (markerRef.current && path.length) {
      markerRef.current.setLatLng(path[idx]);
    }
  }, [idx, path]);
  useEffect(() => {
    if (!map || !path.length) return;
    if (!markerRef.current) {
      markerRef.current = L.marker(path[0], {
        icon: L.divIcon({
          className: "animated-marker",
          html: `<div style='background:#34a853;color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:18px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.2);'>🚚</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        }),
      }).addTo(map);
    }
    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [map, path]);
  return null;
}

function CustomLocateButton() {
  const map = useMap();
  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 14, { animate: true });
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: "custom-numbered-icon",
              html: `<div style='background:#34a853;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.2);'>You</div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            }),
          }).addTo(map);
        },
        () => alert("Could not get your location")
      );
    }
  };
  return (
    <button
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1000,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: "8px 12px",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
      onClick={handleLocate}
    >
      📍 Locate Me
    </button>
  );
}

const RouteMap = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [households, setHouseholds] = useState([
    {
      id: 1,
      address: "123 Elm Street, Apt 4B",
      contact: "Sarah Miller (555) 123-4567",
      notes: "Leave bins by the curb",
      collected: false,
    },
    {
      id: 2,
      address: "456 Oak Avenue",
      contact: "David Lee (555) 987-6543",
      notes: "Backyard gate code: 7890",
      collected: false,
    },
    {
      id: 3,
      address: "789 Pine Lane, Unit 1A",
      contact: "Emily Chen (555) 246-8012",
      notes: "Bins behind the garage",
      collected: false,
    },
    {
      id: 4,
      address: "101 Maple Drive",
      contact: "Robert Green (555) 369-1470",
      notes: "Contactless pickup preferred",
      collected: false,
    },
    {
      id: 5,
      address: "222 Cedar Court",
      contact: "Jessica White (555) 802-5678",
      notes: "Bins near the side entrance",
      collected: false,
    },
  ])

  const mapRef = useRef(null);

  useEffect(() => {
    // Dynamically load Google Maps script
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || !window.google) return;
      // Center somewhere in India
      const center = { lat: 20.5937, lng: 78.9629 };
      const map = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 5.5,
      });
      // Generate 10 random locations
      const locations = Array.from({ length: 10 }, () => getRandomLatLng(center, 1000000));
      // Place markers
      const markers = locations.map((loc, idx) =>
        new window.google.maps.Marker({
          position: loc,
          map,
          label: `${idx + 1}`,
        })
      );
      // Draw polyline connecting the markers
      new window.google.maps.Polyline({
        path: locations,
        geodesic: true,
        strokeColor: "#4285F4",
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map,
      });
    }
  }, []);

  const handleZoomIn = () => {
    console.log("Zoom in")
  }

  const handleZoomOut = () => {
    console.log("Zoom out")
  }

  const handleLocationCenter = () => {
    console.log("Center on user location")
  }

  const toggleCollected = (householdId) => {
    setHouseholds((prev) =>
      prev.map((household) =>
        household.id === householdId ? { ...household, collected: !household.collected } : household,
      ),
    )
  }

  const handleCompleteRoute = () => {
    console.log("Completing route...")
    // Handle route completion logic
  }

  const collectedCount = households.filter((h) => h.collected).length
  const totalCount = households.length

  // Filtered households based on search query
  const filteredHouseholds = households.filter(
    (household) =>
      household.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      household.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      household.notes.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            {/* Logo */}
            <div>
              <img src="/images/logo.png" alt="Logo" className="h-16 w-34" />
            </div>
            {/* Navigation - right aligned */}
            <div className="flex items-center space-x-8 ml-auto">
              <Link to="/company-waste-prefer" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
              <Link to="/company/historylogs" className="text-gray-700 hover:text-gray-900 font-medium">Historylogs</Link>
              {/* Notification Bell Icon */}
              <button className="relative focus:outline-none" aria-label="Notifications">
                <svg className="w-6 h-6 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {/* User Avatar Dropdown */}
              <UserProfileDropdowncom />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Route Map</h1>
          <p className="text-gray-600">View and manage your waste collection route.</p>
        </div>

        {/* Leaflet Map Section */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
          <MapContainer center={center} zoom={5.5} style={{ width: "100%", height: "500px" }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds locations={optimizedLocations} />
            <CustomLocateButton />
            {optimizedLocations.map((loc, idx) => (
              <Marker key={idx} position={loc} icon={createNumberedIcon(idx + 1)}>
                <Popup>
                  <div>
                    <strong>Pin {idx + 1}</strong>
                    <br />Lat: {loc.lat.toFixed(4)}<br />Lng: {loc.lng.toFixed(4)}
                  </div>
                </Popup>
              </Marker>
            ))}
            <Polyline positions={optimizedLocations} color="#4285F4" weight={4} />
            <RouteAnimation path={optimizedLocations} />
          </MapContainer>
        </div>

        {/* Household Details Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Household Details</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collected
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHouseholds.map((household) => (
                  <tr key={household.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{household.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{household.address}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{household.contact}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{household.notes}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleCollected(household.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          household.collected
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        } transition-colors`}
                      >
                        {household.collected ? "Collected" : "Not Collected"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Complete Route Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Progress: {collectedCount} of {totalCount} households collected
            </div>
            <button
              onClick={handleCompleteRoute}
              disabled={collectedCount !== totalCount}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                collectedCount === totalCount
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-400 cursor-not-allowed"
              }`}
            >
              <Check className="w-4 h-4 mr-2" />
              Complete Route
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default RouteMap