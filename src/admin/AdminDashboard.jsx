"use client"

import { Link } from "react-router-dom"
import { Diamond, Users, Building, Truck, MessageSquare, BarChart3, Menu, X } from "lucide-react"
import UserProfileDropdown from "../customer/UserProfileDropdown"
import { useState } from "react"

const AdminDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const stats = [
    {
      title: "Total Customers",
      value: "1,234",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Companies",
      value: "56",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Requests",
      value: "789",
      bgColor: "bg-green-50",
    },
  ]

  const pickupStatus = [
    {
      title: "Pending",
      value: "123",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Active",
      value: "456",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: "789",
      bgColor: "bg-green-50",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      title: "New user registered: Emily Carter",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Pickup request #12345 completed",
      time: "3 hours ago",
    },
    {
      id: 3,
      title: "New company registered: Green Solutions Inc.",
      time: "4 hours ago",
    },
    {
      id: 4,
      title: "Pickup request #67890 created",
      time: "5 hours ago",
    },
  ]

  const quickLinks = [
    {
      title: "Manage Users",
      icon: Users,
      href: "/admin/users",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Manage Companies",
      icon: Building,
      href: "/admin/companies",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Manage Requests",
      icon: Truck,
      href: "/admin/requests",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "View Feedback",
      icon: MessageSquare,
      href: "/admin/feedback",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Generate Reports",
      icon: BarChart3,
      href: "/admin/reports",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex">
      {/* Sidebar Navigation */}
      <div className="w-16 lg:w-20 bg-white shadow-lg fixed h-full z-30 hidden lg:block">
        {/* Navigation Links */}
        <nav className="mt-4">
          <div className="px-2 lg:px-3 space-y-2">
            <Link 
              to="/admin/dashboard" 
              className="flex items-center justify-center p-3 lg:p-4 text-[#3a5f46] bg-[#e6f4ea] rounded-lg font-semibold text-sm hover:bg-[#d0e9d6] transition-all duration-200 group relative"
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
              className="flex items-center justify-center p-3 lg:p-4 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition-all duration-200 group relative"
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
                  className="flex items-center space-x-3 px-3 py-2.5 text-[#3a5f46] bg-[#e6f4ea] rounded-lg font-semibold text-sm"
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
                  className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 hover:text-[#3a5f46] hover:bg-[#e6f4ea] rounded-lg transition text-sm"
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
          {/* Page Title */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3a5f46] tracking-tight mb-2">Dashboard</h1>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className={`${stat.bgColor} rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#d0e9d6] shadow hover:shadow-lg transition-all duration-200`}> 
                <div className="text-xs sm:text-sm font-semibold text-[#3a5f46] mb-1 sm:mb-2 uppercase tracking-wide">{stat.title}</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2e4d3a]">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Pickup Status Section */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#3a5f46] mb-3 sm:mb-4 lg:mb-6">Pickup Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {pickupStatus.map((status, index) => (
                <div key={index} className={`${status.bgColor} rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#d0e9d6] shadow hover:shadow-lg transition-all duration-200`}> 
                  <div className="text-xs sm:text-sm font-semibold text-[#3a5f46] mb-1 sm:mb-2 uppercase tracking-wide">{status.title}</div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2e4d3a]">{status.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Recent Activity Section */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#3a5f46] mb-3 sm:mb-4 lg:mb-6">Recent Activity</h2>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="bg-white rounded-lg p-3 sm:p-4 border border-[#d0e9d6] shadow-sm hover:shadow-md transition">
                    <div className="text-[#2e4d3a] font-semibold mb-1 text-sm sm:text-base">{activity.title}</div>
                    <div className="text-xs sm:text-sm text-[#3a5f46]">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links Section */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#3a5f46] mb-3 sm:mb-4 lg:mb-6">Quick Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                {quickLinks.map((link, index) => {
                  const IconComponent = link.icon
                  return (
                    <Link
                      key={index}
                      to={link.href}
                      className={`bg-gradient-to-br from-[#e6f4ea] to-[#cfe3d6] rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#d0e9d6] hover:shadow-xl transition-shadow group flex items-center gap-2 sm:gap-3 hover:scale-[1.02]`}
                    >
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-white rounded-lg flex items-center justify-center border border-[#d0e9d6] shadow-sm group-hover:bg-[#3a5f46]/10 transition`}>
                        <IconComponent className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${link.iconColor}`} />
                      </div>
                      <div className="text-[#2e4d3a] font-semibold group-hover:text-[#3a5f46] text-xs sm:text-sm lg:text-base">{link.title}</div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
