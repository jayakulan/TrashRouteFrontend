"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, ChevronDown, Star, Diamond, Bell, Menu, X, Users, Building, Truck, MessageSquare, BarChart3 } from "lucide-react"
import SidebarLinks from "./SidebarLinks"
import UserProfileDropdown from "../customer/UserProfileDropdown"
import Footer from "../footer";

const FeedbackRatings = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filters, setFilters] = useState({
    requests: "All Requests",
    users: "All Users",
    ratings: "All Ratings",
  })
  const [sidebarHovered, setSidebarHovered] = useState(false);

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
          <Star key={star} className={`w-3 h-3 sm:w-4 sm:h-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
        <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">
          {rating} star{rating !== 1 ? "s" : ""}
        </span>
      </div>
    )
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
          <UserProfileDropdown popupPosition="sidebar" />
        </div>
      </div>
      {/* Main Content Area */}
      <div className={`flex-1 min-w-0 ml-20 transition-all duration-300 ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <main>
        {/* Page Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3a5f46] mb-2">Feedback</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and manage feedback</p>
        </div>

          {/* Search Bar */}
          <div className="mb-4 sm:mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-[#3a5f46] w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by request, user, or rating"
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
                  <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[#3a5f46] pointer-events-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Table */}
          <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Request ID</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">User</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Company</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Rating</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46] uppercase">Comment</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-bold text-[#3a5f46]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6f4ea]">
                  {filteredFeedback.map((feedback, index) => (
                    <tr key={index} className="hover:bg-[#f7f9fb]">
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-[#2e4d3a]">{feedback.id}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46]">{feedback.user}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#3a5f46]">{feedback.company}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">{renderStars(feedback.rating)}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[#618170] max-w-xs">
                        <div className="truncate" title={feedback.comment}>{feedback.comment}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <button
                          onClick={() => handleViewFeedback(feedback.id)}
                          className="bg-[#3a5f46] hover:bg-[#2e4d3a] text-white font-semibold px-3 py-1.5 rounded-full shadow transition text-xs sm:text-sm"
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
              <div className="text-center py-8 sm:py-12">
                <p className="text-[#618170] text-sm sm:text-base">No feedback found matching your search.</p>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-xs sm:text-sm text-[#618170]">
            Showing {filteredFeedback.length} of {feedbackData.length} feedback entries
          </div>
        </main>
        <Footer admin={true} />
      </div>
    </div>
  )
}

export default FeedbackRatings