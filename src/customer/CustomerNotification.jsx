import { useState, useRef, useEffect } from "react";
import { Bell, Info, Calendar, Clock, Truck, Receipt, Link2, MapPin } from "lucide-react";
import { getCookie } from "../utils/cookieUtils";

// Default title fallback
const defaultTitle = "Notifications";

const THEME_GREEN = "#3a5f46";
const THEME_GREEN_DARK = "#2e4a36";
const LIGHT_GRAY = "#f7faf7";

// simple colors

export default function CustomerNotification({ userId, iconOnly = false }) {
  const [open, setOpen] = useState(false);
  const bellRef = useRef();
  const dropdownRef = useRef();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await fetch(`http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/notifications.php?user_id=${userId}&limit=25`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message || 'Failed to fetch');
        const data = json.data || [];
        setItems(data);
        setHasNew(data.some(n => (n.seen === 0 || String(n.seen) === '0')));

        // Fallback: if no notifications yet, synthesize from latest pickup requests
        if ((data || []).length === 0) {
          const token = getCookie('token');
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;
          const tr = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Customer/trackPickup.php', {
            method: 'GET',
            credentials: 'include',
            headers
          });
          if (tr.ok) {
            const trJson = await tr.json();
            if (trJson.success) {
              const reqs = trJson.data?.pickup_requests || [];
              const synthesized = reqs.slice(0, 5).map(r => ({
                notification_id: `syn-${r.request_id}`,
                message: `Pickup ${r.status || 'Request received'}`,
                created_at: r.timestamp,
                request_id: r.request_id,
                request_waste_type: r.waste_type,
                request_quantity: r.quantity,
                request_status: r.status,
                request_otp: r.otp,
                request_timestamp: r.timestamp,
                seen: 1
              }));
              if (synthesized.length > 0) setItems(synthesized);
            }
          }
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

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
  const progressWidth = `100%`;

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
        <div className="flex flex-col items-start mb-2">
          <span className="text-2xl font-extrabold notif-title-bounce" style={{ color: THEME_GREEN }}>{defaultTitle}</span>
        </div>
        {loading && <div className="text-sm text-gray-600">Loading notifications…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && !error && items.length === 0 && (
          <div className="text-sm text-gray-700">No notifications yet.</div>
        )}
        {!loading && !error && items.length > 0 && (
          <div className="flex flex-col gap-4">
            {items.map((n) => {
              // derive step and progress
              let step = 1;
              if (n.request_status === 'Completed') step = 4; else if (n.request_status === 'Accepted' && n.request_otp) step = 3; else if (n.request_status === 'Accepted') step = 2; else step = 1;
              const total = 4;
              const progress = [0,25,50,75,100][step] || 25;
              const msg = (n.message || defaultTitle).trim();
              const lowerMsg = msg.toLowerCase();
              const hasPickupScheduledPrefix = lowerMsg.startsWith('pickup scheduled:');
              const titleText = hasPickupScheduledPrefix ? 'Pickup scheduled:' : msg;
              // Parse details from message if backend fields missing
              let parsedDetails = '';
              if (hasPickupScheduledPrefix) {
                const afterColon = msg.substring(msg.indexOf(':') + 1).trim();
                // Extract until first period or end
                const firstSentence = afterColon.split('.')[0].trim();
                parsedDetails = firstSentence;
              }
              // Prefer explicit backend fields
              const detailsLine = n.request_waste_type
                ? `${n.request_waste_type}${(n.request_quantity || n.request_quantity === 0) ? ` (qty: ${n.request_quantity})` : ''}.`
                : (hasPickupScheduledPrefix ? `${parsedDetails}${parsedDetails.endsWith('.') ? '' : '.'}` : '');
              // Try to parse Request # from message if request_id absent
              let derivedRequestId = n.request_id;
              if (!derivedRequestId && /request\s*#(\d+)/i.test(msg)) {
                const m = msg.match(/request\s*#(\d+)/i);
                if (m) derivedRequestId = m[1];
              }
              return (
                <div key={n.notification_id} className="bg-white/80 rounded-xl px-4 py-4 text-gray-800 shadow-sm border border-gray-100">
                  {/* Title */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-extrabold notif-title-bounce" style={{ color: THEME_GREEN }}>{titleText}</span>
                  </div>
                  {hasPickupScheduledPrefix && detailsLine && (
                    <div className="-mt-1 mb-2 text-sm text-[#2e4d3a] font-medium">
                      {detailsLine}
                    </div>
                  )}
                  {/* Status line */}
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-green-700" />
                    <span className="text-sm font-medium text-green-700">🟢 Status: Step {step} of {total}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                    <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: THEME_GREEN }}></div>
                  </div>
                  {/* Info sections */}
                  <div className="flex flex-col gap-2 text-base">
                    {n.request_timestamp && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600 notif-icon-glow" />
                        <span className="font-semibold">Pickup Date:</span>
                        <span>{new Date(n.request_timestamp).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-600 notif-icon-glow" />
                      <span className="font-semibold">Time Window:</span>
                      <span>{n.created_at ? new Date(n.created_at).toLocaleString() : 'TBD'}</span>
                    </div>
                    {n.request_waste_type && (
                      <div className="flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-gray-600 notif-icon-glow" />
                        <span className="font-semibold">Waste Summary:</span>
                        <span>{n.request_waste_type}{n.request_quantity ? ` (${n.request_quantity}kg)` : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-gray-500 notif-icon-glow" />
                      <span className="font-semibold">Tracking ID:</span>
                      <span className="text-gray-700 font-mono">{derivedRequestId ? `#REQ-${derivedRequestId}` : `#N-${n.notification_id}`}</span>
                    </div>
                    {n.request_otp && (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-[#f3f8f5] border border-[#cfe0d6] text-[#2e4d3a] text-xs font-medium">OTP: {n.request_otp}</span>
                      </div>
                    )}
                  </div>
                  {/* Footer badges */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    {n.request_status ? <span className="px-2 py-0.5 rounded-full bg-[#eaf3ee] border border-[#cfe0d6] text-[#2e4d3a]">{n.request_status}</span> : null}
                    {n.seen ? null : <span className="px-2 py-0.5 rounded-full bg-[#3a5f46] text-white">New</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* End content */}
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