import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatDate } from '../utils/dateFormatter';
import formatCurrency from '../utils/formatCurrency';

function PropertyDetailsPage() {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);
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
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`, config);
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
      await axios.post(`http://localhost:5000/api/properties/${id}/appointment`, appointment, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookingMsg('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      setBookingMsg(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!property) return <p>No property found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{property.title || property.name}</h1>
      <img src={property.images?.[0]} alt={property.title || property.name} className="w-full h-64 object-cover mb-4" />
      <p className="mb-2">Price: {property.price ? formatCurrency(property.price) : 'N/A'}</p>
      <p className="mb-4">{property.description}</p>
      {/* Location Details */}
      <div className="mb-4 space-y-1">
        <p><span className="font-semibold">Address:</span> {property.location?.address}</p>
        <p><span className="font-semibold">City:</span> {property.location?.city}</p>
        <p><span className="font-semibold">State:</span> {property.location?.state}</p>
        <p><span className="font-semibold">Zip Code:</span> {property.location?.zipCode}</p>
      </div>
      <h2 className="text-xl font-semibold mb-2">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <input name="name" value={appointment.name} onChange={handleChange} placeholder="Your Name" className="block mb-2 p-2 border rounded w-full" required />
        <input name="email" value={appointment.email} onChange={handleChange} placeholder="Your Email" className="block mb-2 p-2 border rounded w-full" required />
        <select name="date" value={appointment.date} onChange={handleChange} className="block mb-2 p-2 border rounded w-full" required>
          <option value="">Select a date</option>
          {property.availableTimeSlots.filter(slot => !slot.isBooked).map(slot => (
            <option key={slot.date} value={slot.date}>
              {formatDate(slot.date)}
            </option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={!appointment.date}>
          {appointment.date ? 'Book Appointment' : 'Select Date'}
        </button>
      </form>
      {bookingMsg && <p>{bookingMsg}</p>}
    </div>
  );
}

export default PropertyDetailsPage;
