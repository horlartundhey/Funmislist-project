import React from 'react';

function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Shipping & Delivery Policy</h1>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        <strong>Last Updated:</strong> [DATE]
      </p>

      <p className="text-gray-600 mb-6 leading-relaxed">
        This Shipping and Delivery Policy outlines how physical products and services are delivered 
        through the Funmislist platform. Please review this policy carefully before making a purchase.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Overview</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Funmislist operates as a marketplace connecting buyers and sellers. Our platform offers:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li><strong>Physical Products:</strong> Items shipped from sellers to buyers</li>
          <li><strong>Digital Services:</strong> Property inspection appointments (no physical shipping)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Physical Product Delivery</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">2.1 Delivery Zones</h3>
          <p className="text-gray-700 mb-3">
            We currently offer delivery within Nigeria to the following zones:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li><strong>Zone 1 (Major Cities):</strong> Lagos, Abuja, Port Harcourt, Kano, Ibadan</li>
            <li><strong>Zone 2 (Regional Centers):</strong> Other state capitals and major towns</li>
            <li><strong>Zone 3 (Remote Areas):</strong> Rural locations and hard-to-reach areas</li>
          </ul>
          <p className="text-gray-700 mt-3">
            <em>Note: Delivery availability varies by seller. Please check product listings for 
            specific delivery information.</em>
          </p>
        </div>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">2.2 Delivery Timelines</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Estimated delivery times from order confirmation:
        </p>
        
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Delivery Zone</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Standard Delivery</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Express Delivery</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Zone 1 (Major Cities)</td>
                <td className="border border-gray-300 px-4 py-2">[2-4 business days]</td>
                <td className="border border-gray-300 px-4 py-2">[1-2 business days]</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">Zone 2 (Regional Centers)</td>
                <td className="border border-gray-300 px-4 py-2">[4-7 business days]</td>
                <td className="border border-gray-300 px-4 py-2">[2-4 business days]</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Zone 3 (Remote Areas)</td>
                <td className="border border-gray-300 px-4 py-2">[7-14 business days]</td>
                <td className="border border-gray-300 px-4 py-2">[4-7 business days]</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-600 mb-4 italic">
          * Delivery times are estimates and may vary due to factors beyond our control, including 
          weather conditions, public holidays, or logistical challenges.
        </p>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">2.3 Shipping Fees</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Shipping costs are calculated based on:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Product weight and dimensions</li>
          <li>Delivery zone</li>
          <li>Delivery speed (standard vs. express)</li>
          <li>Seller's location</li>
        </ul>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Shipping fees are displayed at checkout before payment. Some sellers may offer free 
          shipping on qualifying orders.
        </p>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">2.4 Order Processing Time</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          After payment confirmation:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Sellers have <strong>[1-3 business days]</strong> to process and ship orders</li>
          <li>You will receive a shipping confirmation with tracking details</li>
          <li>Processing times may be longer for custom or made-to-order items</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">2.5 Order Tracking</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Once your order is shipped:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>You'll receive a tracking number via email and SMS</li>
          <li>Track your order status in your account dashboard</li>
          <li>Contact the seller or courier for delivery updates</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">2.6 Delivery Procedures</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          When your order arrives:
        </p>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Courier will contact you to arrange delivery</li>
          <li>Provide a valid ID for verification</li>
          <li>Inspect the package before signing for delivery</li>
          <li>Report any visible damage or discrepancies immediately</li>
          <li>Sign the delivery confirmation</li>
        </ol>

        <div className="bg-yellow-50 p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold mb-3 text-yellow-800">2.7 Failed Delivery Attempts</h3>
          <p className="text-gray-700 mb-3">
            If delivery cannot be completed:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Courier will attempt delivery <strong>[X times]</strong></li>
            <li>You'll be notified via phone, email, and SMS</li>
            <li>After failed attempts, package may be returned to seller</li>
            <li>Additional fees may apply for re-delivery</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">3. Property Inspection Services</h2>
        
        <div className="bg-green-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-3 text-green-800">3.1 No Physical Shipping</h3>
          <p className="text-gray-700 mb-3">
            Property inspection appointments are <strong>service-based bookings</strong> and do not 
            involve physical product shipping. This policy applies only to the appointment booking 
            process:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Inspection fees are paid online through Paystack</li>
            <li>Confirmation is sent via email and SMS</li>
            <li>You attend the appointment at the property location</li>
            <li>No items are shipped or delivered</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">3.2 Appointment Confirmation</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          After booking a property inspection:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>You'll receive instant confirmation upon payment</li>
          <li>Appointment details include date, time, and property address</li>
          <li>Property owner/agent contact information is provided</li>
          <li>Reminder notifications sent <strong>[24 hours]</strong> before appointment</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">4. International Shipping</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          At this time, Funmislist <strong>does not offer international shipping</strong>. All 
          deliveries are limited to locations within Nigeria. We may expand to international 
          shipping in the future.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">5. Damaged or Lost Shipments</h2>
        
        <h3 className="text-xl font-semibold mb-3 text-gray-600">5.1 Damaged Items</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          If your order arrives damaged:
        </p>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Do not accept delivery if package shows obvious damage</li>
          <li>Take photos of the damaged package and item</li>
          <li>Contact the seller and Funmislist support within <strong>[24-48 hours]</strong></li>
          <li>Provide order number, photos, and description of damage</li>
          <li>Keep all packaging materials for inspection if required</li>
        </ol>

        <h3 className="text-xl font-semibold mb-3 text-gray-600">5.2 Lost Shipments</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          If your order doesn't arrive within the estimated delivery window:
        </p>
        <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Check tracking information for updates</li>
          <li>Contact the courier service directly</li>
          <li>If unresolved, contact Funmislist support</li>
          <li>We'll investigate with the seller and courier</li>
          <li>Resolution may include refund or replacement (see our{' '}
            <a href="/legal/refund" className="text-blue-600 hover:underline">
              Refund Policy
            </a>)
          </li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">6. Holidays and Delays</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Please note that delivery times may be extended during:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Public holidays in Nigeria</li>
          <li>Peak shopping seasons (e.g., Christmas, Black Friday)</li>
          <li>Adverse weather conditions</li>
          <li>Unforeseen circumstances (strikes, natural disasters, etc.)</li>
        </ul>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We'll notify you of any significant delays affecting your order.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">7. Address Changes</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          To change your delivery address:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Contact the seller immediately after placing your order</li>
          <li>Address changes may not be possible once order is shipped</li>
          <li>Additional fees may apply for address changes</li>
          <li>Ensure your address is accurate before checkout</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">8. Seller Responsibilities</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Sellers on Funmislist must:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4 ml-4">
          <li>Ship orders within the specified processing time</li>
          <li>Use appropriate packaging to prevent damage</li>
          <li>Provide accurate tracking information</li>
          <li>Communicate proactively about delays</li>
          <li>Honor delivery commitments made in product listings</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">9. Contact Information</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          For shipping and delivery inquiries:
        </p>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 mb-2">
            <strong>Email:</strong>{' '}
            <a href="mailto:shipping@funmislist.com" className="text-blue-600 hover:underline">
              shipping@funmislist.com
            </a>
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Phone:</strong> +234 XXX XXX XXXX
          </p>
          <p className="text-gray-600">
            <strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM WAT
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">10. Policy Updates</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We reserve the right to update this Shipping and Delivery Policy at any time. Changes will 
          be posted on this page with an updated "Last Updated" date.
        </p>
      </section>

      <div className="bg-blue-50 p-6 rounded-lg mt-8">
        <p className="text-sm text-gray-600">
          This policy should be read alongside our{' '}
          <a href="/legal/terms" className="text-blue-600 hover:underline">
            Terms and Conditions
          </a>{' '}
          and{' '}
          <a href="/legal/refund" className="text-blue-600 hover:underline">
            Refund Policy
          </a>.
        </p>
      </div>
    </div>
  );
}

export default ShippingPolicyPage;
