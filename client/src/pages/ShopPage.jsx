import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import { fetchCategories } from '../slices/categorySlice';
import ProductCard from '../components/home/ProductCard';
import SearchAndFilter from '../components/home/SearchAndFilter';
import ShopBanner from '../components/home/ShopBanner';

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
  setFilteredProducts(Array.isArray(products) ? products : []);
}, [products]);

const handleSearch = (productsArray) => {
  setFilteredProducts(Array.isArray(productsArray) ? productsArray : []);
};

  return (
    <div className="container mx-auto px-2 md:px-4 py-8">
      {/* Rotating Banner */}
      <ShopBanner />
      <div className="mb-8 flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 drop-shadow-lg text-center">Shop All Products</h1>
        <span className="text-lg md:text-2xl text-gray-500 text-center">Find the best deals and new arrivals</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* sidebar filters */}
        <aside className="mb-8 lg:mb-0">
          <SearchAndFilter onSearch={handleSearch} />
        </aside>
        {/* products grid */}
        <section className="lg:col-span-3 flex flex-col gap-8">
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