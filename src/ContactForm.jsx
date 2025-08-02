import { useRef, useEffect, useState } from 'react';

function ContactModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setSubmitError('');

    try {
      console.log('Submitting contact form with data:', formData);
      
      const response = await fetch('http://localhost/Trashroutefinal1/Trashroutefinal/TrashRouteBackend/api/contactus.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        setSubmitMessage(data.message);
        // Clear form on success
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setSubmitError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          
          {/* Success/Error Messages */}
          {submitMessage && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-800 font-semibold text-center">
              {submitMessage}
            </div>
          )}
          {submitError && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-800 font-semibold text-center">
              {submitError}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name"
              placeholder="Name *" 
              className="border rounded px-4 py-2 bg-white" 
              required 
              value={formData.name}
              onChange={handleInputChange}
            />
            <input 
              type="email" 
              name="email"
              placeholder="Email *" 
              className="border rounded px-4 py-2 bg-white" 
              required 
              value={formData.email}
              onChange={handleInputChange}
            />
            <input 
              type="text" 
              name="subject"
              placeholder="Subject *" 
              className="border rounded px-4 py-2 bg-white" 
              required 
              value={formData.subject}
              onChange={handleInputChange}
            />
            <textarea 
              name="message"
              placeholder="Message *" 
              className="border rounded px-4 py-2 bg-white min-h-[80px]" 
              required 
              value={formData.message}
              onChange={handleInputChange}
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`mt-2 font-semibold py-2 rounded shadow transition ${
                isSubmitting 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-[#3a5f46] text-white hover:bg-[#2e4d3a]'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
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
