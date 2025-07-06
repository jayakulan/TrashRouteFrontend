import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";

const Footer = () => {
  const navigate = useNavigate();
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  const handleContactClick = (e) => {
    e.preventDefault();
    // Navigate to landing page and trigger contact modal
    navigate('/', { state: { showContactModal: true } });
  };

  const handlePrivacyPolicyClick = (e) => {
    e.preventDefault();
    setShowPrivacyPolicy(true);
  };

  const handleTermsOfServiceClick = (e) => {
    e.preventDefault();
    setShowTermsOfService(true);
  };

  return (
  <footer className="mt-20 bg-[#3a5f46] py-10 text-white border-t">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 px-4">
      {/* Brand/About */}
      <div className="flex-1 mb-6 md:mb-0">
        <div className="font-bold text-lg mb-2">TrashRoute</div>
        <div className="text-sm">Making waste management efficient and environmentally responsible.</div>
      </div>
      {/* Quick Links */}
      <div className="flex-1 mb-6 md:mb-0">
        <div className="font-bold text-lg mb-2">Quick Links</div>
        <ul className="space-y-1 text-sm">
          <li><a href="#about" className="hover:text-green-600" onClick={(e) => {
              e.preventDefault();
              const aboutSection = document.getElementById('about');
              const navHeight = 64; // Height of the fixed navigation bar
              const aboutPosition = aboutSection.offsetTop - navHeight;
              window.scrollTo({
                top: aboutPosition,
                behavior: 'smooth'
              });
            }}>About</a></li>
          <li><a href="#contact" className="hover:underline text-white" onClick={handleContactClick}>Contact</a></li>
          <li><a href="#" className="hover:underline text-white" onClick={handlePrivacyPolicyClick}>Privacy Policy</a></li>
          <li><a href="#" className="hover:underline text-white" onClick={handleTermsOfServiceClick}>Terms of Service</a></li>
        </ul>
      </div>
      {/* Contact Us */}
      <div className="flex-1">
        <div className="font-bold text-lg mb-2">Contact Us</div>
        <div className="text-sm">Email: support@trashroute.com</div>
        <div className="text-sm">Phone: (555) 123-4567</div>
        <div className="text-sm">Address: 123 Green Street, Eco City, EC 12345</div>
        <div className="flex gap-4 mt-4">
          {/* Twitter (X) */}
          <a href="#" className="social-blink" aria-label="Twitter">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 8.99 4.07 7.13 1.64 4.15c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6a4.28 4.28 0 0 1-1.94-.54v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.7z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="social-blink" aria-label="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.782 2.295 7.148 2.233 8.414 2.175 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.414 3.678 1.395c-.98.98-1.263 2.092-1.322 3.373C2.013 5.668 2 6.077 2 12c0 5.923.013 6.332.072 7.612.059 1.281.342 2.393 1.322 3.373.98.98 2.092 1.263 3.373 1.322C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.342 3.373-1.322.98-.98 1.263-2.092 1.322-3.373.059-1.28.072-1.689.072-7.612 0-5.923-.013-6.332-.072-7.612-.059-1.281-.342-2.393-1.322-3.373-.98-.98-2.092-1.263-3.373-1.322C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
            </svg>
          </a>
          {/* Facebook */}
          <a href="#" className="social-blink" aria-label="Facebook">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div className="text-center text-xs text-gray-300 mt-8">
      © 2025 TrashRoute. All rights reserved.
    </div>
    
    {/* Privacy Policy Popup */}
    <PrivacyPolicy 
      isOpen={showPrivacyPolicy} 
      onClose={() => setShowPrivacyPolicy(false)} 
    />
    
    {/* Terms of Service Popup */}
    <TermsOfService 
      isOpen={showTermsOfService} 
      onClose={() => setShowTermsOfService(false)} 
    />
  </footer>
  );
};

export default Footer;
