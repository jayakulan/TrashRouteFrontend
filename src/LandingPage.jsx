import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ContactModal from './ContactForm'

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
      setVisible(scrollTop > 50);
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



function WhyChooseUsSlider() {
  const cards = [
    [
      {
        icon: "♻️",
        title: "Eco-Friendly Impact",
        desc: "Every pickup reduces landfill waste."
      },
      {
        icon: "🚚",
        title: "No Middleman Needed",
        desc: "Direct connection from people to industries."
      }
    ],
    [
      {
        icon: "🕐",
        title: "Time-Saving System",
        desc: "Instant notifications and faster routes."
      },
      {
        icon: "📱",
        title: "Mobile Friendly",
        desc: "Access the platform on any device."
      }
    ]
  ];

  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cards.length]);

  // Scroll to active card when index changes
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.scrollTo({
        left: activeIndex * slider.offsetWidth,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  return (
    <section className="max-w-7xl mx-auto mt-16 px-4">

      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a5f46] mb-4 animate-fade-in-up">
          Why Choose Us
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] mx-auto rounded-full animate-pulse"></div>
        <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
          Discover what makes TrashRoute the leading choice for waste management
        </p>
      </div>
      <div
        ref={sliderRef}
        className="flex overflow-x-hidden relative"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {cards.map((cardPair, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full snap-center flex flex-row justify-center gap-6"
            style={{ minWidth: "100%", transition: "transform 0.3s" }}
          >
            {cardPair.map((card, cidx) => (
              <div
                key={cidx}
                className={`flex flex-col items-center rounded-xl p-10 m-4 shadow transition-transform duration-300 hover:scale-105 hover:shadow-[0_4px_32px_0_#3a5f46] w-full max-w-md h-72 relative ${['Eco-Friendly Impact','No Middleman Needed','Time-Saving System','Mobile Friendly'].includes(card.title) ? 'bg-cover bg-center' : 'bg-white hover:bg-gray-100'}`}
                style={card.title === 'Eco-Friendly Impact'
                  ? { backgroundImage: 'url(/public/images/image1.avif)' }
                  : card.title === 'No Middleman Needed'
                    ? { backgroundImage: 'url(/public/images/image2.avif)' }
                    : card.title === 'Time-Saving System'
                      ? { backgroundImage: 'url(/public/images/image3.jpg)' }
                      : card.title === 'Mobile Friendly'
                        ? { backgroundImage: 'url(/public/images/image4.jpeg)' }
                        : {}}
              >
                {(card.title === 'Eco-Friendly Impact' || card.title === 'No Middleman Needed' || card.title === 'Time-Saving System' || card.title === 'Mobile Friendly') && (
                  <div className="absolute inset-0 bg-white/80 rounded-xl z-0"></div>
                )}
                <div className="text-4xl mb-3 z-10">{card.icon}</div>
                <div className="font-bold text-[#3a5f46] mb-2 text-center z-10">{card.title}</div>
                <div className="text-gray-600 text-sm text-center z-10">{card.desc}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {cards.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${activeIndex === idx ? 'bg-[#3a5f46]' : 'bg-gray-300'} transition`}
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function LandingPage() {
  const [userType, setUserType] = useState('customer')
  const [showFeature1Info, setShowFeature1Info] = useState(false)
  const [showFeature2Info, setShowFeature2Info] = useState(false)
  const [showFeature3Info, setShowFeature3Info] = useState(false)
  const [showFeature4Info, setShowFeature4Info] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Add custom animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slideInFromTop {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes pulseGlow {
        0%, 100% {
          box-shadow: 0 0 5px rgba(58, 95, 70, 0.1);
        }
        50% {
          box-shadow: 0 0 20px rgba(58, 95, 70, 0.3);
        }
      }
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-5px);
        }
      }
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      .animate-slide-in-top {
        animation: slideInFromTop 0.6s ease-out forwards;
      }
      .animate-pulse-glow {
        animation: pulseGlow 2s ease-in-out infinite;
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      .animation-delay-200 {
        animation-delay: 0.2s;
      }
      .animation-delay-400 {
        animation-delay: 0.4s;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // About Us intersection observer for slide-in effect
  const aboutUsRef = useRef(null);
  const aboutUsImgRef = useRef(null);
  const [aboutUsVisible, setAboutUsVisible] = useState(false);

  useEffect(() => {
    document.title = 'Landing Page - TrashRoute';
    const observer = new window.IntersectionObserver(
      ([entry]) => setAboutUsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (aboutUsImgRef.current) observer.observe(aboutUsImgRef.current);
    return () => observer.disconnect();
  }, []);

  // Check if we should show contact modal from navigation state
  useEffect(() => {
    if (location.state?.showContactModal) {
      setShowContactModal(true);
      // Clear the state to prevent showing modal on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Unsplash or similar royalty-free images
  const heroImg = 'https://images.unsplash.com/photo-1508873699372-7aeab60b44c9?auto=format&fit=crop&w=900&q=80' // recycling bins
  const howItWorksImgs = [
    'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', // trash notification
    'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=400&q=80', // garbage truck
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', // industry
    'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80', // truck accept
  ]

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Navigation */}
      {/* Accent bar at the very top */}
      <div className="absolute top-0 left-0 right-0 w-screen h-1 bg-[#26a360] rounded-t-2xl z-50"></div>
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40 shadow-xl transition-all duration-300 relative">
        <div className="w-full flex items-center justify-between h-20">
          {/* Logo with animation */}
          <div className="flex items-center">
            <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
          </div>
          
          {/* Navigation Links with enhanced animations */}
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a 
              href="#about" 
              className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10" 
              onClick={(e) => {
                e.preventDefault();
                const aboutSection = document.getElementById('about');
                const navHeight = 80; // Updated height of the navigation bar
                const aboutPosition = aboutSection.offsetTop - navHeight;
                window.scrollTo({
                  top: aboutPosition,
                  behavior: 'smooth'
                });
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
                const servicesPosition = servicesSection.offsetTop - navHeight;
                window.scrollTo({
                  top: servicesPosition,
                  behavior: 'smooth'
                });
              }}
            >
              <span className="relative z-10">Services</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
            </a>
            
            <button 
              type="button" 
              onClick={() => setShowContactModal(true)} 
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

      {/* Hero Section - Video right after header */}
      <section className="relative w-full overflow-hidden bg-[#f7f9fb]" style={{ height: 'calc(90vh - 64px)' }}>
        <div className="max-w-7xl mx-auto px-4 h-full relative bg-[#f7f9fb]">
          <video
            src="/homevedio.mp4"
            className="w-full h-full object-cover object-center z-0"
            autoPlay
            loop
            muted
            playsInline
            onError={(e) => console.error('Video error:', e)}
            onLoadStart={() => console.log('Video loading started')}
            onCanPlay={() => console.log('Video can play')}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-[#f7f9fb]/40 z-10"></div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-[#3a5f46] text-xl md:text-2xl lg:text-3xl mb-8 font-bold leading-relaxed tracking-wide">
              Connecting households with responsible waste processing companies for a cleaner, greener future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <button
                onClick={() => { setUserType('customer'); navigate('/login'); }}
                className="px-8 py-3 rounded-md font-bold text-base bg-[#3a5f46] text-white shadow-lg hover:bg-[#2e4d3a] transition-all duration-300 transform hover:scale-105 border-2 border-[#3a5f46] hover:border-[#2e4d3a] hover:shadow-xl"
              >
                Sign In
              </button>
              <button
                onClick={() => { setUserType('company'); navigate('/signup'); }}
                className="px-8 py-3 rounded-md font-bold text-base bg-transparent text-[#3a5f46] shadow-lg hover:bg-[#3a5f46] hover:text-white transition-all duration-300 transform hover:scale-105 border-2 border-[#3a5f46] hover:shadow-xl"
              >
                Sign up
              </button>

            </div>
          </div>
        </div>
        
        {/* Headline positioned within the video */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
          <h1 className="text-[#3a5f46] text-4xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-2xl text-center px-4">
            Revolutionizing Waste Management
          </h1>
        </div>
        
       
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto mt-16 px-4">

        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a5f46] mb-4 animate-fade-in-up">
            How It Works
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] mx-auto rounded-full animate-pulse"></div>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Discover our innovative waste management process in four simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Feature 1: Notify Trash Availability */}
          <div className="group bg-white rounded-xl p-0 flex flex-col items-center shadow transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden hover:bg-[#3a5f46]" style={{ minHeight: '270px', height: '270px' }}>
            <div className="w-full flex-shrink-0" style={{ height: '75%' }}>
              <img src="/public/images/feature1.jpg" alt="Notify Trash" className="w-full h-full object-cover object-center rounded-t-xl" />
            </div>
            <div className="flex flex-col items-center w-full justify-center flex-grow" style={{ height: '25%' }}>
              <div className="font-semibold text-[#618170] text-base drop-shadow mb-1">Notify Trash Availability</div>
              <button
                className="flex items-center gap-2 px-3 py-1 bg-[#3a5f46] text-white font-semibold rounded-full shadow transition group-hover:bg-[#2e4d3a] group/button mx-auto text-sm"
                onClick={() => setShowFeature1Info(true)}
              >
                Explore
                <span className="inline-block transition-transform duration-300 group-hover/button:translate-x-2 group-hover/button:drop-shadow-glow">➡️</span>
              </button>
            </div>
          </div>
          {/* Feature 2: Route Optimization */}
          <div className="group bg-white rounded-xl p-0 flex flex-col items-center shadow transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden hover:bg-[#3a5f46]" style={{ minHeight: '270px', height: '270px' }}>
            <div className="w-full flex-shrink-0" style={{ height: '75%' }}>
              <img src="/public/images/feature2.jpg" alt="Route Optimization" className="w-full h-full object-cover object-center rounded-t-xl" />
            </div>
            <div className="flex flex-col items-center w-full justify-center flex-grow" style={{ height: '25%' }}>
              <div className="font-semibold text-[#618170] text-base drop-shadow mb-1">Route Optimization</div>
              <button
                className="flex items-center gap-2 px-3 py-1 bg-[#3a5f46] text-white font-semibold rounded-full shadow transition group-hover:bg-[#2e4d3a] group/button mx-auto text-sm"
                onClick={() => setShowFeature2Info(true)}
              >
                Explore
                <span className="inline-block transition-transform duration-300 group-hover/button:translate-x-2 group-hover/button:drop-shadow-glow">➡️</span>
              </button>
            </div>
          </div>
          {/* Feature 3: Notify Industries */}
          <div className="group bg-white rounded-xl p-0 flex flex-col items-center shadow transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden hover:bg-[#3a5f46]" style={{ minHeight: '270px', height: '270px' }}>
            <div className="w-full flex-shrink-0" style={{ height: '75%' }}>
              <img src="/public/images/feature3.jpg" alt="Notify Industries" className="w-full h-full object-cover object-center rounded-t-xl" />
            </div>
            <div className="flex flex-col items-center w-full justify-center flex-grow" style={{ height: '25%' }}>
              <div className="font-semibold text-[#618170] text-base drop-shadow mb-1">Notify Industries</div>
              <button
                className="flex items-center gap-2 px-3 py-1 bg-[#3a5f46] text-white font-semibold rounded-full shadow transition group-hover:bg-[#2e4d3a] group/button mx-auto text-sm"
                onClick={() => setShowFeature3Info(true)}
              >
                Explore
                <span className="inline-block transition-transform duration-300 group-hover/button:translate-x-2 group-hover/button:drop-shadow-glow">➡️</span>
              </button>
            </div>
          </div>
          {/* Feature 4: Industry Accepts Route */}
          <div className="group bg-white rounded-xl p-0 flex flex-col items-center shadow transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden hover:bg-[#3a5f46]" style={{ minHeight: '270px', height: '270px' }}>
            <div className="w-full flex-shrink-0" style={{ height: '75%' }}>
              <img src="/public/images/feature4.jpg" alt="Industry Accepts Route" className="w-full h-full object-cover object-center rounded-t-xl" />
            </div>
            <div className="flex flex-col items-center w-full justify-center flex-grow" style={{ height: '25%' }}>
              <div className="font-semibold text-[#618170] text-base drop-shadow mb-1">Industry Accepts Route</div>
              <button
                className="flex items-center gap-2 px-3 py-1 bg-[#3a5f46] text-white font-semibold rounded-full shadow transition group-hover:bg-[#2e4d3a] group/button mx-auto text-sm"
                onClick={() => setShowFeature4Info(true)}
              >
                Explore
                <span className="inline-block transition-transform duration-300 group-hover/button:translate-x-2 group-hover/button:drop-shadow-glow">➡️</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modals for each feature, rendered outside the cards to prevent blinking/collapse */}
        {showFeature1Info && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative group bg-[#3a5f46] rounded-xl p-0 flex flex-col items-center shadow-2xl overflow-hidden" style={{ minHeight: '270px', width: '100%', maxWidth: '320px' }}>
              <button
                className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-black"
                onClick={() => setShowFeature1Info(false)}
              >
                &times;
              </button>
              <div className="text-white font-bold text-lg mb-2 mt-8">Notify Trash Availability</div>
              <div className="text-white text-base text-center px-4">Local users inform the system about available recyclable materials.</div>
            </div>
          </div>
        )}
        {showFeature2Info && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative group bg-[#3a5f46] rounded-xl p-0 flex flex-col items-center shadow-2xl overflow-hidden" style={{ minHeight: '270px', width: '100%', maxWidth: '320px' }}>
              <button
                className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-black"
                onClick={() => setShowFeature2Info(false)}
              >
                &times;
              </button>
              <div className="text-white font-bold text-lg mb-2 mt-8">Route Optimization</div>
              <div className="text-white text-base text-center px-4">TrashRoute analyzes and creates categorized, optimized pickup routes.</div>
            </div>
          </div>
        )}
        {showFeature3Info && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative group bg-[#3a5f46] rounded-xl p-0 flex flex-col items-center shadow-2xl overflow-hidden" style={{ minHeight: '270px', width: '100%', maxWidth: '320px' }}>
              <button
                className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-black"
                onClick={() => setShowFeature3Info(false)}
              >
                &times;
              </button>
              <div className="text-white font-bold text-lg mb-2 mt-8">Notify Industries</div>
              <div className="text-white text-base text-center px-4">Registered companies are notified with detailed route and material info.</div>
            </div>
          </div>
        )}
        {showFeature4Info && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="relative group bg-[#3a5f46] rounded-xl p-0 flex flex-col items-center shadow-2xl overflow-hidden" style={{ minHeight: '270px', width: '100%', maxWidth: '320px' }}>
              <button
                className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-black"
                onClick={() => setShowFeature4Info(false)}
              >
                &times;
              </button>
              <div className="text-white font-bold text-lg mb-2 mt-8">Industry Accepts Route</div>
              <div className="text-white text-base text-center px-4">Companies select and confirm routes they want to handle.</div>
            </div>
          </div>
        )}
      </section>

      {/* Who Can Use TrashRoute? */}
      <section className="max-w-7xl mx-auto mt-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a5f46] mb-4 animate-fade-in-up">
            Who Can Use TrashRoute?
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] mx-auto rounded-full animate-pulse"></div>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Our platform serves three key user groups for comprehensive waste management
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Local People */}
          <div className="flex flex-col items-center bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-blue-100 hover:shadow-blue-200 hover:-translate-y-2 transition-all duration-300" style={{background: 'linear-gradient(135deg, #e0e7ff 60%, #f0fdfa 100%)'}}>
            <div className="text-5xl mb-4">🏡</div>
            <div className="font-bold text-lg text-blue-900 mb-2 text-center">Local People</div>
            <div className="text-gray-700 text-base text-center">Recycle easily from home.</div>
          </div>
          {/* Industries */}
          <div className="flex flex-col items-center bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-purple-100 hover:shadow-purple-200 hover:-translate-y-2 transition-all duration-300" style={{background: 'linear-gradient(135deg, #ede9fe 60%, #e0f2fe 100%)'}}>
            <div className="text-5xl mb-4">🏭</div>
            <div className="font-bold text-lg text-purple-900 mb-2 text-center">Industries</div>
            <div className="text-gray-700 text-base text-center">Get recyclable materials directly.</div>
          </div>
          {/* Admin */}
          <div className="flex flex-col items-center bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-cyan-100 hover:shadow-cyan-200 hover:-translate-y-2 transition-all duration-300" style={{background: 'linear-gradient(135deg, #cffafe 60%, #f3e8ff 100%)'}}>
            <div className="text-5xl mb-4">🧑‍💼</div>
            <div className="font-bold text-lg text-cyan-900 mb-2 text-center">Admin</div>
            <div className="text-gray-700 text-base text-center">Monitor and manage the platform.</div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" ref={aboutUsRef} className="mt-16">

        <div className="text-center mb-12 max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a5f46] mb-4 animate-fade-in-up">
            About Us
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] mx-auto rounded-full animate-pulse"></div>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Learn about our mission to revolutionize waste management
          </p>
        </div>

        <div className="relative w-full max-w-7xl mx-auto mb-8">
          <img ref={aboutUsImgRef} src="/public/images/TrashCollect.png" alt="Trash Collecting" className="w-full rounded-2xl shadow-lg" />
          <div className={`absolute left-0 bottom-0 m-6 transition-transform duration-700 ${aboutUsVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="bg-white/80 rounded-2xl shadow-lg p-6 max-w-2xl text-justify">
              <p className="text-gray-700 text-base md:text-lg text-justify">
                TrashRoute is an innovative web-based platform built to improve how recyclable waste is managed and reused. We connect everyday people who have recyclable materials—like plastic, paper, glass, and metal—with industries that can reuse those materials in their production.<br />
                Instead of collecting and storing waste, our system allows local users to simply notify the platform when they have recyclable items. TrashRoute then creates an optimized and categorized route for these materials and offers it to registered industries. When an industry accepts a route, they collect the materials directly from the listed locations.<br />
                By removing the need for middle collection points, we reduce costs, save time, and contribute to a cleaner environment. TrashRoute empowers communities and industries to work together toward a sustainable future—turning everyday waste into valuable resources.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Our Services */}
      <section id="services" className="max-w-7xl mx-auto mt-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a5f46] mb-4 animate-fade-in-up">
            Our Services
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] mx-auto rounded-full animate-pulse"></div>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Discover the key services that make TrashRoute unique and effective
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="flex flex-col items-center bg-gradient-to-br from-[#e6f4ea] to-[#cfe3d6] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105 group cursor-pointer border border-[#d0e9d6]">
            <div className="text-4xl mb-4 drop-shadow">🗂️</div>
            <div className="font-bold text-[#3a5f46] text-lg mb-2 text-center group-hover:text-[#2e4d3a] transition-colors">Smart Waste Categorization</div>
            <div className="text-gray-600 text-base text-center">Our system intelligently categorizes waste to ensure proper handling and recycling.</div>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center bg-gradient-to-br from-[#e6f4ea] to-[#cfe3d6] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105 group cursor-pointer border border-[#d0e9d6]">
            <div className="text-4xl mb-4 drop-shadow">🚛</div>
            <div className="font-bold text-[#3a5f46] text-lg mb-2 text-center group-hover:text-[#2e4d3a] transition-colors">Efficient Pickup Service</div>
            <div className="text-gray-600 text-base text-center">We provide a reliable and efficient pickup service, optimizing routes for timely collection.</div>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center bg-gradient-to-br from-[#e6f4ea] to-[#cfe3d6] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105 group cursor-pointer border border-[#d0e9d6]">
            <div className="text-4xl mb-4 drop-shadow">📍</div>
            <div className="font-bold text-[#3a5f46] text-lg mb-2 text-center group-hover:text-[#2e4d3a] transition-colors">Real-time Tracking</div>
            <div className="text-gray-600 text-base text-center">Track your waste pickup in real-time, from notification to collection.</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUsSlider />

      <ScrollToTopButton />

      {/* Render ContactModal if open */}
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  )
}

export default LandingPage
