"use client"

import { useState } from "react"
import MinimumWastePopup from "./MinimumWastePopup"

const PopupExample = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const handleOpenPopup = () => {
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
  }

  const handleLearnMore = () => {
    console.log("Learn more clicked")
    // Handle learn more action - could navigate to a help page or show additional info
    setIsPopupOpen(false)
  }

  const handleDontShowAgain = () => {
    console.log("Don't show again selected")
    // Handle storing user preference (localStorage, API call, etc.)
    localStorage.setItem("hideMinimumWastePopup", "true")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Popup Component Demo</h1>
        <button
          onClick={handleOpenPopup}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Show Minimum Waste Popup
        </button>

        <MinimumWastePopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          onLearnMore={handleLearnMore}
          onDontShowAgain={handleDontShowAgain}
        />
      </div>
    </div>
  )
}

export default PopupExample
