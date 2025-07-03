"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Diamond, Bell, ChevronDown } from "lucide-react"

const ReportsAnalytics = () => {
  const [filters, setFilters] = useState({
    dateRange: "Last 30 Days",
    wasteType: "All Types",
    region: "All Regions",
    company: "All Companies",
  })

  const wasteCollectedData = [
    { week: "Week 1", value: 200 },
    { week: "Week 2", value: 400 },
    { week: "Week 3", value: 300 },
    { week: "Week 4", value: 300 },
  ]

  const requestsData = [
    { week: "Week 1", value: 1200 },
    { week: "Week 2", value: 1400 },
    { week: "Week 3", value: 900 },
    { week: "Week 4", value: 1500 },
  ]

  const paymentData = [
    { week: "Week 1", value: 15000, percentage: 100 },
    { week: "Week 2", value: 12000, percentage: 80 },
    { week: "Week 3", value: 13000, percentage: 87 },
    { week: "Week 4", value: 10000, percentage: 67 },
  ]

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
  }

  const handleExportPDF = () => {
    console.log("Exporting as PDF...")
  }

  const handleExportCSV = () => {
    console.log("Exporting as CSV...")
  }

  const maxWasteValue = Math.max(...wasteCollectedData.map((d) => d.value))
  const maxRequestsValue = Math.max(...requestsData.map((d) => d.value))

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
              <Link to="/admin/feedback" className="text-gray-700 hover:text-gray-900 font-medium">
                Feedback
              </Link>
              <Link to="/admin/reports" className="text-blue-600 font-medium">
                Reports
              </Link>
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
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(filters).map(([key, value]) => (
              <div key={key} className="relative">
                <select
                  value={value}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value={value}>
                    {key === "dateRange"
                      ? "Date Range"
                      : key === "wasteType"
                        ? "Waste Type"
                        : key === "region"
                          ? "Region"
                          : "Company"}
                  </option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Waste Collected Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Waste Collected</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-1">Total Waste Collected</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1200 tons</div>
              <div className="text-sm text-green-600">Last 30 Days +15%</div>
            </div>

            {/* Bar Chart */}
            <div className="flex items-end justify-between h-40 mb-4">
              {wasteCollectedData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1 mx-2">
                  <div
                    className="w-full bg-blue-200 rounded-t-md"
                    style={{
                      height: `${(item.value / maxWasteValue) * 120}px`,
                      minHeight: "20px",
                    }}
                  ></div>
                  <div className="text-xs text-blue-600 mt-2">{item.week}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requests Completed Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Requests Completed</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-1">Total Requests Completed</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5000</div>
              <div className="text-sm text-green-600">Last 30 Days +10%</div>
            </div>

            {/* Line Chart */}
            <div className="relative h-32 mb-4">
              <svg className="w-full h-full" viewBox="0 0 400 120">
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points="50,80 120,60 190,90 260,40 330,30 380,50"
                />
                {requestsData.map((item, index) => (
                  <circle
                    key={index}
                    cx={50 + index * 87}
                    cy={120 - (item.value / maxRequestsValue) * 80}
                    r="3"
                    fill="#3b82f6"
                  />
                ))}
              </svg>
              <div className="flex justify-between mt-2">
                {requestsData.map((item, index) => (
                  <div key={index} className="text-xs text-blue-600">
                    {item.week}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment History</h2>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-1">Total Payments Received</div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$50,000</div>
              <div className="text-sm text-green-600">Last 30 Days +5%</div>
            </div>

            {/* Horizontal Bar Chart */}
            <div className="space-y-4">
              {paymentData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-blue-600">{item.week}</div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-200 h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </div>
                  <div className="w-20 text-sm text-gray-600 text-right">${item.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleExportPDF}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Export as PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Export as CSV
          </button>
        </div>
      </main>
    </div>
  )
}

export default ReportsAnalytics