import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

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

function ContactModal({ onClose }) {
  // Close modal when clicking outside the content
  const modalRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 p-8 relative flex flex-col md:flex-row gap-6">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Left: Form */}
        <div className="flex-1 bg-gray-50 rounded-lg p-6 flex flex-col">
          <div className="font-semibold text-xl mb-4">Send us a Message</div>
          <form className="flex flex-col gap-4">
            <input type="text" placeholder="Name *" className="border rounded px-4 py-2 bg-white" required />
            <input type="email" placeholder="Email *" className="border rounded px-4 py-2 bg-white" required />
            <input type="text" placeholder="Subject *" className="border rounded px-4 py-2 bg-white" required />
            <textarea placeholder="Message *" className="border rounded px-4 py-2 bg-white min-h-[80px]" required />
            <button type="submit" className="mt-2 bg-[#3a5f46] text-white font-semibold py-2 rounded shadow hover:bg-[#2e4d3a] transition">Send Message</button>
          </form>
        </div>
        {/* Right: Contact Info */}
        <div className="flex-1 bg-gray-50 rounded-lg p-6 flex flex-col">
          <div className="font-semibold text-xl mb-4">Contact Information</div>
          <div className="mb-2"><span className="font-bold">Email:</span> support@trashroute.com</div>
          <div className="mb-2"><span className="font-bold">Phone:</span> (555) 123-4567</div>
          <div className="mb-2"><span className="font-bold">Address:</span><br />123 Green Street<br />Eco City, EC 12345</div>
          <div className="mt-4"><span className="font-bold">Business Hours:</span><br />Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</div>
        </div>
      </div>
    </div>
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
      <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <img src="/public/images/logo.png" alt="Logo" className="h-16 w-34" />
          </div>
          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a href="#about" className="hover:text-green-600">About</a>
            <a href="#services" className="hover:text-green-600">Services</a>
            <button type="button" onClick={() => setShowContactModal(true)} className="hover:text-green-600 focus:outline-none bg-transparent">Contact</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex justify-center mt-10">
        <div className="w-full max-w-4xl rounded-2xl overflow-hidden relative" style={{background:'#cfe3d6'}}>
          <div className="flex justify-center w-full">
            <video
              src="/homevedio.mp4"
              className="w-full max-w-5xl h-80 object-cover object-center opacity-85"
              autoPlay
              loop
              muted
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-[#2e4d3a] text-3xl md:text-5xl font-extrabold drop-shadow-lg">Revolutionizing Waste Management</h1>
            <p className="text-black text-base md:text-lg mt-2 mb-6 drop-shadow">Connecting households with responsible waste processing companies for a cleaner, greener future.</p>
            <div className="flex gap-4">
              <button
                onClick={() => { setUserType('customer'); navigate('/login'); }}
                className={`px-6 py-2 rounded-full font-semibold text-white ${userType==='customer' ? 'bg-blue-600' : 'bg-white text-gray-800'} shadow transition`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setUserType('company'); navigate('/signup'); }}
                className="px-6 py-2 rounded-full font-semibold text-white bg-blue-600 shadow transition"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto mt-16 px-4">
        <h2 className="text-xl font-bold mb-6">How It Works</h2>
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

      {/* About Us */}
      <section id="about" className="max-w-4xl mx-auto mt-16 px-4">
        <h2 className="text-lg font-bold mb-2">About Us</h2>
        <p className="text-gray-700">TrashRoute is a platform dedicated to improving waste management by connecting households with waste processing companies. Our goal is to create a more efficient and sustainable system for waste disposal and recycling.</p>
      </section>

      {/* Our Features */}
      <section className="max-w-7xl mx-auto mt-16 px-4">
        <h2 className="text-lg font-bold mb-6">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border flex flex-col items-start">
            <div className="flex items-center mb-3">
              <span className="material-icons text-2xl mr-2">category</span>
              <span className="font-semibold">Smart Waste Categorization</span>
            </div>
            <div className="text-gray-500 text-sm">Our system intelligently categorizes waste to ensure proper handling and recycling.</div>
          </div>
          <div className="bg-white rounded-xl p-6 border flex flex-col items-start">
            <div className="flex items-center mb-3">
              <span className="material-icons text-2xl mr-2">local_shipping</span>
              <span className="font-semibold">Efficient Pickup Service</span>
            </div>
            <div className="text-gray-500 text-sm">We provide a reliable and efficient pickup service, optimizing routes for timely collection.</div>
          </div>
          <div className="bg-white rounded-xl p-6 border flex flex-col items-start">
            <div className="flex items-center mb-3">
              <span className="material-icons text-2xl mr-2">location_on</span>
              <span className="font-semibold">Real-time Tracking</span>
            </div>
            <div className="text-gray-500 text-sm">Track your waste pickup in real-time, from notification to collection.</div>
          </div>
        </div>
      </section>

      <ScrollToTopButton />

      {/* Render ContactModal if open */}
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  )
}

export default LandingPage
