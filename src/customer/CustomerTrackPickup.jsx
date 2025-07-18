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
      {/* Accent bar at the very top */}
      <div className="absolute top-0 left-0 right-0 w-screen h-1 bg-[#26a360] rounded-t-2xl z-50"></div>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
        <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
          {/* Logo with animation */}
          <div className="flex items-center">
            <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
          </div>
          {/* Navigation Links with enhanced animations */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a href="/" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Home</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/trash-type" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Request Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/track-pickup" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Track Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/history-log" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">History Log</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
          </div>
          {/* Notification and Profile */}
          <div className="hidden md:flex items-center space-x-4 ml-4">
            <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
            <UserProfileDropdown />
          </div>
          {/* Mobile menu button with animation */}
          <div className="md:hidden flex items-center">
            <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
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
    </div>
  );
}