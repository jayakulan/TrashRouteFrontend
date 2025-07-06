"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, ChevronDown, BarChart3, Diamond, Menu, X, Users, Building, Truck, MessageSquare, Download, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import UserProfileDropdown from "../customer/UserProfileDropdown"

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filters, setFilters] = useState({
    reportType: "All Reports",
    dateRange: "Last 30 Days",
    status: "All Status",
  })

  const reportsData = [
    {
      id: "#R001",
      title: "Monthly Pickup Summary",
      type: "Pickup Report",
      status: "Completed",
      date: "2024-03-15",
      generatedBy: "Admin",
      size: "2.3 MB",
      downloads: 15,
    },
    {
      id: "#R002",
      title: "Customer Satisfaction Survey",
      type: "Feedback Report",
      status: "Completed",
      date: "2024-03-14",
      generatedBy: "Admin",
      size: "1.8 MB",
      downloads: 8,
    },
    {
      id: "#R003",
      title: "Revenue Analysis Q1 2024",
      type: "Financial Report",
      status: "In Progress",
      date: "2024-03-13",
      generatedBy: "System",
      size: "4.1 MB",
      downloads: 12,
    },
    {
      id: "#R004",
      title: "Company Performance Metrics",
      type: "Performance Report",
      status: "Completed",
      date: "2024-03-12",
      generatedBy: "Admin",
      size: "3.2 MB",
      downloads: 22,
    },
    {
      id: "#R005",
      title: "Waste Collection Statistics",
      type: "Statistics Report",
      status: "Failed",
      date: "2024-03-11",
      generatedBy: "System",
      size: "1.5 MB",
      downloads: 5,
    },
  ]

  const filteredReports = reportsData.filter(
    (report) =>
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleDownloadReport = (reportId) => {
    console.log("Download report:", reportId)
    // Handle download logic
  }

  const handleViewReport = (reportId) => {
    console.log("View report:", reportId)
    // Handle view logic
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "Pickup Report":
        return "bg-blue-100 text-blue-800"
      case "Feedback Report":
        return "bg-purple-100 text-purple-800"
      case "Financial Report":
        return "bg-green-100 text-green-800"
      case "Performance Report":
        return "bg-orange-100 text-orange-800"
      case "Statistics Report":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex">
      {/* Sidebar Navigation */}
      <div className="w-16 lg:w-20 bg-white shadow-lg fixed h-full z-30 hidden lg:block">
        {/* Navigation Links */}
        <nav className="mt-4">
          <div className="px-2 lg:px-3 space-y-2">
            <Link 
              to="/admin/dashboard" 
              className="flex items-center justify-center p-3 lg:p-4 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition-all duration-200 group relative"
              title="Dashboard"
            >
              <Diamond className="w-5 h-5 lg:w-6 lg:h-6" />
              {/* Tooltip for larger screens */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Dashboard
              </span>
            </Link>
            <Link 
              to="/admin/users" 
              className="flex items-center justify-center p-3 lg:p-4 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition-all duration-200 group relative"
              title="Users"
            >
              <Users className="w-5 h-5 lg:w-6 lg:h-6" />
              {/* Tooltip for larger screens */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Users
              </span>
            </Link>
            <Link 
              to="/admin/companies" 
              className="flex items-center justify-center p-3 lg:p-4 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition-all duration-200 group relative"
              title="Companies"
            >
              <Building className="w-5 h-5 lg:w-6 lg:h-6" />
              {/* Tooltip for larger screens */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Companies
              </span>
            </Link>
            <Link 
              to="/admin/requests" 
              className="flex items-center justify-center p-3 lg:p-4 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition-all duration-200 group relative"
              title="Requests"
            >
              <Truck className="w-5 h-5 lg:w-6 lg:h-6" />
              {/* Tooltip for larger screens */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Requests
              </span>
            </Link>
            <Link 
              to="/admin/feedback" 
              className="flex items-center justify-center p-3 lg:p-4 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition-all duration-200 group relative"
              title="Feedback"
            >
              <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6" />
              {/* Tooltip for larger screens */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Feedback
              </span>
            </Link>
            <Link 
              to="/admin/reports" 
              className="flex items-center justify-center p-3 lg:p-4 text-[#3a5f46] bg-[#e6f4ea] rounded-lg font-semibold text-sm hover:bg-[#d0e9d6] transition-all duration-200 group relative"
              title="Reports"
            >
              <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6" />
              {/* Tooltip for larger screens */}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Reports
              </span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-16 xl:ml-20">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Mobile menu button and logo */}
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo for all screen sizes */}
              <div className="flex items-center">
                <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
              </div>
            </div>

            {/* Right side - Account Icon */}
            <div className="flex items-center">
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center">
                    <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
        </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <nav className="mt-4 px-3 space-y-1">
                <Link 
                  to="/admin/dashboard" 
                  className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Diamond className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  to="/admin/users" 
                  className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </Link>
                <Link 
                  to="/admin/companies" 
                  className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Building className="w-4 h-4" />
                  <span>Companies</span>
                </Link>
                <Link 
                  to="/admin/requests" 
                  className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Truck className="w-4 h-4" />
                  <span>Requests</span>
                </Link>
                <Link 
                  to="/admin/feedback" 
                  className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Feedback</span>
                </Link>
                <Link 
                  to="/admin/reports" 
                  className="flex items-center space-x-3 px-3 py-2.5 text-[#3a5f46] bg-[#e6f4ea] rounded-lg font-semibold text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Reports</span>
                </Link>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="p-4 sm:p-6">
          {/* Page Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3a5f46] mb-2">Reports & Analytics</h1>
            <p className="text-gray-600 text-sm sm:text-base">Generate and manage system reports and analytics</p>
        </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#d0e9d6] shadow hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#3a5f46] mb-1 sm:mb-2 uppercase tracking-wide">Total Reports</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2e4d3a]">24</div>
                </div>
                <div className="bg-[#e6f4ea] p-2 sm:p-3 rounded-lg">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#3a5f46]" />
                </div>
              </div>
              <div className="flex items-center mt-2 sm:mt-3">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                <span className="text-xs sm:text-sm text-green-600 font-semibold">+12%</span>
                <span className="text-xs sm:text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#d0e9d6] shadow hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#3a5f46] mb-1 sm:mb-2 uppercase tracking-wide">Completed</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2e4d3a]">18</div>
                </div>
                <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center mt-2 sm:mt-3">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                <span className="text-xs sm:text-sm text-green-600 font-semibold">+8%</span>
                <span className="text-xs sm:text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#d0e9d6] shadow hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#3a5f46] mb-1 sm:mb-2 uppercase tracking-wide">In Progress</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2e4d3a]">4</div>
                </div>
                <div className="bg-yellow-100 p-2 sm:p-3 rounded-lg">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          </div>
        </div>
              <div className="flex items-center mt-2 sm:mt-3">
                <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1" />
                <span className="text-xs sm:text-sm text-red-600 font-semibold">-2%</span>
                <span className="text-xs sm:text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>

            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#d0e9d6] shadow hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#3a5f46] mb-1 sm:mb-2 uppercase tracking-wide">Total Downloads</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2e4d3a]">156</div>
                </div>
                <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                  </div>
              <div className="flex items-center mt-2 sm:mt-3">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
                <span className="text-xs sm:text-sm text-green-600 font-semibold">+25%</span>
                <span className="text-xs sm:text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#3a5f46] w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search reports by title or type"
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
                    {key === "reportType" && (
                      <>
                        <option value="Pickup Report">Pickup Report</option>
                        <option value="Feedback Report">Feedback Report</option>
                        <option value="Financial Report">Financial Report</option>
                        <option value="Performance Report">Performance Report</option>
                        <option value="Statistics Report">Statistics Report</option>
                      </>
                    )}
                    {key === "dateRange" && (
                      <>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="Last 30 Days">Last 30 Days</option>
                        <option value="Last 90 Days">Last 90 Days</option>
                        <option value="This Year">This Year</option>
                      </>
                    )}
                    {key === "status" && (
                      <>
                        <option value="Completed">Completed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Failed">Failed</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[#3a5f46] pointer-events-none" />
                </div>
              ))}
          </div>
        </div>

          {/* Reports Table */}
          <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Report ID</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Title</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Type</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Status</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Date</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Generated By</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Size</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Downloads</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6f4ea]">
                  {filteredReports.map((report, index) => (
                    <tr key={index} className="hover:bg-[#f7f9fb]">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#2e4d3a]">{report.id}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46] font-semibold">{report.title}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(report.type)}`}>
                          {report.type}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{report.date}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{report.generatedBy}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170]">{report.size}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46] font-semibold">{report.downloads}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex space-x-2">
          <button
                            onClick={() => handleViewReport(report.id)}
                            className="bg-[#3a5f46] hover:bg-[#2e4d3a] text-white font-semibold px-3 py-1 rounded-full shadow transition text-xs"
          >
                            View
          </button>
          <button
                            onClick={() => handleDownloadReport(report.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1 rounded-full shadow transition text-xs"
          >
                            Download
          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredReports.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-[#618170] text-sm sm:text-base">No reports found matching your search.</p>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-xs sm:text-sm text-[#618170]">
            Showing {filteredReports.length} of {reportsData.length} reports
        </div>
      </main>
      </div>
    </div>
  )
}

export default Reports