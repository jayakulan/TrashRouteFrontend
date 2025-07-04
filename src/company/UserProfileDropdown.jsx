import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const UserProfileDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center focus:outline-none"
        aria-label="Account"
      >
        <span className="inline-block w-10 h-10 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-lg">
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-4 z-50 border">
          <div className="px-6 py-2 border-b">
            <div className="font-semibold text-gray-900 text-lg">{user?.name || "Company Name"}</div>
            <div className="text-gray-600 text-sm">{user?.email || "company@email.com"}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-2 text-red-600 hover:bg-gray-100 font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown; 