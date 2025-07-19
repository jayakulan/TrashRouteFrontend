"use client"

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";
import CustomerNotification from "./CustomerNotification";

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
  const navigate = useNavigate();
  // Determine notification status and progress based on progressByType
  const currentStep = progressByType[selectedWaste];
  const isCompleted = currentStep === 3;
  // Map step to progress percent
  const progressPercents = [25, 50, 75, 100];
  const notification = {
    status: isCompleted ? "completed" : "on_the_way",
    progressPercent: progressPercents[currentStep],
    progressStep: currentStep + 1,
    progressTotal: 4,
    // You can add other notification fields as needed
    onFeedback: () => setShowFeedbackPopup(true),
  };
  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Accent bar at the very top */}
      <div className="absolute top-0 left-0 right-0 w-screen h-1 bg-[#26a360] rounded-t-2xl z-50"></div>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
        <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
          {/* Logo with animation */}
          <div className="flex items-center">
            <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
          </div>
 
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/customer/trash-type" className="text-gray-700 hover:text-gray-900 font-medium">Request Pickup</Link>
            <Link to="/customer/track-pickup" className="text-gray-700 hover:text-gray-900 font-medium">Track Pickup</Link>
            <Link to="/customer/history-log" className="text-gray-700 hover:text-gray-900 font-medium">History Log</Link>
            <CustomerNotification 
              onViewDetails={() => navigate('/customer/track-pickup')} 
              notification={notification}
            />

            <UserProfileDropdown />
            <button className="ml-2 relative group p-2 rounded-lg transition-all duration-300 hover:bg-[#3a5f46]/10">
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300"></div>
            </button>
          </div>
        </div>
      </nav>
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
          <FeedbackFormModal onClose={() => setShowFeedbackPopup(false)} />
        </div>
      )}
    </div>
  );
}

// FeedbackFormModal component
function FeedbackFormModal({ onClose }) {
  const [feedback, setFeedback] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

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
      {!submitted ? (
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
      ) : (
        <div>
          <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>🎉</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3a5f46', marginBottom: '0.5rem' }}>Thank you for your feedback!</div>
          <div style={{ fontSize: '1.1rem', color: '#333', marginBottom: '1.5rem' }}>
            We appreciate your input and will use it to improve our service.
          </div>
        </div>
      )}
    </div>
  );
}