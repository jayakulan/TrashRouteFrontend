"use client"

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";
import CustomerNotification from "./CustomerNotification";
import Footer from "../footer.jsx";
import CustomerHeader from "./CustomerHeader";

const wasteTypes = [
  { key: "plastics", label: "Plastics" },
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

// Simulate progress for each waste type
const progressByType = {
  plastics: 2, // 0-based index: 0=first step, 1=second, etc.
  paper: 1,
  glass: 3,
  metal: 0,
};

function ZigzagTimeline({ steps, currentStep }) {
  return (
    <div className="relative flex flex-col items-center w-full max-w-xl mx-auto">
      {/* Center vertical line */}
      <div className="absolute left-1/2 top-0 h-full w-1 bg-gray-200 -translate-x-1/2 z-0" />
      <div className="flex flex-col gap-12 w-full z-10">
        {steps.map((step, idx) => {
          const isLeft = idx % 2 === 0;
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          // Animation classes
          const slideClass = isLeft ? `animate-slide-in-left` : `animate-slide-in-right`;
          const delayStyle = { animationDelay: `${0.15 * idx}s` };
          return (
            <div key={idx} className={`relative flex w-full items-center justify-${isLeft ? "start" : "end"}`}> 
              {/* Step card */}
              <div
                className={`w-[80%] sm:w-[340px] rounded-xl shadow p-5 border flex flex-col items-${isLeft ? "end" : "start"} ${slideClass} ${isCurrent ? 'glow-current bg-[#e6f4ea] border-l-8 border-[#3a5f46] relative' : 'bg-white'}`}
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

// Animations (add to global CSS if not present)
// .animate-slide-in-left { animation: slide-in-left 0.7s cubic-bezier(.68,-0.55,.27,1.55); }
// .animate-slide-in-right { animation: slide-in-right 0.7s cubic-bezier(.68,-0.55,.27,1.55); }
// @keyframes slide-in-left { 0% { opacity: 0; transform: translateX(-40px); } 100% { opacity: 1; transform: translateX(0); } }
// @keyframes slide-in-right { 0% { opacity: 0; transform: translateX(40px); } 100% { opacity: 1; transform: translateX(0); } }

export default function CustomerTrackPickup() {
  const [selectedWaste, setSelectedWaste] = useState("plastics");
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const navigate = useNavigate();
  // Determine notification status and progress based on progressByType
  const currentStep = progressByType[selectedWaste];
  const isCompleted = currentStep === 3;
  // Map step to progress percent
  const progressPercents = [25, 50, 75, 100];

  // Notification content for each step
  const stepNotifications = [
    {
      icon: "📝",
      title: "Request Received",
      message: (
        <>
          Thank you! Your request has been successfully submitted.<br/>
          We’ll notify you once it’s reviewed or accepted by a company.
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
          <b>Pickup Date:</b> [Date]<br/>
          <b>Time Slot:</b> [Time Range]<br/>
          <b>Company:</b> [Company Name]<br/>
          Next Step: You’ll be notified when the pickup is on the way.
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
          <b>Company Agent:</b> [Agent Name]<br/>
          <b>Live Location:</b> [Map or "Tracking Enabled"]<br/>
          <b>Estimated Arrival:</b> [Time]
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
          <b>Collected By:</b> [Company Name / Agent Name]<br/>
          <b>Date & Time:</b> [Completion Date & Time]<br/>
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
  const notification = stepNotifications[currentStep];

  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const bellRef = useRef(null);
  const dropdownRef = useRef(null);

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

  // Remove feedback check: always show red dot if step is completed
  const showRedDot = currentStep === 3;

  // Custom header with bell button and full nav links
  function CustomHeaderWithBell({ onBellClick, showDropdown, dropdownContent, bellRef, dropdownRef, showRedDot }) {
    return (
      <>
        {/* Accent bar at the very top */}
        <div className="absolute top-0 left-0 right-0 w-screen h-1 bg-[#26a360] rounded-t-2xl z-50"></div>
        <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
          <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
            {/* Logo with animation */}
            <div className="flex items-center">
              <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
            </div>
            {/* Navigation Links and Notification/Profile - unified for consistent spacing */}
            <div className="hidden md:flex items-center gap-x-8 text-gray-700 font-medium ml-auto relative">
              {/* Navigation Links */}
              <a href="/" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Home</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
              <a href="/customer/trash-type" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Request Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
              <a href="/customer/track-pickup" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Track Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
              <a href="/customer/history-log" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">History Log</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
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
          {wasteTypes.map((wt) => (
            <button
              key={wt.key}
              className={`px-4 py-2 rounded-lg font-bold transition-colors duration-200 ${selectedWaste === wt.key ? 'bg-[#3a5f46] text-white' : 'bg-[#e5e7eb] text-[#3a5f46]'}`}
              onClick={() => setSelectedWaste(wt.key)}
            >
              {wt.label}
            </button>
          ))}
        </div>
        <div className="w-full max-w-2xl">
          <h2 className="text-lg font-bold mb-6 text-center">{wasteTypes.find(wt => wt.key === selectedWaste).label} Pickup Timeline</h2>
          <ZigzagTimeline steps={steps} currentStep={progressByType[selectedWaste]} />
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
          <FeedbackFormModal onClose={() => setShowFeedbackPopup(false)} onThankYou={() => { setShowFeedbackPopup(false); setShowThankYouPopup(true); }} />
        </div>
      )}
      {/* Thank You Popup Modal */}
      {showThankYouPopup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1100,
          background: 'rgba(0,0,0,0.55)',
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
function FeedbackFormModal({ onClose, onThankYou }) {
  const [feedback, setFeedback] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send feedback to backend here if needed
    setSubmitted(true);
    setTimeout(() => {
      if (onThankYou) onThankYou();
    }, 500);
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
            style={{
              background: '#5E856D',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.1rem',
              border: 'none',
              borderRadius: 8,
              padding: '0.7rem 2.2rem',
              cursor: 'pointer',
              marginTop: 10,
              boxShadow: '0 2px 8px 0 rgba(58, 95, 70, 0.18)',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#466a54'}
            onMouseOut={e => e.currentTarget.style.background = '#5E856D'}
          >
            Submit Feedback
          </button>
        </form>
    </div>
  );
}