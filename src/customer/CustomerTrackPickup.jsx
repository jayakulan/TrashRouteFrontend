"use client"

import { useNavigate, Link } from "react-router-dom"
import { Recycle, Bell } from "lucide-react"
import UserProfileDropdown from "./UserProfileDropdown"

const CustomerTrackPickup = () => {
  const navigate = useNavigate()
  
  const pickupRequests = [
    {
      id: 1,
      wasteType: "Mixed Recyclables",
      stages: [
        { name: "Request Received", completed: true },
        { name: "Scheduled", completed: true },
        { name: "Ongoing", completed: true },
        { name: "Completed", completed: true },
      ],
    },
    {
      id: 2,
      wasteType: "Organic Waste",
      stages: [
        { name: "Request Received", completed: true },
        { name: "Scheduled", completed: true },
        { name: "Ongoing", completed: false, inProgress: true },
        { name: "Completed", completed: false },
      ],
    },
  ]

  const handleGoToDashboard = () => {
    navigate('/customer/trash-type')
  }

  const getProgressBarWidth = (stages) => {
    const completedStages = stages.filter((stage) => stage.completed).length
    const inProgressStages = stages.filter((stage) => stage.inProgress).length

    if (completedStages === stages.length) {
      return 100
    }

    const baseProgress = (completedStages / stages.length) * 100
    const inProgressBonus = inProgressStages > 0 ? (0.5 / stages.length) * 100 : 0

    return Math.min(baseProgress + inProgressBonus, 100)
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Track Your Pickups</h1>
          <p className="text-gray-600 mt-2">Monitor the status of your waste collection requests</p>
        </div>

        {/* Pickup Requests */}
        <div className="space-y-6">
          {pickupRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl p-6 shadow-sm border">
              {/* Waste Type Header */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Waste Type: {request.wasteType}
                </h2>
              </div>

              {/* Progress Stages */}
              <div className="space-y-4">
                {request.stages.map((stage, index) => (
                  <div key={index} className="relative">
                    {/* Stage Label */}
                    <div className="mb-2">
                      <span className="text-gray-700 font-medium">{stage.name}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          stage.completed 
                            ? "bg-green-600" 
                            : stage.inProgress 
                            ? "bg-blue-500" 
                            : "bg-gray-200"
                        }`}
                        style={{
                          width: stage.completed ? "100%" : stage.inProgress ? "60%" : "0%",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleGoToDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Request New Pickup
          </button>
        </div>
      </main>
    </div>
  )
}

export default CustomerTrackPickup