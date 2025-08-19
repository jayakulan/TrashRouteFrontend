"use client"

import { Link, useNavigate } from "react-router-dom"
import { Recycle, Bell } from "lucide-react"
import UserProfileDropdown from "./UserProfileDropdown"
import CustomerNotification from "./CustomerNotification"
import { useState, useEffect } from "react"
import Footer from "../footer.jsx"
import CustomerHeader from "./CustomerHeader";

// Helper functions and icon maps
const wasteTypeEmojis = {
  "Mixed Recyclables": "♻️",
  "Organic Waste": "🍃",
  "Plastic Bottles": "🧴",
  "Paper Waste": "📄",
  "Glass Bottles": "🍾",
  "Glass": "🍾",
  "Metal": "🔩",
  "Paper": "📄",
  "Plastic": "🧴",
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
  const [historyData, setHistoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Fetch history data from backend
  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Customer/historylogs.php', {
          method: 'GET',
          credentials: 'include', // Include cookies for session
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        
        if (result.success) {
          setHistoryData(result.data)
        } else {
          setError(result.message || 'Failed to fetch history data')
        }
      } catch (err) {
        console.error('Error fetching history data:', err)
        setError('Failed to load history data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchHistoryData()
  }, [])

  // Filtered data based on search
  const filteredData = historyData.filter(record => {
    const q = search.toLowerCase();
    return (
      record.waste_type.toLowerCase().includes(q) ||
      record.accepted_company.toLowerCase().includes(q) ||
      record.status.toLowerCase().includes(q)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
        <main className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">History Log</h1>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading history...</span>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader />
        <main className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">History Log</h1>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />

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
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-900">Quantity (kg)</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-900">Request Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-900">Pickup Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-green-900">Company</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-400">
                      {historyData.length === 0 ? 'No pickup history found.' : 'No records match your search.'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record, index) => (
                    <tr
                      key={record.request_id}
                      className={`transition-colors duration-150 border-l-4 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-transparent hover:bg-green-50 hover:border-green-600 cursor-pointer group`}
                      title="Click to view full pickup details"
                    >
                      <td className="px-6 py-4 text-sm text-theme-color">
                        🗓️ {record.date}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {(wasteTypeEmojis[record.waste_type] || "♻️") + " " + record.waste_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {quantityIcon(record.quantity)} {record.quantity}
                      </td>
                      <td className="px-6 py-4 text-sm text-theme-color">
                        {record.request_date}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-semibold ${statusColors[record.status] || ''}`}>
                          {statusIcons[record.status] || ""} {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {(companyIcons[record.accepted_company] || "🏢") + " " + record.accepted_company}
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
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredData.length} of {historyData.length} pickup records
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default HistoryLog