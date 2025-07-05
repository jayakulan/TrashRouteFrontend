"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Diamond, Search, Plus, Minus, Navigation, Check } from "lucide-react"
import reactLogo from "../assets/react.svg";
import UserProfileDropdowncom from "./UserProfileDropdowncom";

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

        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
          <div className="relative">
            {/* Search Bar */}
            <div className="absolute top-6 left-6 z-10 w-80">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-6 right-6 z-10 flex flex-col space-y-2">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleLocationCenter}
                className="w-10 h-10 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Navigation className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Map Display */}
            <div
              className="w-full h-96 bg-gradient-to-br from-teal-500 to-teal-700 relative"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            >
              {/* Street Grid Overlay */}
              <div className="absolute inset-0 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  {/* Horizontal streets */}
                  {[...Array(15)].map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="white" strokeWidth="0.8" />
                  ))}
                  {/* Vertical streets */}
                  {[...Array(20)].map((_, i) => (
                    <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="300" stroke="white" strokeWidth="0.8" />
                  ))}
                  {/* Main roads */}
                  <line x1="0" y1="150" x2="400" y2="150" stroke="white" strokeWidth="2.5" />
                  <line x1="200" y1="0" x2="200" y2="300" stroke="white" strokeWidth="2.5" />
                  {/* Diagonal streets */}
                  <line x1="50" y1="0" x2="350" y2="300" stroke="white" strokeWidth="1.5" opacity="0.7" />
                </svg>
              </div>

              {/* Route markers */}
              {filteredHouseholds.map((household, index) => (
                <div
                  key={household.id}
                  className="absolute"
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + (index % 3) * 20}%`,
                  }}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white ${
                      household.collected ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {household.id}
                  </div>
                </div>
              ))}
            </div>
          </div>
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