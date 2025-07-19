"use client"

import { Link, useNavigate } from "react-router-dom"
import { Recycle, Bell } from "lucide-react"
import UserProfileDropdown from "./UserProfileDropdown"
import CustomerNotification from "./CustomerNotification"
import { useState } from "react"

// Helper functions and icon maps
const wasteTypeEmojis = {
  "Mixed Recyclables": "♻️",
  "Organic Waste": "🍃",
  "Plastic Bottles": "🧴",
  "Paper Waste": "📄",
  "Glass Bottles": "🍾",
};
const companyIcons = {
  GreenCycle: "🏭",
  BioSolutions: "🧪",
  PlasticRecycle: "🚰",
  PaperCo: "📄",
  GlassWorks: "🍶",
  EcoGreen: "🌱",
  TrashRoute: "🚛",
};
const statusColors = {
  Completed: "bg-green-100 text-green-700 border-green-300",
  Scheduled: "bg-blue-100 text-blue-700 border-blue-300",
  Missed: "bg-red-100 text-red-700 border-red-300",
};
const statusIcons = {
  Completed: "✔️",
  Scheduled: "⏳",
  Missed: "❌",
};
const quantityIcon = (quantity) => {
  const num = parseInt(quantity);
  if (isNaN(num)) return "🛍️";
  if (num <= 2) return "🛍️";
  return "🧺";
};
function isToday(dateStr) {
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

const HistoryLog = () => {
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const historyData = [
    {
      date: "July 20, 2024",
      wasteType: "Mixed Recyclables",
      quantity: "2 bags",
      requestDate: "July 20, 2024, 10:00 AM",
      pickupStatus: "Completed",
      company: "GreenCycle",
    },
    {
      date: "July 19, 2024",
      wasteType: "Organic Waste",
      quantity: "1 bag",
      requestDate: "July 19, 2024, 9:00 AM",
      pickupStatus: "Scheduled",
      company: "EcoGreen",
    },
    {
      date: "July 18, 2024",
      wasteType: "Plastic Bottles",
      quantity: "3 bags",
      requestDate: "July 18, 2024, 11:00 AM",
      pickupStatus: "Missed",
      company: "PlasticRecycle",
    },
    {
      date: "July 15, 2024",
      wasteType: "Paper Waste",
      quantity: "2 bags",
      requestDate: "July 15, 2024, 10:30 AM",
      pickupStatus: "Completed",
      company: "PaperCo",
    },
    {
      date: "July 10, 2024",
      wasteType: "Glass Bottles",
      quantity: "1 bag",
      requestDate: "July 10, 2024, 12:00 PM",
      pickupStatus: "Completed",
      company: "GlassWorks",
    },
    {
      date: "July 7, 2024",
      wasteType: "Mixed Recyclables",
      quantity: "4 bags",
      requestDate: "July 7, 2024, 8:00 AM",
      pickupStatus: "Completed",
      company: "TrashRoute",
    },
  ];

  // Filtered data based on search
  const filteredData = historyData.filter(record => {
    const q = search.toLowerCase();
    return (
      record.wasteType.toLowerCase().includes(q) ||
      record.company.toLowerCase().includes(q) ||
      record.pickupStatus.toLowerCase().includes(q)
    );
  });

  const handleWasteTypeClick = (wasteType) => {
    console.log("Waste type clicked:", wasteType)
    // Handle waste type click - could show details or filter
  }

  const handleCompanyClick = (company) => {
    console.log("Company clicked:", company)
    // Handle company click - could show company profile
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Accent bar at the very top */}
      <div className="absolute top-0 left-0 right-0 w-screen h-1 bg-[#26a360] rounded-t-2xl z-50"></div>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
        <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
          {/* Logo with animation */}
          <div className="flex items-center">
            <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
          </div>
          {/* Navigation Links with enhanced animations */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a href="/" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Home</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/trash-type" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Request Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/track-pickup" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Track Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/history-log" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">History Log</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
          </div>
          {/* Notification and Profile */}
          <div className="hidden md:flex items-center space-x-4 ml-4">
            <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
            <UserProfileDropdown />
          </div>
          {/* Mobile menu button with animation */}
          <div className="md:hidden flex items-center">
            <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
            <UserProfileDropdown />
            <button className="ml-2 relative group p-2 rounded-lg transition-all duration-300 hover:bg-[#3a5f46]/10">
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300"></div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Title - clean, no green underline or stripe */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">History Log</h1>
        </div>

        {/* Filter/Search Bar */}
        <div className="mb-6 flex justify-end">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by waste type, company, or status..."
            className="w-full max-w-xs px-4 py-2 border-2 border-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          />
        </div>

        {/* History Table Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-green-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-900">Waste Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-900">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-900">Request Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-900">Pickup Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-900">Company</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">No records found.</td>
                  </tr>
                ) : (
                  filteredData.map((record, index) => (
                    <tr
                      key={index}
                      className={`transition-colors duration-150 border-l-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-transparent hover:bg-green-50 hover:border-green-600 cursor-pointer group`}
                      title="Click to view full pickup details"
                    >
                      <td className="px-6 py-4 text-sm text-theme-color">
                        🗓️ {record.date}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {(wasteTypeEmojis[record.wasteType] || "♻️") + " " + record.wasteType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {quantityIcon(record.quantity)} {record.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-theme-color">
                        {record.requestDate}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold ${statusColors[record.pickupStatus] || ''}`}>
                          {statusIcons[record.pickupStatus] || ""} {record.pickupStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {(companyIcons[record.company] || "🏢") + " " + record.company}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Empty State (if no data) */}
          {historyData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No pickup history found.</p>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">Showing {historyData.length} pickup records</div>
      </main>
    </div>
  )
}

export default HistoryLog