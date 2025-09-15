import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Info, Calendar, Clock, Truck, Receipt, Link2, MapPin } from "lucide-react";
import { getCookie } from "../utils/cookieUtils";

const API_BASE = "http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend";

// Theme colors matching customer notifications
const THEME_GREEN = "#3a5f46";
const THEME_GREEN_DARK = "#2e4a36";
const LIGHT_GRAY = "#f7faf7";

function parseRouteIdFromMessage(message) {
  const match = message && message.match(/Route\s*#(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function parseWasteType(message) {
  const match = message && message.match(/for\s+([A-Za-z]+)/i);
  return match ? match[1] : null;
}

function parseCustomerCount(message) {
  const match = message && message.match(/Customers:\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

function parseTotalQty(message) {
  const match = message && message.match(/Total\s*Qty:\s*(\d+)\s*kg/i);
  return match ? parseInt(match[1], 10) : null;
}

const CompanyNotifications = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const companyIdCookie = getCookie("company_id");
  const userId = companyIdCookie ? parseInt(companyIdCookie, 10) : null; // company user_id == company_id
  const companyId = userId;

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

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/notifications.php?user_id=${userId}&limit=25`, {
        credentials: "include"
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load notifications");
      const notifications = data.data || [];
      setItems(notifications);
      setHasNew(notifications.some(n => (n.seen === 0 || String(n.seen) === '0')));
    } catch (err) {
      setError(err.message || "Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const markSeen = async (ids) => {
    if (!ids || ids.length === 0 || !userId) return;
    try {
      await fetch(`${API_BASE}/api/notifications.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark_seen", user_id: userId, notification_ids: ids })
      });
    } catch (_) {}
  };

  const handleGoToRoute = async (notif) => {
    const routeId = notif.request_id ? null : parseRouteIdFromMessage(notif.message);
    await markSeen([notif.notification_id]);
    navigate("/company/route-map", { state: { company_id: companyId, route_id: routeId } });
    setOpen(false);
  };

  // Animation classes
  const dropdownAnim = open
    ? "notif-popup-open"
    : "notif-popup-closed";

  // Responsive width
  const popupWidth = "w-[25rem] max-w-[95vw] sm:w-[28rem]";

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
        <div className="flex flex-col items-start mb-2">
          <span className="text-2xl font-extrabold notif-title-bounce" style={{ color: THEME_GREEN }}>Notifications</span>
        </div>
        
        {loading && <div className="text-sm text-gray-600">Loading notifications…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="text-sm text-gray-700">No notifications yet.</div>
        )}
        
        {!loading && !error && items.length > 0 && (
          <div className="flex flex-col gap-4">
            {items.map((n) => {
              const routeId = parseRouteIdFromMessage(n.message);
              const wasteType = parseWasteType(n.message);
              const customers = parseCustomerCount(n.message);
              const qty = parseTotalQty(n.message);
              const isUnread = n.seen === 0;
              
              // Check if this is a completion notification
              const isCompletionNotification = n.message && (
                n.message.includes('completed successfully') || 
                n.message.includes('Route completed') ||
                n.message.includes('All notifications have been dismissed') ||
                n.message.includes('has been completed')
              );
              
              // Determine progress based on notification type
              let step = 1;
              let progress = 25;
              if (routeId) {
                step = 3;
                progress = 75;
              }
              
              return (
                <div key={n.notification_id} className="bg-white/80 rounded-xl px-4 py-4 text-gray-800 shadow-sm border border-gray-100">
                  {/* For completion notifications, show only the message */}
                  {isCompletionNotification ? (
                    <div className="text-base text-gray-700">
                      {n.message || 'No message available'}
                    </div>
                  ) : (
                    <>
                      {/* Title */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-extrabold notif-title-bounce" style={{ color: THEME_GREEN }}>
                          {routeId ? 'New Route Activated' : 'Company Update'}
                        </span>
                        <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
                      </div>
                      
                      {/* Status line */}
                      <div className="flex items-center gap-2 mb-1">
                        <Info className="w-4 h-4 text-green-700" />
                        <span className="text-sm font-medium text-green-700">🟢 Status: Step {step} of 4</span>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                        <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: THEME_GREEN }}></div>
                      </div>
                  
                  {/* Info sections */}
                  <div className="flex flex-col gap-2 text-base">
                    {routeId && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600 notif-icon-glow" />
                        <span className="font-semibold">Route ID:</span>
                        <span className="text-gray-700 font-mono">#{routeId}</span>
                      </div>
                    )}
                    
                    {wasteType && (
                      <div className="flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-gray-600 notif-icon-glow" />
                        <span className="font-semibold">Waste Type:</span>
                        <span>{wasteType}</span>
                      </div>
                    )}
                    
                    {typeof customers === 'number' && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-yellow-600 notif-icon-glow" />
                        <span className="font-semibold">Customers:</span>
                        <span>{customers}</span>
                      </div>
                    )}
                    
                    {typeof qty === 'number' && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-600 notif-icon-glow" />
                        <span className="font-semibold">Total Quantity:</span>
                        <span>{qty} kg</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-500 notif-icon-glow" />
                      <span className="font-semibold">Created:</span>
                      <span>{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                      {/* Action button */}
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleGoToRoute(n)}
                          className="px-4 py-2 rounded-lg text-white text-sm bg-[#3a5f46] hover:bg-[#2e4d3a] shadow-sm transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0 notif-btn-grow"
                        >
                          Open Route Map
                        </button>
                        {isUnread && (
                          <span className="px-2 py-1 rounded-full bg-[#3a5f46] text-white text-xs">New</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {/* Mark all as read button */}
        {!loading && items.some(i => i.seen === 0) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              className="text-sm text-[#3a5f46] hover:underline notif-btn-grow"
              onClick={async () => {
                const unseenIds = items.filter(i => i.seen === 0).map(i => i.notification_id);
                await markSeen(unseenIds);
                setItems(prev => prev.map(i => ({ ...i, seen: 1 })));
                setHasNew(false);
              }}
            >
              Mark all as read
            </button>
          </div>
        )}
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
};

export default CompanyNotifications;


