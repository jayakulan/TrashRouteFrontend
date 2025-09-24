import { Link, useNavigate } from "react-router-dom"
import { Recycle, Bell } from "lucide-react"
import { useState, useEffect } from "react"
import UserProfileDropdown from "./UserProfileDropdown"
// import binIcon from '/images/bin.png';
import CustomerNotification from "./CustomerNotification";
import { useAuth } from "../context/AuthContext";
import { getCookie } from "../utils/cookieUtils";
import Footer from "../footer.jsx"
import CustomerHeader from "./CustomerHeader";

const ConfirmPickup = () => {
  const [confirmed, setConfirmed] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [isPickupAlreadyConfirmed, setIsPickupAlreadyConfirmed] = useState(false);
  const [pickupSummary, setPickupSummary] = useState({
    wasteTypes: "Loading...",
    approximateTotalWeight: "Loading...",
    pickupLocation: "Loading...",
    coordinates: {
      latitude: "Loading...",
      longitude: "Loading..."
    }
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
        
        const data = await response.json();

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
            coordinates: data.data.coordinates || {
              latitude: "N/A",
              longitude: "N/A"
            }
          });
          
          // Check if pickup is already confirmed
          if (data.data.pickup_confirmed) {
            setIsPickupAlreadyConfirmed(true);
            setConfirmed(true);
            // If OTP list exists, set it
            if (data.data.otp_list && data.data.otp_list.length > 0) {
              setOtpList(data.data.otp_list);
            }
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
        setShowPopup(true); // Only show popup for new confirmations
        
        // Trigger notification refresh after a short delay to ensure database is updated
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('refreshNotifications'));
        }, 1000);
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
      <CustomerHeader />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/customer/trash-type" className="text-[#3a5f46] hover:text-[#2e4d3a] hover:underline font-medium">
            Request Pickup
          </Link>
          <span>/</span>
          <Link to="/customer/trash-type" className="text-[#3a5f46] hover:text-[#2e4d3a] hover:underline font-medium">
            Select Waste Type
          </Link>
          <span>/</span>
          <Link to="/customer/location-pin" className="text-[#3a5f46] hover:text-[#2e4d3a] hover:underline font-medium">
            Pin Location
          </Link>
          <span>/</span>
          <Link to="/customer/pickup-summary" className="text-gray-900 font-medium">Confirm Pickup Schedule</Link>
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
              <div className="px-6 py-6 flex justify-between items-start">
                <div className="text-sm font-medium text-theme-color">Pickup Location</div>
                <div className="text-gray-900 font-medium text-right">
                  <div className="mb-2">{pickupSummary.pickupLocation}</div>
                  <div className="text-xs text-gray-500">
                    Lat: {pickupSummary.coordinates.latitude}, Long: {pickupSummary.coordinates.longitude}
                  </div>
                </div>
              </div>

                {/* OTP Display (only if pickup is confirmed) */}
                {confirmed && otpList.length > 0 && (
                  <div className="px-6 py-6 bg-green-50 border-t border-green-200">
                    <div className="text-sm font-medium text-theme-color mb-3">Pickup Reference Numbers</div>
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
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm text-blue-800 font-medium mb-1">📱 Important:</div>
                      <div className="text-xs text-blue-700">
                        Please provide these pickup reference numbers to the pickup company when they arrive at your location.
                      </div>
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
              {schedulingLoading ? 'Generating Reference Numbers...' : 'Confirm Pickup Schedule'}
            </button>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                <div className="text-green-600 font-semibold text-lg mb-2">
                  {isPickupAlreadyConfirmed ? '✅ Pickup Already Confirmed!' : '✅ Pickup Schedule Confirmed!'}
                </div>
                <div className="text-green-700 text-sm">
                  {isPickupAlreadyConfirmed 
                    ? 'Your pickup has already been scheduled and reference numbers are available above.'
                    : 'Your pickup has been scheduled and reference numbers have been generated. Please keep the reference numbers safe and provide them to the pickup company when they arrive.'
                  }
                </div>
              </div>
            </div>
          )}
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
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3a5f46', marginBottom: '0.25rem' }}>Reference Numbers Generated Successfully!</div>
            
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
                  Your Pickup Reference Numbers:
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
              <div style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#3a5f46' }}>
                Pickup Location:
              </div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                {pickupSummary.pickupLocation}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.7rem' }}>
                Coordinates: {pickupSummary.coordinates.latitude}, {pickupSummary.coordinates.longitude}
              </div>
              Please provide these pickup reference numbers to the pickup company when they arrive.<br/>
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
      
      <Footer />
    </div>
  )
}

export default ConfirmPickup