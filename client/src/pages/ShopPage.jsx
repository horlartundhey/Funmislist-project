import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import { fetchCategories } from '../slices/categorySlice';
import ProductCard from '../components/home/ProductCard';
import SearchAndFilter from '../components/home/SearchAndFilter';

function ShopPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({}));
    dispatch(fetchCategories());
  }, [dispatch]);

  // initialize filteredProducts when products load
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // filter handler
  const handleSearch = ({ searchTerm, category, subcategory, priceRange, location }) => {
    let temp = products;
    if (searchTerm) temp = temp.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (category) temp = temp.filter(p => p.category === category || p.category?._id === category);
    if (subcategory) temp = temp.filter(p => p.subcategory === subcategory);
    if (priceRange.min) temp = temp.filter(p => p.price >= Number(priceRange.min));
    if (priceRange.max) temp = temp.filter(p => p.price <= Number(priceRange.max));
    if (location) {
      const locLower = location.toLowerCase();
      temp = temp.filter(p =>
        p.location?.city?.toLowerCase().includes(locLower) ||
        p.location?.address?.toLowerCase().includes(locLower)
      );
    }
    setFilteredProducts(temp);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner */}
      <div className="mb-8 bg-blue-50 rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold">All Products</h1>
        <p className="mt-2 text-gray-600">Explore our full catalog</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* sidebar filters */}
        <aside>
          <SearchAndFilter onSearch={handleSearch} />
        </aside>
        {/* products grid */}
        <section className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default ShopPage;