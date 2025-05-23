import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../slices/productSlice';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  
  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  // Take only first 8 products for featured section
  const featuredProducts = products.slice(0, 8);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading products: {error}
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Featured Products
            <span className="block mt-2 text-sm font-normal text-gray-500">
              Discover our curated collection of premium items
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product._id}
              className="animate-fade-in"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-block bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;