import React from 'react';

const PrivacyPolicy = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#e6f4ea] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#e6f4ea] border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              🛡️ Privacy Policy for TrashRoute
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-0 bg-transparent border-none"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none' }}
            >
              <img src="/images/close.png" alt="Close" style={{ width: 24, height: 24, display: 'block' }} />
            </button>
          </div>
          <p className="text-gray-600 mt-2">Effective Date: December 2024</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              At TrashRoute, we are committed to protecting your personal information and your right to privacy. 
              This Privacy Policy explains how we collect, use, and protect your data when you use our platform.
            </p>

            {/* Section 1 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                🔍 1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-3">We collect the following information from users:</p>
              
              <div className="ml-4 space-y-3">
                <div>
                  <h3 className="font-medium text-gray-800">Personal Information:</h3>
                  <p className="text-gray-700">Name, email address, phone number, role (user, admin, industry), address, and password during registration.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Activity Data:</h3>
                  <p className="text-gray-700">Waste pickup requests, route history, location pins (when you notify waste availability), and feedback.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Payment Information:</h3>
                  <p className="text-gray-700">If you are a company using PayHere for route purchases, basic payment details are processed securely through PayHere. We do not store your card or bank details.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-800">Device & Usage Data:</h3>
                  <p className="text-gray-700">Your browser type, access times, pages visited, and interactions to improve our service.</p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                ✅ 2. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-3">We use your data to:</p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Create and manage your account.</li>
                <li>• Generate optimized waste routes.</li>
                <li>• Notify industries about available recyclable materials.</li>
                <li>• Communicate important updates and confirmations.</li>
                <li>• Process payments securely via PayHere.</li>
                <li>• Improve system features and performance.</li>
                <li>• Ensure safety and prevent fraud.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                🔐 3. How We Protect Your Data
              </h2>
              <p className="text-gray-700 mb-3">We use industry-standard security measures such as:</p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Data encryption</li>
                <li>• Role-based access control</li>
                <li>• Secure server storage</li>
                <li>• Safe API handling for third-party services (like Google Maps and PayHere)</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                🤝 4. Who We Share Your Information With
              </h2>
              <p className="text-gray-700 mb-3">We do not sell or rent your personal data.</p>
              <p className="text-gray-700 mb-3">We only share necessary data with:</p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• PayHere for secure payment processing.</li>
                <li>• Google Maps API to locate user addresses.</li>
                <li>• Authorized Admins within TrashRoute for management purposes.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                📍 5. Location Services
              </h2>
              <p className="text-gray-700">
                TrashRoute uses your pinned location only when you submit a waste availability notification. 
                This location is used to create a pickup route and is visible only to relevant industries and admins.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                🧾 6. Your Rights
              </h2>
              <p className="text-gray-700 mb-3">You have the right to:</p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• View or update your profile details.</li>
                <li>• Request account deactivation.</li>
                <li>• Request data deletion by contacting support.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                📞 7. Contact Us
              </h2>
              <p className="text-gray-700 mb-3">
                If you have any questions about this Privacy Policy, you can contact us at:
              </p>
              
              <div className="ml-4 space-y-2 text-gray-700">
                <p>📧 Email: trashroute.wastemanagement@gmail.com</p>
                <p>📍 Address: No.25 , Passara Road , Badulla , Sri Lanka</p>
                <p>📞 Phone: [Optional]</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#e6f4ea] border-t border-gray-200 px-6 py-4 rounded-b-lg">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-[#3a5f46]  text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

