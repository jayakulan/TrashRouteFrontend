"use client"

import { useState, useRef, useEffect } from "react"
import AdminProfileDropdown from "./AdminProfileDropdown"
import { Link } from "react-router-dom"
import { Diamond, Users, Building, Truck, MessageSquare, BarChart3, Menu, X, Bell, Mail, Map, MapPin } from "lucide-react"
import SidebarLinks from "./SidebarLinks";
import Footer from "../footer";

const AdminDashboard = () => {
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Function to calculate time ago
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMs = now - time;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/admin/dashboard.php');
        const result = await response.json();
        
        if (result.success) {
          const data = result.data;
          
          // Update stats
          setStats([
            {
              title: "Total Customers",
              value: data.total_customers?.toLocaleString() || "0",
              bgColor: "bg-blue-50",
            },
            {
              title: "Total Companies",
              value: data.total_companies?.toLocaleString() || "0",
              bgColor: "bg-purple-50",
            },
            {
              title: "Total Requests",
              value: data.total_requests?.toLocaleString() || "0",
              bgColor: "bg-green-50",
            },
          ]);
          
          // Update pickup status
          setPickupStatus([
            {
              title: "Pending",
              value: data.pending?.toLocaleString() || "0",
              bgColor: "bg-yellow-50",
            },
            {
              title: "Active",
              value: data.active?.toLocaleString() || "0",
              bgColor: "bg-blue-50",
            },
            {
              title: "Completed",
              value: data.completed?.toLocaleString() || "0",
              bgColor: "bg-green-50",
            },
          ]);
          
          // Update recent activity
          if (data.recent_activity) {
            setRecentActivity(data.recent_activity.map((activity, index) => ({
              id: index + 1,
              title: activity.title,
              time: activity.time,
              timestamp: activity.timestamp || new Date().toISOString(), // Use provided timestamp or current time
            })));
          }
        } else {
          setError(result.error || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        setError('Failed to connect to server');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Update timestamps every minute to keep them current
  useEffect(() => {
    const timestampInterval = setInterval(() => {
      setRecentActivity(prev => prev.map(activity => ({
        ...activity,
        // Keep the same timestamp but trigger re-render
        _lastUpdate: Date.now()
      })));
    }, 60000); // Update every minute

    return () => clearInterval(timestampInterval);
  }, []);

  const [stats, setStats] = useState([
    {
      title: "Total Customers",
      value: "0",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Companies",
      value: "0",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Requests",
      value: "0",
      bgColor: "bg-green-50",
    },
  ])

  const [pickupStatus, setPickupStatus] = useState([
    {
      title: "Pending",
      value: "0",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Active",
      value: "0",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: "0",
      bgColor: "bg-green-50",
    },
  ])

  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
          {/* Page Title */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#3a5f46] tracking-tight mb-2">Dashboard</h1>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className={`${stat.bgColor} rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-[#d0e9d6] shadow hover:shadow-lg transition-all duration-200`}> 
                <div className="text-xs sm:text-sm font-semibold text-[#3a5f46] mb-1 sm:mb-2 uppercase tracking-wide">{stat.title}</div>
                <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2e4d3a]">
                  {loading ? (
                    <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
                  ) : (
                    stat.value
                  )}
                </div>
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
                  <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2e4d3a]">
                    {loading ? (
                      <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
                    ) : (
                      status.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Recent Activity Section */}
            <div>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#3a5f46] mb-3 sm:mb-4 lg:mb-6">Recent Activity</h2>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {loading ? (
                  // Loading skeleton for recent activity
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 sm:p-4 border border-[#d0e9d6] shadow-sm">
                      <div className="animate-pulse bg-gray-300 h-4 w-3/4 rounded mb-2"></div>
                      <div className="animate-pulse bg-gray-300 h-3 w-1/2 rounded"></div>
                    </div>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-lg p-3 sm:p-4 border border-[#d0e9d6] shadow-sm hover:shadow-md transition">
                      <div className="text-[#2e4d3a] font-semibold mb-1 text-sm sm:text-base">{activity.title}</div>
                      <div className="text-xs sm:text-sm text-[#3a5f46]">{getTimeAgo(activity.timestamp)}</div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg p-3 sm:p-4 border border-[#d0e9d6] shadow-sm">
                    <div className="text-[#2e4d3a] text-sm text-center py-4">No recent activity</div>
                  </div>
                )}
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

