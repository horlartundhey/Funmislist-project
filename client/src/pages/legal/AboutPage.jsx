import React from 'react';

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">About Funmislist</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Company Overview</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          <strong>Company Legal Name:</strong> Funmislist Nigerian Limited
        </p>
        <p className="text-gray-600 mb-4 leading-relaxed">
          <strong>Registration Number (RC):</strong> RC 1935124
        </p>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Funmislist is a comprehensive online marketplace platform where customers can buy quality
          products and services directly across Nigeria. We specialize in two primary business verticals:
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">What We Do</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-4">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">E-Commerce Marketplace</h3>
          <p className="text-gray-700 mb-3">
            Our e-commerce platform lists and sells a wide variety of quality products including:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Electronics, phones and gadgets</li>
            <li>Fashion and apparel</li>
            <li>Furniture and home décor</li>
            <li>Electrical cables, switches and sockets</li>
            <li>Solar panels, inverters and batteries</li>
            <li>Automobiles and more</li>
          </ul>
          <p className="text-gray-700 mt-3 text-sm">
            Most of our pre-owned products are sourced from Europe and North America, while we also
            proudly promote locally made Nigerian products.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-green-800">Real Estate Services</h3>
          <p className="text-gray-700 mb-3">
            Our real estate platform lists properties across Nigeria, offering:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Residential and commercial property listings</li>
            <li>Detailed property descriptions and photos</li>
            <li>Professional property inspection booking system</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">How Payments Work</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          We process all payments securely through Paystack, ensuring the safety and convenience
          of all transactions on our platform. Payments on Funmislist are used for:
        </p>

        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">1. Product Purchases</h4>
            <p className="text-gray-600">
              Buyers pay Funmislist directly for products listed on our platform. Payments are processed
              securely at checkout. Funmislist credits the seller's account only after the buyer has
              received and confirmed the product — primarily for pre-owned items. This escrow-style model
              protects both parties and ensures product quality.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">2. Property Inspection Fees</h4>
            <p className="text-gray-600">
              Property inspection booking fees are charged when users schedule appointments to view
              properties. These fees ensure commitment from serious buyers and are managed by Funmislist.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Our Mission</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          "To empower consumers by providing a trusted e-commerce destination where quality products
          meet uncompromising standards, driven by rigorous quality assurance and a steadfast
          commitment to integrity in every transaction."
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Why Choose Funmislist?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">🔒 Secure Payments</h4>
            <p className="text-gray-600 text-sm">
              All transactions are processed through Paystack's secure payment gateway.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">✅ Verified Listings</h4>
            <p className="text-gray-600 text-sm">
              We maintain quality standards for all product and property listings.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">📱 User-Friendly Platform</h4>
            <p className="text-gray-600 text-sm">
              Easy-to-use interface for browsing, buying, and selling.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">🤝 Customer Support</h4>
            <p className="text-gray-600 text-sm">
              Dedicated support team to assist with inquiries and disputes.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Get in Touch</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Have questions about our platform? Visit our <a href="/legal/contact" className="text-blue-600 hover:underline">Contact Page</a> to 
          reach out to our team, or check our <a href="/legal/faq" className="text-blue-600 hover:underline">FAQ</a> for quick answers.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;
