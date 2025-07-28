"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Bell, Diamond } from "lucide-react"
import SidebarLinks from "./SidebarLinks";
import AdminProfileDropdown from "./AdminProfileDropdown";
import Footer from "../footer";
import { Menu, X, MapPin } from "lucide-react";

const RouteMappingManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mappingData = [
    {
      mappingId: "#12345",
      routeId: "Route #67890",
      requestId: "Request #11223",
      createdAt: "2024-01-15",
    },
    {
      mappingId: "#67890",
      routeId: "Route #12345",
      requestId: "Request #44556",
      createdAt: "2024-02-20",
    },
    {
      mappingId: "#24680",
      routeId: "Route #98765",
      requestId: "Request #77889",
      createdAt: "2024-03-25",
    },
    {
      mappingId: "#13579",
      routeId: "Route #54321",
      requestId: "Request #99001",
      createdAt: "2024-04-30",
    },
    {
      mappingId: "#97531",
      routeId: "Route #10101",
      requestId: "Request #22334",
      createdAt: "2024-05-05",
    },
  ]

  const filteredMappings = mappingData.filter(
    (mapping) =>
      mapping.mappingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.routeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.requestId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateNewMapping = () => {
    console.log("Create new mapping clicked")
    // Handle create new mapping logic
  }

  const handleEdit = (mappingId) => {
    console.log("Edit mapping:", mappingId)
    // Handle edit mapping logic
  }

  const handleDelete = (mappingId) => {
    console.log("Delete mapping:", mappingId)
    // Handle delete mapping logic
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex overflow-x-hidden">
      {/* Sidebar: hover-expand on desktop */}
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
      {/* Mobile Hamburger */}
      <button
        className="sm:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-full shadow"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="w-6 h-6 text-[#3a5f46]" />
      </button>
      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
          <div className="w-64 bg-white h-full shadow-lg flex flex-col">
            <button
              className="self-end m-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
            <SidebarLinks sidebarOpen={true} onClick={() => setMobileMenuOpen(false)} />
            <div className="p-4 border-t border-gray-200 mt-auto flex justify-center">
              <AdminProfileDropdown />
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
      {/* Main Content Area */}
      <div className={`flex-1 min-w-0 ml-0 sm:ml-20 transition-all duration-300 ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <main className="p-4 sm:p-6 md:p-8">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#3a5f46]">Route Mapping Management</h1>
            <button
              onClick={handleCreateNewMapping}
              className="bg-[#e6f4ea] hover:bg-[#d0e9d6] text-[#3a5f46] font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create New Mapping
            </button>
          </div>
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3a5f46] w-5 h-5" />
              <input
                type="text"
                placeholder="Search Mapping ID, Route ID, or Request ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#e6f4ea] border-0 rounded-lg text-[#2e4d3a] placeholder-[#618170] focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:bg-white transition-colors"
              />
            </div>
          </div>
          {/* Mappings Table */}
          <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Mapping ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Route ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Request ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">Created At</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#618170] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d0e9d6]">
                  {filteredMappings.map((mapping, index) => (
                    <tr key={index} className="hover:bg-[#f7f9fb]">
                      <td className="px-6 py-4 text-sm font-medium text-[#2e4d3a]">{mapping.mappingId}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">{mapping.routeId}</td>
                      <td className="px-6 py-4 text-sm text-blue-600">{mapping.requestId}</td>
                      <td className="px-6 py-4 text-sm text-[#618170]">{mapping.createdAt}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2 text-sm">
                          <button
                            onClick={() => handleEdit(mapping.mappingId)}
                            className="text-[#3a5f46] hover:text-[#2e4d3a]"
                          >
                            Edit
                          </button>
                          <span className="text-gray-400">|</span>
                          <button
                            onClick={() => handleDelete(mapping.mappingId)}
                            className="text-[#3a5f46] hover:text-red-600"
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
            {filteredMappings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#618170]">No mappings found matching your search.</p>
              </div>
            )}
          </div>
          {/* Results Count */}
          <div className="mt-4 text-sm text-[#618170]">
            Showing {filteredMappings.length} of {mappingData.length} mappings
          </div>
        </main>
        <Footer admin={true} />
      </div>
    </div>
  )
}

export default RouteMappingManagement
