"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Diamond } from "lucide-react"
import UserProfileDropdown from "../customer/UserProfileDropdown"

const PickupRequests = () => {
  const [activeTab, setActiveTab] = useState("Pending")
  const [searchQuery, setSearchQuery] = useState("")

  const requestsData = [
    {
      id: "#12345",
      customer: "Olivia Bennett",
      company: "EcoSolutions",
      wasteType: "Mixed Waste",
      location: "123 Maple Street",
      time: "2024-03-15 10:00 AM",
      status: "Pending",
    },
    {
      id: "#12346",
      customer: "Ethan Carter",
      company: "GreenCycle",
      wasteType: "Recyclables",
      location: "456 Oak Avenue",
      time: "2024-03-15 11:00 AM",
      status: "Pending",
    },
    {
      id: "#12347",
      customer: "Sophia Davis",
      company: "WasteAway",
      wasteType: "Organic Waste",
      location: "789 Pine Lane",
      time: "2024-03-15 12:00 PM",
      status: "Pending",
    },
    {
      id: "#12348",
      customer: "Liam Foster",
      company: "EcoSolutions",
      wasteType: "Mixed Waste",
      location: "101 Elm Road",
      time: "2024-03-15 01:00 PM",
      status: "Pending",
    },
    {
      id: "#12349",
      customer: "Ava Green",
      company: "GreenCycle",
      wasteType: "Recyclables",
      location: "222 Cedar Court",
      time: "2024-03-15 02:00 PM",
      status: "Pending",
    },
  ]

  // Sample data for other tabs
  const acceptedRequests = [
    {
      id: "#12350",
      customer: "Noah Wilson",
      company: "EcoSolutions",
      wasteType: "Mixed Waste",
      location: "333 Birch Street",
      time: "2024-03-16 09:00 AM",
      status: "Accepted",
    },
    {
      id: "#12351",
      customer: "Emma Johnson",
      company: "GreenCycle",
      wasteType: "Recyclables",
      location: "444 Spruce Avenue",
      time: "2024-03-16 10:30 AM",
      status: "Accepted",
    },
  ]

  const completedRequests = [
    {
      id: "#12352",
      customer: "Mason Brown",
      company: "WasteAway",
      wasteType: "Organic Waste",
      location: "555 Willow Drive",
      time: "2024-03-14 02:00 PM",
      status: "Completed",
    },
    {
      id: "#12353",
      customer: "Isabella Taylor",
      company: "EcoSolutions",
      wasteType: "Mixed Waste",
      location: "666 Poplar Lane",
      time: "2024-03-14 03:30 PM",
      status: "Completed",
    },
  ]

  const getCurrentData = () => {
    switch (activeTab) {
      case "Pending":
        return requestsData
      case "Accepted":
        return acceptedRequests
      case "Completed":
        return completedRequests
      default:
        return requestsData
    }
  }

  const filteredRequests = getCurrentData().filter(
    (request) =>
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Accepted":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src="/images/logo.png" alt="Logo" className="h-16 w-34" />
              <span className="text-xl font-bold text-gray-900">TrashRoute</span>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/admin/dashboard" className="text-gray-700 hover:text-gray-900 font-medium">
                Dashboard
              </Link>
              <Link to="/admin/users" className="text-gray-700 hover:text-gray-900 font-medium">
                Users
              </Link>
              <Link to="/admin/companies" className="text-gray-700 hover:text-gray-900 font-medium">
                Companies
              </Link>
              <Link to="/admin/requests" className="text-blue-600 font-medium">
                Requests
              </Link>
              <Link to="/admin/feedback" className="text-gray-700 hover:text-gray-900 font-medium">
                Feedback
              </Link>
              <Link to="/admin/reports" className="text-gray-700 hover:text-gray-900 font-medium">
                Reports
              </Link>
              <UserProfileDropdown />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pickup Requests</h1>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-8 border-b border-gray-200">
            {["Pending", "Accepted", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by request ID, customer name, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Request ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Waste Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{request.id}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{request.customer}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{request.company}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{request.wasteType}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{request.time}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No requests found matching your search.</p>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredRequests.length} of {getCurrentData().length} {activeTab.toLowerCase()} requests
        </div>
      </main>
    </div>
  )
}

export default PickupRequests