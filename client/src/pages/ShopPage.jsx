import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProductsLean, searchProducts, setCurrentPage } from '../slices/productSlice';
import { fetchCategories } from '../slices/categorySlice';
import ProductCard from '../components/home/ProductCard';
import SearchAndFilter from '../components/home/SearchAndFilter';
import ShopBanner from '../components/home/ShopBanner';

function ShopPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, loading, error, total, currentPage, totalPages } = useSelector((state) => state.products);
  const [currentFilters, setCurrentFilters] = useState({});

  // Helper to get query param
  const getQueryParam = useCallback((param) => {
    const params = new URLSearchParams(location.search);
    return params.get(param) || '';
  }, [location.search]);

  // Helper to update URL with filters
  const updateURL = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      }
    });
    const newSearch = params.toString();
    const newURL = newSearch ? `${location.pathname}?${newSearch}` : location.pathname;
    navigate(newURL, { replace: true });
  };

  // Load products based on current filters and search
  const loadProducts = useCallback((filters = {}) => {
    const searchQuery = getQueryParam('query');
    
    if (searchQuery) {
      // Use advanced search endpoint for queries
      dispatch(searchProducts({
        q: searchQuery,
        page: currentPage,
        ...filters
      }));
    } else {
      // Use lean endpoint for regular browsing
      dispatch(fetchProductsLean({
        page: currentPage,
        ...filters
      }));
    }
  }, [dispatch, getQueryParam, currentPage]);

  useEffect(() => {
    // Load categories once
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // Extract filters from URL
    const filters = {
      category: getQueryParam('category'),
      subcategory: getQueryParam('subcategory'),
      condition: getQueryParam('condition'),
      minPrice: getQueryParam('minPrice'),
      maxPrice: getQueryParam('maxPrice'),
      location: getQueryParam('location')
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
      if (!filters[key]) delete filters[key];
    });

    setCurrentFilters(filters);
    loadProducts(filters);
  }, [getQueryParam, loadProducts]);

  const handleSearch = (searchFilters) => {
    // Reset to page 1 when searching
    dispatch(setCurrentPage(1));
    
    // Update URL with new filters
    updateURL(searchFilters);
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const showPages = 5;
      let start = Math.max(1, currentPage - Math.floor(showPages / 2));
      let end = Math.min(totalPages, start + showPages - 1);
      
      if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
        >
          Previous
        </button>
        
        {getPageNumbers().map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 text-sm rounded-md ${
              currentPage === page
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-2 md:px-4 py-8">{/* Rotating Banner */}
      <ShopBanner />
      <div className="mb-8 flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-lg text-center">Shop All Products</h1>
        <span className="text-lg md:text-2xl text-gray-500 text-center">Find the best deals and new arrivals</span>
        {getQueryParam('query') && (
          <p className="text-lg text-indigo-600">
            Search results for: "{getQueryParam('query')}" ({total} found)
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* sidebar filters */}
        <aside className="mb-8 lg:mb-0">
          <SearchAndFilter onSearch={handleSearch} initialFilters={currentFilters} />
        </aside>
        {/* products grid */}
        <section className="lg:col-span-3 flex flex-col gap-8">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">{error}</p>
              <button 
                onClick={() => loadProducts(currentFilters)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Showing {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, total)} of {total} products
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <Pagination />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default ShopPage;