"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Search, Bell } from "lucide-react"
import SidebarLinks from "./SidebarLinks";
import AdminProfileDropdown from "./AdminProfileDropdown";
import Footer from "../footer";
import { Menu, X } from "lucide-react";
import DeleteWarningPopup from "./components/DeleteWarningPopup";

const NotificationsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsData, setNotificationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingNotification, setDeletingNotification] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    fetchNotificationData();
  }, []);

  const fetchNotificationData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/notification.php');
      const result = await response.json();
      
      if (result.success) {
        setNotificationsData(result.data);
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching notification data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notificationsData.filter(
    (notification) =>
      notification.notification_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.request_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.customer_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.company_id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const resetSearch = () => {
    setSearchQuery("")
  }

  const handleDeleteClick = (notification) => {
    setNotificationToDelete(notification);
    setShowDeletePopup(true);
  }

  const handleDeleteConfirm = async () => {
    if (!notificationToDelete) return;
    
    if (window.confirm(`Are you sure you want to delete notification ${notificationToDelete.notification_id}?`)) {
      try {
        setDeletingNotification(notificationToDelete.notification_id);
        const response = await fetch(`http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/notification.php?notification_id=${notificationToDelete.notification_id}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        
        if (result.success) {
          alert('Notification deleted successfully');
          fetchNotificationData(); // Refresh the data
          setShowDeletePopup(false);
          setNotificationToDelete(null);
        } else {
          alert(result.message || 'Failed to delete notification');
        }
      } catch (err) {
        alert('Error deleting notification');
        console.error('Error deleting notification:', err);
      } finally {
        setDeletingNotification(null);
      }
    }
  }

  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
    setNotificationToDelete(null);
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#3a5f46]">Notifications</h1>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3a5f46] w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search Notification ID, Request ID, Customer ID, Company ID, or Message"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#e6f4ea] border-0 rounded-lg text-[#2e4d3a] placeholder-[#618170] focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:bg-white transition-colors"
                />
              </div>
              <button
                onClick={resetSearch}
                className="px-4 py-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm shadow"
              >
                Reset Search
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a5f46] mx-auto"></div>
                <p className="mt-4 text-[#618170]">Loading notifications...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-white rounded-lg shadow-lg border border-red-200 p-8">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchNotificationData}
                  className="bg-[#3a5f46] hover:bg-[#2e4d3a] text-white px-4 py-2 rounded-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Notifications Table */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-lg border border-[#d0e9d6] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#e6f4ea] border-b border-[#d0e9d6]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">NOTIFICATION ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">REQUEST ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">CUSTOMER ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">COMPANY ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">MESSAGE</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">CREATED AT</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#3a5f46] uppercase">STATUS</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-[#618170] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d0e9d6]">
                    {filteredNotifications.map((notification, index) => (
                      <tr key={index} className="hover:bg-[#f7f9fb]">
                        <td className="px-6 py-4 text-sm font-medium text-[#2e4d3a]">{notification.notification_id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#2e4d3a]">{notification.request_id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#2e4d3a]">{notification.customer_id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-[#2e4d3a]">{notification.company_id}</td>
                        <td className="px-6 py-4 text-sm text-[#618170] max-w-xs">
                          <div className="truncate" title={notification.message}>
                            {notification.message}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#618170]">{new Date(notification.created_at).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            notification.seen === 1 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {notification.seen === 1 ? 'Seen' : 'Unseen'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteClick(notification)}
                              disabled={deletingNotification === notification.notification_id}
                              className={`font-semibold px-3 py-1 rounded-full shadow transition text-xs ${
                                deletingNotification === notification.notification_id
                                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                  : 'bg-red-600 hover:bg-red-700 text-white'
                              }`}
                            >
                              {deletingNotification === notification.notification_id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
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
          )}
          {/* Results Count */}
          {!loading && !error && (
            <div className="mt-4 text-sm text-[#618170]">
              Showing {filteredNotifications.length} of {notificationsData.length} notifications
            </div>
          )}
        </main>
        <div className="mb-12"></div>
        <Footer admin={true} />
      </div>

      {/* Delete Warning Popup */}
      <DeleteWarningPopup
        isOpen={showDeletePopup}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Notification"
        message="Are you sure you want to delete this notification?"
        itemName={notificationToDelete?.notification_id || ""}
        isLoading={deletingNotification !== null}
      />
    </div>
  )
}

export default NotificationsManagement