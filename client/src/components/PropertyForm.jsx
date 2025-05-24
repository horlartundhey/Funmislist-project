import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/dateFormatter';

function PropertyForm({
  onSubmit,
  initialData = {},
  categories = [],
  isEditing = false,
  isLoading = false,
  onCancel
}) {  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    images: [],
    availableTimeSlots: [],
    category: '',
    subcategory: ''
  });
  
  // Get available subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    if (!form.category) return [];
    const selectedCategory = categories.find(cat => cat._id === form.category);
    return selectedCategory?.subcategories || [];
  }, [categories, form.category]);

  const [newTimeSlot, setNewTimeSlot] = useState({
    date: '',
    time: ''
  });  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      let timeSlots = initialData.availableTimeSlots || [];
        // If the time slots come as a JSON string, keep it as is
      // If it's already an array, no need to stringify
      if (typeof timeSlots === 'string') {
        try {
          // Try to parse it to make sure it's valid JSON
          JSON.parse(timeSlots);
        } catch (error) {
          // If it's not valid JSON, convert the array to string
          console.error('Invalid JSON for availableTimeSlots:', error);
          timeSlots = JSON.stringify([]);
        }
      }
      
      // Find the category object to verify subcategory compatibility
      const categoryObj = categories.find(cat => cat._id === initialData.category);
      const isSubcategoryValid = categoryObj?.subcategories?.some(
        sub => sub.name === initialData.subcategory
      );
      
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || '',
        address: initialData.location?.address || '',
        city: initialData.location?.city || '',
        state: initialData.location?.state || '',
        zipCode: initialData.location?.zipCode || '',
        images: [], // Images cannot be prefilled
        availableTimeSlots: timeSlots,
        category: initialData.category || '',
        // Only set subcategory if it's valid for the current category
        subcategory: isSubcategoryValid ? initialData.subcategory : ''
      });
    }
  }, [initialData]);  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setForm((prev) => ({ ...prev, images: files }));
    } else if (name === 'newSlotDate' || name === 'newSlotTime') {
      setNewTimeSlot(prev => ({ ...prev, [name === 'newSlotDate' ? 'date' : 'time']: value }));
    } else if (name === 'category') {
      // Reset subcategory when category changes
      console.log(`Category changed to: ${value}`);
      
      // Verify if we need to reset subcategory
      const categoryObj = categories.find(cat => cat._id === value);
      const currentSubcat = form.subcategory;
      const isSubcategoryValid = categoryObj?.subcategories?.some(
        sub => sub.name === currentSubcat
      );
      
      setForm((prev) => ({ 
        ...prev, 
        [name]: value,
        // Only reset subcategory if it's not valid for the new category
        subcategory: isSubcategoryValid ? currentSubcat : ''
      }));
    } else if (name === 'subcategory') {
      // Verify subcategory is valid for current category
      const categoryObj = categories.find(cat => cat._id === form.category);
      const isValid = categoryObj?.subcategories?.some(sub => sub.name === value);
      
      if (isValid || value === '') {
        setForm((prev) => ({ ...prev, [name]: value }));
      } else {
        console.warn('Invalid subcategory selected');
        toast.error('Invalid subcategory selected');
      }
    } else {
      console.log(`Form field changed: ${name} = ${value}`);
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleAddTimeSlot = () => {
    if (!newTimeSlot.date || !newTimeSlot.time) {
      toast.error('Please select both date and time');
      return;
    }

    const dateTime = new Date(`${newTimeSlot.date}T${newTimeSlot.time}`);
    
    if (dateTime < new Date()) {
      toast.error('Cannot add time slots in the past');
      return;
    }

    setForm(prev => {
      const currentSlots = typeof prev.availableTimeSlots === 'string' 
        ? JSON.parse(prev.availableTimeSlots) 
        : prev.availableTimeSlots;
      
      const updatedSlots = [
        ...currentSlots,
        { date: dateTime.toISOString(), isBooked: false }
      ];
      
      return {
        ...prev,
        availableTimeSlots: typeof prev.availableTimeSlots === 'string'
          ? JSON.stringify(updatedSlots)
          : updatedSlots
      };
    });

    setNewTimeSlot({ date: '', time: '' });
  };
  const handleRemoveTimeSlot = (index) => {
    setForm(prev => {
      const currentSlots = typeof prev.availableTimeSlots === 'string' 
        ? JSON.parse(prev.availableTimeSlots) 
        : prev.availableTimeSlots;
      
      const updatedSlots = currentSlots.filter((_, i) => i !== index);
      
      return {
        ...prev,
        availableTimeSlots: typeof prev.availableTimeSlots === 'string'
          ? JSON.stringify(updatedSlots)
          : updatedSlots
      };
    });
  };  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate category
    if (!form.category) {
      toast.error('Please select a category');
      return;
    }

    // Validate subcategory if category has subcategories
    const categoryObj = categories.find(cat => cat._id === form.category);
    if (categoryObj?.subcategories?.length > 0 && !form.subcategory) {
      toast.error('Please select a subcategory');
      return;
    }

    // Verify subcategory is valid for selected category
    if (form.subcategory && !categoryObj?.subcategories?.some(sub => sub.name === form.subcategory)) {
      toast.error('Invalid subcategory for selected category');
      return;
    }

    const timeSlotsArray = typeof form.availableTimeSlots === 'string'
      ? JSON.parse(form.availableTimeSlots)
      : form.availableTimeSlots;
      
    if (timeSlotsArray.length === 0) {
      toast.error('Please add at least one time slot');
      return;
    }
    
    onSubmit({
      ...form,
      location: { address: form.address, city: form.city, state: form.state, zipCode: form.zipCode },
      availableTimeSlots: timeSlotsArray.map(slot => ({
        date: slot.date,
        isBooked: slot.isBooked || false
      }))
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-4">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="p-2 border rounded w-full"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="p-2 border rounded w-full"
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="p-2 border rounded w-full"
        required
      />
      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="p-2 border rounded w-full"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.name}</option>
        ))}
      </select>

      {/* Subcategory dropdown - only show when category is selected and has subcategories */}
      {form.category && availableSubcategories.length > 0 && (
        <select
          name="subcategory"
          value={form.subcategory}
          onChange={handleChange}
          className="p-2 border rounded w-full"
        >
          <option value="">Select Subcategory (Optional)</option>
          {availableSubcategories.map((sub) => (
            <option key={sub.name} value={sub.name}>{sub.name}</option>
          ))}
        </select>
      )}

      {/* Location Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={form.zipCode}
          onChange={handleChange}
          className="p-2 border rounded w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Available Time Slots</h3>
        <div className="flex gap-2">
          <input
            type="date"
            name="newSlotDate"
            value={newTimeSlot.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="p-2 border rounded flex-1"
          />
          <input
            type="time"
            name="newSlotTime"
            value={newTimeSlot.time}
            onChange={handleChange}
            className="p-2 border rounded flex-1"
          />
          <button
            type="button"
            onClick={handleAddTimeSlot}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Slot
          </button>
        </div>
        <div className="mt-2">          {(typeof form.availableTimeSlots === 'string' 
            ? JSON.parse(form.availableTimeSlots) 
            : form.availableTimeSlots).map((slot, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
              <span>{formatDate(slot.date)}</span>
              <button
                type="button"
                onClick={() => handleRemoveTimeSlot(index)}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          {(typeof form.availableTimeSlots === 'string' 
            ? JSON.parse(form.availableTimeSlots).length === 0 
            : form.availableTimeSlots.length === 0) && (
            <p className="text-gray-500 text-sm">No time slots added yet</p>
          )}
        </div>
      </div>

      <input
        type="file"
        name="images"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="p-2 border rounded w-full"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? (
            <><span className="animate-spin h-5 w-5 border-b-2 border-white rounded-full inline-block mr-2"></span>
              {isEditing ? 'Saving...' : 'Adding...'}
            </>
          ) : (
            isEditing ? 'Save Changes' : 'Add Property'
          )}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default PropertyForm;
