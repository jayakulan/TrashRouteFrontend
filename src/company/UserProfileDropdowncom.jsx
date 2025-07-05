import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const UserProfileDropdowncom = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  return (
    <div
      className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center cursor-pointer relative"
      ref={profileRef}
    >
      <img
        src={user?.profileImage || "https://randomuser.me/api/portraits/men/44.jpg"}
        alt="User"
        className="w-8 h-8 object-cover"
        onClick={() => setShowProfile((prev) => !prev)}
      />
      {showProfile && (
        <div className="fixed top-20 right-10 w-72 bg-white border-2 border-gray-400 rounded-lg shadow-2xl z-[9999] p-6 flex flex-col items-center">
          <img src={user?.profileImage || "https://randomuser.me/api/portraits/men/44.jpg"} alt="User" className="w-16 h-16 rounded-full object-cover mb-3" />
          <div className="font-semibold text-gray-900 text-lg mb-1">{user?.name || "Company Name"}</div>
          <div className="text-sm text-gray-500 mb-4">{user?.email || "company@email.com"}</div>
          <button onClick={logout} className="w-full text-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdowncom; 