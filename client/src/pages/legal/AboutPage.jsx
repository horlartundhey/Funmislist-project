import React from 'react';

function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">About Funmislist</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Company Overview</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          <strong>Company Legal Name:</strong> [YOUR COMPANY LEGAL NAME HERE]
        </p>
        <p className="text-gray-600 mb-4 leading-relaxed">
          <strong>Registration Number:</strong> [YOUR REGISTRATION NUMBER]
        </p>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Funmislist is a comprehensive online marketplace platform that connects buyers and sellers 
          across Nigeria. We specialize in two primary business verticals:
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">What We Do</h2>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-4">
          <h3 className="text-xl font-semibold mb-3 text-blue-800">E-Commerce Marketplace</h3>
          <p className="text-gray-700 mb-3">
            Our e-commerce platform enables individuals and businesses to buy and sell a wide variety 
            of products including:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Electronics and gadgets</li>
            <li>Furniture and home decor</li>
            <li>Fashion and apparel</li>
            <li>Books and educational materials</li>
            <li>And many other product categories</li>
          </ul>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-green-800">Real Estate Services</h3>
          <p className="text-gray-700 mb-3">
            Our real estate platform connects property owners with potential buyers and renters, offering:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Property listings (residential and commercial)</li>
            <li>Virtual property tours and detailed descriptions</li>
            <li>Professional property inspection booking system</li>
            <li>Direct communication between property owners and interested parties</li>
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
              Buyers pay sellers for products listed on our marketplace. Payments are processed 
              securely at checkout, and funds are transferred to sellers after successful delivery.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">2. Property Inspection Fees</h4>
            <p className="text-gray-600">
              Property inspection booking fees are charged when users schedule appointments to view 
              properties. These fees ensure commitment from serious buyers and compensate property 
              owners for their time.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">3. Service Fees</h4>
            <p className="text-gray-600">
              A small platform service fee may be applied to facilitate transactions, maintain 
              the platform, and provide customer support.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Our Mission</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          [INSERT YOUR COMPANY MISSION STATEMENT HERE - Example: "To create a trusted, efficient, 
          and user-friendly marketplace that empowers Nigerians to buy, sell, and discover properties 
          with confidence and ease."]
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
