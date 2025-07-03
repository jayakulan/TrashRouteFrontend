"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, ChevronDown, Star, Diamond, Bell } from "lucide-react"
import UserProfileDropdown from "../customer/UserProfileDropdown"

const FeedbackRatings = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    requests: "All Requests",
    users: "All Users",
    ratings: "All Ratings",
  })

  const feedbackData = [
    {
      id: "#12345",
      user: "Sophia Clark",
      company: "Green Solutions Inc.",
      rating: 5,
      comment: "Excellent service, very professional and efficient.",
    },
    {
      id: "#67890",
      user: "Ethan Miller",
      company: "EcoWaste Management",
      rating: 3,
      comment: "Service was okay, but pickup was delayed.",
    },
    {
      id: "#24680",
      user: "Olivia Davis",
      company: "RecyclePro",
      rating: 4,
      comment: "Good communication and timely pickup.",
    },
    {
      id: "#13579",
      user: "Liam Wilson",
      company: "WasteAway Ltd.",
      rating: 1,
      comment: "Terrible service, pickup never happened.",
    },
    {
      id: "#98765",
      user: "Ava Brown",
      company: "Green Solutions Inc.",
      rating: 5,
      comment: "Highly recommend, very satisfied with the service.",
    },
  ]

  const filteredFeedback = feedbackData.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleViewFeedback = (feedbackId) => {
    console.log("View feedback:", feedbackId)
    // Handle view feedback logic
  }

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating} star{rating !== 1 ? "s" : ""}
        </span>
      </div>
    )
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
              <Link to="/admin/companies" className="text-gray-700 hover:text-gray-900 font-medium">
                Companies
              </Link>
              <Link to="/admin/requests" className="text-gray-700 hover:text-gray-900 font-medium">
                Requests
              </Link>
              <Link to="/admin/feedback" className="text-blue-600 font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback & Ratings</h1>
          <p className="text-gray-600">Manage user feedback and company ratings</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by request, user, or rating"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex space-x-4">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className="relative">
              <select
                value={value}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
              >
                <option value={value}>{value}</option>
                {key === "requests" && (
                  <>
                    <option value="Completed Requests">Completed Requests</option>
                    <option value="Pending Requests">Pending Requests</option>
                  </>
                )}
                {key === "users" && (
                  <>
                    <option value="Active Users">Active Users</option>
                    <option value="New Users">New Users</option>
                  </>
                )}
                {key === "ratings" && (
                  <>
                    <option value="5 Stars">5 Stars</option>
                    <option value="4 Stars">4 Stars</option>
                    <option value="3 Stars">3 Stars</option>
                    <option value="2 Stars">2 Stars</option>
                    <option value="1 Star">1 Star</option>
                  </>
                )}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Feedback Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Request ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Comment</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFeedback.map((feedback, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{feedback.id}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{feedback.user}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{feedback.company}</td>
                    <td className="px-6 py-4">{renderStars(feedback.rating)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      <div className="truncate" title={feedback.comment}>
                        {feedback.comment}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewFeedback(feedback.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredFeedback.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No feedback found matching your search.</p>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredFeedback.length} of {feedbackData.length} feedback entries
        </div>
      </main>
    </div>
  )
}

export default FeedbackRatings