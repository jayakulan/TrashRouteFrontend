import React from 'react';

const TermsOfService = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-[#e6f4ea] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#e6f4ea] border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              📋 Terms of Service for TrashRoute
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">Effective Date: December 2024</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Welcome to TrashRoute! These Terms of Service govern your use of our waste management platform. 
              By accessing or using TrashRoute, you agree to be bound by these terms and our Privacy Policy.
            </p>

            {/* Section 1 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                🎯 1. Service Description
              </h2>
              <p className="text-gray-700 mb-3">
                TrashRoute is a waste management platform that connects users, waste collection companies, and recycling industries. 
                Our services include:
              </p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Waste pickup scheduling and route optimization</li>
                <li>• Connection between waste generators and collection services</li>
                <li>• Recycling material marketplace for industries</li>
                <li>• Real-time tracking and notifications</li>
                <li>• Payment processing for route purchases</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                👤 2. User Accounts and Registration
              </h2>
              <p className="text-gray-700 mb-3">To use TrashRoute, you must:</p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Be at least 18 years old or have parental consent</li>
                <li>• Provide accurate and complete registration information</li>
                <li>• Maintain the security of your account credentials</li>
                <li>• Notify us immediately of any unauthorized account use</li>
                <li>• Accept responsibility for all activities under your account</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                ✅ 3. Acceptable Use
              </h2>
              <p className="text-gray-700 mb-3">You agree to use TrashRoute only for lawful purposes and in accordance with these terms. You must not:</p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Submit false or misleading information about waste availability</li>
                <li>• Use the service for illegal waste disposal activities</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Interfere with or disrupt the service or servers</li>
                <li>• Use the service to harm others or their property</li>
                <li>• Violate any applicable laws or regulations</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                💰 4. Payment Terms
              </h2>
              <p className="text-gray-700 mb-3">For companies purchasing routes:</p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• All payments are processed securely through PayHere</li>
                <li>• Route purchases are non-refundable unless service is not provided</li>
                <li>• Prices are subject to change with prior notice</li>
                <li>• You are responsible for all applicable taxes</li>
                <li>• Disputed charges must be reported within 30 days</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                📍 5. Location Services and Privacy
              </h2>
              <p className="text-gray-700 mb-3">
                By using TrashRoute's location features, you consent to:
              </p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Sharing your location when you notify waste availability</li>
                <li>• Your location being visible to relevant collection companies</li>
                <li>• Location data being used for route optimization</li>
                <li>• Location information being stored as described in our Privacy Policy</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                ⚠️ 6. Disclaimers and Limitations
              </h2>
              <p className="text-gray-700 mb-3">
                TrashRoute provides the service "as is" and makes no warranties about:
              </p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Uninterrupted or error-free service</li>
                <li>• Accuracy of route optimization or timing</li>
                <li>• Quality of waste collection services provided by third parties</li>
                <li>• Compatibility with all devices or browsers</li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                We are not responsible for delays, damages, or losses resulting from:
              </p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Acts of third-party service providers</li>
                <li>• Force majeure events (natural disasters, strikes, etc.)</li>
                <li>• Technical issues beyond our reasonable control</li>
                <li>• User errors or miscommunications</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                🛡️ 7. Liability and Indemnification
              </h2>
              <p className="text-gray-700 mb-3">
                You agree to indemnify and hold harmless TrashRoute from any claims arising from:
              </p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Your violation of these terms</li>
                <li>• Your use of the service</li>
                <li>• Your interactions with other users or service providers</li>
                <li>• Any content you submit or share</li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                Our total liability to you shall not exceed the amount you paid for our services in the 12 months preceding the claim.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                📝 8. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-3">
                TrashRoute and its content are protected by intellectual property laws. You may not:
              </p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Copy, modify, or distribute our software or content</li>
                <li>• Reverse engineer or attempt to extract source code</li>
                <li>• Use our trademarks or branding without permission</li>
                <li>• Create derivative works based on our platform</li>
              </ul>
            </div>

            {/* Section 9 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                🔄 9. Termination
              </h2>
              <p className="text-gray-700 mb-3">
                We may terminate or suspend your account if you:
              </p>
              
              <ul className="ml-4 space-y-2 text-gray-700">
                <li>• Violate these terms of service</li>
                <li>• Engage in fraudulent or illegal activities</li>
                <li>• Fail to pay for services when due</li>
                <li>• Provide false or misleading information</li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                You may terminate your account at any time by contacting support. Upon termination, your access to the service will cease immediately.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                📅 10. Changes to Terms
              </h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the platform. 
                Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </div>

            {/* Section 11 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                ⚖️ 11. Governing Law
              </h2>
              <p className="text-gray-700">
                These terms are governed by the laws of Sri Lanka. Any disputes shall be resolved in the courts of Sri Lanka, 
                unless otherwise required by applicable law.
              </p>
            </div>

            {/* Section 12 */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                📞 12. Contact Information
              </h2>
              <p className="text-gray-700 mb-3">
                If you have questions about these Terms of Service, please contact us:
              </p>
              
              <div className="ml-4 space-y-2 text-gray-700">
                <p>📧 Email: legal@trashroute.lk</p>
                <p>📍 Address: [Enter Your Organization's Address]</p>
                <p>📞 Phone: [Optional]</p>
                <p>🌐 Website: www.trashroute.lk</p>
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

export default TermsOfService;
