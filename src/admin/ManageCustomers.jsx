"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, ChevronDown, Users, Diamond, Menu, X, Building, Truck, MessageSquare, BarChart3 } from "lucide-react"
import UserProfileDropdown from "../customer/UserProfileDropdown"
import SidebarLinks from "./SidebarLinks";
import Footer from "../footer";

const ManageCustomers = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [customersData, setCustomersData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingCustomer, setDeletingCustomer] = useState(null)
  const [filters, setFilters] = useState({
    status: "All Status",
    location: "All Locations",
  })
  const [sidebarHovered, setSidebarHovered] = useState(false);

  // Fetch customers data from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('adminToken');
        const headers = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/managecustomers.php', {
          headers,
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          setCustomersData(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch customers')
        }
      } catch (err) {
        console.error('Error fetching customers:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const filteredCustomers = customersData.filter(
    (customer) =>
      customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleViewCustomer = (customerId) => {
    console.log("View customer:", customerId)
    // Handle view customer logic
  }

  const handleEditCustomer = (customerId) => {
    console.log("Edit customer:", customerId)
    // Handle edit customer logic
  }

  const handleDeleteCustomer = async (customerId) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete customer ${customerId}? This action cannot be undone.`);
    
    if (!isConfirmed) {
      return;
    }

    try {
      setDeletingCustomer(customerId);
      
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/deleteusers.php?action=delete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customerId: customerId
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Remove the deleted customer from the local state
        setCustomersData(prevCustomers => 
          prevCustomers.filter(customer => customer.id !== customerId)
        );
        
        // Show success message
        alert(`Customer ${customerId} has been deleted successfully.`);
      } else {
        throw new Error(result.error || 'Failed to delete customer');
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert(`Error deleting customer: ${err.message}`);
    } finally {
      setDeletingCustomer(null);
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      case "Suspended":
        return "bg-red-100 text-red-800"
      case "Disabled":
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
          <UserProfileDropdown mode="admin" />
        </div>
      </div>
      {/* Main Content Area */}
      <div className={`flex-1 min-w-0 ml-20 transition-all duration-300 ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <main>
          {/* Page Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3a5f46] mb-2">Manage Customers</h1>
            <p className="text-gray-600 text-sm sm:text-base">View and manage registered customers</p>
          </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3a5f46]"></div>
                <p className="mt-2 text-[#618170] text-sm sm:text-base">Loading customers...</p>
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
                  placeholder="Search by customer name, email, or location"
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
                          <option value="Active">Active</option>
                              <option value="Disabled">Disabled</option>
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

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Customer ID</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Name</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Email</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Phone</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Location</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Status</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Join Date</th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e6f4ea]">
                    {filteredCustomers.map((customer, index) => (
                      <tr key={index} className="hover:bg-[#f7f9fb]">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#2e4d3a]">{customer.id}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46] font-semibold">{customer.name}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{customer.email}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{customer.phone}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{customer.location}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{customer.joinDate}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewCustomer(customer.id)}
                              className="bg-[#3a5f46] hover:bg-[#2e4d3a] text-white font-semibold px-3 py-1 rounded-full shadow transition text-xs"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleEditCustomer(customer.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-full shadow transition text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(customer.id)}
                                  disabled={deletingCustomer === customer.id}
                                  className={`font-semibold px-3 py-1 rounded-full shadow transition text-xs ${
                                    deletingCustomer === customer.id
                                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                      : 'bg-red-600 hover:bg-red-700 text-white'
                                  }`}
                            >
                                  {deletingCustomer === customer.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
                  {filteredCustomers.length === 0 && !loading && (
                <div className="text-center py-8 sm:py-12">
                      <p className="text-[#618170] text-sm sm:text-base">
                        {customersData.length === 0 ? 'No customers found in the database.' : 'No customers found matching your search.'}
                      </p>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mt-4 text-xs sm:text-sm text-[#618170]">
              Showing {filteredCustomers.length} of {customersData.length} customers
            </div>
              </>
            )}
        </main>
        <Footer admin={true} />
      </div>
    </div>
  )
}

export default ManageCustomers