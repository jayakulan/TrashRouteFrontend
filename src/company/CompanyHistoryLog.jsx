import { Link } from "react-router-dom"
import { Recycle } from "lucide-react"
import UserProfileDropdowncom from "./UserProfileDropdowncom"

const CompanyHistoryLog = () => {
  const processingData = [
    {
      date: "2024-07-26",
      wasteType: "Plastic",
      quantity: "50 kg",
      source: "Factory A",
      status: "Processed",
      notes: "Recycled into new products",
    },
    {
      date: "2024-07-25",
      wasteType: "Paper",
      quantity: "100 kg",
      source: "Office B",
      status: "Processed",
      notes: "Used for cardboard production",
    },
    {
      date: "2024-07-24",
      wasteType: "Organic",
      quantity: "75 kg",
      source: "Restaurant C",
      status: "Pending",
      notes: "Awaiting composting",
    },
    {
      date: "2024-07-23",
      wasteType: "Metal",
      quantity: "25 kg",
      source: "Construction Site D",
      status: "Processed",
      notes: "Melted down for reuse",
    },
    {
      date: "2024-07-22",
      wasteType: "Glass",
      quantity: "60 kg",
      source: "Residential Area E",
      status: "Rejected",
      notes: "Contaminated with non-recyclable materials",
    },
    {
      date: "2024-07-21",
      wasteType: "Plastic",
      quantity: "45 kg",
      source: "Factory F",
      status: "Processed",
      notes: "Recycled into plastic pellets",
    },
    {
      date: "2024-07-20",
      wasteType: "Paper",
      quantity: "90 kg",
      source: "Office G",
      status: "Processed",
      notes: "Reprocessed into new paper",
    },
    {
      date: "2024-07-19",
      wasteType: "Organic",
      quantity: "80 kg",
      source: "Restaurant H",
      status: "Pending",
      notes: "Scheduled for composting",
    },
    {
      date: "2024-07-18",
      wasteType: "Metal",
      quantity: "30 kg",
      source: "Construction Site I",
      status: "Processed",
      notes: "Used in metal fabrication",
    },
    {
      date: "2024-07-17",
      wasteType: "Glass",
      quantity: "55 kg",
      source: "Residential Area J",
      status: "Processed",
      notes: "Recycled into new glass products",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "Processed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getWasteTypeColor = (wasteType) => {
    switch (wasteType) {
      case "Plastic":
        return "text-blue-600"
      case "Paper":
        return "text-green-600"
      case "Organic":
        return "text-orange-600"
      case "Metal":
        return "text-gray-600"
      case "Glass":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const getSourceColor = (source) => {
    return "text-green-600" // All sources appear to be green in the image
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center">
            {/* Logo */}
            <div>
              <img src="/images/logo.png" alt="Logo" className="h-16 w-34" />
            </div>
            {/* Navigation - right aligned */}
            <div className="flex items-center space-x-8 ml-auto">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
              <Link to="/company-waste-prefer" className="text-gray-700 hover:text-gray-900 font-medium">Dashboard</Link>
              <Link to="/company/historylogs" className="text-gray-700 hover:text-gray-900 font-medium">Historylogs</Link>
              {/* Notification Bell Icon */}
              <button className="relative focus:outline-none" aria-label="Notifications">
                <svg className="w-6 h-6 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {/* User Avatar Dropdown */}
              <UserProfileDropdowncom />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Waste Processing History Log</h1>
        </div>

        {/* Processing History Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Waste Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Source</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {processingData.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{record.date}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getWasteTypeColor(record.wasteType)}`}>
                        {record.wasteType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.quantity}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${getSourceColor(record.source)}`}>{record.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      <div className="truncate" title={record.notes}>
                        {record.notes}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State (if no data) */}
          {processingData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No processing history found.</p>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">Showing {processingData.length} processing records</div>
      </main>
    </div>
  )
}

export default CompanyHistoryLog