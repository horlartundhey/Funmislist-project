import { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaSearch, FaSlidersH } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SearchAndFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { filteredCategories: categories } = useSelector((state) => state.categories);
  // Filter out Real Estate category from general search
  const filteredCategories = categories?.filter(cat => cat.name.toLowerCase() !== 'real estate') || [];
  const selectedCategoryObj = filteredCategories?.find(cat => cat._id === selectedCategory);
  const availableSubcategories = selectedCategoryObj?.subcategories || [];
  const handleSubmit = (e) => {
    e.preventDefault();
    // Parse combined "term in location" syntax
    let term = searchTerm;
    let loc = locationTerm;
    const inMatch = searchTerm.match(/(.+?)\s+in\s+(.+)/i);
    if (inMatch) {
      term = inMatch[1].trim();
      loc = inMatch[2].trim();
    }
    onSearch({
      searchTerm: term,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      priceRange,
      location: loc,
      condition: selectedCondition
    });
  };
  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setPriceRange({ min: '', max: '' });
    setLocationTerm('');
    setSelectedCondition('');
    onSearch({
      searchTerm: '',
      category: '',
      subcategory: '',
      priceRange: { min: '', max: '' },
      location: '',
      condition: ''
    });
    setShowFilters(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit} className="p-4">
        <motion.div 
          initial={false}
          className="flex flex-wrap gap-3"
        >
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
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
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            Search
          </motion.button>
        </motion.div>
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

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedCategory(value);
                      setSelectedSubcategory('');
                      onSearch({ searchTerm, category: value, subcategory: '', priceRange, location: locationTerm });
                    }}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">All Categories</option>                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory Filter */}
                {selectedCategory && availableSubcategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategory
                    </label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => {
                        const sub = e.target.value;
                        setSelectedSubcategory(sub);
                        onSearch({ searchTerm, category: selectedCategory, subcategory: sub, priceRange, location: locationTerm });
                      }}
                      className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">All Subcategories</option>
                      {availableSubcategories.map((sub) => (
                        <option key={sub.name} value={sub.name}>{sub.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    min="0"
                  />
                </div>

                {/* Location Filter */}                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="City or Address"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => {
                      const condition = e.target.value;
                      setSelectedCondition(condition);
                      onSearch({ 
                        searchTerm, 
                        category: selectedCategory, 
                        subcategory: selectedSubcategory, 
                        priceRange, 
                        location: locationTerm,
                        condition
                      });
                    }}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Any Condition</option>
                    <option value="new">New</option>
                    <option value="pre-owned">Pre-owned</option>
                  </select>
                </div>
              </div>

              
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default SearchAndFilter;