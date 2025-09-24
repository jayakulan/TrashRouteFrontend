import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CompanyNotifications from './CompanyNotifications'
import UserProfileDropdowncom from './UserProfileDropdowncom'
import Footer from '../footer.jsx'

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
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
        <circle ref={circleRef} cx={size / 2} cy={size / 2} r={radius} stroke="#3a5f46" strokeWidth={stroke} fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.2s linear' }} />
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
      { icon: '♻', title: 'Eco-Friendly Impact', desc: 'Every pickup reduces landfill waste.' },
      { icon: '🚚', title: 'No Middleman Needed', desc: 'Direct connection from people to industries.' }
    ],
    [
      { icon: '🕐', title: 'Time-Saving System', desc: 'Instant notifications and faster routes.' },
      { icon: '📱', title: 'Mobile Friendly', desc: 'Access the platform on any device.' }
    ]
  ];

  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % cards.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [cards.length]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.scrollTo({ left: activeIndex * slider.offsetWidth, behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <section className="max-w-7xl mx-auto mt-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a5f46] mb-4">Why Choose Us</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] mx-auto rounded-full"></div>
        <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">Discover what makes TrashRoute the leading choice for waste management</p>
      </div>
      <div ref={sliderRef} className="flex overflow-x-hidden relative" style={{ scrollSnapType: 'x mandatory' }}>
        {cards.map((pair, idx) => (
          <div key={idx} className="flex-shrink-0 w-full snap-center flex flex-row justify-center gap-6" style={{ minWidth: '100%' }}>
            {pair.map((card, cidx) => (
              <div key={cidx} className={`flex flex-col items-center rounded-xl p-10 m-4 shadow transition-transform duration-300 hover:scale-105 hover:shadow-[0_4px_32px_0_#3a5f46] w/full max-w-md h-72 relative ${['Eco-Friendly Impact','No Middleman Needed','Time-Saving System','Mobile Friendly'].includes(card.title) ? 'bg-cover bg-center' : 'bg-white hover:bg-gray-100'}`.replace('w/full','w-full')}
                   style={card.title === 'Eco-Friendly Impact' ? { backgroundImage: 'url(/public/images/image1.avif)' }
                     : card.title === 'No Middleman Needed' ? { backgroundImage: 'url(/public/images/image2.avif)' }
                     : card.title === 'Time-Saving System' ? { backgroundImage: 'url(/public/images/image3.jpg)' }
                     : card.title === 'Mobile Friendly' ? { backgroundImage: 'url(/public/images/image4.jpeg)' } : {}}>
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
      <div className="flex justify-center mt-4 gap-2">
        {cards.map((_, idx) => (
          <button key={idx} className={`w-3 h-3 rounded-full ${activeIndex === idx ? 'bg-[#3a5f46]' : 'bg-gray-300'} transition`} onClick={() => setActiveIndex(idx)} aria-label={`Go to slide ${idx + 1}`} />
        ))}
      </div>
    </section>
  );
}

export default function CompanyHome() {
  const navigate = useNavigate();
  const aboutUsRef = useRef(null);
  const aboutUsImgRef = useRef(null);
  const [aboutUsVisible, setAboutUsVisible] = useState(false);

  useEffect(() => {
    document.title = 'Company Home - TrashRoute';
    const observer = new window.IntersectionObserver(([entry]) => setAboutUsVisible(entry.isIntersecting), { threshold: 0.1 });
    if (aboutUsImgRef.current) observer.observe(aboutUsImgRef.current);
    return () => observer.disconnect();
  }, []);

  const [showFeature1Info, setShowFeature1Info] = useState(false);
  const [showFeature2Info, setShowFeature2Info] = useState(false);
  const [showFeature3Info, setShowFeature3Info] = useState(false);
  const [showFeature4Info, setShowFeature4Info] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col w-full">
      {/* Company Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
        <div className="w-full h-1 bg-[#26a360]"></div>
        <nav className="w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50">
          <div className="w-full flex items-center justify-between h-20 px-4 md:px-8">
            <div className="flex items-center">
              <img src="/public/images/logo2.png" alt="Logo" className="h-16 w-34" />
            </div>
            <div className="flex items-center space-x-8 ml-auto">
              <button type="button" onClick={() => navigate('/company/home')} className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 focus:outline-none bg-transparent nav-link-text">
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
              </button>
              <button type="button" onClick={() => navigate('/company-waste-prefer')} className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 focus:outline-none bg-transparent nav-link-text">
                <span className="relative z-10">Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
              </button>
              <button type="button" onClick={() => navigate('/company/historylogs')} className="relative group px-4 py-2 rounded-lg transition-all duration-300 hover:text-[#3a5f46] hover:bg-[#3a5f46]/10 focus:outline-none bg-transparent nav-link-text">
                <span className="relative z-10">Historylogs</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#3a5f46]/20 to-[#2e4d3a]/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] group-hover:w-full transition-all duration-300"></div>
              </button>
              <CompanyNotifications />
              <UserProfileDropdowncom />
            </div>
          </div>
        </nav>
      </div>

      <main className="w-full flex-1 pt-[88px]">
        {/* How It Works */}
        <section className="w-full max-w-7xl mx-auto mt-8 sm:mt-12 md:mt-16 px-2 sm:px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a5f46] mb-4">How It Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] mx-auto rounded-full"></div>
            <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">Discover our innovative waste management process in four simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
            <div className="group bg-white rounded-xl p-0 flex flex-col items-center shadow transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden hover:bg-[#3a5f46]" style={{ minHeight: '270px', height: '270px' }}>
              <div className="w-full flex-shrink-0" style={{ height: '75%' }}>
                <img src="/public/images/feature1.jpg" alt="Notify Trash" className="w-full h-full object-cover object-center rounded-t-xl" />
              </div>
              <div className="flex flex-col items-center w-full justify-center flex-grow" style={{ height: '25%' }}>
                <div className="font-semibold text-[#618170] text-base drop-shadow mb-1">Notify Trash Availability</div>
                <button className="flex items-center gap-2 px-3 py-1 bg-[#3a5f46] text-white font-semibold rounded-full shadow transition group-hover:bg-[#2e4d3a] group/button mx-auto text-sm" onClick={() => setShowFeature1Info(true)}>
                  Explore
                  <span className="inline-block transition-transform duration-300 group-hover/button:translate-x-2">➡</span>
                </button>
              </div>
            </div>
            <div className="group bg-white rounded-xl p-0 flex flex-col items-center shadow transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden hover:bg-[#3a5f46]" style={{ minHeight: '270px', height: '270px' }}>
              <div className="w-full flex-shrink-0" style={{ height: '75%' }}>
                <img src="/public/images/feature2.jpg" alt="Route Optimization" className="w-full h-full object-cover object-center rounded-t-xl" />
              </div>
              <div className="flex flex-col items-center w-full justify-center flex-grow" style={{ height: '25%' }}>
                <div className="font-semibold text-[#618170] text-base drop-shadow mb-1">Route Optimization</div>
                <button className="flex items-center gap-2 px-3 py-1 bg-[#3a5f46] text-white font-semibold rounded-full shadow transition group-hover:bg-[#2e4d3a] group/button mx-auto text-sm" onClick={() => setShowFeature2Info(true)}>
                  Explore
                  <span className="inline-block transition-transform duration-300 group-hover/button:translate-x-2">➡</span>
                </button>
              </div>
            </div>
            <div className="group bg-white rounded-xl p-0 flex flex-col items-center shadow transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden hover:bg-[#3a5f46]" style={{ minHeight: '270px', height: '270px' }}>
              <div className="w-full flex-shrink-0" style={{ height: '75%' }}>
                <img src="/public/images/feature3.jpg" alt="Notify Industries" className="w-full h-full object-cover object-center rounded-t-xl" />
              </div>
              <div className="flex flex-col items-center w-full justify-center flex-grow" style={{ height: '25%' }}>
                <div className="font-semibold text-[#618170] text-base drop-shadow mb-1">Notify Industries</div>
                <button className="flex items-center gap-2 px-3 py-1 bg-[#3a5f46] text-white font-semibold rounded-full shadow transition group-hover:bg-[#2e4d3a] group/button mx-auto text-sm" onClick={() => setShowFeature3Info(true)}>
                  Explore
                  <span className="inline-block transition-transform duration-300 group-hover/button:translate-x-2">➡</span>
                </button>
              </div>
            </div>
            <div className="group bg-white rounded-xl p-0 flex flex-col items-center shadow transition-transform duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden hover:bg-[#3a5f46]" style={{ minHeight: '270px', height: '270px' }}>
              <div className="w-full flex-shrink-0" style={{ height: '75%' }}>
                <img src="/public/images/feature4.jpg" alt="Industry Accepts Route" className="w-full h-full object-cover object-center rounded-t-xl" />
              </div>
              <div className="flex flex-col items-center w-full justify-center flex-grow" style={{ height: '25%' }}>
                <div className="font-semibold text-[#618170] text-base drop-shadow mb-1">Industry Accepts Route</div>
                <button className="flex items-center gap-2 px-3 py-1 bg-[#3a5f46] text-white font-semibold rounded-full shadow transition group-hover:bg-[#2e4d3a] group/button mx-auto text-sm" onClick={() => setShowFeature4Info(true)}>
                  Explore
                  <span className="inline-block transition-transform duration-300 group-hover/button:translate-x-2">➡</span>
                </button>
              </div>
            </div>
          </div>

          {showFeature1Info && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="relative group bg-[#3a5f46] rounded-xl p-0 flex flex-col items-center shadow-2xl overflow-hidden" style={{ minHeight: '270px', width: '100%', maxWidth: '320px' }}>
                <button className="absolute top-2 right-2 text-2xl text-gray-200 hover:text-white" onClick={() => setShowFeature1Info(false)}>&times;</button>
                <div className="text-white font-bold text-lg mb-2 mt-8">Notify Trash Availability</div>
                <div className="text-white text-base text-center px-4">Local users inform the system about available recyclable materials.</div>
              </div>
            </div>
          )}
          {showFeature2Info && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="relative group bg-[#3a5f46] rounded-xl p-0 flex flex-col items-center shadow-2xl overflow-hidden" style={{ minHeight: '270px', width: '100%', maxWidth: '320px' }}>
                <button className="absolute top-2 right-2 text-2xl text-gray-200 hover:text-white" onClick={() => setShowFeature2Info(false)}>&times;</button>
                <div className="text-white font-bold text-lg mb-2 mt-8">Route Optimization</div>
                <div className="text-white text-base text-center px-4">TrashRoute analyzes and creates categorized, optimized pickup routes.</div>
              </div>
            </div>
          )}
          {showFeature3Info && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="relative group bg-[#3a5f46] rounded-xl p-0 flex flex-col items-center shadow-2xl overflow-hidden" style={{ minHeight: '270px', width: '100%', maxWidth: '320px' }}>
                <button className="absolute top-2 right-2 text-2xl text-gray-200 hover:text-white" onClick={() => setShowFeature3Info(false)}>&times;</button>
                <div className="text-white font-bold text-lg mb-2 mt-8">Notify Industries</div>
                <div className="text-white text-base text-center px-4">Registered companies are notified with detailed route and material info.</div>
              </div>
            </div>
          )}
          {showFeature4Info && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="relative group bg-[#3a5f46] rounded-xl p-0 flex flex-col items-center shadow-2xl overflow-hidden" style={{ minHeight: '270px', width: '100%', maxWidth: '320px' }}>
                <button className="absolute top-2 right-2 text-2xl text-gray-200 hover:text-white" onClick={() => setShowFeature4Info(false)}>&times;</button>
                <div className="text-white font-bold text-lg mb-2 mt-8">Industry Accepts Route</div>
                <div className="text-white text-base text-center px-4">Companies select and confirm routes they want to handle.</div>
              </div>
            </div>
          )}
        </section>

        {/* Who Can Use TrashRoute? */}
        <section className="w-full max-w-7xl mx-auto mt-8 sm:mt-12 md:mt-16 px-2 sm:px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a5f46] mb-4">Who Can Use TrashRoute?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] mx-auto rounded-full"></div>
            <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">Our platform serves three key user groups for comprehensive waste management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 w-full">
            <div className="flex flex-col items-center bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-blue-100 transition-all duration-300" style={{background: 'linear-gradient(135deg, #e0e7ff 60%, #f0fdfa 100%)'}}>
              <div className="text-5xl mb-4">🏡</div>
              <div className="font-bold text-lg text-blue-900 mb-2 text-center">Local People</div>
              <div className="text-gray-700 text-base text-center">Recycle easily from home.</div>
            </div>
            <div className="flex flex-col items-center bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-purple-100 transition-all duration-300" style={{background: 'linear-gradient(135deg, #ede9fe 60%, #e0f2fe 100%)'}}>
              <div className="text-5xl mb-4">🏭</div>
              <div className="font-bold text-lg text-purple-900 mb-2 text-center">Industries</div>
              <div className="text-gray-700 text-base text-center">Get recyclable materials directly.</div>
            </div>
            <div className="flex flex-col items-center bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-cyan-100 transition-all duration-300" style={{background: 'linear-gradient(135deg, #cffafe 60%, #f3e8ff 100%)'}}>
              <div className="text-5xl mb-4">🧑‍💼</div>
              <div className="font-bold text-lg text-cyan-900 mb-2 text-center">Admin</div>
              <div className="text-gray-700 text-base text-center">Monitor and manage the platform.</div>
            </div>
          </div>
        </section>

        {/* About Us */}
        <section id="about" ref={aboutUsRef} className="mt-8 sm:mt-12 md:mt-16 w-full">
          <div className="text-center mb-8 sm:mb-12 max-w-7xl mx-auto px-2 sm:px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a5f46] mb-4">About Us</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] mx-auto rounded-full"></div>
            <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">Learn about our mission to revolutionize waste management</p>
          </div>
          <div className="relative w-full max-w-7xl mx-auto mb-4 sm:mb-8">
            <img ref={aboutUsImgRef} src="/public/images/TrashCollect.png" alt="Trash Collecting" className="w-full rounded-2xl shadow-lg" />
            <div className={`absolute left-0 bottom-0 m-6 transition-transform duration-700 ${aboutUsVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="bg-white/80 rounded-2xl shadow-lg p-4 sm:p-6 max-w-2xl text-justify w-full">
                <p className="text-gray-700 text-base md:text-lg text-justify">
                  TrashRoute is an innovative web-based platform built to improve how recyclable waste is managed and reused. We connect everyday people who have recyclable materials—like plastic, paper, glass, and metal—with industries that can reuse those materials in their production.<br />
                  Instead of collecting and storing waste, our system allows local users to simply notify the platform when they have recyclable items. TrashRoute then creates an optimized and categorized route for these materials and offers it to registered industries. When an industry accepts a route, they collect the materials directly from the listed locations.<br />
                  By removing the need for middle collection points, we reduce costs, save time, and contribute to a cleaner environment. TrashRoute empowers communities and industries to work together toward a sustainable future—turning everyday waste into valuable resources.
                </p>
                <div role="dialog" aria-labelledby="districtNoticeTitleCompany" className="mt-4 rounded-lg border border-[#3a5f46]/30 bg-white shadow p-3">
                  <div id="districtNoticeTitleCompany" className="font-semibold text-[#3a5f46] mb-1">Notice</div>
                  <p className="text-gray-700 text-sm">This system now only works for Badulla district.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section id="services" className="w-full max-w-7xl mx-auto mt-8 sm:mt-12 md:mt-16 px-2 sm:px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#3a5f46] mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#3a5f46] to-[#2e4d3a] mx-auto rounded-full"></div>
            <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">Discover the key services that make TrashRoute unique and effective</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
            <div className="flex flex-col items-center bg-gradient-to-br from-[#e6f4ea] to-[#cfe3d6] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105 group cursor-pointer border border-[#d0e9d6]">
              <div className="text-4xl mb-4">🗂</div>
              <div className="font-bold text-[#3a5f46] text-lg mb-2 text-center">Smart Waste Categorization</div>
              <div className="text-gray-600 text-base text-center">Our system intelligently categorizes waste to ensure proper handling and recycling.</div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-[#e6f4ea] to-[#cfe3d6] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105 group cursor-pointer border border-[#d0e9d6]">
              <div className="text-4xl mb-4">🚛</div>
              <div className="font-bold text-[#3a5f46] text-lg mb-2 text-center">Efficient Pickup Service</div>
              <div className="text-gray-600 text-base text-center">We provide a reliable and efficient pickup service, optimizing routes for timely collection.</div>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-[#e6f4ea] to-[#cfe3d6] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-105 group cursor-pointer border border-[#d0e9d6]">
              <div className="text-4xl mb-4">📍</div>
              <div className="font-bold text-[#3a5f46] text-lg mb-2 text-center">Real-time Tracking</div>
              <div className="text-gray-600 text-base text-center">Track your waste pickup in real-time, from notification to collection.</div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <div className="overflow-x-auto w-full max-w-full">
          <WhyChooseUsSlider />
        </div>

        <ScrollToTopButton />
      </main>

      <Footer />
    </div>
  )
}


