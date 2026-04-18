import React from 'react';

function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Refund Policy</h1>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        <strong>Last Updated:</strong> April 18, 2026
      </p>

      <p className="text-gray-600 mb-6 leading-relaxed">
        At Funmislist, we strive to ensure customer satisfaction. This Refund Policy outlines the 
        conditions under which refunds may be issued for transactions on our platform. Please read 
        this policy carefully before making a purchase.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Overview</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Our refund policy varies depending on the type of transaction:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li><strong>Product Purchases:</strong> Refunds may be available under certain conditions</li>
          <li><strong>Property Inspection Fees:</strong> Generally non-refundable (see exceptions below)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Product Purchase Refunds</h2>
        
        <div className="bg-green-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3 text-green-800">2.1 Eligible for Refund</h3>
          <p className="text-gray-700 mb-3">
            You may be eligible for a refund if:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>The product was not as described in the listing</li>
            <li>The product arrived damaged or defective</li>
            <li>You received the wrong item</li>
            <li>The product was not delivered within the specified timeframe</li>
            <li>The seller cancelled the order</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">2.2 Refund Request Process</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          To request a refund for a product purchase:
        </p>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Contact Funmislist customer support within <strong>7 days</strong> of delivery</li>
          <li>Email{' '}
            <a href="mailto:support@funmislist.com" className="text-blue-600 hover:underline">
              support@funmislist.com
            </a>
            {' '}with your order details
          </li>
          <li>Provide order details, photos (if applicable), and reason for refund request</li>
          <li>Allow up to <strong>5 business days</strong> for review and resolution</li>
        </ol>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">2.3 Refund Timeline</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Once a refund is approved:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Refunds are processed within <strong>3–5 business days</strong></li>
          <li>Funds will be returned to your original payment method</li>
          <li>Bank processing time may take an additional <strong>3–7 business days</strong></li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">2.4 Conditions for Product Returns</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          For refund eligibility, returned products must:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Be in original condition (unless defective)</li>
          <li>Include all original packaging and accessories</li>
          <li>Be returned within the specified return window</li>
          <li>Have proof of purchase</li>
        </ul>

        <div className="bg-red-50 p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold mb-3 text-red-800">2.5 Non-Refundable Product Categories</h3>
          <p className="text-gray-700 mb-3">
            The following items are generally not eligible for refunds:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Personalized or custom-made items</li>
            <li>Perishable goods</li>
            <li>Digital products or downloadable content</li>
            <li>Items marked "final sale" or "non-refundable" in the listing</li>
            <li>Used or damaged items (unless defective upon arrival)</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. Property Inspection Fee Refunds</h2>
        
        <div className="bg-yellow-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3 text-yellow-800">3.1 General Policy</h3>
          <p className="text-gray-700 mb-3">
            Property inspection booking fees are <strong>generally non-refundable</strong>. These fees 
            compensate property owners for reserving time and preparing for your visit.
          </p>
        </div>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">3.2 Exceptions</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Refunds for property inspection fees may be issued in the following circumstances:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>The property owner cancels the appointment</li>
          <li>The property is no longer available for viewing</li>
          <li>The property was misrepresented in the listing</li>
          <li>You cancel at least <strong>48 hours</strong> before the scheduled appointment</li>
          <li>There are safety or accessibility issues that prevent the inspection</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">3.3 Cancellation by Buyer</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          If you need to cancel a property inspection appointment:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Cancel at least <strong>48 hours</strong> in advance: <strong>100%</strong> refund</li>
          <li>Cancel less than <strong>48 hours</strong> in advance: <strong>No refund</strong></li>
          <li>No-show without cancellation: <strong>No refund</strong></li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">3.4 Rescheduling</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          You may reschedule your property inspection appointment <strong>once</strong> without penalty, 
          provided you give at least <strong>48 hours</strong> notice. Additional rescheduling 
          requests may incur fees.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">4. Payment Processing Fees</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Please note that payment processing fees charged by Paystack are non-refundable, even if 
          a refund is issued for the transaction amount. Only the product or service cost will be 
          refunded, not the processing fees.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">5. Partial Refunds</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          In some cases, partial refunds may be issued:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Items with minor defects or damage</li>
          <li>Late cancellations with valid reasons</li>
          <li>Returns without all original packaging</li>
          <li>Multi-item orders where only some items are eligible for refund</li>
        </ul>
        <p className="text-gray-600 mb-4 leading-relaxed">
          The refund amount will be determined on a case-by-case basis by our customer support team.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">6. Disputed Transactions</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          If there is a dispute between buyer and seller regarding a refund:
        </p>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Funmislist will mediate the dispute and review evidence from both parties</li>
          <li>We may request additional documentation or photos</li>
          <li>Our decision will be final and binding</li>
          <li>Resolution typically takes <strong>5–7 business days</strong></li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">7. Refund Method</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          All refunds will be issued to the original payment method used for the transaction:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Credit/Debit card refunds: <strong>3–7 business days</strong></li>
          <li>Bank account refunds: <strong>3–7 business days</strong></li>
          <li>Mobile money refunds: <strong>1–3 business days</strong></li>
        </ul>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Alternative refund methods (e.g., platform credit) may be offered at our discretion.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">8. Seller Responsibilities</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Sellers on Funmislist must:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Provide accurate product descriptions and images</li>
          <li>Honor legitimate refund requests</li>
          <li>Respond to buyer inquiries within <strong>48 hours</strong></li>
          <li>Process approved refunds promptly</li>
        </ul>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Failure to comply may result in account suspension or termination.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">9. How to Contact Us About Refunds</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          For refund requests or questions about this policy, contact us:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 mb-2">
            <strong>Email:</strong>{' '}
            <a href="mailto:support@funmislist.com" className="text-blue-600 hover:underline">
              support@funmislist.com
            </a>
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Phone:</strong> +234 802 393 3197
          </p>
          <p className="text-gray-600">
            <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM WAT
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">10. Changes to This Policy</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We reserve the right to modify this Refund Policy at any time. Changes will be effective 
          immediately upon posting. Your continued use of Funmislist constitutes acceptance of the 
          updated policy.
        </p>
      </section>

      <div className="bg-blue-50 p-6 rounded-lg mt-8">
        <p className="text-sm text-gray-600">
          This Refund Policy should be read in conjunction with our{' '}
          <a href="/legal/terms" className="text-blue-600 hover:underline">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="/legal/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}

export default RefundPolicyPage;
