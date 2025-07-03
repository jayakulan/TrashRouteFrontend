"use client"

import { Link } from "react-router-dom"
import { Recycle, Bell } from "lucide-react"
import UserProfileDropdown from "./UserProfileDropdown"

const HistoryLog = () => {
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
      date: "July 15, 2024",
      wasteType: "Organic Waste",
      quantity: "1 bag",
      requestDate: "July 15, 2024, 9:00 AM",
      pickupStatus: "Completed",
      company: "BioSolutions",
    },
    {
      date: "July 10, 2024",
      wasteType: "Plastic Bottles",
      quantity: "3 bags",
      requestDate: "July 10, 2024, 11:00 AM",
      pickupStatus: "Completed",
      company: "PlasticRecycle",
    },
    {
      date: "July 5, 2024",
      wasteType: "Paper Waste",
      quantity: "2 bags",
      requestDate: "July 5, 2024, 10:30 AM",
      pickupStatus: "Completed",
      company: "PaperCo",
    },
    {
      date: "June 30, 2024",
      wasteType: "Glass Bottles",
      quantity: "1 bag",
      requestDate: "June 30, 2024, 12:00 PM",
      pickupStatus: "Completed",
      company: "GlassWorks",
    },
  ]

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
      {/* Header */}
      <header className="bg-white border-b">
        <nav className="container mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-34" />
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/customer/trash-type" className="text-gray-700 hover:text-gray-900 font-medium">Request Pickup</Link>
            <Link to="/customer/track-pickup" className="text-gray-700 hover:text-gray-900 font-medium">Track Pickup</Link>
            <Link to="/customer/history-log" className="text-gray-700 hover:text-gray-900 font-medium">History Log</Link>
            <Link to="/customer/notification-log" className="text-gray-700 hover:text-gray-900 font-medium" aria-label="Notification Log"><Bell className="w-5 h-5" /></Link>
            <UserProfileDropdown />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">History Log</h1>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Waste Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Request Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Pickup Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Company</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historyData.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-blue-600">{record.date}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleWasteTypeClick(record.wasteType)}
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {record.wasteType}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.quantity}</td>
                    <td className="px-6 py-4 text-sm text-blue-600">{record.requestDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.pickupStatus}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCompanyClick(record.company)}
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {record.company}
                      </button>
                    </td>
                  </tr>
                ))}
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