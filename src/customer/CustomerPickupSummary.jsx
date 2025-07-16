import { Link, useNavigate } from "react-router-dom"
import { Recycle, Bell, X } from "lucide-react"
import { useState, useEffect } from "react"
import UserProfileDropdown from "./UserProfileDropdown"
<<<<<<< HEAD
import binIcon from '/images/bin.png';
=======
import CustomerNotification from "./CustomerNotification";
>>>>>>> ea8637baa2efec7003ae2eec137906464b4b6d79

const ConfirmPickup = () => {
  const [confirmed, setConfirmed] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
<<<<<<< HEAD
  const [showBellDot, setShowBellDot] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showBellPopup, setShowBellPopup] = useState(false);
  const [showBellDetails, setShowBellDetails] = useState(false);
  const navigate = useNavigate();
  // Get data from localStorage
  const wasteTypesData = JSON.parse(localStorage.getItem('wasteTypesData') || '[]');
  // Get address from locationData (set by CustomerLocationPin)
  let pickupLocation = '';
  let longitude = '';
  let latitude = '';
  try {
    const locationData = JSON.parse(localStorage.getItem('locationData') || '{}');
    pickupLocation = locationData.address || '';
    longitude = locationData.longitude || '';
    latitude = locationData.latitude || '';
  } catch (e) {
    pickupLocation = '';
    longitude = '';
    latitude = '';
  }

  // Prepare display strings
  const wasteTypes = wasteTypesData.filter(w => w.selected).map(w => w.type).join(', ');
  const quantities = wasteTypesData.filter(w => w.selected).map(w => `${w.type}: ${w.quantity} kg`).join(', ');

  const pickupSummary = {
    wasteTypes,
    quantities,
    pickupLocation,
  }
=======
  const [wasteTypes, setWasteTypes] = useState([]);
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get waste types from localStorage
    const wasteTypesData = JSON.parse(localStorage.getItem('wasteTypesData')) || [];
    setWasteTypes(wasteTypesData.filter(w => w.selected));
    // Get location from localStorage
    const locationData = JSON.parse(localStorage.getItem('locationData'));
    setLocation(locationData);
  }, []);
>>>>>>> ea8637baa2efec7003ae2eec137906464b4b6d79

  const handleConfirmSchedule = () => {
    setConfirmed(true)
    setShowPopup(true);
    setShowBellDot(true); // Show red dot on bell
    console.log("Pickup schedule confirmed")
    // Handle schedule confirmation logic here
    // This would typically submit the pickup request to the backend
  }

  const handleClosePopup = () => setShowPopup(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
<<<<<<< HEAD
            <span className="mx-2" />
            <button
              className="relative focus:outline-none"
              aria-label="Notifications"
              style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer' }}
              type="button"
              onClick={() => {
                setShowBellPopup((prev) => !prev);
                setShowBellDot(false); // Remove red dot when notification is viewed
              }}
            >
              <Bell className="w-7 h-7 text-gray-700 hover:text-green-700 transition" />
              {showBellDot && (
                <span className="absolute top-0 right-0 block w-3 h-3 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>
=======
            {confirmed ? (
              <CustomerNotification hasNew={true} onViewDetails={() => navigate('/customer/track-pickup')} />
            ) : (
              <CustomerNotification iconOnly hasNew={false} />
            )}
>>>>>>> ea8637baa2efec7003ae2eec137906464b4b6d79
            <UserProfileDropdown />
          </div>
        </nav>
      </header>

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

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {/* Waste Types */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-theme-color">Waste Types</div>
                <div className="text-gray-900 font-medium">
                  {wasteTypes.length > 0 ? wasteTypes.map(w => w.type).join(', ') : '—'}
                </div>
              </div>
              {/* Quantities */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-theme-color">Quantities (kg)</div>
                <div className="text-gray-900 font-medium">
                  {wasteTypes.length > 0 ? wasteTypes.map(w => `${w.type}: ${w.quantity}kg`).join(', ') : '—'}
                </div>
              </div>
<<<<<<< HEAD

              {/* Address */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-theme-color">Address</div>
                <div className="text-gray-900 font-medium">{pickupSummary.pickupLocation}</div>
=======
              {/* Address Row */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-theme-color">Address</div>
                <div className="text-gray-900 font-medium">
                  {location && location.address ? location.address : '—'}
                </div>
>>>>>>> ea8637baa2efec7003ae2eec137906464b4b6d79
              </div>
              {/* Pickup Location (Coordinates) Row */}
              <div className="px-6 py-6 flex justify-between items-center">
<<<<<<< HEAD
                <div className="text-sm font-medium text-theme-color">Pickup Location</div>
                <div className="text-gray-900 font-medium">
                  {(longitude && latitude) ? (
                    <>
                      Longitude: <span className="font-mono">{longitude}</span><br />
                      Latitude: <span className="font-mono">{latitude}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Not set</span>
                  )}
=======
                <div className="text-sm font-medium text-theme-color">Pickup Coordinates</div>
                <div className="text-gray-900 font-medium">
                  {location && location.latitude && location.longitude
                    ? `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`
                    : '—'}
>>>>>>> ea8637baa2efec7003ae2eec137906464b4b6d79
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button or Success Message */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="py-2 px-8 rounded-full text-base border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 mb-2"
          >
            ← Back
          </button>
          {!confirmed ? (
            <button
              onClick={handleConfirmSchedule}
              className="next-btn py-4 px-12 rounded-full text-lg"
            >
              Confirm Schedule
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
            borderRadius: '1.5rem',
            boxShadow: '0 8px 40px 0 rgba(58, 95, 70, 0.25)',
            padding: '2.5rem 2.5rem 2rem 2.5rem',
            minWidth: 340,
            maxWidth: '90vw',
            textAlign: 'center',
            position: 'relative',
            animation: 'zoomIn 0.35s cubic-bezier(.4,2,.6,1)',
          }}>
<<<<<<< HEAD
=======
            <button
              onClick={handleClosePopup}
              aria-label="Close success message"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#3a5f46',
                border: 'none',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                boxShadow: '0 2px 8px 0 rgba(58, 95, 70, 0.18)',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#24402e'}
              onMouseOut={e => e.currentTarget.style.background = '#3a5f46'}
            >
              <X size={24} color="#fff" style={{ display: 'block' }} />
            </button>
>>>>>>> ea8637baa2efec7003ae2eec137906464b4b6d79
            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'popIn 0.4s' }}>✅</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3a5f46', marginBottom: '0.5rem' }}>Pickup Scheduled Successfully!</div>
            <div style={{ fontSize: '1.1rem', color: '#333', marginBottom: '1.5rem' }}>
              You'll receive the pickup time and assigned company shortly.<br/>
              Thank you for choosing TrashRoute!
            </div>
            <div style={{ fontSize: '1rem', color: '#3a5f46', fontWeight: 500, marginTop: '0.5rem' }}>Please wait...</div>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginTop: '2rem',
                padding: '0.75rem 2.5rem',
                background: '#3a5f46',
                color: '#fff',
                border: 'none',
                borderRadius: '2rem',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px 0 rgba(58, 95, 70, 0.18)',
                transition: 'background 0.2s',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
      {showBellPopup && (
        <div style={{
          position: 'fixed',
          top: '6.5rem',
          right: '2.5rem',
          zIndex: 1200,
          background: '#fff',
          borderRadius: showBellDetails ? '2rem' : '1.1rem',
          boxShadow: '0 4px 24px 0 rgba(60,120,60,0.13), 0 1.5px 6px 0 rgba(0,0,0,0.10)',
          borderLeft: '6px solid #43a047',
          padding: showBellDetails ? '2rem 2.2rem 2rem 2.2rem' : '1.1rem 1.3rem 1.1rem 1.1rem',
          minWidth: showBellDetails ? 390 : 320,
          maxWidth: showBellDetails ? 390 : 340,
          textAlign: 'left',
          display: showBellDetails ? 'block' : 'flex',
          alignItems: showBellDetails ? undefined : 'flex-start',
          gap: showBellDetails ? undefined : '0.9rem',
          animation: 'notifSlideIn 0.32s cubic-bezier(.4,2,.6,1)',
        }}>
          <style>{`
            @keyframes notifSlideIn {
              from { opacity: 0; transform: translateY(-18px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
          {!showBellDetails ? (
            <>
              <span style={{ fontSize: '2rem', color: '#43a047', background: '#e0f2f1', borderRadius: '50%', padding: '0.18em 0.32em', boxShadow: '0 1px 4px 0 #b2dfdb33', flexShrink: 0, marginTop: '0.1em' }}>✅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#256029', fontSize: '1.08rem', marginBottom: '0.18rem' }}>
                  Pickup scheduled!
                </div>
                <div style={{ color: '#24402e', fontSize: '0.98rem', marginBottom: '0.3rem' }}>
                  Your sorted waste will be collected by EcoGreen Recycling on July 7, 2025 (9:00 AM - 12:00 PM).
                </div>
                <div
                  style={{ fontSize: '0.93rem', color: '#388e3c', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline', marginTop: '0.1rem' }}
                  onClick={() => setShowBellDetails(true)}
                >
                  View Details
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.7rem' }}>
                <span style={{ fontSize: '2.5rem', color: '#43a047', background: '#e0f2f1', borderRadius: '50%', padding: '0.3em 0.45em', boxShadow: '0 2px 8px 0 #b2dfdb55', marginBottom: '0.5rem' }}>✅</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#256029', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '0.01em' }}>
                  Your Pickup Successfully Scheduled
                </div>
              </div>
              <div style={{ fontSize: '1.08rem', fontWeight: 700, color: '#388e3c', marginBottom: '0.6rem', textAlign: 'center', letterSpacing: '0.01em' }}>
                Status: <span style={{ color: '#256029' }}>Step 3 of 4</span> — <span style={{ color: '#2e7d32' }}>Scheduled</span>
              </div>
              <div style={{ borderTop: '1px solid #c8e6c9', margin: '0.7rem 0 0.7rem 0' }} />
              <div style={{ fontSize: '1rem', color: '#24402e', marginBottom: '0.4rem' }}><b>Pickup Date:</b> July 7, 2025</div>
              <div style={{ fontSize: '1rem', color: '#24402e', marginBottom: '0.4rem' }}><b>Time Window:</b> 9:00 AM - 12:00 PM</div>
              <div style={{ fontSize: '1rem', color: '#24402e', marginBottom: '0.4rem' }}><b>Company:</b> EcoGreen Recycling</div>
              <div style={{ fontSize: '1rem', color: '#24402e', marginBottom: '0.4rem' }}><b>Waste Summary:</b> Plastic (3kg), Glass (2kg)</div>
              <div style={{ fontSize: '1rem', color: '#24402e', marginBottom: '0.4rem' }}><b>Location:</b> 123 Green St, Spring...</div>
              <div style={{ fontSize: '1rem', color: '#24402e', marginBottom: '0.4rem' }}><b>Tracking ID:</b> #TR-002194</div>
              <div style={{ fontSize: '1rem', color: '#256029', fontWeight: 600, marginBottom: '0.7rem' }}><b>Status:</b> On the Way</div>
              <div style={{ background: '#fff', borderRadius: '0.9rem', padding: '1rem 1.1rem', margin: '0.7rem 0 0.2rem 0', color: '#256029', fontSize: '1.01rem', boxShadow: '0 2px 8px 0 #b2dfdb33', border: '1px solid #e0f2f1' }}>
                <b>Smart Assistant:</b> We've locked in your pickup with EcoGreen.<br />Your sorted waste will be picked up at your scheduled time — just have it ready at your drop point!
              </div>
              <div style={{ background: '#e8f5e9', borderRadius: '0.8rem', padding: '0.9rem 1rem', margin: '0.5rem 0 0 0', color: '#24402e', fontSize: '0.98rem', border: '1px solid #b2dfdb' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.3rem', color: '#256029' }}>What You Need to Provide:</div>
                <ul style={{ margin: 0, paddingLeft: '1.1em', listStyle: 'disc' }}>
                  <li>Please have your sorted waste ready as listed above.</li>
                  <li>Place everything at your designated drop point before your pickup window begins.</li>
                  <li>Make sure all bags or containers are securely closed to keep things tidy and safe.</li>
                  <li style={{marginTop: '0.5em', color: '#2e7d32', fontWeight: 600}}>Thank you for helping us keep the community clean!</li>
                </ul>
              </div>
              <div
                style={{ fontSize: '0.93rem', color: '#388e3c', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline', marginTop: '0.7rem', textAlign: 'center' }}
                onClick={() => setShowBellDetails(false)}
              >
                Hide Details
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ConfirmPickup