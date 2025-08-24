import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaSearch, FaSlidersH } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../config/api';

const PropertySearchAndFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [locationTerm, setLocationTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  const { allCategories: categories } = useSelector((state) => state.categories);
  console.log('allCategories:', categories);
  // Find the Real Estate category
  const realEstateCategory = categories?.find(cat => 
    cat.name.toLowerCase() === 'real estate'
  );
  
  const availableSubcategories = realEstateCategory?.subcategories || [];

  // Set Real Estate category by default and always include in all queries
  useEffect(() => {
    if (realEstateCategory && !selectedCategory) {
      setSelectedCategory(realEstateCategory._id);
    }
  }, [realEstateCategory, selectedCategory]);

  // Fetch initial properties for Real Estate category
  useEffect(() => {
    const fetchInitial = async () => {
      if (realEstateCategory && selectedCategory === realEstateCategory._id) {
        try {
          const res = await fetch(`${API_BASE_URL}/properties?category=${realEstateCategory._id}`);
          const data = await res.json();
          if (Array.isArray(data.properties)) {
            onSearch(data.properties);
          } else if (Array.isArray(data)) {
            onSearch(data);
          } else {
            onSearch([]);
          }
        } catch {
          onSearch([]);
        }
      }
    };
    fetchInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realEstateCategory, selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Parse combined "term in location" syntax
    let term = searchTerm;
    let loc = locationTerm;
    const inMatch = searchTerm.match(/(.+?)\s+in\s+(.+)/i);
    if (inMatch) {
      term = inMatch[1].trim();
      loc = inMatch[2].trim();
    }
    // Build query params
    let params = new URLSearchParams();
    // Always include Real Estate category if available
    if (realEstateCategory) {
      params.append('category', realEstateCategory._id);
    } else if (selectedCategory) {
      params.append('category', selectedCategory);
    }
    if (term) params.append('searchTerm', term);
    if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
    if (priceRange.min) params.append('minPrice', priceRange.min);
    if (priceRange.max) params.append('maxPrice', priceRange.max);
    if (loc) params.append('location', loc);

    try {
      const res = await fetch(`${API_BASE_URL}/properties?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data.properties)) {
        onSearch(data.properties);
      } else if (Array.isArray(data)) {
        onSearch(data);
      } else {
        onSearch([]);
      }
    } catch {
      onSearch([]);
    }
  };

  const handleReset = async () => {
    setSearchTerm('');
    if (realEstateCategory) {
      setSelectedCategory(realEstateCategory._id);
    }
    setSelectedSubcategory('');
    setPriceRange({ min: '', max: '' });
    setLocationTerm('');
    try {
      const res = await fetch(`${API_BASE_URL}/properties?category=${realEstateCategory?._id || ''}`);
      const data = await res.json();
      if (Array.isArray(data.properties)) {
        onSearch(data.properties);
      } else if (Array.isArray(data)) {
        onSearch(data);
      } else {
        onSearch([]);
      }
    } catch {
      onSearch([]);
    }
    setShowFilters(false);
  };

  

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit} className="p-4">
        <motion.div initial={false} className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <motion.button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
            whileTap={{ scale: 0.95 }}
          >
            <FaSlidersH className={`text-gray-600 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            <span>Filters</span>
          </motion.button>

          <motion.button
            type="submit"
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                {/* Subcategory Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    value={selectedSubcategory}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setSelectedSubcategory(value);
                      // Fetch filtered properties from backend when subcategory changes
                      let params = new URLSearchParams();
                      // Always include Real Estate category if available
                      if (realEstateCategory) {
                        params.append('category', realEstateCategory._id);
                      } else if (selectedCategory) {
                        params.append('category', selectedCategory);
                      }
                      if (searchTerm) params.append('searchTerm', searchTerm);
                      if (value) params.append('subcategory', value);
                      if (priceRange.min) params.append('minPrice', priceRange.min);
                      if (priceRange.max) params.append('maxPrice', priceRange.max);
                      if (locationTerm) params.append('location', locationTerm);
                      try {
                        const res = await fetch(`${API_BASE_URL}/properties?${params.toString()}`);
                        const data = await res.json();
                        if (data && Array.isArray(data.properties)) {
                          onSearch(data.properties);
                        } else {
                          onSearch([]);
                        }
                      } catch {
                        onSearch([]);
                      }
                    }}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  >
                    <option value="">All Property Types</option>
                    {availableSubcategories.map((sub) => (
                      <option key={sub.name} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, State, or Address"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    min="0"
                  />
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex justify-end"
              >
                <motion.button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default PropertySearchAndFilter;
