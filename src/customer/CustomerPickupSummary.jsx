import { Link, useNavigate } from "react-router-dom"
import { Recycle, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import UserProfileDropdown from "./UserProfileDropdown"
// import binIcon from '/images/bin.png';
import CustomerNotification from "./CustomerNotification";
import { useAuth } from "../context/AuthContext";
import { getCookie } from "../utils/cookieUtils";

const ConfirmPickup = () => {
  const [confirmed, setConfirmed] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [pickupSummary, setPickupSummary] = useState({
    wasteTypes: "Loading...",
    approximateTotalWeight: "Loading...",
    pickupLocation: "Loading...",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [otpData, setOtpData] = useState(null);
  const [otpList, setOtpList] = useState([]);
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch pickup summary data from API
  useEffect(() => {
    const fetchPickupSummary = async () => {
      try {
        const token = getCookie('token');
        const user = getCookie('user');
        
        console.log('Token exists:', !!token);
        console.log('User exists:', !!user);
        
        if (!token || !user) {
          setError('Please log in to view pickup summary.');
          setLoading(false);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }

        // Check if user is a customer
        const userData = typeof user === 'string' ? JSON.parse(user) : user;
        if (userData.role !== 'customer') {
          setError('Access denied. This page is for customers only.');
          setLoading(false);
          setTimeout(() => {
            navigate('/');
          }, 2000);
          return;
        }

        const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Customer/pickupsummary.php', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);

        if (data.success) {
          // Deduplicate waste types if it's an array
          let wasteTypes = data.data.waste_types;
          if (Array.isArray(wasteTypes)) {
            wasteTypes = [...new Set(wasteTypes)];
          }
          
          setPickupSummary({
            wasteTypes: Array.isArray(wasteTypes) ? wasteTypes.join(', ') : wasteTypes,
            approximateTotalWeight: data.data.approximate_total_weight,
            pickupLocation: data.data.pickup_location,
          });
          
          // If OTP list exists, set it
          if (data.data.otp_list && data.data.otp_list.length > 0) {
            setOtpList(data.data.otp_list);
          }
        } else {
          setError(data.message || 'Failed to fetch pickup summary');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Network error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupSummary();
  }, []);

  const handleConfirmSchedule = async () => {
    setSchedulingLoading(true);
    try {
      const token = getCookie('token');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/Customer/pickupotp.php', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setOtpData(data.data);
        setOtpList(data.data.otp_list || []);
        setConfirmed(true);
    setShowPopup(true);
        console.log("OTPs generated successfully:", data.data.otp_list);
      } else {
        setError(data.message || 'Failed to generate OTPs');
      }
    } catch (err) {
      console.error('Schedule error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setSchedulingLoading(false);
    }
  }

  const handleClosePopup = () => setShowPopup(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Accent bar at the very top */}
      <div className="absolute top-0 left-0 right-0 w-screen h-1 bg-[#26a360] rounded-t-2xl z-50"></div>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
        <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
          {/* Logo with animation */}
          <div className="flex items-center">
            <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
          </div>
          {/* Navigation Links - right aligned */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium ml-auto">
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
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/request-pickup" className="text-theme-color hover:text-theme-color-dark font-medium">
            Request Pickup
          </Link>
          <span>/</span>
          <Link to="/select-waste-type" className="text-theme-color hover:text-theme-color-dark font-medium">
            Select Waste Type
          </Link>
          <span>/</span>
          <Link to="/pin-location" className="text-theme-color hover:text-theme-color-dark font-medium">
            Pin Location
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Confirm Pickup Schedule</span>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Step 3 of 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full" style={{ width: "100%", background: '#3a5f46' }}></div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Confirm Pickup Schedule</h1>
        </div>

        {/* Pickup Summary Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-8">Pickup Summary</h2>

          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-gray-600">Loading pickup summary...</div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <div className="text-red-600 mb-4">Error: {error}</div>
              {error.includes('log in') && (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-theme-color text-white px-6 py-2 rounded-lg hover:bg-theme-color-dark transition-colors"
                >
                  Go to Login
                </button>
              )}
            </div>
          ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {/* Waste Types */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-theme-color">Waste Types</div>
                <div className="text-gray-900 font-medium">{pickupSummary.wasteTypes}</div>
              </div>

              {/* Total Weight */}
              <div className="px-6 py-6 flex justify-between items-center">
                  <div className="text-sm font-medium text-theme-color">Approximate Total Weight</div>
                  <div className="text-gray-900 font-medium">{pickupSummary.approximateTotalWeight}</div>
              </div>

              {/* Pickup Location */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-theme-color">Pickup Location</div>
                <div className="text-gray-900 font-medium">{pickupSummary.pickupLocation}</div>
                </div>

                {/* OTP Display (if scheduled) */}
                {otpList.length > 0 && (
                  <div className="px-6 py-6 bg-green-50 border-t border-green-200">
                    <div className="text-sm font-medium text-theme-color mb-3">Pickup OTPs</div>
                    <div className="space-y-2">
                      {otpList.map((otpItem, index) => (
                        <div key={index} className="flex justify-between items-center bg-white p-3 rounded border">
                          <div className="text-sm text-gray-600">
                            {otpItem.waste_type} ({otpItem.quantity} kg)
                          </div>
                          <div className="text-gray-900 font-mono font-bold text-lg tracking-wider">
                            {otpItem.otp}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Button or Success Message */}
        <div className="flex justify-center">
          {!confirmed ? (
            <button
              onClick={handleConfirmSchedule}
              disabled={schedulingLoading}
              className={`next-btn py-4 px-12 rounded-full text-lg ${schedulingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {schedulingLoading ? 'Scheduling...' : 'Confirm Schedule'}
            </button>
          ) : null}
        </div>
      </main>

      {/* Success Popup Overlay */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s',
        }}>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes zoomIn {
              from { transform: scale(0.85); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
            @keyframes popIn {
              0% { transform: scale(0.7); opacity: 0; }
              60% { transform: scale(1.15); opacity: 1; }
              100% { transform: scale(1); }
            }
          `}</style>
          <div style={{
            background: '#fff',
            borderRadius: '1.25rem',
            boxShadow: '0 4px 24px 0 rgba(58, 95, 70, 0.18)',
            padding: '1.25rem 1.25rem 1rem 1.25rem',
            minWidth: 300,
            maxWidth: '90vw',
            textAlign: 'center',
            position: 'relative',
            animation: 'zoomIn 0.35s cubic-bezier(.4,2,.6,1)',
          }}>
            <button
              onClick={handleClosePopup}
              aria-label="Close success message"
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
              <img src="/images/close.png" alt="Close" style={{ width: '1.5rem', height: '1.5rem', objectFit: 'contain', display: 'block', margin: 0 }} />
            </button>
            <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem', animation: 'popIn 0.4s' }}>✅</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3a5f46', marginBottom: '0.25rem' }}>OTPs Generated Successfully!</div>
            
            {otpList.length > 0 && (
              <div style={{ 
                background: '#f0f9ff', 
                border: '2px solid #3a5f46', 
                borderRadius: '0.75rem', 
                padding: '0.5rem', 
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1rem', color: '#3a5f46', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Your Pickup OTPs:
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {otpList.map((otpItem, index) => (
                    <div key={index} style={{ 
                      background: '#fff',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '0.4rem',
                      border: '1px solid #3a5f46',
                      marginBottom: '0.3rem',
                      textAlign: 'left'
                    }}>
                      <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.1rem' }}>
                        {otpItem.waste_type} ({otpItem.quantity} kg)
                      </div>
                      <div style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 700, 
                        color: '#3a5f46', 
                        letterSpacing: '0.15rem',
                        fontFamily: 'monospace'
                      }}>
                        {otpItem.otp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ fontSize: '0.95rem', color: '#333', marginBottom: '0.7rem' }}>
              Please provide these OTPs to the pickup company when they arrive.<br/>
              Thank you for choosing TrashRoute!
            </div>
            
            <button
              onClick={handleClosePopup}
              style={{
                background: '#3a5f46',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1.2rem',
                borderRadius: '0.4rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#24402e'}
              onMouseOut={e => e.currentTarget.style.background = '#3a5f46'}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfirmPickup