"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, ChevronDown, Truck, Diamond, Menu, X, Users, Building, MessageSquare, BarChart3, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import SidebarLinks from "./SidebarLinks"
import AdminProfileDropdown from "./AdminProfileDropdown"
import Footer from "../footer";

const Requests = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: "All Status",
    priority: "All Priorities",
    location: "All Locations",
  })
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const requestsData = [
    {
      id: "#R001",
      customer: "Emily Carter",
      company: "Green Solutions Inc.",
      location: "New York, NY",
      status: "Pending",
      priority: "High",
      requestDate: "2024-03-15",
      pickupDate: "2024-03-18",
      wasteType: "Mixed Waste",
      amount: "50 kg",
    },
    {
      id: "#R002",
      customer: "Michael Rodriguez",
      company: "EcoWaste Management",
      location: "Los Angeles, CA",
      status: "In Progress",
      priority: "Medium",
      requestDate: "2024-03-14",
      pickupDate: "2024-03-17",
      wasteType: "Recyclables",
      amount: "30 kg",
    },
    {
      id: "#R003",
      customer: "Sarah Johnson",
      company: "RecyclePro",
      location: "Chicago, IL",
      status: "Completed",
      priority: "Low",
      requestDate: "2024-03-13",
      pickupDate: "2024-03-16",
      wasteType: "Organic Waste",
      amount: "25 kg",
    },
    {
      id: "#R004",
      customer: "David Thompson",
      company: "WasteAway Ltd.",
      location: "Houston, TX",
      status: "Cancelled",
      priority: "High",
      requestDate: "2024-03-12",
      pickupDate: "2024-03-15",
      wasteType: "Hazardous Waste",
      amount: "15 kg",
    },
    {
      id: "#R005",
      customer: "Lisa Wang",
      company: "CleanEarth Services",
      location: "Phoenix, AZ",
      status: "Pending",
      priority: "Medium",
      requestDate: "2024-03-11",
      pickupDate: "2024-03-14",
      wasteType: "Electronic Waste",
      amount: "40 kg",
    },
  ]

  const filteredRequests = requestsData.filter(
    (request) =>
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleViewRequest = (requestId) => {
    console.log("View request:", requestId)
    // Handle view request logic
  }

  const handleEditRequest = (requestId) => {
    console.log("Edit request:", requestId)
    // Handle edit request logic
  }

  const handleDeleteRequest = (requestId) => {
    console.log("Delete request:", requestId)
    // Handle delete request logic
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
      case "In Progress":
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      case "Completed":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      case "Cancelled":
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      default:
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex overflow-x-hidden">
      {/* Hover-expand Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-30 bg-white shadow-lg flex flex-col transition-all duration-300
          ${sidebarHovered ? 'w-64' : 'w-20'}
        `}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <SidebarLinks sidebarOpen={sidebarHovered} />
        <div className="p-4 border-t border-gray-200 mt-auto flex justify-center">
          <AdminProfileDropdown />
        </div>
      </div>
      {/* Main Content Area */}
      <div className={`flex-1 min-w-0 ml-20 transition-all duration-300 ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <main>
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3a5f46] mb-2">Manage Requests</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and manage waste pickup requests</p>
        </div>

          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#3a5f46] w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by request ID, customer, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#e6f4ea] border-0 rounded-lg text-[#2e4d3a] placeholder-[#618170] focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:bg-white transition-colors text-sm sm:text-base shadow"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {Object.entries(filters).map(([key, value]) => (
                <div key={key} className="relative flex-1">
                  <select
                    value={value}
                    onChange={(e) => handleFilterChange(key, e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2 bg-white border border-[#d0e9d6] rounded-lg text-[#3a5f46] font-semibold focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] appearance-none pr-8 sm:pr-10 text-sm shadow"
                  >
                    <option value={value}>{value}</option>
                    {key === "status" && (
                      <>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </>
                    )}
                    {key === "priority" && (
                      <>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </>
                    )}
                    {key === "location" && (
                      <>
                        <option value="New York, NY">New York, NY</option>
                        <option value="Los Angeles, CA">Los Angeles, CA</option>
                        <option value="Chicago, IL">Chicago, IL</option>
                        <option value="Houston, TX">Houston, TX</option>
                        <option value="Phoenix, AZ">Phoenix, AZ</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[#3a5f46] pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Request ID</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Customer</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Company</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Location</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Status</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Priority</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Request Date</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Pickup Date</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Waste Type</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Amount</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6f4ea]">
                  {filteredRequests.map((request, index) => (
                    <tr key={index} className="hover:bg-[#f7f9fb]">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#2e4d3a]">{request.id}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46] font-semibold">{request.customer}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.company}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.location}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(request.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.requestDate}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.pickupDate}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.wasteType}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46] font-semibold">{request.amount}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewRequest(request.id)}
                            className="bg-[#3a5f46] hover:bg-[#2e4d3a] text-white font-semibold px-3 py-1 rounded-full shadow transition text-xs"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditRequest(request.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-full shadow transition text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1 rounded-full shadow transition text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredRequests.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-[#618170] text-sm sm:text-base">No requests found matching your search.</p>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-xs sm:text-sm text-[#618170]">
            Showing {filteredRequests.length} of {requestsData.length} requests
          </div>
        </main>
        <Footer admin={true} />
      </div>
    </div>
  )
}

export default Requests