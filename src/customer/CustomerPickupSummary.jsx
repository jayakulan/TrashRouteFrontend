import { Link } from "react-router-dom"
import { Recycle, Bell } from "lucide-react"
import { useState } from "react"
import UserProfileDropdown from "./UserProfileDropdown"
import binIcon from '/images/bin.png';
import CustomerNotification from "./CustomerNotification";

const ConfirmPickup = () => {
  const [confirmed, setConfirmed] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const pickupSummary = {
    wasteTypes: "Recyclables, Organics",
    quantities: "2 bags, 1 bin",
    totalWeight: "15 kg",
    pickupLocation: "123 Maple Street, Anytown",
  }

  const handleConfirmSchedule = () => {
    setConfirmed(true)
    setShowPopup(true);
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
            <CustomerNotification onViewDetails={() => navigate('/customer/track-pickup')} />
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
                <div className="text-gray-900 font-medium">{pickupSummary.wasteTypes}</div>
              </div>

              {/* Quantities */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-theme-color">Quantities</div>
                <div className="text-gray-900 font-medium">{pickupSummary.quantities}</div>
              </div>

              {/* Total Weight */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-theme-color">Total Weight</div>
                <div className="text-gray-900 font-medium">{pickupSummary.totalWeight}</div>
              </div>

              {/* Pickup Location */}
              <div className="px-6 py-6 flex justify-between items-center">
                <div className="text-sm font-medium text-theme-color">Pickup Location</div>
                <div className="text-gray-900 font-medium">{pickupSummary.pickupLocation}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button or Success Message */}
        <div className="flex justify-center">
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
              <img src={binIcon} alt="Close" style={{ width: '1.5rem', height: '1.5rem', objectFit: 'contain', filter: 'invert(1) brightness(2)', display: 'block', margin: '0 auto' }} />
            </button>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'popIn 0.4s' }}>✅</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3a5f46', marginBottom: '0.5rem' }}>Pickup Scheduled Successfully!</div>
            <div style={{ fontSize: '1.1rem', color: '#333', marginBottom: '1.5rem' }}>
              You'll receive the pickup time and assigned company shortly.<br/>
              Thank you for choosing TrashRoute!
            </div>
            <div style={{ fontSize: '1rem', color: '#3a5f46', fontWeight: 500, marginTop: '0.5rem' }}>Please wait...</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConfirmPickup