import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom"; // Added Link import
import ReactDOM from "react-dom";

const UserProfileDropdowncom = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    phone: user?.contact_number || user?.phone || "",
    address: user?.address || "",
  });
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
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

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
    setEditError("");
    setEditSuccess("");
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");
    try {
      const response = await fetch("http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/editprofilecom.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id || user?.user_id || user?.company_id,
          ...editData,
        }),
        credentials: "include",
      });
      const result = await response.json();
      if (result.success) {
        setEditSuccess("Profile updated successfully!");
        // Update localStorage and context
        const updatedUser = { ...user, ...editData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (typeof window !== "undefined" && window.dispatchEvent) {
          window.dispatchEvent(new Event("storage"));
        }
        setTimeout(() => {
          setShowEditModal(false);
          setShowProfile(false);
          window.location.reload(); // To update context everywhere
        }, 1000);
      } else {
        setEditError(result.message || "Failed to update profile");
      }
    } catch (err) {
      setEditError("Server error");
    }
  };

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
          <button onClick={() => setShowEditModal(true)} className="w-full text-center px-4 py-2 bg-[#3a5f46] text-white rounded hover:bg-[#2e4d3a] transition mb-2">Edit Profile</button>
          <button onClick={logout} className="w-full text-center px-4 py-2 bg-[#6bbf7c] text-white rounded transition">Logout</button>
        </div>
      )}
      {/* Edit Profile Modal */}
      {showEditModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto flex flex-col justify-center">
            <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Company Name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Contact Number"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleEditChange}
                  required
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Address"
                />
              </div>
              {editError && <div className="text-red-600 text-sm text-center">{editError}</div>}
              {editSuccess && <div className="text-green-600 text-sm text-center">{editSuccess}</div>}
              <button type="submit" className="w-full bg-[#3a5f46] hover:bg-[#2e4d3a] text-white font-semibold py-3 rounded-lg transition">Save Changes</button>
            </form>
          </div>
        </div>
        , document.body
      )}
    </div>
  );
};

export default UserProfileDropdowncom; 