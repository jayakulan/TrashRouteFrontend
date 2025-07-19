import { useRef, useEffect } from 'react';

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
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 p-0 bg-transparent border-none"
          onClick={onClose}
          aria-label="Close"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none' }}
        >
          <img src="/images/close.png" alt="Close" style={{ width: 24, height: 24, display: 'block' }} />
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
          <div className="mb-2"><span className="font-bold">Email:</span> trashroute.wastemanagement@gmail.com</div>
          <div className="mb-2"><span className="font-bold">Phone:</span> 0768304047</div>
          <div className="mb-2"><span className="font-bold">Address:</span><br />No.25 , Passara Road , Badulla , Sri Lanka</div>
          <div className="mt-4"><span className="font-bold">Business Hours:</span><br />Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</div>
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
