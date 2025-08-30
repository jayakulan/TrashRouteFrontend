"use client"

import { useState, useEffect } from "react"
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
  const [mappingData, setMappingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    fetchMappingData();
  }, []);

  const fetchMappingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/route_mapping.php');
      const result = await response.json();
      
      if (result.success) {
        setMappingData(result.data);
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching mapping data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMappings = mappingData.filter(
    (mapping) =>
      mapping.mapping_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.route_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.request_id.toString().toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateNewMapping = async () => {
    // For now, just show an alert - you can implement a modal form later
    alert("Create new mapping functionality will be implemented");
  }

  const handleEdit = async (mappingId) => {
    // For now, just show an alert - you can implement a modal form later
    alert(`Edit mapping ${mappingId} functionality will be implemented`);
  }

  const handleDelete = async (mappingId) => {
    if (window.confirm(`Are you sure you want to delete mapping ${mappingId}?`)) {
      try {
        const response = await fetch(`http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/route_mapping.php?mapping_id=${mappingId}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        
        if (result.success) {
          alert('Mapping deleted successfully');
          fetchMappingData(); // Refresh the data
        } else {
          alert(result.message || 'Failed to delete mapping');
        }
      } catch (err) {
        alert('Error deleting mapping');
        console.error('Error deleting mapping:', err);
      }
    }
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
          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto"></div>
                <p className="mt-4 text-[#618170]">Loading mappings...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-white rounded-lg shadow-lg border border-red-200 p-8">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchMappingData}
                  className="bg-[#3a5f46] hover:bg-[#2e4d3a] text-white px-4 py-2 rounded-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Mappings Table */}
          {!loading && !error && (
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
                        <td className="px-6 py-4 text-sm font-medium text-[#2e4d3a]">{mapping.mapping_id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#2e4d3a]">{mapping.route_id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#2e4d3a]">{mapping.request_id}</td>
                        <td className="px-6 py-4 text-sm text-[#618170]">{new Date(mapping.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2 text-sm">
                            <button
                              onClick={() => handleEdit(mapping.mapping_id)}
                              className="text-[#3a5f46] hover:text-[#2e4d3a]"
                            >
                              Edit
                            </button>
                            <span className="text-gray-400">|</span>
                            <button
                              onClick={() => handleDelete(mapping.mapping_id)}
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
          )}
          {/* Results Count */}
          {!loading && !error && (
            <div className="mt-4 text-sm text-[#618170]">
              Showing {filteredMappings.length} of {mappingData.length} mappings
            </div>
          )}
        </main>
        <Footer admin={true} />
      </div>
    </div>
  )
}

export default RouteMappingManagement
