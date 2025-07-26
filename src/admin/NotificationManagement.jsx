"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Bell } from "lucide-react"
import SidebarLinks from "./SidebarLinks";
import UserProfileDropdown from "../customer/UserProfileDropdown";
import Footer from "../footer";
import { Menu, X } from "lucide-react";

const NotificationsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notificationsData = [
    {
      title: "System Update",
      message: "Scheduled maintenance for the server",
      recipient: "All Users",
      date: "2024-03-15",
      status: "Sent",
    },
    {
      title: "New Feature Announcement",
      message: "Introducing the new recycling guide",
      recipient: "All Users",
      date: "2024-03-10",
      status: "Sent",
    },
    {
      title: "Payment Reminder",
      message: "Your payment is due",
      recipient: "Specific Users",
      date: "2024-03-05",
      status: "Sent",
    },
    {
      title: "Service Alert",
      message: "Temporary service disruption in your area",
      recipient: "Specific Users",
      date: "2024-02-28",
      status: "Sent",
    },
    {
      title: "Welcome to EcoCycle",
      message: "Get started with our services",
      recipient: "New Users",
      date: "2024-02-20",
      status: "Sent",
    },
  ]

  const filteredNotifications = notificationsData.filter(
    (notification) =>
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.recipient.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateNotification = () => {
    console.log("Create notification clicked")
    // Handle create notification logic
  }

  const handleView = (notificationIndex) => {
    console.log("View notification:", notificationIndex)
    // Handle view notification logic
  }

  const getRecipientColor = (recipient) => {
    switch (recipient) {
      case "All Users":
        return "text-gray-600"
      case "Specific Users":
        return "text-blue-600"
      case "New Users":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex overflow-x-hidden">
      {/* Sidebar: hidden on mobile, hover-expand on desktop */}
      <div
        className={`fixed top-0 left-0 h-full z-30 bg-white shadow-lg flex-col transition-all duration-300 hidden sm:flex ${sidebarHovered ? 'w-64' : 'w-20'}`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <SidebarLinks sidebarOpen={sidebarHovered} />
        <div className="p-4 border-t border-gray-200 mt-auto flex justify-center">
          <UserProfileDropdown mode="admin" />
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
              <UserProfileDropdown mode="admin" />
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
            <h1 className="text-3xl font-bold text-[#3a5f46]">Notifications</h1>
            <button
              onClick={handleCreateNotification}
              className="bg-[#e6f4ea] hover:bg-[#d0e9d6] text-[#3a5f46] font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Create Notification
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3a5f46] w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-[#e6f4ea] border-0 rounded-lg text-[#2e4d3a] placeholder-[#618170] focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Notifications Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#3a5f46]">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#3a5f46]">Message</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#3a5f46]">Recipient</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#3a5f46]">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#3a5f46]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#3a5f46]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d0e9d6]">
                  {filteredNotifications.map((notification, index) => (
                    <tr key={index} className="hover:bg-[#f7f9fb]">
                      <td className="px-6 py-4 text-sm font-medium text-[#2e4d3a]">{notification.title}</td>
                      <td className="px-6 py-4 text-sm text-[#618170] max-w-xs">
                        <div className="truncate" title={notification.message}>
                          {notification.message}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${getRecipientColor(notification.recipient)}`}>
                          {notification.recipient}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#618170]">{notification.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {notification.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleView(index)}
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
            {filteredNotifications.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#618170]">No notifications found matching your search.</p>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-[#618170]">
            Showing {filteredNotifications.length} of {notificationsData.length} notifications
          </div>
        </main>
        <Footer admin={true} />
      </div>
    </div>
  )
}

export default NotificationsManagement