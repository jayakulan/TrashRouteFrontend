import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { GoogleMapsProvider } from './components/GoogleMapsProvider'
import GoogleMapsErrorBoundary from './components/GoogleMapsErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import URLProtection from './components/URLProtection'
import Login from './Login.jsx'
import LandingPage from './LandingPage.jsx'

import CustomerSignUp from './CustomerSignUp.jsx'
import CompanySignUp from './CompanySignUp.jsx'
import CustomerTrashType from './customer/CustomerTrashType.jsx'
import CustomerLocationPin from './customer/CustomerLocationPin.jsx'
import CustomerPickupSummary from './customer/CustomerPickupSummary.jsx'
import CompanyWastePrefer from './company/CompanyWastePrefer.jsx'
import RouteActivation from './company/RouteAccess.jsx'
import RouteMap from './company/RouteMap.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import ManageCustomers from './admin/ManageCustomers.jsx'
import ManageCompanies from './admin/ManageCompanies.jsx'
import ReportsAnalytics from './admin/Reports.jsx'
import FeedbackRatings from './admin/Feedback.jsx'
import ContactUsManagement from './admin/ContactUsManagement.jsx'
import PickupRequests from './admin/Requests.jsx'
import CustomerTrackPickup from './customer/CustomerTrackPickup.jsx'
import CustomerHistoryLog from './customer/CustomerHistoryLog.jsx'
import OtpVerification from './OtpVerification.jsx'
import CompanyHistoryLog from './company/CompanyHistoryLog';
import NotificationManagement from './admin/NotificationManagement.jsx';
import RoutesManagement from './admin/RoutesManagement.jsx';
import RouteMappingManagement from './admin/RouteMappingManagement.jsx';

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const circleRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const percent = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(percent);
      setVisible(scrollTop > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG circle progress
  const size = 56;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <button
      onClick={handleClick}
      className={`fixed z-50 bottom-8 right-8 w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-lg border-2 border-[#3a5f46] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-label="Scroll to top"
      style={{ outline: 'none' }}
    >
      <svg width={size} height={size} className="absolute top-0 left-0" style={{ pointerEvents: 'none' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3a5f46"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.2s linear' }}
        />
      </svg>
      <span className="relative z-10 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3a5f46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
          <path d="M12 19V5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </span>
    </button>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <GoogleMapsErrorBoundary>
      <GoogleMapsProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<CustomerSignUp />} />
          <Route path="/company-signup" element={<CompanySignUp />} />
          <Route path="/customer/trash-type" element={<CustomerTrashType />} />
          <Route path="/customer/location-pin" element={<CustomerLocationPin />} />
          <Route path="/customer/pickup-summary" element={<CustomerPickupSummary />} />
          <Route path="/company-waste-prefer" element={<CompanyWastePrefer />} />
          <Route path="/company/route-access" element={<RouteActivation />} />
          <Route path="/company/route-map" element={<RouteMap />} />
          <Route path="/company/historylogs" element={<CompanyHistoryLog />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageCustomers />} />
          <Route path="/admin/companies" element={<ManageCompanies />} />
          <Route path="/admin/requests" element={<PickupRequests />} />
          <Route path="/admin/feedback" element={<FeedbackRatings />} />
          <Route path="/admin/contactus" element={<ContactUsManagement />} />
          <Route path="/admin/reports" element={<ReportsAnalytics />} />
          <Route path="/admin/notifications" element={<NotificationManagement />} />
          <Route path="/customer/track-pickup" element={<CustomerTrackPickup />} />
          <Route path="/customer/history-log" element={<CustomerHistoryLog />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
        </Routes>
      </GoogleMapsProvider>
    </GoogleMapsErrorBoundary>
  )
}

export default App
