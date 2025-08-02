"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, ChevronDown, Building, Diamond, Menu, X, Users, Truck, MessageSquare, BarChart3 } from "lucide-react"
import SidebarLinks from "./SidebarLinks"
import AdminProfileDropdown from "./AdminProfileDropdown"
import Footer from "../footer";
import { getCookie } from "../utils/cookieUtils";

const ManageCompanies = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [companiesData, setCompaniesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingCompany, setDeletingCompany] = useState(null)
  const [filters, setFilters] = useState({
    status: "All Status",
  })
  const [autoRevertMsg, setAutoRevertMsg] = useState("");

  // Fetch companies data from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const token = getCookie('token');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/managecompanies.php', {
          headers,
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          setCompaniesData(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch companies')
        }
      } catch (err) {
        console.error('Error fetching companies:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  const filteredCompanies = companiesData.filter(
    (company) =>
      company.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleViewCompany = (companyId) => {
    console.log("View company:", companyId)
    // Handle view company logic
  }

  const handleEditCompany = (companyId) => {
    console.log("Edit company:", companyId)
    // Handle edit company logic
  }

  const handleDeleteCompany = async (companyId) => {
    try {
      setDeletingCompany(companyId);
      
      const token = getCookie('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/deletecompanies.php?action=delete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          companyId: companyId
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update the company status to 'Disabled' in the local state
        setCompaniesData(prevCompanies => 
          prevCompanies.map(company => 
            company.id === companyId 
              ? { ...company, status: 'Disabled' }
              : company
          )
        );
      } else {
        throw new Error(result.error || 'Failed to disable company');
      }
    } catch (err) {
      console.error('Error disabling company:', err);
    } finally {
      setDeletingCompany(null);
    }
  }

  const handleAutoRevert = async () => {
    setAutoRevertMsg("Running auto-revert...");
    try {
      const token = getCookie('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Company/auto_revert_pickup_status.php", {
        headers,
        credentials: 'include'
      });
      const data = await res.json();
      setAutoRevertMsg(data.message || "Done.");
    } catch (err) {
      setAutoRevertMsg("Error: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3a5f46] mb-2">Manage Companies</h1>
            <p className="text-gray-600 text-sm sm:text-base">View and manage registered waste management companies</p>
          </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a5f46]"></div>
                <p className="mt-2 text-[#618170] text-sm sm:text-base">Loading companies...</p>
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
                  placeholder="Search by company name, email, or location"
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
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[#3a5f46] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Companies Table */}
            <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Company ID</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Company Name</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Email</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Phone</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Location</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Status</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">ComRegno</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6f4ea]">
                    {filteredCompanies.map((company, index) => (
                      <tr key={index} className="hover:bg-[#f7f9fb]">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#2e4d3a]">{company.id}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46] font-semibold">{company.name}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{company.email}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{company.phone}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{company.location}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(company.status)}`}>
                            {company.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46] font-semibold">{company.comRegno}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteCompany(company.id)}
                              disabled={deletingCompany === company.id}
                              className={`font-semibold px-3 py-1 rounded-full shadow transition text-xs ${
                                deletingCompany === company.id
                                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                              }`}
                            >
                              {deletingCompany === company.id ? 'Disabling...' : 'Disable'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredCompanies.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-[#618170] text-sm sm:text-base">No companies found matching your search.</p>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-xs sm:text-sm text-[#618170]">
              Showing {filteredCompanies.length} of {companiesData.length} companies
            </div>
            <button
              onClick={handleAutoRevert}
              className="px-4 py-2 bg-green-700 text-white rounded shadow hover:bg-green-800 mt-4"
            >
              Run Auto-Revert for Stale Pickup Requests
            </button>
            {autoRevertMsg && (
              <div className="mt-2 text-sm text-green-700">{autoRevertMsg}</div>
            )}
              </>
            )}
          </main>
          <Footer admin={true} />
        </div>
    </div>
  )
}

export default ManageCompanies
