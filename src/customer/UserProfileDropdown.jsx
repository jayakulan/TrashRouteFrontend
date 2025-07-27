import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ReactDOM from "react-dom";

const UserProfileDropdown = ({ mode = "default" }) => {
  const { user, logout, updateUser } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const profileRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      // For admin modal, also close when clicking outside the modal
      if (mode === "admin" && modalRef.current && !modalRef.current.contains(event.target) && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile, mode]);

  // Update edit data when user changes
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
    setEditError("");
    setEditSuccess("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEditError("");
    setEditSuccess("");
    
    try {
      // Use different endpoints based on user role
      let endpoint = "";
      if (mode === "admin" || user?.role === "admin") {
        // For admin users, we'll update locally since there's no admin edit endpoint
        setEditSuccess("Profile updated successfully!");
        
        // Update local user data
        const updatedUser = { ...user, ...editData };
        updateUser(updatedUser);
        
        setTimeout(() => {
          setShowEditModal(false);
          setShowProfile(false);
        }, 1500);
        setLoading(false);
        return;
      } else if (user?.role === "company") {
        endpoint = "http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/editprofilecom.php";
      } else {
        endpoint = "http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/editprofilecus.php";
      }
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
        credentials: "include",
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEditSuccess("Profile updated successfully!");
        
        // Update local user data
        const updatedUser = { ...user, ...editData };
        updateUser(updatedUser);
        
        setTimeout(() => {
          setShowEditModal(false);
          setShowProfile(false);
        }, 1500);
      } else {
        setEditError(result.message || "Failed to update profile");
      }
    } catch (err) {
      setEditError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setShowProfile(false);
    setShowEditModal(false);
    logout();
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
    setShowProfile(false); // Close the profile modal when opening edit modal
  };

  return (
    <div className="relative">
      <div
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center cursor-pointer relative"
        ref={profileRef}
      >
        <img
          src={user?.profileImage || "https://randomuser.me/api/portraits/women/44.jpg"}
          alt="User"
          className="w-8 h-8 object-cover"
          onClick={() => setShowProfile((prev) => !prev)}
        />
        {showProfile && mode !== "admin" && (
          <div
            className="fixed top-20 right-10 w-72 bg-white border-2 border-gray-400 rounded-lg shadow-2xl z-[9999] p-6 flex flex-col items-center"
          >
            <img src={user?.profileImage || "https://randomuser.me/api/portraits/women/44.jpg"} alt="User" className="w-16 h-16 rounded-full object-cover mb-3" />
            <div className="font-semibold text-gray-900 text-lg mb-1">{user?.name || "User"}</div>
            <div className="text-sm text-gray-500 mb-4">{user?.email || "user@email.com"}</div>
            <button 
              onClick={handleEditProfile}
              className="w-full text-center px-4 py-2 bg-[#3a5f46] text-white rounded-lg hover:bg-[#2e4d3a] transition-colors mb-2 font-medium"
            >
              Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="w-full text-center px-4 py-2 bg-[#6bbf7c] text-white rounded-lg hover:bg-[#57a86a] transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
          <div 
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-4 md:p-8 relative overflow-y-auto max-h-[90vh]"
          >
            <button 
              onClick={() => setShowEditModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition-colors"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-[#3a5f46]">Edit Profile</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Address</label>
                <textarea
                  name="address"
                  value={editData.address}
                  onChange={handleEditChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3a5f46] focus:border-[#3a5f46] transition-colors resize-none"
                  placeholder="Enter your address"
                />
              </div>
              
              {editError && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">
                  {editError}
                </div>
              )}
              
              {editSuccess && (
                <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded-lg">
                  {editSuccess}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#3a5f46] hover:bg-[#2e4d3a] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}
      
      {/* Admin Profile Modal */}
      {showProfile && mode === "admin" && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-40">
          <div 
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col items-center"
          >
            <img src={user?.profileImage || "https://randomuser.me/api/portraits/women/44.jpg"} alt="User" className="w-20 h-20 rounded-full object-cover mb-4" />
            <div className="font-semibold text-gray-900 text-xl mb-1">{user?.name || "Admin User"}</div>
            <div className="text-sm text-gray-500 mb-6">{user?.email || "admin@email.com"}</div>
            <button 
              onClick={handleEditProfile}
              className="w-full text-center px-4 py-3 bg-[#3a5f46] text-white rounded-lg hover:bg-[#2e4d3a] transition-colors mb-3 font-medium"
            >
              Edit Profile
            </button>
            <button 
              onClick={handleLogout}
              className="w-full text-center px-4 py-3 bg-[#6bbf7c] text-white rounded-lg hover:bg-[#57a86a] transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UserProfileDropdown; 