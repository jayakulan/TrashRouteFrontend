import React, { useState } from "react"

const MinimumWastePopup = ({ isOpen, onClose, onLearnMore, onDontShowAgain }) => {
  const [dontShow, setDontShow] = useState(false)

  if (!isOpen) return null

  const handleGotIt = () => {
    if (dontShow) onDontShowAgain()
    onClose()
  }

  const handleLearnMore = () => {
    if (dontShow) onDontShowAgain()
    onLearnMore()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg px-8 py-10 max-w-xl w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-center">Minimum Waste Requirement</h2>
          <p className="mb-8 text-gray-700 text-center text-lg">
            To ensure efficient processing, we require a minimum of 3kg of waste for collection.
          </p>
          <div className="flex gap-4 w-full justify-center mb-8">
            <button
              onClick={handleGotIt}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-10 rounded-full transition-colors text-lg focus:outline-none"
            >
              Got it!
            </button>
            <button
              onClick={handleLearnMore}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-10 rounded-full transition-colors text-lg focus:outline-none"
            >
              Learn more
            </button>
          </div>
          <div className="flex items-center gap-2 w-full justify-start">
            <input
              id="dont-show-again"
              type="checkbox"
              checked={dontShow}
              onChange={e => setDontShow(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="dont-show-again" className="text-gray-800 text-lg select-none cursor-pointer">
              Don't show again
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MinimumWastePopup 