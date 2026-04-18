import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { formatDate } from '../utils/dateFormatter';
import formatCurrency from '../utils/formatCurrency';
import { initiatePayment } from '../slices/paymentSlice';
import { API_BASE_URL } from '../config/api';

function PropertyDetailsPage() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointment, setAppointment] = useState({ name: '', email: '', date: '' });
  const [bookingMsg, setBookingMsg] = useState('');

  useEffect(() => {
    async function fetchProperty() {
      try {
        const config = {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        };
        const res = await axios.get(`${API_BASE_URL}/properties/${id}`, config);
        setProperty(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property:', error);
        setError(error.response?.data?.message || 'Failed to load property details');
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id, token]);

  const handleChange = (e) => {
    setAppointment({ ...appointment, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/properties/${id}/appointment`, appointment, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookingMsg('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      setBookingMsg(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  // New payment handler for property appointment
  const handlePayForAppointment = async () => {
    if (!property || !property.price) return;
    dispatch(initiatePayment({
      userEmail: appointment.email,
      total: property.price,
      itemType: 'property',
      itemId: id,
      // Optionally, you can send appointment details as well
      appointmentDetails: appointment
    }));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!property) return <p>No property found.</p>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">{property.title || property.name}</h1>
      <img src={property.images?.[0]} alt={property.title || property.name} className="w-full h-64 object-cover mb-4 rounded-lg" />

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-xl font-semibold text-green-700 mb-2">
            Price: {property.price ? formatCurrency(property.price) : 'N/A'}
          </p>
          <p className="text-gray-700 mb-4">{property.description}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg space-y-1">
          <h3 className="font-semibold text-gray-800 mb-2">Property Location</h3>
          <p><span className="font-medium">Address:</span> {property.location?.address}</p>
          <p><span className="font-medium">City:</span> {property.location?.city}</p>
          <p><span className="font-medium">State:</span> {property.location?.state}</p>
          <p><span className="font-medium">Zip Code:</span> {property.location?.zipCode}</p>
        </div>
      </div>

      {/* How to Acquire This Property */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-900">How to Acquire This Property</h2>
        <p className="text-gray-700 mb-4">
          Funmislist manages all property listings and payments directly. Follow these steps to
          proceed with viewing or acquiring this property:
        </p>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
            <div>
              <p className="font-semibold text-gray-800">Book an Inspection Appointment</p>
              <p className="text-gray-600 text-sm">
                Select an available date below and fill in your details to book a physical inspection of the property.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
            <div>
              <p className="font-semibold text-gray-800">Pay the Inspection Fee via Paystack</p>
              <p className="text-gray-600 text-sm">
                After booking, pay the inspection fee securely through Paystack. Payment confirms your appointment
                and reserves the time slot. You will receive an email confirmation upon payment.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
            <div>
              <p className="font-semibold text-gray-800">Attend the Physical Inspection</p>
              <p className="text-gray-600 text-sm">
                Visit the property on the scheduled date. Funmislist coordinates with the property owner to
                facilitate the inspection. No virtual tours are offered at this time.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
            <div>
              <p className="font-semibold text-gray-800">Express Interest & Negotiate</p>
              <p className="text-gray-600 text-sm">
                After inspection, contact Funmislist at{' '}
                <a href="mailto:info@funmislist.com" className="text-blue-600 underline">info@funmislist.com</a>{' '}
                to express your interest and begin the acquisition process. Please note that Funmislist does not offer rental services — properties listed are for sale/purchase only.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</span>
            <div>
              <p className="font-semibold text-gray-800">Complete Documentation & Payment</p>
              <p className="text-gray-600 text-sm">
                Funmislist will guide you through the final documentation and payment process to complete the
                property acquisition agreement.
              </p>
            </div>
          </li>
        </ol>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
          <strong>Note:</strong> Inspection fees are non-refundable except in cases where the property owner
          cancels or the property is no longer available. See our{' '}
          <a href="/legal/refund" className="underline">Refund Policy</a> for full details.
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Step 1: Book Your Inspection</h2>
        <form onSubmit={handleSubmit} className="mb-4 space-y-3">
          <input name="name" value={appointment.name} onChange={handleChange} placeholder="Your Full Name" className="block p-2 border rounded w-full" required />
          <input name="email" value={appointment.email} onChange={handleChange} placeholder="Your Email Address" className="block p-2 border rounded w-full" required />
          <select name="date" value={appointment.date} onChange={handleChange} className="block p-2 border rounded w-full" required>
            <option value="">Select an Available Date</option>
            {property.availableTimeSlots.filter(slot => !slot.isBooked).map(slot => (
              <option key={slot.date} value={slot.date}>
                {formatDate(slot.date)}
              </option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full" disabled={!appointment.date}>
            {appointment.date ? 'Confirm Booking' : 'Select a Date to Continue'}
          </button>
        </form>
        {bookingMsg && <p className="text-green-700 font-medium">{bookingMsg}</p>}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Step 2: Pay Inspection Fee</h2>
        <p className="text-gray-600 text-sm mb-4">
          Click below to securely pay the inspection fee via Paystack. You must complete Step 1 first.
        </p>
        <button
          onClick={handlePayForAppointment}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold w-full"
          disabled={!appointment.email}
        >
          Pay {property.price ? formatCurrency(property.price) : ''} — Inspection Fee via Paystack
        </button>
        <p className="text-xs text-gray-400 mt-2 text-center">Secured by Paystack · PCI DSS Compliant</p>
      </div>
    </div>
  );
}

export default PropertyDetailsPage;
