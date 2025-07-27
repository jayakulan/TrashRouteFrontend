"use client"

import { useState, useRef, useEffect } from "react"
import UserProfileDropdown from "../customer/UserProfileDropdown"
import { Link } from "react-router-dom"
import { Diamond, Users, Building, Truck, MessageSquare, BarChart3, Menu, X, Bell, Mail, Map, MapPin } from "lucide-react"
import SidebarLinks from "./SidebarLinks";
import Footer from "../footer";

const AdminDashboard = () => {
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

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
    {
      title: "Notifications",
      icon: Bell,
      href: "/admin/notifications",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
    {
      title: "Contact Us",
      icon: Mail,
      href: "/admin/contactus",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-600",
    },
    {
      title: "Routes",
      icon: Map,
      href: "/admin/routes",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      title: "Route Mapping",
      icon: MapPin,
      href: "/admin/route-mapping",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex overflow-x-hidden">
      {/* Sidebar: hidden on mobile, hover-expand on desktop */}
      <div
        className={`fixed top-0 left-0 h-full z-30 bg-white shadow-lg flex-col transition-all duration-300
          hidden sm:flex
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
        <Footer admin={true} />
      </div>
    </div>
  )
}

export default AdminDashboard;
