"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, ChevronDown, Truck, Diamond, Menu, X, Users, Building, MessageSquare, BarChart3, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import SidebarLinks from "./SidebarLinks"
import AdminProfileDropdown from "./AdminProfileDropdown"
import Footer from "../footer";
import { getCookie } from "../utils/cookieUtils";
import DeleteWarningPopup from "./components/DeleteWarningPopup";

const Requests = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [requestsData, setRequestsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingRequest, setDeletingRequest] = useState(null)
  const [filters, setFilters] = useState({
    status: "All Status",
  })
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  // Fetch requests data from API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        const token = getCookie('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/manageRequests.php', {
          headers,
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          setRequestsData(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch requests')
        }
      } catch (err) {
        console.error('Error fetching requests:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  const filteredRequests = requestsData.filter(
    (request) => {
      const matchesSearch =
        request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filters.status === "All Status" || request.status === filters.status

      return matchesSearch && matchesStatus
    }
  )

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      status: "All Status",
    })
    setSearchQuery("")
  }

  const handleViewRequest = (requestId) => {
    console.log("View request:", requestId)
    // Handle view request logic
  }

  const handleEditRequest = (requestId) => {
    console.log("Edit request:", requestId)
    // Handle edit request logic
  }

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setShowDeletePopup(true);
  }

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;
    
    try {
      setDeletingRequest(requestToDelete.id);
      
      const token = getCookie('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/deleteRequests.php?action=delete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          requestId: requestToDelete.id
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Remove the deleted request from the local state
        setRequestsData(prevRequests => 
          prevRequests.filter(request => request.id !== requestToDelete.id)
        );
        setShowDeletePopup(false);
        setRequestToDelete(null);
      } else {
        throw new Error(result.error || 'Failed to delete request');
      }
    } catch (err) {
      console.error('Error deleting request:', err);
    } finally {
      setDeletingRequest(null);
    }
  }

  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
    setRequestToDelete(null);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Request received":
        return "bg-yellow-100 text-yellow-800"
      case "Accepted":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "Request received":
        return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
      case "Accepted":
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      case "Completed":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
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
      <div className={`flex-1 min-w-0 ml-0 sm:ml-20 transition-all duration-300 ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <main className="p-4 sm:p-6 md:p-8">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3a5f46] mb-2">Manage Requests</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and manage waste pickup requests</p>
        </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a5f46]"></div>
                <p className="mt-2 text-[#618170] text-sm sm:text-base">Loading requests...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-red-600 text-sm sm:text-base">Error: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 bg-[#3a5f46] hover:bg-[#2e4d3a] text-white font-semibold px-4 py-2 rounded-lg shadow transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Content when data is loaded */}
            {!loading && !error && (
              <>
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
              <div className="relative flex-1">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2 bg-white border border-[#d0e9d6] rounded-lg text-[#3a5f46] font-semibold focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] appearance-none pr-8 sm:pr-10 text-sm shadow"
                >
                  <option value="All Status">All Status</option>
                  <option value="Request received">Request received</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[#3a5f46] pointer-events-none" />
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm shadow"
              >
                Reset Filters
              </button>
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
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Location</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Status</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Request Date</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Waste Type</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Amount</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Latitude</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Longitude</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">OTP</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6f4ea]">
                  {filteredRequests.map((request, index) => (
                    <tr key={index} className="hover:bg-[#f7f9fb]">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#2e4d3a]">{request.id}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46] font-semibold">{request.customer}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.location}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(request.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.requestDate}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.wasteType}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46] font-semibold">{request.amount}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.latitude || 'N/A'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.longitude || 'N/A'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{request.otp || 'N/A'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteClick(request)}
                            disabled={deletingRequest === request.id}
                            className={`font-semibold px-3 py-1 rounded-full shadow transition text-xs ${
                              deletingRequest === request.id
                                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                          >
                            {deletingRequest === request.id ? 'Deleting...' : 'Delete'}
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
              </>
            )}
        </main>
        <Footer admin={true} />
      </div>

      {/* Delete Warning Popup */}
      <DeleteWarningPopup
        isOpen={showDeletePopup}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Request"
        message="Are you sure you want to delete this request?"
        itemName={requestToDelete?.id || ""}
        isLoading={deletingRequest !== null}
      />
    </div>
  )
}

export default Requests