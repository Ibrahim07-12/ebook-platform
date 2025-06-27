import React from 'react';
import Navbar from '../components/Navbar';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onLoginClick={() => {}} />
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg text-gray-700">
          <p className="mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Information We Collect</h2>
          <p className="mb-4">
            When you use our service, we may collect the following information:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li>Name and email address when you register or download our ebook</li>
            <li>Profile information when you sign in with Google or Facebook</li>
            <li>Usage data to improve our service</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>To provide you access to our ebook downloads</li>
            <li>To create and manage your account</li>
            <li>To send you the ebook download link</li>
            <li>To improve our services</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Sharing</h2>
          <p className="mb-6">
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
          <p className="mb-6">
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Deletion</h2>
          <p className="mb-6">
            You can request deletion of your personal data by contacting us at support@example.com. We will process your request within 30 days.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Third-Party Login Services</h2>
          <p className="mb-6">
            When you sign in using Google or Facebook, we only receive basic profile information (name, email) that you explicitly authorize. We do not access your other social media data.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Us</h2>
          <p className="mb-6">
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: support@example.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
