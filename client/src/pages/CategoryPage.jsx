import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import { fetchCategories } from '../slices/categorySlice';
import ProductCard from '../components/home/ProductCard';
import FeaturedCategories from '../components/home/FeaturedCategories';
import SearchAndFilter from '../components/home/SearchAndFilter';

function CategoryPage() {
  const { name, subcategory } = useParams(); // Get both category and subcategory from URL
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // fetch categories always
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // fetch products for specific category
  useEffect(() => {
    if (name) {
      dispatch(fetchProducts({ category: name, subcategory }));
    }
  }, [name, subcategory, dispatch]);

  // set category and subcategory names
  useEffect(() => {
    if (categories.length > 0 && name) {
      const cat = categories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === name);
      if (cat) {
        setCategoryName(cat.name);
        if (subcategory) {
          const sub = cat.subcategories?.find(s => 
            s.name.toLowerCase().replace(/\s+/g, '-') === subcategory
          );
          setSubcategoryName(sub?.name || '');
        } else {
          setSubcategoryName('');
        }
      }
    }
  }, [categories, name, subcategory]);

  // filter loaded products by category and subcategory
  useEffect(() => {
    if (name) {
      let filtered = products.filter(p => 
        p.category?.name.toLowerCase().replace(/\s+/g, '-') === name
      );
      
      if (subcategory) {
        filtered = filtered.filter(p =>
          p.subcategory?.toLowerCase().replace(/\s+/g, '-') === subcategory
        );
      }
      
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [products, name, subcategory]);

  // handle search & price filters
  const handleSearch = ({ searchTerm, priceRange }) => {
    let temp = products.filter(p => 
      p.category?.name.toLowerCase().replace(/\s+/g, '-') === name
    );
    
    if (subcategory) {
      temp = temp.filter(p =>
        p.subcategory?.toLowerCase().replace(/\s+/g, '-') === subcategory
      );
    }
    
    if (searchTerm) {
      temp = temp.filter((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (priceRange.min) temp = temp.filter((p) => p.price >= Number(priceRange.min));
    if (priceRange.max) temp = temp.filter((p) => p.price <= Number(priceRange.max));
    setFilteredProducts(temp);
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
          onClick={() => dispatch(fetchProducts({ category: name, subcategory }))}
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
        <h1 className="text-3xl font-bold">
          {categoryName}
          {subcategoryName && (
            <>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">{subcategoryName}</span>
            </>
          )}
        </h1>
        <p className="mt-2 text-gray-600">
          Browse our {subcategoryName ? `${subcategoryName} in ${categoryName}` : categoryName} listings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar filters */}
        <aside className="lg:col-span-1">
          <SearchAndFilter onSearch={handleSearch} />
        </aside>
        {/* Products grid */}
        <section className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-xl text-gray-600">No products found in this {subcategoryName ? 'subcategory' : 'category'}.</p>
              {subcategoryName && (
                <p className="mt-2 text-gray-500">Try browsing other subcategories in {categoryName}.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CategoryPage;