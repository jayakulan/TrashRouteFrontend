import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../utils/cookieUtils";

const API_BASE = "http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend";

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
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const companyIdCookie = getCookie("company_id");
  const userId = companyIdCookie ? parseInt(companyIdCookie, 10) : null; // company user_id == company_id
  const companyId = userId;

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const fetchNotifications = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/notifications.php?user_id=${userId}&limit=20`, {
        credentials: "include"
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to load notifications");
      setItems(data.data || []);
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

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative focus:outline-none"
        aria-label="Notifications"
        title="Notifications"
      >
        <svg className="w-6 h-6 text-gray-700 hover:text-gray-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {items.some(n => n.seen === 0) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{items.filter(n=>n.seen===0).length}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-[22rem] bg-white border rounded-lg shadow-xl z-50 animate-dropdown">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="font-semibold">Notifications</div>
            <button
              className="text-sm text-[#3a5f46] hover:underline"
              onClick={() => {
                setOpen(false);
              }}
            >
              Close
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <div className="p-4 text-sm text-gray-600">Loading...</div>
            )}
            {error && !loading && (
              <div className="p-4 text-sm text-red-600">{error}</div>
            )}
            {!loading && !error && items.length === 0 && (
              <div className="p-4 text-sm text-gray-600">No notifications.</div>
            )}
            {!loading && !error && items.map((n) => {
              const routeId = parseRouteIdFromMessage(n.message);
              const wasteType = parseWasteType(n.message);
              const customers = parseCustomerCount(n.message);
              const qty = parseTotalQty(n.message);
              const isUnread = n.seen === 0;
              return (
                <div key={n.notification_id} className={`px-4 py-4 border-b last:border-b-0 ${isUnread ? 'bg-[#f7faf9]' : 'bg-white'} relative`}> 
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${isUnread ? 'bg-[#3a5f46] animate-pulse' : 'bg-gray-300'}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-sm text-gray-900">{routeId ? 'New Route Activated' : 'Notification'}</div>
                        <div className="text-[10px] text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
                      </div>
                      {routeId ? (
                        <div className="mt-1 text-xs text-gray-600">
                          <span className="inline-flex items-center gap-1 mr-3">
                            <span className="w-2 h-2 bg-[#3a5f46] inline-block rounded-full"></span>
                            Route #{routeId}
                          </span>
                          {wasteType && (
                            <span className="inline-flex items-center gap-1 mr-3">
                              <span className="w-2 h-2 bg-blue-500 inline-block rounded-full"></span>
                              Waste: {wasteType}
                            </span>
                          )}
                          {typeof customers === 'number' && (
                            <span className="inline-flex items-center gap-1 mr-3">
                              <span className="w-2 h-2 bg-amber-500 inline-block rounded-full"></span>
                              Customers: {customers}
                            </span>
                          )}
                          {typeof qty === 'number' && (
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2 h-2 bg-purple-500 inline-block rounded-full"></span>
                              Qty: {qty} kg
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="mt-1 text-xs text-gray-600">You have a new update.</div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleGoToRoute(n)}
                          className="px-3 py-1.5 rounded text-white text-xs bg-[#3a5f46] hover:bg-[#2e4d3a] shadow-sm transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Open Route Map
                        </button>
                        {routeId && (
                          <span className="text-[11px] text-gray-500 self-center">Route ID: {routeId}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {!loading && items.some(i => i.seen === 0) && (
            <div className="px-4 py-2 border-t">
              <button
                className="text-xs text-[#3a5f46] hover:underline"
                onClick={async () => {
                  const unseenIds = items.filter(i => i.seen === 0).map(i => i.notification_id);
                  await markSeen(unseenIds);
                  setItems(prev => prev.map(i => ({ ...i, seen: 1 })));
                }}
              >
                Mark all as read
              </button>
            </div>
          )}
          <style>{`
            @keyframes dropdownIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
            .animate-dropdown { animation: dropdownIn 160ms ease-out; }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default CompanyNotifications;


