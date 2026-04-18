import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Contact Us</h1>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        We're here to help! Reach out to us through any of the following channels, 
        and our team will get back to you as soon as possible.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Business Address */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-start mb-4">
            <FaMapMarkerAlt className="text-blue-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Business Address</h3>
              <p className="text-gray-600 leading-relaxed">
                1 Thomas Olaniyan Street<br />
                Anthony Maryland, Lagos<br />
                101233<br />
                Nigeria
              </p>
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-start mb-4">
            <FaPhone className="text-green-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Phone Number</h3>
              <p className="text-gray-600">
                <a href="tel:+2348023933197" className="hover:text-blue-600">
                  +234 802 393 3197
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Available Monday - Friday, 9:00 AM - 6:00 PM WAT
              </p>
            </div>
          </div>
        </div>

        {/* Email Address */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-start mb-4">
            <FaEnvelope className="text-red-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Email Address</h3>
              <p className="text-gray-600">
                <a href="mailto:info@funmislist.com" className="hover:text-blue-600">
                  info@funmislist.com
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                We typically respond within 24-48 hours
              </p>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-start mb-4">
            <FaClock className="text-purple-600 text-2xl mr-4 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Business Hours</h3>
              <div className="text-gray-600 space-y-1">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
                <p className="text-sm text-gray-500 mt-2">West Africa Time (WAT)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Send Us a Message</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+234 802 393 3197"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How can we help you?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please provide details about your inquiry..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Other Ways to Reach Us</h2>
        <div className="space-y-3 text-gray-600">
          <p>
            <strong>For Account Issues:</strong> Email us at{' '}
            <a href="mailto:support@funmislist.com" className="text-blue-600 hover:underline">
              support@funmislist.com
            </a>
          </p>
          <p>
            <strong>For Partnership Inquiries:</strong> Email us at{' '}
            <a href="mailto:partnerships@funmislist.com" className="text-blue-600 hover:underline">
              partnerships@funmislist.com
            </a>
          </p>
          <p>
            <strong>For Media & Press:</strong> Email us at{' '}
            <a href="mailto:press@funmislist.com" className="text-blue-600 hover:underline">
              press@funmislist.com
            </a>
          </p>
          <p>
            <strong>Quick Help:</strong> Check our{' '}
            <a href="/legal/faq" className="text-blue-600 hover:underline">
              FAQ page
            </a>{' '}
            for instant answers to common questions.
          </p>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
