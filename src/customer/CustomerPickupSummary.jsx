import { Link } from "react-router-dom"
import { Recycle, Bell } from "lucide-react"
import { useState } from "react"
import UserProfileDropdown from "./UserProfileDropdown"

const ConfirmPickup = () => {
  const [confirmed, setConfirmed] = useState(false)
  const pickupSummary = {
    wasteTypes: "Recyclables, Organics",
    quantities: "2 bags, 1 bin",
    totalWeight: "15 kg",
    pickupLocation: "123 Maple Street, Anytown",
  }

  const handleConfirmSchedule = () => {
    setConfirmed(true)
    console.log("Pickup schedule confirmed")
    // Handle schedule confirmation logic here
    // This would typically submit the pickup request to the backend
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
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/request-pickup" className="text-blue-600 hover:text-blue-700">
            Request Pickup
          </Link>
          <span>/</span>
          <Link to="/select-waste-type" className="text-blue-600 hover:text-blue-700">
            Select Waste Type
          </Link>
          <span>/</span>
          <Link to="/pin-location" className="text-blue-600 hover:text-blue-700">
            Pin Location
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Confirm Pickup Schedule</span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Step 3 of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full" style={{ width: "33.33%", background: '#3a5f46' }}></div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Pickup Schedule</h1>
        </div>

        {/* Pickup Summary Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-8">Pickup Summary</h2>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {/* Waste Types */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-blue-600">Waste Types</div>
                <div className="text-gray-900 font-medium">{pickupSummary.wasteTypes}</div>
              </div>

              {/* Quantities */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-blue-600">Quantities</div>
                <div className="text-gray-900 font-medium">{pickupSummary.quantities}</div>
              </div>

              {/* Total Weight */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-blue-600">Total Weight</div>
                <div className="text-gray-900 font-medium">{pickupSummary.totalWeight}</div>
              </div>

              {/* Pickup Location */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-blue-600">Pickup Location</div>
                <div className="text-gray-900 font-medium">{pickupSummary.pickupLocation}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button or Success Message */}
        <div className="flex justify-center">
          {confirmed ? (
            <div className="text-green-600 text-lg font-semibold">Pickup schedule confirmed!</div>
          ) : (
            <button
              onClick={handleConfirmSchedule}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-12 rounded-full text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Confirm Schedule
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

export default ConfirmPickup