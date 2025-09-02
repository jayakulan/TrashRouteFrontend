import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom'
import { MapboxProvider } from './components/MapboxProvider'
import MapboxErrorBoundary from './components/MapboxErrorBoundary'
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
    <MapboxErrorBoundary>
      <MapboxProvider>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<CustomerSignUp />} />
          <Route path="/company-signup" element={<CompanySignUp />} />


          
          {/* Customer Protected Routes */}
          <Route path="/customer/trash-type" element={
            <URLProtection>
              <ProtectedRoute requiredRole="customer">
                <CustomerTrashType />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/customer/location-pin" element={
            <URLProtection>
              <ProtectedRoute requiredRole="customer">
                <CustomerLocationPin />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/customer/pickup-summary" element={
            <URLProtection>
              <ProtectedRoute requiredRole="customer">
                <CustomerPickupSummary />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/customer/track-pickup" element={
            <URLProtection>
              <ProtectedRoute requiredRole="customer">
                <CustomerTrackPickup />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/customer/history-log" element={
            <URLProtection>
              <ProtectedRoute requiredRole="customer">
                <CustomerHistoryLog />
              </ProtectedRoute>
            </URLProtection>
          } />
          
          {/* Company Protected Routes */}
          <Route path="/company-waste-prefer" element={
            <URLProtection>
              <ProtectedRoute requiredRole="company">
                <CompanyWastePrefer />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/company/route-access" element={
            <URLProtection>
              <ProtectedRoute requiredRole="company">
                <RouteActivation />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/company/route-map" element={
            <URLProtection>
              <ProtectedRoute requiredRole="company">
                <RouteMap />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/company/historylogs" element={
            <URLProtection>
              <ProtectedRoute requiredRole="company">
                <CompanyHistoryLog />
              </ProtectedRoute>
            </URLProtection>
          } />
          
          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/admin/users" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <ManageCustomers />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/admin/companies" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <ManageCompanies />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/admin/requests" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <PickupRequests />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/admin/feedback" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <FeedbackRatings />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/admin/reports" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <ReportsAnalytics />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/admin/contact-us" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <ContactUsManagement />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/admin/contactus" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <ContactUsManagement />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/admin/notifications" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <NotificationManagement />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/admin/routes" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <RoutesManagement />
              </ProtectedRoute>
            </URLProtection>
          } />
          <Route path="/admin/route-mapping" element={
            <URLProtection>
              <ProtectedRoute requiredRole="admin">
                <RouteMappingManagement />
              </ProtectedRoute>
            </URLProtection>
          } />
          
          {/* OTP Verification (no role restriction) */}


          <Route path="/otp-verification" element={<OtpVerification />} />
        </Routes>
      </MapboxProvider>
    </MapboxErrorBoundary>
  )
}

export default App
