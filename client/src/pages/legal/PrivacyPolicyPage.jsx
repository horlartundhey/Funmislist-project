import React from 'react';

function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Privacy Policy</h1>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        <strong>Last Updated:</strong> [DATE]
      </p>

      <p className="text-gray-600 mb-6 leading-relaxed">
        At Funmislist, we are committed to protecting your privacy and ensuring the security of your 
        personal information. This Privacy Policy explains how we collect, use, store, and protect 
        your data when you use our platform.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Information We Collect</h2>
        
        <h3 className="text-xl font-semibold mb-3 text-gray-600">1.1 Personal Information</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          When you create an account or use our services, we may collect:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Shipping and billing address</li>
          <li>Payment information (processed securely through Paystack)</li>
          <li>Profile information (if provided)</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">1.2 Transaction Information</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We collect information about your transactions, including:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Products purchased or sold</li>
          <li>Property inspections booked</li>
          <li>Payment amounts and dates</li>
          <li>Order history and preferences</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">1.3 Technical Information</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We automatically collect certain technical information when you use our platform:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>Operating system</li>
          <li>Pages visited and actions taken</li>
          <li>Date and time of visits</li>
          <li>Referral URLs</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. How We Use Your Information</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We use the collected information for the following purposes:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>To create and manage your account</li>
          <li>To process transactions and payments</li>
          <li>To facilitate communication between buyers and sellers</li>
          <li>To send order confirmations and updates</li>
          <li>To provide customer support</li>
          <li>To improve our platform and services</li>
          <li>To prevent fraud and ensure platform security</li>
          <li>To send important notifications and updates</li>
          <li>To comply with legal obligations</li>
          <li>To send marketing communications (with your consent)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. Payment Processing</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          All payment transactions on Funmislist are processed securely through <strong>Paystack</strong>, 
          a certified Payment Card Industry Data Security Standard (PCI DSS) compliant payment processor.
        </p>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We do not store your complete payment card information on our servers. Paystack handles all 
          sensitive payment data according to industry standards. For more information about how Paystack 
          protects your payment information, please visit{' '}
          <a 
            href="https://paystack.com/privacy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Paystack's Privacy Policy
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">4. Cookies and Tracking Technologies</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We use cookies and similar tracking technologies to enhance your experience on our platform:
        </p>
        
        <h3 className="text-xl font-semibold mb-3 text-gray-600">4.1 Essential Cookies</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Required for the platform to function properly, including authentication and security features.
        </p>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">4.2 Analytics Cookies</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Help us understand how visitors interact with our platform, allowing us to improve our services.
        </p>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">4.3 Preference Cookies</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Remember your preferences and settings for a personalized experience.
        </p>

        <p className="text-gray-600 mb-4 leading-relaxed">
          You can control cookies through your browser settings. However, disabling cookies may affect 
          the functionality of our platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">5. Third-Party Services</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We use third-party services to operate our platform effectively:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li><strong>Paystack:</strong> Payment processing</li>
          <li><strong>Cloudinary:</strong> Image hosting and optimization</li>
          <li><strong>Email Service Providers:</strong> Transactional and marketing emails</li>
          <li><strong>Analytics Tools:</strong> Platform performance and user behavior analysis</li>
        </ul>
        <p className="text-gray-600 mb-4 leading-relaxed">
          These third parties have their own privacy policies and are responsible for protecting 
          the data they receive from us.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">6. Data Storage and Security</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We implement industry-standard security measures to protect your personal information:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Encrypted data transmission (SSL/TLS)</li>
          <li>Secure server infrastructure</li>
          <li>Regular security audits and updates</li>
          <li>Access controls and authentication</li>
          <li>Data backup and recovery procedures</li>
        </ul>
        <p className="text-gray-600 mb-4 leading-relaxed">
          While we take reasonable precautions to protect your data, no method of transmission over 
          the internet is 100% secure. We cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">7. Data Sharing and Disclosure</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We do not sell your personal information to third parties. We may share your information in 
          the following circumstances:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>With sellers or buyers to facilitate transactions</li>
          <li>With service providers who assist in operating our platform</li>
          <li>When required by law or legal process</li>
          <li>To protect our rights, property, or safety</li>
          <li>With your explicit consent</li>
          <li>In connection with a business transfer or acquisition</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">8. Your Rights and Choices</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          You have the following rights regarding your personal information:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Correction:</strong> Update or correct inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your account and data</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          <li><strong>Data Portability:</strong> Request your data in a portable format</li>
          <li><strong>Restriction:</strong> Request limitation of data processing</li>
        </ul>
        <p className="text-gray-600 mb-4 leading-relaxed">
          To exercise any of these rights, please contact us at{' '}
          <a href="mailto:privacy@funmislist.com" className="text-blue-600 hover:underline">
            privacy@funmislist.com
          </a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">9. Data Retention</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We retain your personal information for as long as necessary to:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Provide our services to you</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce agreements</li>
          <li>Maintain business records</li>
        </ul>
        <p className="text-gray-600 mb-4 leading-relaxed">
          After you close your account, we may retain certain information for legitimate business 
          purposes or as required by law.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">10. Children's Privacy</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Our platform is not intended for individuals under the age of 18. We do not knowingly 
          collect personal information from children. If you are a parent or guardian and believe 
          your child has provided us with personal information, please contact us immediately.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">11. Changes to This Privacy Policy</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We may update this Privacy Policy from time to time to reflect changes in our practices or 
          legal requirements. We will notify you of significant changes by:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Posting the updated policy on this page</li>
          <li>Updating the "Last Updated" date</li>
          <li>Sending an email notification (for material changes)</li>
        </ul>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Your continued use of our platform after changes are posted constitutes acceptance of 
          the updated Privacy Policy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">12. Contact Us</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          If you have questions or concerns about this Privacy Policy or our data practices, 
          please contact us:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 mb-2">
            <strong>Email:</strong>{' '}
            <a href="mailto:privacy@funmislist.com" className="text-blue-600 hover:underline">
              privacy@funmislist.com
            </a>
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Address:</strong> [YOUR BUSINESS ADDRESS]
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong> +234 XXX XXX XXXX
          </p>
        </div>
      </section>

      <div className="bg-blue-50 p-6 rounded-lg mt-8">
        <p className="text-sm text-gray-600">
          By using Funmislist, you acknowledge that you have read, understood, and agree to be bound 
          by this Privacy Policy and our{' '}
          <a href="/legal/terms" className="text-blue-600 hover:underline">
            Terms and Conditions
          </a>.
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
