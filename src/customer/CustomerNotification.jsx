import { useState, useRef, useEffect } from "react";
import { Bell, Info, Calendar, Clock, Truck, Receipt, Link2, MapPin } from "lucide-react";
import { getCookie } from "../utils/cookieUtils";

// Default title fallback
const defaultTitle = "Notifications";

const THEME_GREEN = "#3a5f46";
const THEME_GREEN_DARK = "#2e4a36";
const LIGHT_GRAY = "#f7faf7";

// simple colors

export default function CustomerNotification({ userId, iconOnly = false, refreshTrigger }) {
  const [open, setOpen] = useState(false);
  const bellRef = useRef();
  const dropdownRef = useRef();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [hasNew, setHasNew] = useState(false);
  const [error, setError] = useState(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const fetchData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/notifications.php?user_id=${userId}&limit=25`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      // Get response text first
      const text = await res.text();
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      if (!text) {
        throw new Error('Empty response from server');
      }
      
      let json;
      try {
        json = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', text);
        throw new Error('Invalid JSON response from server');
      }
      
      if (!json.success) throw new Error(json.message || 'Failed to fetch');
      const data = json.data || [];
      setItems(data);
      setHasNew(data.some(n => (n.seen === 0 || String(n.seen) === '0')));
    } catch (e) {
      console.error('Notification fetch error:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, refreshTrigger]);

  // Listen for custom refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchData();
    };

    window.addEventListener('refreshNotifications', handleRefresh);
    return () => {
      window.removeEventListener('refreshNotifications', handleRefresh);
    };
  }, [userId]);

  const dismissNotification = async (notificationId) => {
    if (!notificationId || !userId) return;
    try {
      const response = await fetch(`http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/notifications.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dismiss", user_id: userId, notification_id: notificationId })
      });
      
      if (response.ok) {
        // Remove the notification from the local state
        setItems(prev => prev.filter(item => item.notification_id !== notificationId));
        // Update hasNew state
        setHasNew(items.some(n => n.seen === 0 && n.notification_id !== notificationId));
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const cancelRequest = async (requestId) => {
    if (!requestId || !userId) return;
    
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to cancel this pickup request? This action cannot be undone.')) {
      return;
    }

    try {
      const token = getCookie('token');
      const headers = { "Content-Type": "application/json" };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Customer/cancelRequest.php`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ request_id: requestId }),
        credentials: "include"
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Show success message
        alert('Request cancelled successfully!');
        
        // Remove notifications related to this request
        setItems(prev => prev.filter(item => (item.display_request_id || item.request_id) !== requestId));
        
        // Update hasNew state
        setHasNew(items.some(n => n.seen === 0 && (n.display_request_id || n.request_id) !== requestId));
        
        // Trigger refresh for other components
        window.dispatchEvent(new CustomEvent('refreshNotifications'));
        window.dispatchEvent(new CustomEvent('refreshTrackingData'));
      } else {
        alert(result.message || 'Failed to cancel request');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Error cancelling request. Please try again.');
    }
  };

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
    <>
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
              const msg = (n.message || defaultTitle).trim();
              const lowerMsg = msg.toLowerCase();
              const hasPickupScheduledPrefix = lowerMsg.startsWith('pickup scheduled:');
              
              // Transform the message for display - remove request ID and add "company" prefix
              const transformMessage = (message) => {
                // Check if it's an "accepted by" message
                const acceptedPattern = /Your pickup request #\d+ has been accepted by (.+)\./;
                const match = message.match(acceptedPattern);
                if (match) {
                  const companyName = match[1];
                  return `Your request accepted by ${companyName}`;
                }
                // For old notifications, show simple "Pickup request received"
                return "Pickup request received";
              };
              
              
              // Determine the title text and status based on notification type
              let titleText;
              let displayStatus;
              let progressPercent;
              
              if (hasPickupScheduledPrefix) {
                // For old notifications that start with "Pickup scheduled:", show "Pickup request received"
                titleText = "Pickup request received";
                displayStatus = "Pickup Scheduled";
                progressPercent = 25;
              } else if (msg.includes('accepted by')) {
                // For any accepted message - prioritize this check
                titleText = transformMessage(msg);
                displayStatus = "Accepted";
                progressPercent = 50;
              } else if (msg.includes('marked as completed')) {
                // For completion notifications - prioritize this check
                titleText = "Pickup completed successfully";
                displayStatus = "Completed";
                progressPercent = 100;
              } else if (msg.includes('has been completed')) {
                // For completion notifications with different pattern
                titleText = "Pickup completed successfully";
                displayStatus = "Completed";
                progressPercent = 100;
              } else if (n.request_status === 'Accepted') {
                // For accepted requests, show the transformed message
                titleText = transformMessage(msg);
                displayStatus = "Accepted";
                progressPercent = 50;
              } else if (n.request_status === 'Completed') {
                // For completed requests - distinguish between old and new notifications
                const originalTitle = transformMessage(msg);
                if (originalTitle === "Pickup request received") {
                  // Keep original title and status for old notifications
                  titleText = "Pickup request received";
                  displayStatus = "Request received";
                  progressPercent = 25;
                } else {
                  // Use completion title and status for new notifications
                  titleText = "Pickup completed successfully";
                  displayStatus = "Completed";
                  progressPercent = 100;
                }
              } else if (msg.includes('OTPs generated') || msg.includes('Pickup schedule confirmed')) {
                // For OTP/schedule confirmation
                titleText = "Pickup schedule confirmed";
                displayStatus = "Pickup Scheduled";
                progressPercent = 25;
              } else {
                // Default fallback
                titleText = "Pickup request received";
                displayStatus = "Pickup Scheduled";
                progressPercent = 25;
              }
              // Parse details from message if backend fields missing
              let parsedDetails = '';
              if (hasPickupScheduledPrefix) {
                const afterColon = msg.substring(msg.indexOf(':') + 1).trim();
                // Extract until first period or end
                const firstSentence = afterColon.split('.')[0].trim();
                parsedDetails = firstSentence;
              }
              // Remove waste type and quantity details from the message
              const detailsLine = '';
              // Try to parse Request # from message if request_id absent
              let derivedRequestId = n.display_request_id || n.request_id;
              if (!derivedRequestId && /request\s*#(\d+)/i.test(msg)) {
                const m = msg.match(/request\s*#(\d+)/i);
                if (m) derivedRequestId = m[1];
              }
              
              // Additional fallback: try to extract from message content
              if (!derivedRequestId && /#(\d+)/i.test(msg)) {
                const m = msg.match(/#(\d+)/i);
                if (m) derivedRequestId = m[1];
              }
              
              // Debug: Log notification data
              console.log('Notification data:', {
                notification_id: n.notification_id,
                request_id: n.request_id,
                display_request_id: n.display_request_id,
                derivedRequestId: derivedRequestId,
                message: msg
              });
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
                    <span className="text-sm font-medium text-green-700">🟢 Status: {displayStatus}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full mb-2">
                    <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%`, background: THEME_GREEN }}></div>
                  </div>
                  {/* Info sections */}
                  <div className="flex flex-col gap-2 text-base">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600 notif-icon-glow" />
                      <span className="font-semibold">Date:</span>
                      <span>{n.created_at ? new Date(n.created_at).toLocaleDateString() : 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-600 notif-icon-glow" />
                      <span className="font-semibold">Time:</span>
                      <span>{n.created_at ? new Date(n.created_at).toLocaleTimeString() : 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link2 className="w-5 h-5 text-gray-500 notif-icon-glow" />
                      <span className="font-semibold">Request ID:</span>
                      <span className="text-gray-700 font-mono">#req-{derivedRequestId || 'N/A'}</span>
                    </div>
                    {n.request_waste_type && (
                      <div className="flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-gray-600 notif-icon-glow" />
                        <span className="font-semibold">Waste Type:</span>
                        <span>{n.request_waste_type}</span>
                      </div>
                    )}
                    {n.request_quantity && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-purple-600 notif-icon-glow" />
                        <span className="font-semibold">Quantity:</span>
                        <span>{n.request_quantity} kg</span>
                      </div>
                    )}
                  </div>
                  {/* Footer badges */}
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
                    <div className="flex flex-wrap items-center gap-2">
                      {displayStatus && <span className="px-2 py-0.5 rounded-full bg-[#eaf3ee] border border-[#cfe0d6] text-[#2e4d3a]">{displayStatus}</span>}
                      {n.request_otp && <span className="px-2 py-0.5 rounded-full bg-[#f3f8f5] border border-[#cfe0d6] text-[#2e4d3a] font-medium">OTP: {n.request_otp}</span>}
                      {n.seen ? null : <span className="px-2 py-0.5 rounded-full bg-[#3a5f46] text-white">New</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Give Feedback button for completed notifications */}
                      {displayStatus === 'Completed' && (
                        <button
                          onClick={() => {
                            setSelectedRequestId(derivedRequestId);
                            setShowFeedbackPopup(true);
                          }}
                          className="px-3 py-1 rounded-full bg-[#3a5f46] hover:bg-[#2e4d3a] text-white text-xs transition-colors duration-200"
                          title="Give Feedback"
                        >
                          Give Feedback
                        </button>
                      )}
                      {/* Cancel Request button only for Request received and Pickup Scheduled status */}
                      {(displayStatus === 'Request received' || displayStatus === 'Pickup Scheduled') && (
                        <button
                          onClick={() => cancelRequest(derivedRequestId)}
                          className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs transition-colors duration-200"
                          title="Cancel Request"
                        >
                          Cancel Request
                        </button>
                      )}
                      <button
                        onClick={() => dismissNotification(n.notification_id)}
                        className="px-2 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors duration-200 text-xs"
                        title="Dismiss notification"
                      >
                        ✕
                      </button>
                    </div>
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
    
    {/* Feedback Popup Modal - rendered outside dropdown container */}
    {showFeedbackPopup && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10000,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <FeedbackFormModal 
          onClose={() => setShowFeedbackPopup(false)} 
          onThankYou={() => setShowFeedbackPopup(false)}
          requestId={selectedRequestId}
        />
      </div>
    )}
    </>
  );
}

// FeedbackFormModal component (from CustomerTrackPickup.jsx)
function FeedbackFormModal({ onClose, onThankYou, requestId }) {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get the JWT token from cookies
      const token = getCookie('token');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Customer/submitFeedback.php', {
        method: 'POST',
        credentials: 'include',
        headers: headers,
        body: JSON.stringify({
          request_id: requestId,
          rating: rating,
          comment: feedback
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Handle unauthorized - redirect to login
          console.log('Unauthorized access, redirecting to login');
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setSubmitted(true);
        setTimeout(() => {
          if (onThankYou) onThankYou();
        }, 500);
      } else {
        throw new Error(result.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return null;

  return (
    <div style={{
      background: '#fff',
      borderRadius: '1.5rem',
      boxShadow: '0 8px 40px 0 rgba(58, 95, 70, 0.25)',
      padding: '2.5rem 2.5rem 2rem 2.5rem',
      minWidth: 340,
      maxWidth: '90vw',
      textAlign: 'center',
      position: 'relative',
    }}>
      <button
        onClick={onClose}
        aria-label="Close feedback form"
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'transparent',
          border: 'none',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        <img src="/images/close.png" alt="Close" style={{ width: 24, height: 24, display: 'block' }} />
      </button>
        <form onSubmit={handleSubmit}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3a5f46', marginBottom: '1.2rem' }}>Feedback</div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="feedback-text" style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Your Feedback</label>
            <textarea
              id="feedback-text"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={4}
              style={{ width: '100%', borderRadius: 8, border: '1px solid #ccc', padding: 10, resize: 'vertical' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1.2rem' }}>
            <label htmlFor="feedback-rating" style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Rating</label>
            <select
              id="feedback-rating"
              value={rating}
              onChange={e => setRating(Number(e.target.value))}
              style={{ width: '100%', borderRadius: 8, border: '1px solid #ccc', padding: 8 }}
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Good</option>
              <option value={3}>3 - Average</option>
              <option value={2}>2 - Poor</option>
              <option value={1}>1 - Very Poor</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#ccc' : '#5E856D',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 2.2rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 10,
              boxShadow: '0 2px 8px 0 rgba(58, 95, 70, 0.18)',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => !loading && (e.currentTarget.style.background = '#466a54')}
            onMouseOut={e => !loading && (e.currentTarget.style.background = '#5E856D')}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
    </div>
  );
}