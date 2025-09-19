import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Recycle } from "lucide-react"
import UserProfileDropdowncom from "./UserProfileDropdowncom"
import Footer from "../footer.jsx"
import CompanyNotifications from "./CompanyNotifications"
import { getCookie } from "../utils/cookieUtils"

const CompanyHistoryLog = () => {
  const processingData = []
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getCookie("token");
        const company_id = getCookie("company_id");
        if (!token || !company_id) {
          setError("Missing auth cookie(s). Please log in again.");
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Company/comhistorylogs.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + token
          },
          body: `company_id=${company_id}`
        });
        const data = await res.json();
        if (data.success) {
          setRows(data.data || []);
        } else {
          setError(data.message || "Failed to fetch history logs");
        }
      } catch (err) {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header Container */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
        {/* Accent bar at the very top */}
        <div className="w-full h-1 bg-[#26a360]"></div>
        {/* Navigation */}
        <nav className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50">
          <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
            {/* Logo with animation */}
            <div className="flex items-center">
              <img src="/images/logo2.png" alt="Logo" className="h-16 w-34" />
            </div>
            {/* Navigation - right aligned */}
            <div className="flex items-center space-x-8">
              <button
                type="button"
                onClick={() => navigate("/company/home")}
                className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 focus:outline-none bg-transparent nav-link-text"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
              </button>
              <button
                type="button"
                onClick={() => navigate("/company-waste-prefer")}
                className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 focus:outline-none bg-transparent nav-link-text"
              >
                <span className="relative z-10">Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
              </button>
              <button
                type="button"
                onClick={() => navigate("/company/historylogs")}
                className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 focus:outline-none bg-transparent nav-link-text"
              >
                <span className="relative z-10">Historylogs</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
              </button>
              <CompanyNotifications />
              {/* User Avatar Dropdown */}
              <UserProfileDropdowncom />
            </div>
            {/* Mobile menu button with notification/profile */}
            <div className="md:hidden flex items-center">
              <CompanyNotifications />
              <UserProfileDropdowncom />
              <button className="ml-2 relative group p-2 rounded-lg transition-all duration-300 hover:bg-[#3a5f46]/10">
                <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300"></div>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-7xl pt-[85px]">
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Customer Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading && (
                  <tr>
                    <td className="px-6 py-6 text-center text-gray-500 text-sm" colSpan={5}>Loading...</td>
                  </tr>
                )}
                {!loading && rows.length === 0 && !error && (
                  <tr>
                    <td className="px-6 py-6 text-center text-gray-500 text-sm" colSpan={5}>No history found.</td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td className="px-6 py-6 text-center text-red-600 text-sm" colSpan={5}>{error}</td>
                  </tr>
                )}
                {!loading && !error && rows.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(record.date).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${getWasteTypeColor(record.waste_type)}`}>
                        {record.waste_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{record.quantity} kg</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{record.customer_name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}
                      >
                        {record.status}
                      </span>
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
        <div className="mt-4 text-sm text-gray-600">Showing {rows.length} records</div>
      </main>
      
      <Footer />
    </div>
  )
}

export default CompanyHistoryLog