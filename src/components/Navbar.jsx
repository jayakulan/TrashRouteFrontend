import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ onContactClick, showHomeButton }) {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <>
      {/* Accent bar at the very top */}
      <div className="absolute top-0 left-0 right-0 w-screen h-1 bg-[#26a360] rounded-t-2xl z-50"></div>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
        <div className="w-full flex items-center justify-between h-20">
          {/* Logo with animation */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/') }>
            <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
          </div>
          {/* Navigation Links with enhanced animations */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            {showHomeButton && (
              <Link
                to="/"
                className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
              </Link>
            )}
            <a 
              href="#about" 
              className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10" 
              onClick={(e) => {
                e.preventDefault();
                const aboutSection = document.getElementById('about');
                const navHeight = 80; // Updated height of the navigation bar
                if (aboutSection) {
                  const aboutPosition = aboutSection.offsetTop - navHeight;
                  window.scrollTo({
                    top: aboutPosition,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              <span className="relative z-10">About</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
            </a>
            <a 
              href="#services" 
              className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10" 
              onClick={(e) => {
                e.preventDefault();
                const servicesSection = document.getElementById('services');
                const navHeight = 80; // Updated height of the navigation bar
                if (servicesSection) {
                  const servicesPosition = servicesSection.offsetTop - navHeight;
                  window.scrollTo({
                    top: servicesPosition,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              <span className="relative z-10">Services</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
            </a>
            <button 
              type="button" 
              onClick={onContactClick ? onContactClick : () => setShowContactModal(true)} 
              className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 focus:outline-none bg-transparent"
            >
              <span className="relative z-10">Contact</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
            </button>
          </div>
          {/* Mobile menu button with animation */}
          <div className="md:hidden">
            <button className="relative group p-2 rounded-lg transition-all duration-300 hover:bg-[#3a5f46]/10">
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300 mb-1.5"></div>
              <div className="w-6 h-0.5 bg-gray-700 group-hover:bg-[#3a5f46] transition-all duration-300"></div>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar; 