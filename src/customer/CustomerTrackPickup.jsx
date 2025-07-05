"use client"

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell } from "lucide-react";
import UserProfileDropdown from "./UserProfileDropdown";

const wasteTypes = [
  { key: "plastics", label: "Plastics" },
  { key: "paper", label: "Paper" },
  { key: "glass", label: "Glass" },
  { key: "metal", label: "Metal" },
];

const steps = [
  { label: "Select Waste", icon: "♻️" },
  { label: "Set Quantity", icon: "⚖️" },
  { label: "Schedule Pickup", icon: "📅" },
  { label: "Confirm", icon: "✅" },
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

function VerticalStepper({ steps, currentStep }) {
  return (
    <div className="flex flex-col relative pl-8">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isCurrent = idx === currentStep;
        const isUpcoming = idx > currentStep;
        return (
          <div key={idx} className="flex items-start relative min-h-[64px]">
            {/* Vertical line */}
            {idx < steps.length - 1 && (
              <span className="absolute left-0 top-7 w-0.5 h-[48px] bg-gray-300" />
            )}
            {/* Icon */}
            <span className={`flex items-center justify-center w-7 h-7 rounded-full text-xl font-bold ${isCompleted ? "bg-blue-100 text-blue-600" : isCurrent ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"}`}>{step.icon}</span>
            <div className="ml-4 flex flex-col">
              <span className={`font-semibold text-base ${isCurrent ? "text-black" : "text-gray-800"}`}>{step.label}</span>
              <span className={`text-sm mt-1 ${isCompleted ? "text-blue-500" : isCurrent ? "text-blue-500" : "text-blue-400"}`}>{
                isCompleted ? "Completed" : isCurrent ? "In Progress" : "Upcoming"
              }</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
            <Link to="/customer/notification-log" className="text-gray-700 hover:text-gray-900 font-medium" aria-label="Notification Log"><Bell className="w-5 h-5" /></Link>
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
              className={`px-4 py-2 rounded-lg font-bold transition-colors duration-200 ${selectedWaste === wt.key ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setSelectedWaste(wt.key)}
            >
              {wt.label}
            </button>
          ))}
        </div>
        <div className="w-full max-w-xl bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold mb-6 text-center">{wasteTypes.find(wt => wt.key === selectedWaste).label} Pickup Route</h2>
          <VerticalStepper steps={steps} currentStep={progressByType[selectedWaste]} />
        </div>
      </main>
    </div>
  );
}