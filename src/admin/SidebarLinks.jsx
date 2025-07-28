import { Link, useLocation } from "react-router-dom";
import { Diamond, Users, Building, Truck, MessageSquare, BarChart3, Bell, Map, MapPin } from "lucide-react";
import { Mail } from "lucide-react";

const links = [
  { to: "/admin/dashboard", icon: <Diamond />, label: "Dashboard" },
  { to: "/admin/users", icon: <Users />, label: "Users" },
  { to: "/admin/companies", icon: <Building />, label: "Companies" },
  { to: "/admin/requests", icon: <Truck />, label: "Requests" },
  { to: "/admin/feedback", icon: <MessageSquare />, label: "Feedback" },
  { to: "/admin/notifications", icon: <Bell />, label: "Notifications" },
  { to: "/admin/contactus", icon: <Mail />, label: "Contact Us" },
  { to: "/admin/routes", icon: <Map />, label: "Routes" },
  { to: "/admin/route-mapping", icon: <MapPin />, label: "Route Mapping" },
  { to: "/admin/reports", icon: <BarChart3 />, label: "Reports" },
];

const SidebarLinks = ({ onClick, sidebarOpen }) => {
  const location = useLocation();
  return (
    <nav className="mt-4 flex-1">
      <div className="px-2 lg:px-3 space-y-2">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              hover:bg-[#e6f4ea] text-[#3a5f46] font-medium
              ${sidebarOpen ? 'justify-start' : 'justify-center'}
              ${location.pathname === link.to ? 'bg-[#e6f4ea] font-bold' : ''}
            `}
            title={link.label}
          >
            <span className="w-6 h-6 flex items-center justify-center">{link.icon}</span>
            {sidebarOpen && <span className="whitespace-nowrap">{link.label}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default SidebarLinks; 