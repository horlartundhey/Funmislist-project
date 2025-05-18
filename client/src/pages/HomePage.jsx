import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import FeaturedProperties from '../components/home/FeaturedProperties';
import IconsOverlay from '../components/home/IconsOverlay';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative">
      <IconsOverlay />
      <HeroSection />
      
      <div className="-mt-16 relative z-10">
        <FeaturedCategories />
      </div>

      <div className="py-16">
        <FeaturedProducts />
      </div>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8" 
            alt="Background pattern"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Special Offer!
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get 20% off on your first purchase. Limited time offer!
            </p>
            <Link
              to="/shop"
              className="inline-block bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <FeaturedProperties />
    </div>
  );
}

export default HomePage;