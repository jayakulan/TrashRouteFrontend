"use client"

import { useState } from "react"
import { Search, Plus, Minus, Navigation } from "lucide-react"
import { useNavigate } from "react-router-dom"
import UserProfileDropdowncom from "./UserProfileDropdowncom"
import { Link } from "react-router-dom"

const RouteActivation = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")
  const [showModal, setShowModal] = useState(false)
  const [cardType, setCardType] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [amount, setAmount] = useState(500)

  const activationFee = 500
  const navigate = useNavigate();

  const handleZoomIn = () => {
    console.log("Zoom in")
  }

  const handleZoomOut = () => {
    console.log("Zoom out")
  }

  const handleLocationCenter = () => {
    console.log("Center on user location")
  }

  const handlePayNow = () => {
    setShowModal(true)
  }

  const handleProceed = (e) => {
    e.preventDefault()
    // Here you would handle the payment logic
    setShowModal(false)
    // Optionally reset fields or show a success message
    navigate("/company/route-map");
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Map Section */}
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg">
          {/* Search Bar */}
          <div className="absolute top-6 left-6 right-24 z-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for an address or a place"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-6 right-6 z-10 flex flex-col space-y-3">
            <button
              onClick={handleZoomIn}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={handleLocationCenter}
              className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Navigation className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Map Display */}
          <div
            className="w-full h-80 bg-gradient-to-br from-teal-500 to-teal-700 relative"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize: "25px 25px",
            }}
          >
            {/* Street Grid Overlay */}
            <div className="absolute inset-0 opacity-40">
              <svg className="w-full h-full" viewBox="0 0 400 320">
                {/* City grid pattern */}
                {[...Array(16)].map((_, i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="white" strokeWidth="0.8" />
                ))}
                {[...Array(20)].map((_, i) => (
                  <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="320" stroke="white" strokeWidth="0.8" />
                ))}
                {/* Main arterial roads */}
                <line x1="0" y1="160" x2="400" y2="160" stroke="white" strokeWidth="3" />
                <line x1="200" y1="0" x2="200" y2="320" stroke="white" strokeWidth="3" />
                {/* Diagonal roads */}
                <line x1="0" y1="0" x2="400" y2="320" stroke="white" strokeWidth="2" opacity="0.6" />
                <line x1="400" y1="0" x2="0" y2="320" stroke="white" strokeWidth="2" opacity="0.6" />
              </svg>
            </div>

            {/* Locked overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900">Routes are currently locked. Pay the subscription fee to access them.</p>
        </div>

        {/* Activation Card */}
        <div className="relative bg-gradient-to-r from-yellow-400 via-green-400 to-green-600 rounded-2xl overflow-hidden shadow-lg">
          {/* Blurred background effect */}
          <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>

          <div className="relative p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Activate Route Access</h2>
            <p className="text-lg font-medium">Total fee: Rs.{activationFee}</p>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h3>

          {/* Payment Options */}
          <div className="space-y-4 mb-8">
            {/* Card payment option removed as requested */}
          </div>

          {/* Pay Now Button */}
          <button
            onClick={handlePayNow}
            className="w-full bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-4 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Pay Now
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
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
                <input type="number" value={amount} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-100" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">Proceed</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RouteActivation
