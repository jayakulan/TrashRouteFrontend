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
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Header Bar */}
      <header className="bg-white border-b">
        <nav className="container mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/images/logo.png" alt="Logo" className="h-16 w-34" />
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
            <Link to="/customer/trash-type" className="text-gray-700 hover:text-gray-900 font-medium">Request Pickup</Link>
            <Link to="/customer/track-pickup" className="text-gray-700 hover:text-gray-900 font-medium">Track Pickup</Link>
            <Link to="/customer/history-log" className="text-gray-700 hover:text-gray-900 font-medium">History Log</Link>
            <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
            <UserProfileDropdown />
          </div>
        </nav>
      </header>
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
    </div>
  );
}