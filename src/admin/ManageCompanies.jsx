"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Diamond, Search, Bell } from "lucide-react"
import UserProfileDropdown from "../customer/UserProfileDropdown"

const ManageCompanies = () => {
  const [searchQuery, setSearchQuery] = useState("")

  const companies = [
    {
      id: 1,
      name: "Green Solutions Inc.",
      wasteTypes: "Recyclables, Organic Waste",
      rating: 4.5,
      status: "Active",
    },
    {
      id: 2,
      name: "Waste Away Ltd.",
      wasteTypes: "Construction Debris, Recyclables",
      rating: 3.8,
      status: "Pending Approval",
    },
    {
      id: 3,
      name: "EcoTech Recycling",
      wasteTypes: "Electronics, Recyclables",
      rating: 4.2,
      status: "Active",
    },
    {
      id: 4,
      name: "Clean Earth Disposal",
      wasteTypes: "Hazardous Waste, Recyclables",
      rating: 2.9,
      status: "Inactive",
    },
    {
      id: 5,
      name: "Sustainable Waste Management",
      wasteTypes: "All Types",
      rating: 4.9,
      status: "Active",
    },
  ]

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.wasteTypes.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending Approval":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewProfile = (companyId) => {
    console.log("View profile for company:", companyId)
  }

  const handleManageServices = (companyId) => {
    console.log("Manage services for company:", companyId)
  }

  const handleApprove = (companyId) => {
    console.log("Approve company:", companyId)
  }

  const handleDeactivate = (companyId) => {
    console.log("Deactivate company:", companyId)
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
              <Link to="/admin/companies" className="text-blue-600 font-medium">
                Companies
              </Link>
              <Link to="/admin/requests" className="text-gray-700 hover:text-gray-900 font-medium">
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

            {/* Right side - Notification and Avatar */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <img
                  src="https://ui-avatars.com/api/?name=Admin&background=orange&color=fff&size=32"
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Companies</h1>
          <p className="text-gray-600">View and manage registered waste processing companies.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Company Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Accepted Waste Types</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{company.name}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{company.wasteTypes}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{company.rating}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(company.status)}`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1 text-sm">
                        <button
                          onClick={() => handleViewProfile(company.id)}
                          className="text-blue-600 hover:text-blue-700 text-left"
                        >
                          View Profile
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                          onClick={() => handleManageServices(company.id)}
                          className="text-blue-600 hover:text-blue-700 text-left"
                        >
                          Manage Services
                        </button>
                        <span className="text-gray-400">|</span>
                        {company.status === "Pending Approval" && (
                          <>
                            <button
                              onClick={() => handleApprove(company.id)}
                              className="text-blue-600 hover:text-blue-700 text-left"
                            >
                              Approve
                            </button>
                            <span className="text-gray-400">|</span>
                          </>
                        )}
                        <button
                          onClick={() => handleDeactivate(company.id)}
                          className="text-blue-600 hover:text-blue-700 text-left"
                        >
                          Deactivate
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
            <div className="text-center py-12">
              <p className="text-gray-500">No companies found matching your search.</p>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredCompanies.length} of {companies.length} companies
        </div>
      </main>
    </div>
  )
}

export default ManageCompanies
