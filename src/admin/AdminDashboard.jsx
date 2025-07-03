"use client"

import { Link } from "react-router-dom"
import { Diamond, Users, Building, Truck, MessageSquare, BarChart3 } from "lucide-react"
import UserProfileDropdown from "../customer/UserProfileDropdown"

const AdminDashboard = () => {
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
              <Link to="/admin/dashboard" className="text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link to="/admin/users" className="text-gray-700 hover:text-gray-900 font-medium">
                Users
              </Link>
              <Link to="/admin/companies" className="text-gray-700 hover:text-gray-900 font-medium">
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
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100`}>
              <div className="text-sm font-medium text-gray-600 mb-2">{stat.title}</div>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Pickup Status Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pickup Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pickupStatus.map((status, index) => (
              <div key={index} className={`${status.bgColor} rounded-2xl p-6 border border-gray-100`}>
                <div className="text-sm font-medium text-gray-600 mb-2">{status.title}</div>
                <div className="text-3xl font-bold text-gray-900">{status.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg p-4 border border-gray-100">
                  <div className="text-gray-900 font-medium mb-1">{activity.title}</div>
                  <div className="text-sm text-blue-600">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickLinks.map((link, index) => {
                const IconComponent = link.icon
                return (
                  <Link
                    key={index}
                    to={link.href}
                    className={`${link.bgColor} rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow group`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${link.bgColor} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`w-5 h-5 ${link.iconColor}`} />
                      </div>
                      <div className="text-gray-900 font-medium group-hover:text-gray-700">{link.title}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
