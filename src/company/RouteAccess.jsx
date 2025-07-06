"use client"

import { useState } from "react"
import { Search, Plus, Minus, Navigation } from "lucide-react"
import { useNavigate } from "react-router-dom"
import UserProfileDropdowncom from "./UserProfileDropdowncom"
import { Link } from "react-router-dom"

const RouteActivation = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [cardType, setCardType] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [amount] = useState(500)

  const navigate = useNavigate()

  const handlePayNow = () => setShowModal(true)
  const handleCloseModal = () => setShowModal(false)
  const handleProceed = (e) => {
    e.preventDefault()
    setShowModal(false)
    navigate("/company/route-map")
  }

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

          {/* Locked Map Display */}
          <div className="w-full h-80 bg-gradient-to-br from-[#e6f4ea] to-[#cfe3d6] relative flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="bg-white bg-opacity-30 rounded-full p-6 shadow-lg">
                <svg className="w-12 h-12 text-[#3a5f46]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 17v.01M17 8V7a5 5 0 00-10 0v1a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Route Status */}
        <div className="flex items-center gap-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 px-4 py-3 rounded mt-8 mb-8 shadow">
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <span>Routes are currently locked. Pay the subscription fee to access them.</span>
        </div>
      </section>

      {/* Subscription & Payment Card */}
      <section className="max-w-4xl mx-auto px-4 mb-16 space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-yellow-400 via-green-500 to-green-600 p-6 text-white text-center shadow-md border-2 border-[#e6f4ea] flex flex-col items-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-white bg-[#3a5f46] rounded-full p-1 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
            </svg>
            <h2 className="text-2xl font-bold">Activate Route Access</h2>
          </div>
          <p className="text-lg mb-2">Total fee: <span className="font-bold">Rs.500</span></p>
          <div className="w-full border-t border-white/30 my-4"></div>
          <h3 className="text-xl font-semibold mb-4 text-white">Payment Method</h3>
          <button
            onClick={handlePayNow}
            className="bg-[#3a5f46] hover:bg-[#2e4d3a] text-white py-3 px-6 rounded-xl font-semibold w-full flex items-center justify-center gap-2 shadow transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="10" rx="2" fill="#fff" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20M2 15h20" />
            </svg>
            <span>Pay Now</span>
          </button>
        </div>
      </section>

      {/* Payment Modal */}
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
                <input type="text" value={`Rs.${amount}`} readOnly className="w-full border rounded-lg px-3 py-2 bg-gray-100" />
              </div>
              <button type="submit" className="w-full bg-[#3a5f46] hover:bg-[#2e4d3a] text-white font-semibold py-3 rounded-lg transition">Proceed</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default RouteActivation
