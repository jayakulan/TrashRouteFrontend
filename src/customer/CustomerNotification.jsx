import { useState, useRef, useEffect } from "react";
import { Bell, Calendar, Clock, Truck, MapPin, CheckCircle, AlertCircle, Hourglass, Receipt, Link2, Info } from "lucide-react";

// Default notification data
const defaultNotification = {
  name: "Alex",
  greeting: "Hi Alex, your waste pickup is ready!",
  title: "Pickup Scheduled Successfully!",
  pickupDate: "July 7, 2025",
  pickupTime: "9:00 AM – 12:00 PM",
  company: "EcoGreen Recycling",
  wasteSummary: "Plastic (3kg), Glass (2kg)",
  location: "123 Green St, Springfield",
  trackingId: "#TR-002194",
  status: "on_the_way", // 'confirmed', 'pending', 'missed', 'on_the_way'
  statusText: "🚛 Status: On the Way",
  assistantMsg: "We've locked in your pickup with EcoGreen 🚛. Your sorted waste will be picked up at your scheduled time — just have it ready at your drop point!",
  progressStep: 3,
  progressTotal: 4,
  progressPercent: 75,
};

const THEME_GREEN = "#3a5f46";
const THEME_GREEN_DARK = "#2e4a36";
const LIGHT_GRAY = "#f7faf7";

const statusColors = {
  confirmed: "text-green-600",
  pending: "text-yellow-500",
  missed: "text-red-600",
  on_the_way: "text-green-700",
};

export default function CustomerNotification({ hasNew = true, onViewDetails, notification = defaultNotification, iconOnly = false, mode = "track", wasteTypes = null, onGoNow = null }) {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const bellRef = useRef();
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Animation classes
  const dropdownAnim = open
    ? "notif-popup-open"
    : "notif-popup-closed";

  // Responsive width
  const popupWidth = "w-[25rem] max-w-[95vw] sm:w-[28rem]";

  // Progress bar width
  const progressWidth = `${notification.progressPercent || 0}%`;

  if (iconOnly) {
    return (
      <div className="relative flex items-center">
        <button
          ref={bellRef}
          className="relative focus:outline-none"
          aria-label="Notifications"
          // No onClick when iconOnly
        >
          <Bell className="w-7 h-7 text-gray-700 hover:text-green-700 transition" />
          {hasNew && (
            <span className="absolute top-0 right-0 block w-3 h-3 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex items-center">
      {/* Bell Icon with red dot */}
      <button
        ref={bellRef}
        className="relative focus:outline-none"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="w-7 h-7 text-gray-700 hover:text-green-700 transition" />
        {/* Removed red notification dot */}
      </button>
      {/* Dropdown Card - absolute, attached to bell, dialog style */}
      <div
        ref={dropdownRef}
        className={`absolute right-0 top-full z-50 ${popupWidth} min-h-[12rem] max-h-[32rem] rounded-xl border border-green-200 shadow-2xl transition-all duration-500 ease-out ${dropdownAnim} p-7 flex flex-col gap-4 animate-none sm:rounded-xl notif-glass-bg`}
        style={{
          background: 'linear-gradient(135deg, #e8f5e9 0%, #f7faf7 60%, #d0f5e0 100%)',
          boxShadow: '0 12px 40px 0 rgba(60, 120, 60, 0.22), 0 2px 8px 0 rgba(0,0,0,0.10)',
          overflowY: 'auto',
          pointerEvents: open ? 'auto' : 'none',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1.5px solid #b2dfdb',
          marginTop: '0.5rem', // small gap below bell
        }}
      >
        {/* Call-to-Action Button with Tooltip */}
        <div className="relative w-full flex flex-col items-center">
          {mode === "track" ? (
            <>
              <button
                className="w-full mt-2 py-3 px-6 bg-green-700 hover:bg-green-800 text-white text-lg font-bold rounded-xl shadow-md transition-all duration-200 notif-btn-grow"
                style={{ background: THEME_GREEN }}
                onClick={onViewDetails}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                aria-label="Track Pickup Now"
              >
                📦 Track Pickup Now
              </button>
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs rounded-md px-3 py-2 shadow-lg z-50 whitespace-nowrap animate-fade-slide">
                  Click to see full info, company contact & tracking.
                </div>
              )}
            </>
          ) : (
            <>
              {/* All Waste Types Display */}
              <div className="w-full mb-4 p-4 bg-white/90 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold text-green-700 mb-3">Available Waste Types</h3>
                {wasteTypes && wasteTypes.length > 0 ? (
                  <div className="space-y-3">
                    {wasteTypes.map((waste, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{waste.type}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              waste.status === "Completed" ? "bg-green-100 text-green-700" :
                              waste.status === "Scheduled" ? "bg-blue-100 text-blue-700" :
                              waste.status === "Missed" ? "bg-red-100 text-red-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {waste.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-2">No waste types available</div>
                )}
                {/* Single Go Now Button for all waste types */}
                <button
                  className="w-full mt-3 py-2 px-4 bg-green-700 hover:bg-green-800 text-white text-sm font-bold rounded-lg shadow-md transition-all duration-200 notif-btn-grow"
                  style={{ background: THEME_GREEN }}
                  onClick={onGoNow}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  aria-label="Go to Track Pickup"
                >
                  🚀 Go Now
                </button>
                {/* Tooltip */}
                {showTooltip && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs rounded-md px-3 py-2 shadow-lg z-50 whitespace-nowrap animate-fade-slide">
                    Go to track pickup page.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        {notification.status === "completed" && (
          <div className="w-full flex justify-center mt-3">
            <button
              className="py-2 px-6 text-white text-base font-semibold rounded-lg shadow transition-all duration-200"
              style={{ background: '#5E856D' }}
              onMouseOver={e => e.currentTarget.style.background = '#466a54'}
              onMouseOut={e => e.currentTarget.style.background = '#5E856D'}
              onClick={e => {
                e.stopPropagation();
                console.log("Give Feedback clicked");
                setShowFeedbackPopup(true);
              }}
            >
              Give Feedback
            </button>
          </div>
        )}
        {/* Mini Confirmation Note */}
        <div className="mt-2 text-center text-green-800 text-sm font-medium bg-green-50 rounded-lg py-2 px-3 shadow-sm">
          Thank you for recycling with TrashRoute 🌿<br />
          You're helping reduce landfill waste and support cleaner communities.
        </div>
      </div>
      {/* Animation keyframes and hover effects */}
      <style>{`
        .notif-popup-open {
          opacity: 1;
          transform: translateY(0) scale(1);
          animation: notif-slide-down 0.5s cubic-bezier(0.4,0,0.2,1);
          pointer-events: auto;
        }
        .notif-popup-closed {
          opacity: 0;
          transform: translateY(-24px) scale(0.97);
          pointer-events: none;
        }
        @keyframes notif-slide-down {
          0% { opacity: 0; transform: translateY(-32px) scale(0.97); }
          80% { opacity: 1; transform: translateY(6px) scale(1.04); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .notif-title-bounce {
          animation: notif-title-bounce 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes notif-title-bounce {
          0% { transform: scale(0.95); }
          60% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        .notif-icon-bounce {
          animation: notif-icon-bounce 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes notif-icon-bounce {
          0% { transform: scale(0.8) translateY(-10px); }
          60% { transform: scale(1.15) translateY(2px); }
          100% { transform: scale(1) translateY(0); }
        }
        .notif-btn-grow {
          transition: transform 0.18s cubic-bezier(0.4,0,0.2,1), box-shadow 0.18s;
        }
        .notif-btn-grow:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 24px 0 rgba(60,120,60,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.12);
        }
        .notif-icon-glow {
          transition: filter 0.18s, transform 0.18s;
        }
        .notif-icon-glow:hover {
          filter: drop-shadow(0 0 6px #3a5f46cc);
          transform: scale(1.12) translateY(-2px);
        }
        .animate-fade-slide {
          animation: fade-slide 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fade-slide {
          0% { opacity: 0; transform: translateY(-16px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .notif-glass-bg {
          background: linear-gradient(135deg, #e8f5e9 0%, #f7faf7 60%, #d0f5e0 100%) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1.5px solid #b2dfdb;
          box-shadow: 0 12px 40px 0 rgba(60, 120, 60, 0.22), 0 2px 8px 0 rgba(0,0,0,0.10), 0 0 0 2px #e0f2f1 inset;
          border-radius: 1rem !important;
        }
        @media (max-width: 640px) {
          .fixed.top-0.right-0 {
            width: 98vw !important;
            min-width: 0 !important;
            right: 0 !important;
            left: auto !important;
            border-radius: 1rem !important;
            padding: 1.2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
