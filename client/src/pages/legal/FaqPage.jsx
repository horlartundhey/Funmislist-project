import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    // Platform Basics
    {
      category: "Platform Basics",
      question: "What is Funmislist?",
      answer: "Funmislist is an online marketplace platform that connects buyers and sellers across Nigeria. We offer two main services: an e-commerce marketplace for buying and selling various products, and a real estate platform for browsing properties and booking property inspections."
    },
    {
      category: "Platform Basics",
      question: "How do I create an account?",
      answer: "To create an account, click the 'Register' button in the top navigation. Fill in your name, email address, phone number, and create a password. You'll receive a verification email to confirm your account. Once verified, you can start buying, selling, and booking property inspections."
    },
    {
      category: "Platform Basics",
      question: "Is Funmislist free to use?",
      answer: "Creating an account and browsing products/properties is completely free. However, we may charge a small service fee on transactions to maintain the platform and provide customer support. All fees are clearly displayed before you complete a purchase."
    },

    // Buying Products
    {
      category: "Buying Products",
      question: "How do I purchase a product?",
      answer: "Browse our product categories, click on a product you like, review the details, and click 'Add to Cart'. When ready to checkout, click the cart icon, review your items, and proceed to checkout. Enter your shipping information and complete payment securely through Paystack."
    },
    {
      category: "Buying Products",
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods through Paystack, including credit/debit cards (Visa, Mastercard, Verve), bank transfers, and mobile money. All payments are processed securely with industry-standard encryption."
    },
    {
      category: "Buying Products",
      question: "How long does delivery take?",
      answer: "Delivery times vary based on your location and the seller's processing time. Typically, deliveries to major cities take 2-4 business days, regional centers take 4-7 business days, and remote areas may take 7-14 business days. You'll receive tracking information once your order ships."
    },
    {
      category: "Buying Products",
      question: "Can I track my order?",
      answer: "Yes! Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order status by logging into your account and viewing your order history in the dashboard."
    },
    {
      category: "Buying Products",
      question: "What if I receive a damaged or wrong item?",
      answer: "If you receive a damaged or incorrect item, contact the seller immediately through the platform. If the issue isn't resolved, escalate to our customer support team within 24-48 hours. Provide photos and your order number. We'll work to resolve the issue, which may include a refund or replacement."
    },

    // Selling Products
    {
      category: "Selling Products",
      question: "How do I sell items on Funmislist?",
      answer: "After creating an account, navigate to your dashboard and click 'Add Product' (sellers with appropriate permissions). Fill in product details including name, description, price, category, condition, stock, and upload high-quality images. Once submitted, your listing will be reviewed and published."
    },
    {
      category: "Selling Products",
      question: "Are there any fees for selling?",
      answer: "Listing products is free. We may charge a small commission on completed sales to maintain the platform and provide support services. All fees are transparent and clearly communicated before you list your items."
    },
    {
      category: "Selling Products",
      question: "How do I get paid for my sales?",
      answer: "When a buyer purchases your product, the payment is held securely. Once the buyer confirms receipt of the item (or after a specified period), the funds are transferred to your registered bank account or mobile money wallet, minus any applicable fees."
    },
    {
      category: "Selling Products",
      question: "How do I ship my products?",
      answer: "Sellers are responsible for shipping their products to buyers. You can use your preferred courier service or partner with our recommended logistics providers. Make sure to package items securely, provide tracking information, and ship within the timeframe specified in your listing."
    },

    // Property Services
    {
      category: "Property Services",
      question: "How do property inspections work?",
      answer: "Browse available properties on our real estate platform, select a property you're interested in, and choose an available inspection time slot. Pay the inspection fee through Paystack to confirm your booking. You'll receive confirmation with the property address and contact details for the appointment."
    },
    {
      category: "Property Services",
      question: "Why do I need to pay an inspection fee?",
      answer: "Inspection fees ensure commitment from serious buyers and compensate property owners for their time in preparing and conducting property viewings. These fees help reduce no-shows and maintain quality service for all parties."
    },
    {
      category: "Property Services",
      question: "Can I reschedule a property inspection?",
      answer: "Yes, you can reschedule your inspection appointment once without penalty, provided you give at least [X hours/days] notice. Contact the property owner or our support team to arrange a new time. Additional rescheduling may incur fees."
    },
    {
      category: "Property Services",
      question: "Are property inspection fees refundable?",
      answer: "Inspection fees are generally non-refundable as they reserve the property owner's time. However, refunds may be issued if the property owner cancels, the property is no longer available, or you cancel with sufficient advance notice. See our Refund Policy for complete details."
    },

    // Payments & Fees
    {
      category: "Payments & Fees",
      question: "Is it safe to pay on Funmislist?",
      answer: "Absolutely! All payments are processed through Paystack, a certified PCI DSS compliant payment processor. We never store your complete card details on our servers. Your payment information is encrypted and handled according to the highest security standards."
    },
    {
      category: "Payments & Fees",
      question: "What currency do you accept?",
      answer: "All transactions on Funmislist are processed in Nigerian Naira (NGN)."
    },
    {
      category: "Payments & Fees",
      question: "Can I get a receipt for my purchase?",
      answer: "Yes! You'll automatically receive a digital receipt via email after every purchase. You can also view and download receipts from your account dashboard under order history."
    },
    {
      category: "Payments & Fees",
      question: "What happens if my payment fails?",
      answer: "If your payment fails, you'll receive an error message explaining the issue. Common reasons include insufficient funds, incorrect card details, or bank restrictions. Try again with updated information or contact your bank. If problems persist, contact our support team for assistance."
    },

    // Disputes & Refunds
    {
      category: "Disputes & Refunds",
      question: "How do I request a refund?",
      answer: "To request a refund, first contact the seller through the platform. If unresolved, escalate to our customer support at support@funmislist.com within the specified timeframe. Provide your order number, reason for the refund, and any supporting documentation or photos."
    },
    {
      category: "Disputes & Refunds",
      question: "How long do refunds take?",
      answer: "Once a refund is approved, it typically takes [X business days] to process. Funds are returned to your original payment method. Bank processing time may take an additional [X-X business days] depending on your financial institution."
    },
    {
      category: "Disputes & Refunds",
      question: "What if I have a dispute with a seller or buyer?",
      answer: "If you have a dispute, first try to resolve it directly through the platform messaging system. If unsuccessful, contact Funmislist support. We'll mediate the dispute, review evidence from both parties, and make a fair decision. Our resolution process typically takes [X business days]."
    },
    {
      category: "Disputes & Refunds",
      question: "What is your return policy?",
      answer: "Return policies vary by seller. Generally, items must be returned in original condition within a specified timeframe. Reasons for returns may include items not as described, damaged goods, or wrong items received. See our Refund Policy for complete details."
    },

    // Account & Security
    {
      category: "Account & Security",
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page. Enter your registered email address, and we'll send you a password reset link. Click the link in the email and create a new password. If you don't receive the email, check your spam folder or contact support."
    },
    {
      category: "Account & Security",
      question: "How do I update my account information?",
      answer: "Log into your account and navigate to your dashboard. Click on 'Account Settings' or 'Profile' to update your personal information, shipping addresses, and contact details. Make sure to save changes before exiting."
    },
    {
      category: "Account & Security",
      question: "Is my personal information secure?",
      answer: "Yes, we take your privacy and security seriously. We use industry-standard encryption, secure servers, and follow best practices to protect your personal data. We never sell your information to third parties. Read our Privacy Policy for complete details."
    },
    {
      category: "Account & Security",
      question: "How do I delete my account?",
      answer: "To delete your account, contact our support team at support@funmislist.com. Note that account deletion is permanent and will remove all your data, order history, and listings. Make sure to complete any pending transactions before requesting deletion."
    },

    // Customer Support
    {
      category: "Customer Support",
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team via email at support@funmislist.com, by phone at +234 XXX XXX XXXX (Monday-Friday, 9 AM - 6 PM WAT), or through the contact form on our Contact page. We typically respond within 24-48 hours."
    },
    {
      category: "Customer Support",
      question: "What are your business hours?",
      answer: "Our customer support team is available Monday through Friday, 9:00 AM to 6:00 PM West Africa Time (WAT). We're also available on Saturdays from 10:00 AM to 4:00 PM. We're closed on Sundays and public holidays."
    },
    {
      category: "Customer Support",
      question: "Do you have a mobile app?",
      answer: "Currently, Funmislist is available as a web platform that works seamlessly on mobile browsers. We're working on developing dedicated mobile apps for iOS and Android, which will be available soon. Stay tuned for updates!"
    }
  ];

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq, index) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push({ ...faq, originalIndex: index });
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Frequently Asked Questions (FAQ)</h1>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        Find answers to common questions about using Funmislist. If you can't find what you're 
        looking for, please <a href="/legal/contact" className="text-blue-600 hover:underline">contact us</a>.
      </p>

      {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
        <section key={category} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b-2 border-blue-500 pb-2">
            {category}
          </h2>
          
          <div className="space-y-3">
            {categoryFaqs.map((faq) => (
              <div key={faq.originalIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(faq.originalIndex)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                  {openIndex === faq.originalIndex ? (
                    <FaChevronUp className="text-blue-600 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {openIndex === faq.originalIndex && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="bg-blue-50 p-6 rounded-lg mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Still Have Questions?</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          If you couldn't find the answer you were looking for, we're here to help!
        </p>
        <div className="space-y-2">
          <p className="text-gray-600">
            <strong>Email:</strong>{' '}
            <a href="mailto:support@funmislist.com" className="text-blue-600 hover:underline">
              support@funmislist.com
            </a>
          </p>
          <p className="text-gray-600">
            <strong>Phone:</strong>{' '}
            <a href="tel:+234XXXXXXXXXX" className="text-blue-600 hover:underline">
              +234 XXX XXX XXXX
            </a>
          </p>
          <p className="text-gray-600">
            <strong>Contact Form:</strong>{' '}
            <a href="/legal/contact" className="text-blue-600 hover:underline">
              Visit our Contact Page
            </a>
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Related Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a 
            href="/legal/about" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-800 mb-2">About Funmislist</h3>
            <p className="text-sm text-gray-600">Learn more about our platform and services</p>
          </a>
          
          <a 
            href="/legal/terms" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Terms & Conditions</h3>
            <p className="text-sm text-gray-600">Review our platform rules and user responsibilities</p>
          </a>
          
          <a 
            href="/legal/privacy" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Privacy Policy</h3>
            <p className="text-sm text-gray-600">Understand how we protect your data</p>
          </a>
          
          <a 
            href="/legal/refund" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
          >
            <h3 className="font-semibold text-gray-800 mb-2">Refund Policy</h3>
            <p className="text-sm text-gray-600">Learn about our refund and return procedures</p>
          </a>
        </div>
      </section>
    </div>
  );
}

export default FaqPage;
