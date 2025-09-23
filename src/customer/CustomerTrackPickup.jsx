"use client"

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";
import CustomerNotification from "./CustomerNotification";
import Footer from "../footer.jsx";
import CustomerHeader from "./CustomerHeader";
import { getCookie } from "../utils/cookieUtils";

const wasteTypes = [
  { key: "plastic", label: "Plastic" },
  { key: "paper", label: "Paper" },
  { key: "glass", label: "Glass" },
  { key: "metal", label: "Metal" },
];

const steps = [
  { label: "Request Received", icon: "/images/step1.png", desc: "We got your request and are setting things up." },
  { label: "Scheduled", icon: "/images/step2.png", desc: "Pickup is booked — you'll get the time and company details soon." },
  { label: "Ongoing", icon: "/images/step3.png", desc: "Pickup is in progress. Get your waste ready!" },
  { label: "Completed", icon: "/images/step4.png", desc: "Pickup done! Thanks for helping keep things green." },
];

const statusLabels = ["Completed", "Completed", "In Progress", "Upcoming"];
const statusColors = ["text-blue-500", "text-blue-500", "text-blue-500", "text-blue-400"];

function ZigzagTimeline({ steps, currentStep, isBlinking = false }) {
  return (
    <div className="relative flex flex-col items-center w-full max-w-xl mx-auto">
      {/* Center vertical line */}
      <div className="absolute left-1/2 top-0 h-full w-1 bg-gray-200 -translate-x-1/2 z-0" />
      <div className="flex flex-col gap-12 w-full z-10">
        {steps.map((step, idx) => {
          const isLeft = idx % 2 === 0;
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const shouldBlink = isBlinking && (idx === 1 || idx === 2); // Blink for Scheduled and Ongoing simultaneously
          
          // Animation classes
          const slideClass = isLeft ? `animate-slide-in-left` : `animate-slide-in-right`;
          const blinkClass = shouldBlink ? 'animate-pulse' : '';
          const delayStyle = { animationDelay: `${0.15 * idx}s` };
          
          return (
            <div key={idx} className={`relative flex w-full items-center justify-${isLeft ? "start" : "end"}`}> 
              {/* Step card */}
              <div
                className={`w-[80%] sm:w-[340px] rounded-xl shadow p-5 border flex flex-col items-${isLeft ? "end" : "start"} ${slideClass} ${isCurrent ? 'glow-current bg-[#e6f4ea] border-l-8 border-[#3a5f46] relative' : 'bg-white'} ${blinkClass}`}
                style={{
                  marginLeft: isLeft ? 0 : "auto",
                  marginRight: isLeft ? "auto" : 0,
                  ...delayStyle,
                }}
              >
                {isCurrent && (
                  <span className="absolute top-3 right-4 bg-[#3a5f46] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">Now</span>
                )}
                <div className="flex items-center mb-2">
                  <span className={`mr-3 flex items-center justify-center w-14 h-14 rounded-full bg-white p-1 ${isCurrent ? 'animate-pulse-current' : ''}`}>
                    <img src={step.icon} alt={step.label} className="w-14 h-14 object-contain rounded-full border-2 border-white" />
                  </span>
                  <span className={`font-bold text-lg text-gray-800`}>{step.label}</span>
                </div>
                <span className="text-gray-500 text-sm text-right w-full animate-fade-in" style={{ animationDelay: `${0.25 + 0.15 * idx}s` }}>{step.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CustomerTrackPickup() {
  const [selectedWaste, setSelectedWaste] = useState("plastic");
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch tracking data from backend
  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        setLoading(true);
        
        // Get the JWT token from cookies
        const token = getCookie('token');
        console.log('Token found:', !!token); // Debug log
        
        const headers = {
          'Content-Type': 'application/json',
        };
        
        // Add Authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          console.log('Authorization header added'); // Debug log
        } else {
          console.log('No token found, proceeding without Authorization header'); // Debug log
        }
        
        const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Customer/trackPickup.php', {
          method: 'GET',
          credentials: 'include',
          headers: headers,
        });

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          if (response.status === 401) {
            // Handle unauthorized - redirect to login
            console.log('Unauthorized access, redirecting to login');
            navigate('/login');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          console.log('Tracking data received:', result.data);
          setTrackingData(result.data);
          // Set the first available waste type as selected
          if (result.data.waste_types && Object.keys(result.data.waste_types).length > 0) {
            const firstWasteType = Object.keys(result.data.waste_types)[0];
            // Map the backend waste type to frontend key
            const frontendKey = wasteTypes.find(wt => wt.key.toLowerCase() === firstWasteType.toLowerCase())?.key || firstWasteType.toLowerCase();
            setSelectedWaste(frontendKey);
          }
        } else {
          throw new Error(result.error || 'Failed to fetch tracking data');
        }
      } catch (err) {
        console.error('Error fetching tracking data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [navigate]);

  // Get current step based on selected waste type and tracking data
  const getCurrentStep = () => {
    if (!trackingData || !trackingData.waste_types) {
      return 0;
    }
    
    // Handle case-insensitive waste type mapping
    const wasteTypeKey = Object.keys(trackingData.waste_types).find(
      key => key.toLowerCase() === selectedWaste.toLowerCase()
    );
    
    if (!wasteTypeKey) {
      return 0;
    }
    
    return trackingData.waste_types[wasteTypeKey].current_step || 0;
  };

  const currentStep = getCurrentStep();
  const isCompleted = currentStep === 3;
  
  // Get current waste data for blinking logic
  const wasteTypeKey = trackingData?.waste_types ? Object.keys(trackingData.waste_types).find(
    key => key.toLowerCase() === selectedWaste.toLowerCase()
  ) : null;
  const currentWasteData = wasteTypeKey ? trackingData.waste_types[wasteTypeKey] : null;
  
  // Blink both Scheduled and Ongoing steps when status is "Accepted"
  const isBlinking = currentWasteData?.status === 'Accepted';

  // Map step to progress percent
  const progressPercents = [25, 50, 75, 100];

  // Get notification content based on current step
  const getNotificationContent = () => {
    // Handle case-insensitive waste type mapping
    const wasteTypeKey = trackingData?.waste_types ? Object.keys(trackingData.waste_types).find(
      key => key.toLowerCase() === selectedWaste.toLowerCase()
    ) : null;
    
    const currentWasteData = wasteTypeKey ? trackingData.waste_types[wasteTypeKey] : null;
    
    // Calculate estimated arrival date (3 days from accepted date)
    const getEstimatedArrival = () => {
      if (currentWasteData?.timestamp && currentWasteData?.status === 'Accepted') {
        const acceptedDate = new Date(currentWasteData.timestamp);
        const estimatedDate = new Date(acceptedDate);
        estimatedDate.setDate(acceptedDate.getDate() + 3);
        return estimatedDate.toLocaleDateString();
      }
      return 'TBD';
    };
    
    const stepNotifications = [
      {
        icon: "📝",
        title: "Request Received",
        message: (
          <>
            Thank you! Your request has been successfully submitted.<br/>
            <b>Waste Type:</b> {currentWasteData?.waste_type || 'N/A'}<br/>
            <b>Quantity:</b> {currentWasteData?.quantity || 'N/A'} kg<br/>
            <b>Date:</b> {currentWasteData?.timestamp ? new Date(currentWasteData.timestamp).toLocaleDateString() : 'N/A'}<br/>
            We'll notify you once it's reviewed or accepted by a company.
          </>
        ),
        progress: 25,
        stepLabel: "Step 1 of 4 — Request Received",
        extra: null,
      },
      {
        icon: "📅",
        title: "Pickup Scheduled",
        message: (
          <>
            Your waste pickup has been scheduled.<br/>
            <b>Waste Type:</b> {currentWasteData?.waste_type || 'N/A'}<br/>
            <b>Quantity:</b> {currentWasteData?.quantity || 'N/A'} kg<br/>
            <b>Scheduled Date:</b> {currentWasteData?.timestamp ? new Date(currentWasteData.timestamp).toLocaleDateString() : 'TBD'}<br/>
            <b>Time Slot:</b> 4:00 PM - 6:00 PM<br/>
            <b>Company:</b> {currentWasteData?.company_name || 'TBD'}<br/>
            <b>Estimated Arrival:</b> {getEstimatedArrival()} (4:00 PM - 6:00 PM)<br/>
            Next Step: You'll be notified when the pickup is on the way.
          </>
        ),
        progress: 50,
        stepLabel: "Step 2 of 4 — Scheduled",
        extra: null,
      },
      {
        icon: "🚛",
        title: "Pickup In Progress",
        message: (
          <>
            Your pickup is now on the way!<br/>
            <b>Waste Type:</b> {currentWasteData?.waste_type || 'N/A'}<br/>
            <b>Quantity:</b> {currentWasteData?.quantity || 'N/A'} kg<br/>
            <b>OTP:</b> {currentWasteData?.otp || 'Not generated yet'}<br/>
            <b>Company:</b> {currentWasteData?.company_name || 'TBD'}<br/>
            <b>Live Location:</b> Tracking Enabled<br/>
            <b>Estimated Arrival:</b> {getEstimatedArrival()} (4:00 PM - 6:00 PM)
          </>
        ),
        progress: 75,
        stepLabel: "Step 3 of 4 — Ongoing",
        extra: null,
      },
      {
        icon: "✅",
        title: "Pickup Completed",
        message: (
          <>
            Your waste was successfully collected.<br/>
            <b>Waste Type:</b> {currentWasteData?.waste_type || 'N/A'}<br/>
            <b>Quantity:</b> {currentWasteData?.quantity || 'N/A'} kg<br/>
            <b>Collected By:</b> {currentWasteData?.company_name || 'TBD'}<br/>
            <b>Date & Time:</b> {currentWasteData?.timestamp ? new Date(currentWasteData.timestamp).toLocaleString() : 'TBD'}<br/>
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
              <button
                style={{
                  background: '#3a5f46',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(58, 95, 70, 0.10)',
                  transition: 'background 0.2s',
                }}
                onMouseDown={e => {
                  e.stopPropagation();
                  console.log("Give Feedback clicked");
                  setShowFeedbackPopup(true);
                }}
                onMouseOver={e => e.currentTarget.style.background = '#24402e'}
                onMouseOut={e => e.currentTarget.style.background = '#3a5f46'}
              >
                Give Feedback
              </button>
            </div>
          </>
        ),
        progress: 100,
        stepLabel: "Step 4 of 4 — Completed",
        extra: <span className="text-gray-500 text-sm">Thank you for using our service. You may now rate the experience.</span>,
      },
    ];

    return stepNotifications[currentStep] || stepNotifications[0];
  };

  const notification = getNotificationContent();

  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);

  // Group all pickup requests by waste type to support multiple submissions per type
  const groupedByWasteType = useMemo(() => {
    const map = {};
    const list = trackingData?.pickup_requests || [];
    for (const req of list) {
      const key = (req.waste_type || '').toLowerCase();
      if (!map[key]) map[key] = [];
      map[key].push(req);
    }
    // Ensure newest first per type
    Object.keys(map).forEach(k => {
      map[k].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });
    return map;
  }, [trackingData]);

  // Helper: compute current step for an individual request (mirror backend logic)
  const computeStepForRequest = (request) => {
    const status = request?.status;
    if (status === 'Completed') return 3;
    if (status === 'Accepted') {
      if (request?.otp && !request?.otp_verified) return 2;
      return 1;
    }
    // Default to Request received
    return 0;
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
        setShowNotificationDropdown(false);
      }
    }
    if (showNotificationDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotificationDropdown]);

  // Show red dot if step is completed
  const showRedDot = currentStep === 3;

  // Custom header with bell button and full nav links
  function CustomHeaderWithBell({ onBellClick, showDropdown, dropdownContent, bellRef, dropdownRef, showRedDot }) {
    return (
      <>
        {/* Accent bar at the very top */}
        <div className="absolute top-0 left-0 right-0 w-screen h-1 bg-[#26a360] rounded-t-2xl z-[10001]"></div>
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-[10000] shadow-xl transition-all duration-300 relative">
          <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
            {/* Logo with animation */}
            <div className="flex items-center">
              <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
            </div>
            {/* Navigation Links and Notification/Profile - unified for consistent spacing */}
            <div className="hidden md:flex items-center gap-x-8 text-gray-700 font-medium ml-auto relative">
              {/* Navigation Links */}
              <a href="/" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 nav-link-text"><span className="relative z-10">Home</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
              <a href="/customer/trash-type" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 nav-link-text"><span className="relative z-10">Request Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
              <a href="/customer/track-pickup" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 nav-link-text"><span className="relative z-10">Track Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
              <a href="/customer/history-log" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 nav-link-text"><span className="relative z-10">History Log</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
              {/* Notification and Profile */}
              <button ref={bellRef} className="relative focus:outline-none" aria-label="Notifications" onClick={onBellClick}>
                <Bell className="w-7 h-7 text-gray-700 hover:text-green-700 transition" />
                {showRedDot && !showDropdown && (
                  <span className="absolute top-0 right-0 block w-3 h-3 rounded-full bg-red-600 border-2 border-white animate-pulse" style={{transform: 'translate(40%, -40%)'}}></span>
                )}
              </button>
              {showDropdown && (
                <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-96 bg-white border border-green-200 rounded-xl shadow-xl p-6 z-50 animate-fade-slide" style={{minWidth:320}}>
                  {dropdownContent}
                </div>
              )}
              <UserProfileDropdown />
            </div>
            {/* Mobile menu button with animation */}
            <div className="md:hidden flex items-center">
              <button ref={bellRef} className="relative focus:outline-none" aria-label="Notifications" onClick={onBellClick}>
                <Bell className="w-7 h-7 text-gray-700 hover:text-green-700 transition" />
                {showRedDot && !showDropdown && (
                  <span className="absolute top-0 right-0 block w-3 h-3 rounded-full bg-red-600 border-2 border-white animate-pulse" style={{transform: 'translate(40%, -40%)'}}></span>
                )}
              </button>
              {showDropdown && (
                <div ref={dropdownRef} className="absolute right-0 top-full mt-2 w-80 bg-white border border-green-200 rounded-xl shadow-xl p-4 z-50 animate-fade-slide" style={{minWidth:260}}>
                  {dropdownContent}
                </div>
              )}
              <UserProfileDropdown />
              <button className="ml-2 relative group p-2 rounded-lg transition-all duration-300 hover:bg-[#3a5f46]/10">
                <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300"></div>
              </button>
            </div>
          </div>
        </nav>
      </>
    );
  }

  // Notification dropdown content
  const notificationDropdownContent = (
    <>
      <div className="flex items-center gap-3 mb-2">
        <span style={{fontSize: '2rem'}}>{notification.icon}</span>
        <span className="text-xl font-bold text-green-900">{notification.title}</span>
      </div>
      <div className="text-gray-700 text-base mb-3">{notification.message}</div>
      {(() => {
        const wKey = trackingData?.waste_types ? Object.keys(trackingData.waste_types).find(k => k.toLowerCase() === selectedWaste.toLowerCase()) : null;
        const data = wKey ? trackingData.waste_types[wKey] : null;
        const otpVal = data?.otp;
        return otpVal ? (
          <div className="mb-2">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold border border-[#cfe0d6] text-[#2e4d3a] bg-[#eaf3ee]">
              <span role="img" aria-label="otp">🔑</span>
              OTP: {otpVal}
            </span>
          </div>
        ) : null;
      })()}
      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 rounded-full" style={{ width: `${notification.progress}%`, background: '#3a5f46' }}></div>
        </div>
        <div className="text-sm text-green-900 font-medium mt-1">{notification.stepLabel}</div>
      </div>
      {notification.extra && (
        <div className="mt-2">{notification.extra}</div>
      )}
    </>
  );

  const [showThankYouPopup, setShowThankYouPopup] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
        <CustomHeaderWithBell
          onBellClick={() => setShowNotificationDropdown((v) => !v)}
          showDropdown={showNotificationDropdown}
          dropdownContent={notificationDropdownContent}
          bellRef={bellRef}
          dropdownRef={dropdownRef}
          showRedDot={showRedDot}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#3a5f46] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pickup tracking data...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
        <CustomHeaderWithBell
          onBellClick={() => setShowNotificationDropdown((v) => !v)}
          showDropdown={showNotificationDropdown}
          dropdownContent={notificationDropdownContent}
          bellRef={bellRef}
          dropdownRef={dropdownRef}
          showRedDot={showRedDot}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading tracking data: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#3a5f46] text-white px-4 py-2 rounded-lg hover:bg-[#2e4d3a] transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle no requests state
  if (!trackingData || !trackingData.has_requests || Object.keys(trackingData.waste_types || {}).length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
        <CustomHeaderWithBell
          onBellClick={() => setShowNotificationDropdown((v) => !v)}
          showDropdown={showNotificationDropdown}
          dropdownContent={notificationDropdownContent}
          bellRef={bellRef}
          dropdownRef={dropdownRef}
          showRedDot={showRedDot}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No pickup requests found.</p>
            <Link 
              to="/customer/trash-type" 
              className="bg-[#3a5f46] text-white px-4 py-2 rounded-lg hover:bg-[#2e4d3a] transition-colors"
            >
              Request Pickup
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Custom header with bell and dropdown */}
      <CustomHeaderWithBell
        onBellClick={() => setShowNotificationDropdown((v) => !v)}
        showDropdown={showNotificationDropdown}
        dropdownContent={notificationDropdownContent}
        bellRef={bellRef}
        dropdownRef={dropdownRef}
        showRedDot={showRedDot}
      />
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-10">
        <div className="flex gap-4 mb-8">
          {wasteTypes.map((wt) => {
            // Handle case-insensitive waste type mapping
            const wasteTypeKey = trackingData?.waste_types ? Object.keys(trackingData.waste_types).find(
              key => key.toLowerCase() === wt.key.toLowerCase()
            ) : null;
            
            const hasData = wasteTypeKey ? trackingData.waste_types[wasteTypeKey] : null;
            const isSelected = selectedWaste === wt.key;
            
            return (
              <button
                key={wt.key}
                className={`px-4 py-2 rounded-lg font-bold transition-colors duration-200 ${
                  isSelected 
                    ? 'bg-[#3a5f46] text-white' 
                    : hasData 
                      ? 'bg-[#e5e7eb] text-[#3a5f46] hover:bg-[#d1d5db]' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => hasData && !feedbackSubmitted && setSelectedWaste(wt.key)}
                disabled={!hasData || feedbackSubmitted}
              >
                {wt.label}
              </button>
            );
          })}
        </div>
        <div className="w-full max-w-2xl">
          <h2 className="text-lg font-bold mb-6 text-center">
            {wasteTypes.find(wt => wt.key === selectedWaste)?.label} Pickup Timeline
          </h2>
          {feedbackSubmitted ? (
            <div className="text-center text-[#2e4d3a]">
              Tracking is disabled after feedback submission. Thank you!
            </div>
          ) : (groupedByWasteType[selectedWaste]?.length === 0 ? (
            <div className="text-center text-gray-600">No submissions for this waste type yet.</div>
          ) : (
            // Show only the most recent pickup request for this waste type
            (() => {
              const mostRecentRequest = groupedByWasteType[selectedWaste]?.[0]; // First item is already sorted by newest
              if (!mostRecentRequest) return null;
              
              const reqStep = computeStepForRequest(mostRecentRequest);
              const reqBlink = (reqStep === 1 || reqStep === 2) && (mostRecentRequest?.status === 'Accepted');
              
              return (
                <div key={mostRecentRequest.request_id} className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm flex items-center gap-2">
                      <span className="inline-flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-white text-xs font-semibold" style={{background:'#3a5f46'}}>Current</span>
                        <span className="px-2 py-0.5 rounded-full text-[#2e4d3a] text-xs font-semibold border border-[#cfe0d6] bg-[#eaf3ee]">Latest Request</span>
                      </span>
                      {typeof mostRecentRequest?.quantity !== 'undefined' && mostRecentRequest?.quantity !== null && (
                        <span className="px-2 py-0.5 rounded-full text-[#2e4d3a] text-xs font-semibold border border-[#cfe0d6] bg-[#f3f8f5]">{mostRecentRequest.quantity}kg</span>
                      )}
                    </div>
                    <div className="text-sm">
                      {mostRecentRequest.timestamp && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border border-[#cfe0d6] text-[#2e4d3a] bg-[#f3f8f5]">
                          <span role="img" aria-label="time">🕒</span>
                          {new Date(mostRecentRequest.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <ZigzagTimeline
                    steps={steps}
                    currentStep={reqStep}
                    isBlinking={reqBlink}
                  />
                </div>
              );
            })()
          ))}
        </div>
      </main>
      {/* Feedback Popup Modal */}
      {showFeedbackPopup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <FeedbackFormModal 
            onClose={() => setShowFeedbackPopup(false)} 
            onThankYou={() => { setShowFeedbackPopup(false); setShowThankYouPopup(true); setFeedbackSubmitted(true); }}
            requestId={(() => {
              // Handle case-insensitive waste type mapping
              const wasteTypeKey = trackingData?.waste_types ? Object.keys(trackingData.waste_types).find(
                key => key.toLowerCase() === selectedWaste.toLowerCase()
              ) : null;
              return wasteTypeKey ? trackingData.waste_types[wasteTypeKey]?.request_id : null;
            })()}
          />
        </div>
      )}
      {/* Thank You Popup Modal */}
      {showThankYouPopup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
         // background: 'rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
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
              onClick={() => setShowThankYouPopup(false)}
              aria-label="Close thank you message"
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
            <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🎉</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3a5f46', marginBottom: '0.5rem' }}>Thank you for your feedback!</div>
            <div style={{ fontSize: '1.1rem', color: '#333', marginBottom: '1.5rem' }}>
              We appreciate your input and will use it to improve our service.
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

// FeedbackFormModal component
function FeedbackFormModal({ onClose, onThankYou, requestId }) {
  const [feedback, setFeedback] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

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