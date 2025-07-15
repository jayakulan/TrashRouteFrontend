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

export default function CustomerNotification({ hasNew = true, onViewDetails, notification = defaultNotification }) {
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
        {hasNew && (
          <span className="absolute top-0 right-0 block w-3 h-3 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
        )}
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
        {/* Greeting/Title */}
        <div className="flex flex-col items-start mb-2">
          <span className="text-lg font-semibold text-gray-700 mb-1">{notification.greeting}</span>
          <span className="text-2xl font-extrabold notif-title-bounce" style={{ color: THEME_GREEN }}>{notification.title}</span>
        </div>
        {/* Progress Bar or Badge */}
        <div className="flex items-center gap-2 mb-1">
          <Info className="w-4 h-4 text-green-700" />
          <span className="text-sm font-medium text-green-700">
            🟢 Status: Step {notification.progressStep} of {notification.progressTotal} — Scheduled
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: progressWidth, background: THEME_GREEN }}
          ></div>
        </div>
        {/* Info Sections */}
        <div className="flex flex-col gap-2 text-base">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 notif-icon-glow" />
            <span className="font-semibold">Pickup Date:</span>
            <span>{notification.pickupDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600 notif-icon-glow" />
            <span className="font-semibold">Time Window:</span>
            <span>{notification.pickupTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-green-700 notif-icon-bounce notif-icon-glow" />
            <span className="font-semibold">Company:</span>
            <span>{notification.company}</span>
          </div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gray-600 notif-icon-glow" />
            <span className="font-semibold">Waste Summary:</span>
            <span>{notification.wasteSummary}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-700 notif-icon-bounce notif-icon-glow" />
            <span className="font-semibold">Location:</span>
            <span className="truncate max-w-[10rem]" title={notification.location}>{notification.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-gray-500 notif-icon-glow" />
            <span className="font-semibold">Tracking ID:</span>
            <span className="text-gray-700 font-mono">{notification.trackingId}</span>
          </div>
        </div>
        {/* Status line (optional) */}
        {notification.statusText && (
          <div className="flex items-center mb-1 mt-2">
            <Truck className="w-5 h-5 mr-2 text-green-700 notif-icon-bounce" />
            <span className={`ml-2 text-base font-semibold`} style={{ color: THEME_GREEN }}>{notification.statusText}</span>
          </div>
        )}
        {/* Assistant message */}
        <div className="bg-white/80 rounded-lg px-4 py-3 text-gray-700 text-[1rem] shadow-sm border border-gray-100">
          <span className="font-medium text-green-700">Smart Assistant:</span> {notification.assistantMsg}
        </div>
        {/* Call-to-Action Button with Tooltip */}
        <div className="relative w-full flex flex-col items-center">
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
        </div>
        {notification.status === "completed" && (
          <div className="w-full flex justify-center mt-3">
            <button
              className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-lg shadow transition-all duration-200"
              onClick={notification.onFeedback || (() => alert('Feedback clicked!'))}
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
