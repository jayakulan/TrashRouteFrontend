"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Bell, Diamond } from "lucide-react"
import SidebarLinks from "./SidebarLinks";
import Footer from "../footer";
import UserProfileDropdown from "../customer/UserProfileDropdown";

const RoutesManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const routesData = [
    {
      routeId: "RT-2023-001",
      assignedCompany: "GreenCycle Solutions",
      customers: 150,
      acceptanceStatus: "Accepted",
      timestamp: "2023-08-15",
      disabledStatus: "Enabled",
    },
    {
      routeId: "RT-2023-002",
      assignedCompany: "WasteAway Inc.",
      customers: 200,
      acceptanceStatus: "Pending",
      timestamp: "2023-08-16",
      disabledStatus: "Enabled",
    },
    {
      routeId: "RT-2023-003",
      assignedCompany: "EcoDisposal Ltd.",
      customers: 120,
      acceptanceStatus: "Rejected",
      timestamp: "2023-08-17",
      disabledStatus: "Disabled",
    },
    {
      routeId: "RT-2023-004",
      assignedCompany: "GreenCycle Solutions",
      customers: 180,
      acceptanceStatus: "Accepted",
      timestamp: "2023-08-18",
      disabledStatus: "Enabled",
    },
    {
      routeId: "RT-2023-005",
      assignedCompany: "WasteAway Inc.",
      customers: 220,
      acceptanceStatus: "Pending",
      timestamp: "2023-08-19",
      disabledStatus: "Enabled",
    },
    {
      routeId: "RT-2023-006",
      assignedCompany: "EcoDisposal Ltd.",
      customers: 140,
      acceptanceStatus: "Accepted",
      timestamp: "2023-08-20",
      disabledStatus: "Enabled",
    },
    {
      routeId: "RT-2023-007",
      assignedCompany: "GreenCycle Solutions",
      customers: 160,
      acceptanceStatus: "Rejected",
      timestamp: "2023-08-21",
      disabledStatus: "Disabled",
    },
    {
      routeId: "RT-2023-008",
      assignedCompany: "WasteAway Inc.",
      customers: 210,
      acceptanceStatus: "Accepted",
      timestamp: "2023-08-22",
      disabledStatus: "Enabled",
    },
    {
      routeId: "RT-2023-009",
      assignedCompany: "EcoDisposal Ltd.",
      customers: 130,
      acceptanceStatus: "Pending",
      timestamp: "2023-08-23",
      disabledStatus: "Enabled",
    },
    {
      routeId: "RT-2023-010",
      assignedCompany: "GreenCycle Solutions",
      customers: 170,
      acceptanceStatus: "Accepted",
      timestamp: "2023-08-24",
      disabledStatus: "Enabled",
    },
  ]

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
          <UserProfileDropdown mode="admin" />
        </div>
      </div>
      {/* Main Content Area */}
      <div className={`flex-1 min-w-0 ml-0 sm:ml-20 transition-all duration-300 ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <main className="p-4 sm:p-6 md:p-8 flex-1">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Routes Management</h1>
            <p className="text-blue-600">
              Manage and oversee all routes within the system. View details, edit assignments, and track performance.
            </p>
          </div>
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Company or Route ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="flex space-x-8 border-b border-gray-200">
              {["All", "Active", "Inactive"].map((tab) => (
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
          {/* Routes Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Route ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Assigned Company</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900"># Customers</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Acceptance Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Timestamp</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Disabled Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-blue-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRoutes.map((route, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{route.routeId}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">{route.assignedCompany}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{route.customers}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAcceptanceStatusColor(route.acceptanceStatus)}`}
                        >
                          {route.acceptanceStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-blue-600">{route.timestamp}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDisabledStatusColor(route.disabledStatus)}`}
                        >
                          {route.disabledStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 text-sm">
                          <button
                            onClick={() => handleViewEditDelete(route.routeId, "View")}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            View
                          </button>
                          <span className="text-gray-400">/</span>
                          <button
                            onClick={() => handleViewEditDelete(route.routeId, "Edit")}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Edit
                          </button>
                          <span className="text-gray-400">/</span>
                          <button
                            onClick={() => handleViewEditDelete(route.routeId, "Delete")}
                            className="text-blue-600 hover:text-blue-700"
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
              <div className="text-center py-12">
                <p className="text-gray-500">No routes found matching your criteria.</p>
              </div>
            )}
          </div>
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredRoutes.length} of {routesData.length} routes
          </div>
        </main>
        <Footer admin={true} />
      </div>
    </div>
  )
}

export default RoutesManagement
