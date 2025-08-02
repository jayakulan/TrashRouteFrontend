"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Bell, Diamond } from "lucide-react"
import SidebarLinks from "./SidebarLinks";
import Footer from "../footer";
import AdminProfileDropdown from "./AdminProfileDropdown";
import { getCookie } from "../utils/cookieUtils";

const RoutesManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [routesData, setRoutesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch routes data from backend
  useEffect(() => {
    const fetchRoutesData = async () => {
      try {
        setLoading(true);
        const token = getCookie("token");
        if (!token) {
          setError("Authentication token not found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/manageRoute.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        });

        const data = await response.json();

        if (data.success) {
          // Transform the data to match the expected format
          const transformedData = data.data.map(route => ({
            routeId: String(route.route_id), // Ensure routeId is a string
            assignedCompany: route.company_name || 'Unknown Company',
            customers: route.no_of_customers || 0,
            acceptanceStatus: route.is_accepted || 'Pending',
            timestamp: route.generated_at || '',
            disabledStatus: route.is_disabled || 'Enabled',
            routeDetails: route.route_details || ''
          }));
          setRoutesData(transformedData);
        } else {
          setError(data.error || "Failed to fetch routes data");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutesData();
  }, []);

  const filteredRoutes = routesData.filter((route) => {
    const matchesSearch =
      route.routeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.assignedCompany.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Active" && route.disabledStatus === "Enabled") ||
      (activeTab === "Inactive" && route.disabledStatus === "Disabled")

    return matchesSearch && matchesTab
  })

  const getAcceptanceStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDisabledStatusColor = (status) => {
    switch (status) {
      case "Enabled":
        return "bg-green-100 text-green-800"
      case "Disabled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewEditDelete = (routeId, action) => {
    console.log(`${action} route:`, routeId)
    // Handle view/edit/delete logic
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex overflow-x-hidden">
      {/* Sidebar: hover-expand */}
      <div
        className={`fixed top-0 left-0 h-full z-30 bg-white shadow-lg flex-col transition-all duration-300 hidden sm:flex ${sidebarHovered ? 'w-64' : 'w-20'}`}
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
        <main className="p-4 sm:p-6 md:p-8 flex-1">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#2e4d3a] mb-2">Routes Management</h1>
            <p className="text-[#3a5f46]">
              Manage and oversee all routes within the system. View details, edit assignments, and track performance.
            </p>
          </div>
          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#3a5f46] w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by Company or Route ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-[#e6f4ea] border-0 rounded-lg text-[#2e4d3a] placeholder-[#618170] focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:bg-white transition-colors text-sm sm:text-base shadow"
              />
            </div>
          </div>
          {/* Filter Tabs */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <div className="flex space-x-8 border-b border-[#d0e9d6]">
              {["All", "Active", "Inactive"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? "border-[#3a5f46] text-[#3a5f46]"
                      : "border-transparent text-[#618170] hover:text-[#3a5f46] hover:border-[#d0e9d6]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading routes...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold">Error loading routes data:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Routes Table */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Route ID</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Assigned Company</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase"># Customers</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Acceptance Status</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Timestamp</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Disabled Status</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6f4ea]">
                    {filteredRoutes.map((route, index) => (
                      <tr key={index} className="hover:bg-[#f7f9fb]">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#2e4d3a]">{route.routeId}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46] font-semibold">{route.assignedCompany}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{route.customers}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAcceptanceStatusColor(route.acceptanceStatus)}`}
                          >
                            {route.acceptanceStatus}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{route.timestamp}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDisabledStatusColor(route.disabledStatus)}`}
                          >
                            {route.disabledStatus}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewEditDelete(route.routeId, "View")}
                              className="bg-[#3a5f46] hover:bg-[#2e4d3a] text-white font-semibold px-3 py-1 rounded-full shadow transition text-xs"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleViewEditDelete(route.routeId, "Edit")}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-full shadow transition text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleViewEditDelete(route.routeId, "Delete")}
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
              {filteredRoutes.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-[#618170] text-sm sm:text-base">No routes found matching your criteria.</p>
                </div>
              )}
            </div>
          )}
          {/* Results Count */}
          <div className="mt-4 text-xs sm:text-sm text-[#618170]">
            Showing {filteredRoutes.length} of {routesData.length} routes
          </div>
        </main>
        <Footer admin={true} />
      </div>
    </div>
  )
}

export default RoutesManagement
