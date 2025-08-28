import { Link, useNavigate, useLocation } from "react-router-dom";
import CustomerNotification from "./CustomerNotification";
import UserProfileDropdown from "./UserProfileDropdown";

const CustomerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
          <div className="hidden md:flex items-center gap-x-8 text-gray-700 font-medium ml-auto">
            {/* Navigation Links */}
            <a href="/" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Home</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/trash-type" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Request Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/track-pickup" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">Track Pickup</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            <a href="/customer/history-log" className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"><span className="relative z-10">History Log</span><div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div><div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div></a>
            {/* Notification and Profile */}
            {location.pathname.includes('/history-log') ? (
              <CustomerNotification 
                mode="history"
                wasteTypes={[
                  { type: "Plastics", status: "Completed" },
                  { type: "Paper", status: "Scheduled" },
                  { type: "Glass", status: "Missed" },
                  { type: "Metal", status: "Completed" }
                ]}
                onGoNow={() => navigate('/customer/track-pickup')}
              />
            ) : location.pathname.includes('/request-pickup') || location.pathname.includes('/trash-type') || location.pathname.includes('/pin-location') || location.pathname.includes('/pickup-summary') ? (
              <CustomerNotification 
                mode="request"
                wasteTypes={[
                  { type: "Plastics", status: "Pending" },
                  { type: "Paper", status: "Pending" },
                  { type: "Glass", status: "Pending" },
                  { type: "Metal", status: "Pending" }
                ]}
                onGoNow={() => navigate('/customer/track-pickup')}
              />
            ) : (
              <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
            )}
            <UserProfileDropdown />
          </div>
          {/* Mobile menu button with animation */}
          <div className="md:hidden flex items-center">
            {location.pathname.includes('/history-log') ? (
              <CustomerNotification 
                mode="history"
                wasteTypes={[
                  { type: "Plastics", status: "Completed" },
                  { type: "Paper", status: "Scheduled" },
                  { type: "Glass", status: "Missed" },
                  { type: "Metal", status: "Completed" }
                ]}
                onGoNow={() => navigate('/customer/track-pickup')}
              />
            ) : location.pathname.includes('/request-pickup') || location.pathname.includes('/trash-type') || location.pathname.includes('/pin-location') || location.pathname.includes('/pickup-summary') ? (
              <CustomerNotification 
                mode="request"
                wasteTypes={[
                  { type: "Plastics", status: "Pending" },
                  { type: "Paper", status: "Pending" },
                  { type: "Glass", status: "Pending" },
                  { type: "Metal", status: "Pending" }
                ]}
                onGoNow={() => navigate('/customer/track-pickup')}
              />
            ) : (
              <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
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
};

export default CustomerHeader; 