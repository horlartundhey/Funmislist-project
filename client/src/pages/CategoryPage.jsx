import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsLean, searchProducts, setCurrentPage } from '../slices/productSlice';
import { fetchCategories } from '../slices/categorySlice';
import ProductCard from '../components/home/ProductCard';
import FeaturedCategories from '../components/home/FeaturedCategories';
import SearchAndFilter from '../components/home/SearchAndFilter';

function CategoryPage() {
  const { name, subcategory } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { products, loading, error, total, currentPage, totalPages } = useSelector((state) => state.products);
  const { filteredCategories: categories } = useSelector((state) => state.categories);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});
  
  // Enhanced debugging
  console.log('🔍 CategoryPage - Route params:', { 
    categorySlug: name, 
    subcategorySlug: subcategory 
  });

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

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Set category and subcategory names from URL params
  useEffect(() => {
    if (categories.length > 0 && name) {
      const cat = categories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === name);
      console.log('📁 Found category:', cat?.name || 'none');
      setCategoryName(cat?.name || '');
      
      if (subcategory && cat) {
        const sub = cat.subcategories?.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === subcategory);
        console.log('📂 Found subcategory:', sub?.name || 'none');
        setSubcategoryName(sub?.name || '');
      }
    }
  }, [categories, name, subcategory]);

  // Load products when URL params or filters change
  useEffect(() => {
    if (categories.length === 0) return; // Wait for categories to load

    // Find the category object to get its ID
    const categoryObj = categories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === name);
    
    if (!categoryObj) {
      console.log('Category not found:', name);
      return;
    }

    // Extract filters from URL
    const filters = {
      category: categoryObj._id, // Use category ID instead of slug
      subcategory: subcategory ? decodeURIComponent(subcategory) : getQueryParam('subcategory'),
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
  }, [categories, name, subcategory, getQueryParam, loadProducts]);

  const handleSearch = (searchFilters) => {
    // Reset to page 1 when searching
    dispatch(setCurrentPage(1));
    
    // If category is changed in filters, navigate to that category
    if (searchFilters.category) {
      const selectedCategory = categories.find(c => c._id === searchFilters.category);
      if (selectedCategory) {
        const categorySlug = selectedCategory.name.toLowerCase().replace(/\s+/g, '-');
        if (categorySlug !== name) {
          // Navigate to the new category page
          navigate(`/category/${categorySlug}`);
          return;
        }
      }
    }
    
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

  if (!name) {
    return <FeaturedCategories />;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <button
          onClick={() => loadProducts(currentFilters)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category banner */}
      <div className="mb-8 bg-red-50 rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <p className="mt-2 text-gray-600">
          {subcategoryName 
            ? `Browse ${subcategoryName} in ${categoryName}`
            : `Browse our ${categoryName} listings`
          }
        </p>
        {getQueryParam('query') && (
          <p className="text-lg text-indigo-600 mt-2">
            Search results for: "{getQueryParam('query')}" ({total} found)
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar filters */}
        <aside className="lg:col-span-1">
          <SearchAndFilter onSearch={handleSearch} initialFilters={currentFilters} />
        </aside>
        
        {/* Products grid */}
        <section className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">No products found.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, total)} of {total} products
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
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

export default CategoryPage;